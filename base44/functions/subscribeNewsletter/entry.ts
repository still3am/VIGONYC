import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, name, source } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await base44.entities.Newsletter.filter({ email });
    if (existing.length > 0) {
      return Response.json({ success: true, message: 'Already subscribed', isNew: false });
    }

    // Create newsletter subscription
    await base44.entities.Newsletter.create({
      email,
      name: name || null,
      subscribed: true,
      source: source || 'Homepage'
    });

    // Send welcome email
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'Welcome to VIGONYC Drop List 🎉',
      body: `Hey,\n\nYou're now on the VIGONYC drop list! Get first access to new releases, exclusive offers, and NYC-only drops.\n\nNo spam, ever.\n\nBest regards,\nVIGONYC Team`
    });

    return Response.json({ success: true, message: 'Subscribed successfully', isNew: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});