import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      amount, 
      currency = 'usd',
      orderId,
      userEmail,
      shippingAddress,
      lineItems // Array of { name, quantity, unitAmount, taxCode }
    } = await req.json();

    if (!amount || !orderId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build payment intent params with automatic tax calculation
    const paymentIntentParams = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
        userEmail: userEmail || user.email
      }
    };

    // Enable Stripe Tax if shipping address is provided
    // Stripe Tax requires a tax calculation session
    if (shippingAddress && lineItems?.length > 0) {
      try {
        // Create tax calculation for accurate tax
        const taxCalculation = await stripe.tax.calculations.create({
          currency,
          customer_details: {
            address: {
              line1: shippingAddress.address || '',
              city: shippingAddress.city || '',
              state: shippingAddress.state || '',
              postal_code: shippingAddress.zip || '',
              country: shippingAddress.country || 'US',
            },
            address_source: 'shipping',
          },
          line_items: lineItems.map(item => ({
            amount: Math.round(item.unitAmount * item.quantity * 100),
            quantity: item.quantity,
            reference: item.name,
            // Clothing tax code - txcd_10000000 is general tangible goods
            // txcd_30011000 is specifically for clothing
            tax_code: item.taxCode || 'txcd_30011000',
          })),
          shipping_cost: {
            amount: Math.round((shippingAddress.shippingCost || 0) * 100),
            tax_code: 'txcd_92010001', // Shipping tax code
          },
        });

        // Update payment intent amount with calculated tax
        paymentIntentParams.amount = taxCalculation.amount_total;
        paymentIntentParams.metadata.tax_calculation_id = taxCalculation.id;
        paymentIntentParams.metadata.tax_amount = taxCalculation.tax_amount_exclusive;

      } catch (taxError) {
        console.error('Tax calculation error:', taxError.message);
        // Continue without tax calculation if it fails
      }
    }

    // Create the Payment Intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return Response.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      taxAmount: paymentIntentParams.metadata.tax_amount ? paymentIntentParams.metadata.tax_amount / 100 : null,
    });

  } catch (error) {
    console.error('Payment Intent creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});