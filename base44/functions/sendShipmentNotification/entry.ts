import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, orderId, trackingNumber } = await req.json();
    if (!email) return Response.json({ success: false, error: "No email provided" });

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Your VIGONYC order ${orderId} has shipped!`,
      body: `Your order ${orderId} is on its way!${trackingNumber ? `\n\nTracking number: ${trackingNumber}` : ""}\n\nThank you for shopping with VIGONYC.`,
    });

    console.log(`Shipment notification for ${orderId} sent to ${email}. Tracking: ${trackingNumber}`);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});