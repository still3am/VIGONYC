import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { txnId } = await req.json();

    if (!txnId) {
      return Response.json({ error: 'Missing txnId' }, { status: 400 });
    }

    // Find transaction
    const txns = await base44.asServiceRole.entities.PaymentTransaction.filter({ txnId });
    if (!txns || txns.length === 0) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const txn = txns[0];

    // Can only capture if currently authorized
    if (txn.status !== 'authorized') {
      return Response.json({ error: `Cannot capture transaction with status: ${txn.status}` }, { status: 400 });
    }

    // Update to captured
    await base44.asServiceRole.entities.PaymentTransaction.update(txn.id, {
      status: 'captured',
      capturedAt: new Date().toISOString()
    });

    return Response.json({
      success: true,
      txnId,
      newStatus: 'captured'
    });

  } catch (error) {
    console.error('Payment capture error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});