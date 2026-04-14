import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const STATUS_COLORS = { Pending: "#fa0", Approved: "#0c6", Rejected: "#e03", Completed: S };

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const load = () => {
    base44.entities.ReturnRequest.list("-created_date", 200).catch(() => []).then(data => {
      setReturns(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async (id, status) => {
    await base44.entities.ReturnRequest.update(id, { status });
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const pending = returns.filter(r => r.status === "Pending").length;
  const filtered = returns.filter(r => filter === "All" || r.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Returns</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Return Requests</h2>
          {pending > 0 && <span style={{ background: "#fa0", color: "#000", fontSize: 8, fontWeight: 900, padding: "3px 10px", letterSpacing: 1, textTransform: "uppercase" }}>{pending} Pending</span>}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit", width: "100%", maxWidth: 240 }}>
          {["All", "Pending", "Approved", "Rejected", "Completed"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading returns...</div>}
        {!loading && filtered.length === 0 && <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No return requests found</div>}
        {!loading && filtered.map(r => {
          const col = STATUS_COLORS[r.status] || SD;
          return (
            <div key={r.id} style={{ background: G1, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${col}`, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>#{r.orderId}</div>
                    <span style={{ fontSize: 7, color: col, border: `0.5px solid ${col}`, padding: "2px 8px", letterSpacing: 1, textTransform: "uppercase" }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 10, color: SD, marginBottom: 4, wordBreak: "break-word" }}>{r.userEmail}</div>
                  <div style={{ fontSize: 11, color: S, marginBottom: 4 }}>Reason: {r.reason}</div>
                  {r.message && <div style={{ fontSize: 11, color: SD }}>{r.message}</div>}
                  <div style={{ fontSize: 9, color: SD, marginTop: 8 }}>{r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
                </div>
                {r.status === "Pending" && (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => handleUpdate(r.id, "Approved")} style={{ background: "#0c6", color: "#fff", border: "none", padding: "9px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 900 }}>Approve</button>
                    <button onClick={() => handleUpdate(r.id, "Rejected")} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "9px 14px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}