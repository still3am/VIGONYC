import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { code, subtotal } = await req.json();

  if (!code) {
    return Response.json({ valid: false, error: 'No code provided' });
  }

  const codes = await base44.asServiceRole.entities.PromoCode.filter({ code: code.toUpperCase().trim() });

  if (!codes || codes.length === 0) {
    return Response.json({ valid: false, error: 'Invalid promo code' });
  }

  const promo = codes[0];

  if (!promo.active) {
    return Response.json({ valid: false, error: 'This promo code is no longer active' });
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return Response.json({ valid: false, error: 'This promo code has expired' });
  }

  if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
    return Response.json({ valid: false, error: 'This promo code has reached its usage limit' });
  }

  // Increment usage count
  await base44.asServiceRole.entities.PromoCode.update(promo.id, {
    usageCount: (promo.usageCount || 0) + 1
  });

  return Response.json({
    valid: true,
    discountPercent: promo.discountPercent,
    discountType: promo.discountType || 'percent'
  });
});