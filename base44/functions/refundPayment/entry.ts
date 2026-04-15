import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    // Admin only
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { txnId, amount, reason } = await req.json();

    if (!txnId || !amount) {
      return Response.json({ error: 'Missing txnId or amount' }, { status: 400 });
    }

    // Find transaction
    const txns = await base44.asServiceRole.entities.PaymentTransaction.filter({ txnId });
    if (!txns || txns.length === 0) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const txn = txns[0];

    // Can only refund captured or failed
    if (txn.status !== 'captured' && txn.status !== 'failed') {
      return Response.json({ error: `Cannot refund transaction with status: ${txn.status}` }, { status: 400 });
    }

    // Check refund doesn't exceed original amount
    const totalRefunded = (txn.refundAmount || 0) + amount;
    if (totalRefunded > txn.amount) {
      return Response.json({ error: 'Refund amount exceeds transaction amount' }, { status: 400 });
    }

    // Determine new status
    const newStatus = totalRefunded >= txn.amount ? 'refunded' : 'partially_refunded';

    // Update transaction
    await base44.asServiceRole.entities.PaymentTransaction.update(txn.id, {
      status: newStatus,
      refundAmount: totalRefunded,
      refundReason: reason,
      refundedAt: new Date().toISOString()
    });

    return Response.json({
      success: true,
      txnId,
      newStatus,
      totalRefunded
    });

  } catch (error) {
    console.error('Payment refund error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});