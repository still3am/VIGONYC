import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { S, G2, G3, SD, btnPrimary, inputStyle, Empty } from "@/components/admin/adminUi";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];
const CARRIERS = ["USPS", "UPS", "FedEx", "DHL"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    base44.entities.Order.list("-created_date", 200).then(o => setOrders(o || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = async (id, data, msg) => {
    await base44.entities.Order.update(id, data).catch(() => {});
    toast.success(msg || "Updated");
    setOrders(p => p.map(o => o.id === id ? { ...o, ...data } : o));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading orders...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? S : "none", color: filter === s ? "#000" : SD, border: `0.5px solid ${filter === s ? S : G3}`, padding: "7px 14px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>{s === "all" ? "All" : s}</button>
        ))}
      </div>
      {filtered.length === 0 ? <Empty msg="No orders found." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(o => (
            <div key={o.id} style={{ background: G2, border: `0.5px solid ${G3}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{o.orderId}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 3 }}>{o.userEmail} · {new Date(o.created_date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: S }}>${(o.total || 0).toFixed(2)}</div>
                  <div style={{ fontSize: 9, color: SD, marginTop: 2 }}>{o.pieces || 0} pcs · {o.paymentStatus || "pending"}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: SD, marginBottom: 12, borderTop: `0.5px solid ${G3}`, paddingTop: 10 }}>{o.items}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <select value={o.status} onChange={e => update(o.id, { status: e.target.value }, "Status updated")} style={{ ...inputStyle, width: "auto", padding: "7px 12px" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={o.trackingCarrier || ""} onChange={e => update(o.id, { trackingCarrier: e.target.value }, "Carrier updated")} style={{ ...inputStyle, width: "auto", padding: "7px 12px" }}>
                  <option value="">Carrier</option>
                  {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={o.trackingNumber || ""} onChange={e => setOrders(p => p.map(x => x.id === o.id ? { ...x, trackingNumber: e.target.value } : x))} placeholder="Tracking #" style={{ ...inputStyle, width: 160, padding: "7px 12px" }} />
                <button onClick={() => update(o.id, { trackingNumber: o.trackingNumber }, "Tracking saved")} style={btnPrimary}>Save Tracking</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}