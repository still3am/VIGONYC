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
      lineItems, // Array of { name, quantity, unitAmount }
      shippingAddress,
      shippingCost = 0,
      currency = 'usd'
    } = await req.json();

    if (!lineItems || !lineItems.length || !shippingAddress) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate address has minimum required fields
    if (!shippingAddress.zip || !shippingAddress.country) {
      return Response.json({ 
        success: true, 
        taxAmount: 0, 
        taxBreakdown: [],
        message: 'Incomplete address for tax calculation'
      });
    }

    try {
      // Create Stripe Tax calculation
      const taxCalculation = await stripe.tax.calculations.create({
        currency,
        customer_details: {
          address: {
            line1: shippingAddress.address || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || '',
            postal_code: shippingAddress.zip,
            country: shippingAddress.country || 'US',
          },
          address_source: 'shipping',
        },
        line_items: lineItems.map(item => ({
          amount: Math.round(item.unitAmount * item.quantity * 100),
          quantity: item.quantity,
          reference: item.name,
          // txcd_30011000 = Clothing (non-exempt in most jurisdictions)
          tax_code: 'txcd_30011000',
        })),
        shipping_cost: {
          amount: Math.round(shippingCost * 100),
          tax_code: 'txcd_92010001', // Shipping
        },
      });

      // Extract tax breakdown by jurisdiction
      const taxBreakdown = taxCalculation.tax_breakdown?.map(tb => ({
        jurisdiction: tb.jurisdiction?.display_name || 'Unknown',
        type: tb.jurisdiction?.level || 'unknown',
        rate: (tb.amount / (taxCalculation.amount_total - taxCalculation.tax_amount_exclusive) * 100).toFixed(3),
        amount: tb.amount / 100,
      })) || [];

      return Response.json({
        success: true,
        taxCalculationId: taxCalculation.id,
        subtotal: (taxCalculation.amount_total - taxCalculation.tax_amount_exclusive) / 100,
        taxAmount: taxCalculation.tax_amount_exclusive / 100,
        total: taxCalculation.amount_total / 100,
        taxBreakdown,
        shippingTaxIncluded: taxCalculation.shipping_cost?.tax_amount > 0,
      });

    } catch (stripeError) {
      console.error('Stripe Tax calculation error:', stripeError.message);
      
      // Return a graceful fallback - no tax calculated
      return Response.json({
        success: true,
        taxAmount: 0,
        taxBreakdown: [],
        message: 'Tax calculation unavailable for this address',
        error: stripeError.message
      });
    }

  } catch (error) {
    console.error('Tax calculation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});