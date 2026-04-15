import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const STATUS_COLORS = { captured: "#0c6", pending: "#fa0", failed: "#e03", refunded: "#888" };
const BRAND_COLORS = { Visa: "#1A1F71", Mastercard: "#EB001B", Amex: "#006FCF", Discover: "#FF6000" };

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [refundInputs, setRefundInputs] = useState({});

  useEffect(() => {
    base44.entities.PaymentTransaction.list("-created_date", 500)
      .then(data => { setTransactions(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = {
    totalProcessed: transactions.filter(t => t.status === "captured").reduce((s, t) => s + (t.amount || 0), 0),
    todayVolume: transactions.filter(t => t.created_date && new Date(t.created_date).toDateString() === new Date().toDateString()).reduce((s, t) => s + (t.amount || 0), 0),
    failedCount: transactions.filter(t => t.status === "failed").length,
    refundedCount: transactions.filter(t => t.status === "refunded" || t.status === "partially_refunded").length,
    refundRate: transactions.length > 0 ? ((transactions.filter(t => t.status === "refunded" || t.status === "partially_refunded").length / transactions.length) * 100).toFixed(1) : 0
  };

  const filtered = transactions.filter(t => {
    const matchSearch = !search || t.txnId.toLowerCase().includes(search.toLowerCase()) || (t.orderId && t.orderId.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchMethod = methodFilter === "All" || t.method === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  const handleRefund = async (txn) => {
    const amount = parseFloat(refundInputs[txn.id] || txn.amount);
    const reason = prompt("Refund reason:");
    if (!reason) return;
    
    try {
      const res = await base44.functions.invoke("refundPayment", { txnId: txn.txnId, amount, reason });
      if (res.data.success) {
        setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: res.data.newStatus, refundAmount: res.data.totalRefunded } : t));
        setRefundInputs(prev => { const copy = { ...prev }; delete copy[txn.id]; return copy; });
      }
    } catch (e) {
      alert("Refund failed: " + e.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Payments</div>
        <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Payment Transactions</h2>
      </div>

      {/* Stats row */}
      <div className="admin-payment-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Processed", value: `$${stats.totalProcessed.toFixed(2)}`, color: S },
          { label: "Today's Volume", value: `$${stats.todayVolume.toFixed(2)}`, color: "#0c6" },
          { label: "Failed Txns", value: stats.failedCount, color: "#e03" },
          { label: "Refunded Txns", value: stats.refundedCount, color: SD },
          { label: "Refund Rate", value: `${stats.refundRate}%`, color: S }
        ].map((stat, i) => (
          <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${stat.color}`, padding: "16px 12px" }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: stat.color, letterSpacing: -1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search txnId or orderId..." style={{ flex: 1, minWidth: 200, background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="authorized">Authorized</option>
          <option value="captured">Captured</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="partially_refunded">Partially Refunded</option>
        </select>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Methods</option>
          <option value="card">Card</option>
          <option value="applepay">Apple Pay</option>
          <option value="klarna">Klarna</option>
          <option value="points">Points</option>
        </select>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD }}>Loading transactions...</div>}
      {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: SD }}>No transactions found</div>}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div style={{ background: G1, border: `.5px solid ${G3}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 100px 120px 80px 100px 100px 140px 80px", padding: "10px 16px", borderBottom: `.5px solid ${G3}`, fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", fontWeight: 700 }}>
            <span>TXN ID</span>
            <span>Order ID</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
            <span>Card</span>
            <span>Risk</span>
            <span>Date</span>
          </div>
          {filtered.map(t => {
            const col = STATUS_COLORS[t.status] || SD;
            return (
              <div key={t.id}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 100px 120px 80px 100px 100px 140px 80px", padding: "12px 16px", borderBottom: `.5px solid ${G3}`, alignItems: "center", gap: 4, cursor: "pointer" }}
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  onMouseEnter={e => e.currentTarget.style.background = G2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: S, fontFamily: "monospace" }}>{t.txnId.slice(0, 10)}</div>
                  <div style={{ fontSize: 9, color: SD }}>{t.orderId ? t.orderId.slice(0, 8) : "—"}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>${t.amount}</div>
                  <div style={{ fontSize: 9, textTransform: "capitalize", color: SD }}>{t.method}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: "capitalize" }}>{t.status}</div>
                  <div style={{ fontSize: 9, color: t.cardBrand ? BRAND_COLORS[t.cardBrand] : SD }}>
                    {t.cardBrand && t.cardLast4 ? `${t.cardBrand.slice(0, 2)} ···· ${t.cardLast4}` : "—"}
                  </div>
                  <div style={{ fontSize: 9, color: t.riskScore > 60 ? "#e03" : t.riskScore > 30 ? "#fa0" : "#0c6" }}>
                    {t.riskScore || 0} <span style={{ fontSize: 7, color: SD }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: 9, color: SD }}>{t.created_date ? new Date(t.created_date).toLocaleDateString() : "—"}</div>
                </div>
                {expanded === t.id && (
                  <div style={{ padding: "16px", background: G2, borderBottom: `.5px solid ${G3}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Transaction Details</div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>TXN ID: <span style={{ fontFamily: "monospace", color: S }}>{t.txnId}</span></div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Order ID: <span style={{ color: S }}>{t.orderId}</span></div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Amount: <span style={{ fontWeight: 700, color: "#fff" }}>${t.amount}</span></div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Status: <span style={{ color: col, textTransform: "capitalize", fontWeight: 700 }}>{t.status}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Card & Billing</div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Card: <span style={{ color: BRAND_COLORS[t.cardBrand] }}>{t.cardBrand}</span> ···· {t.cardLast4}</div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Expiry: {t.cardExpiry || "—"}</div>
                        <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>Cardholder: {t.cardholderName || "—"}</div>
                        <div style={{ fontSize: 10, color: "#fff" }}>Billing ZIP: {t.billingZip || "—"}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Risk Assessment</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "6px 10px", fontSize: 9, color: t.riskScore > 60 ? "#e03" : t.riskScore > 30 ? "#fa0" : "#0c6" }}>
                          Risk Score: {t.riskScore || 0}/100
                        </div>
                        {(t.riskFlags || []).map(flag => (
                          <div key={flag} style={{ background: "#fa0", color: "#000", padding: "4px 8px", fontSize: 7, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{flag}</div>
                        ))}
                      </div>
                    </div>
                    {(t.status === "captured" || t.status === "failed") && (
                      <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 12 }}>
                        <div style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Issue Refund</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type="number"
                            value={refundInputs[t.id] || t.amount - (t.refundAmount || 0)}
                            onChange={e => setRefundInputs(prev => ({ ...prev, [t.id]: e.target.value }))}
                            max={t.amount - (t.refundAmount || 0)}
                            style={{ flex: 1, background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "8px 10px", fontSize: 10, outline: "none" }}
                          />
                          <button onClick={() => handleRefund(t)} style={{ background: S, color: "#000", border: "none", padding: "8px 16px", fontSize: 8, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }}>Refund</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .admin-payment-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}