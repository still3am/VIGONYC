import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, phone, topic, message } = await req.json();

    if (!name || !email || !topic || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Contact entity
    await base44.entities.Contact.create({
      name,
      email,
      phone,
      topic,
      message,
      status: 'New',
      responded: false
    });

    // Send confirmation email to user
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `We received your inquiry - VIGONYC`,
      body: `Hi ${name},\n\nThank you for reaching out to VIGONYC. We received your message about ${topic} and will get back to you within 24 hours.\n\nBest regards,\nVIGONYC Team`
    });

    // Send notification email to admin
    await base44.integrations.Core.SendEmail({
      to: 'hello@vigonyc.com',
      subject: `New Contact: ${topic} from ${name}`,
      body: `New inquiry from ${name} (${email}, ${phone})\n\nTopic: ${topic}\n\nMessage:\n${message}`
    });

    return Response.json({ success: true, message: 'Contact saved and emails sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});