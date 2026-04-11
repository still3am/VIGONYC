import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, shipping, tax, discount, total, firstName, lastName, email, phone, address, city, state, zip, paymentMethod, promoCode } = await req.json();

    if (!items || items.length === 0 || !total) {
      return Response.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Create order
    const order = await base44.entities.Order.create({
      items,
      subtotal,
      shipping,
      tax,
      discount: discount || 0,
      total,
      status: 'Processing',
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      paymentMethod,
      promoCode: promoCode || null
    });

    // Send order confirmation email
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Order Confirmed #${order.id} - VIGONYC`,
      body: `Hi ${firstName},\n\nYour order has been placed successfully!\n\nOrder ID: ${order.id}\nTotal: $${total}\nStatus: Processing\n\nWe'll send you a shipping confirmation email within 24 hours.\n\nThank you for shopping with VIGONYC!\n\nBest regards,\nVIGONYC Team`
    });

    return Response.json({ success: true, orderId: order.id, order });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});