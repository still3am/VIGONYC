import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { formData, cartItems } = await req.json();

    // Validate form data
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
      return Response.json({ valid: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return Response.json({ valid: false, error: 'Invalid email format' }, { status: 400 });
    }

    if (!cartItems || cartItems.length === 0) {
      return Response.json({ valid: false, error: 'Cart is empty' }, { status: 400 });
    }

    return Response.json({ valid: true, message: 'Checkout validation passed' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});