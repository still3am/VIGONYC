import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action, data } = body;

  // Get or create loyalty record
  const getLoyalty = async () => {
    const records = await base44.asServiceRole.entities.UserLoyalty.filter({ userEmail: user.email }, '-created_date', 1);
    if (records.length > 0) return records[0];
    // Create new loyalty record
    const code = user.email.split('@')[0].toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newRecord = await base44.asServiceRole.entities.UserLoyalty.create({
      userEmail: user.email,
      points: 0,
      totalEarned: 0,
      referralCode: code,
      totalReferrals: 0,
      tier: 'Silver',
      scannedProducts: [],
    });
    return newRecord;
  };

  if (action === 'get') {
    const loyalty = await getLoyalty();
    return Response.json({ loyalty });
  }

  if (action === 'addPoints') {
    const { points, reason } = data;
    const loyalty = await getLoyalty();
    const newPoints = (loyalty.points || 0) + points;
    const newTotal = (loyalty.totalEarned || 0) + points;
    // Update tier based on total earned
    let tier = 'Silver';
    if (newTotal >= 10000) tier = 'Obsidian';
    else if (newTotal >= 3000) tier = 'Chrome';
    const updated = await base44.asServiceRole.entities.UserLoyalty.update(loyalty.id, {
      points: newPoints,
      totalEarned: newTotal,
      tier,
    });
    return Response.json({ loyalty: updated, pointsAdded: points, reason });
  }

  if (action === 'redeemPoints') {
    const { points } = data;
    const loyalty = await getLoyalty();
    if ((loyalty.points || 0) < points) return Response.json({ error: 'Insufficient points' }, { status: 400 });
    const updated = await base44.asServiceRole.entities.UserLoyalty.update(loyalty.id, {
      points: loyalty.points - points,
    });
    return Response.json({ loyalty: updated });
  }

  if (action === 'scanQR') {
    const { qrCodeId } = data;
    const loyalty = await getLoyalty();

    // Check if already scanned
    if ((loyalty.scannedProducts || []).includes(qrCodeId)) {
      return Response.json({ error: 'Already scanned', alreadyScanned: true });
    }

    // Check if it's a referral code (other user's referral code)
    const referralRecords = await base44.asServiceRole.entities.UserLoyalty.filter({ referralCode: qrCodeId }, '-created_date', 1);
    if (referralRecords.length > 0 && referralRecords[0].userEmail !== user.email) {
      // Apply referral
      if (!loyalty.referredBy) {
        await base44.asServiceRole.entities.UserLoyalty.update(loyalty.id, { referredBy: qrCodeId });
        const referrer = referralRecords[0];
        const newReferrerPoints = (referrer.points || 0) + 500;
        await base44.asServiceRole.entities.UserLoyalty.update(referrer.id, {
          points: newReferrerPoints,
          totalEarned: (referrer.totalEarned || 0) + 500,
          totalReferrals: (referrer.totalReferrals || 0) + 1,
        });
        return Response.json({ type: 'referral', message: 'Referral applied! Your friend earned 500 points.', pointsAdded: 0 });
      }
      return Response.json({ error: 'Already referred', alreadyReferred: true });
    }

    // Check product authenticity
    const products = await base44.asServiceRole.entities.ProductAuthenticity.filter({ qrCodeId }, '-created_date', 1);
    if (products.length > 0) {
      const product = products[0];
      const pointsToAward = product.pointsAwarded || 100;
      if (!product.authenticated) {
        await base44.asServiceRole.entities.ProductAuthenticity.update(product.id, {
          authenticated: true,
          authenticatedBy: user.email,
        });
      }
      const newScanned = [...(loyalty.scannedProducts || []), qrCodeId];
      const newPoints = (loyalty.points || 0) + pointsToAward;
      const newTotal = (loyalty.totalEarned || 0) + pointsToAward;
      let tier = 'Silver';
      if (newTotal >= 10000) tier = 'Obsidian';
      else if (newTotal >= 3000) tier = 'Chrome';
      const updated = await base44.asServiceRole.entities.UserLoyalty.update(loyalty.id, {
        points: newPoints,
        totalEarned: newTotal,
        tier,
        scannedProducts: newScanned,
      });
      return Response.json({ type: 'product', product, loyalty: updated, pointsAdded: pointsToAward });
    }

    return Response.json({ error: 'Invalid QR code' }, { status: 404 });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});