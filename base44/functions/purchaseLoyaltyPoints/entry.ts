import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { event, data } = body;

  if (event?.type !== 'create') return Response.json({ ok: true });

  const order = data;
  if (!order?.userEmail || !order?.total) return Response.json({ ok: true });

  const pointsToAdd = Math.floor((order.total || 0) * 5);
  if (pointsToAdd <= 0) return Response.json({ ok: true });

  const records = await base44.asServiceRole.entities.UserLoyalty.filter({ userEmail: order.userEmail }, '-created_date', 1);
  if (records.length === 0) return Response.json({ ok: true, message: 'No loyalty record found' });

  const loyalty = records[0];
  const newPoints = (loyalty.points || 0) + pointsToAdd;
  const newTotal = (loyalty.totalEarned || 0) + pointsToAdd;
  let tier = 'Silver';
  if (newTotal >= 10000) tier = 'Obsidian';
  else if (newTotal >= 3000) tier = 'Chrome';

  await base44.asServiceRole.entities.UserLoyalty.update(loyalty.id, {
    points: newPoints,
    totalEarned: newTotal,
    tier,
  });

  return Response.json({ ok: true, pointsAdded: pointsToAdd });
});