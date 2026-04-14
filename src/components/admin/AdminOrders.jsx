import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = { Pending: "#fa0", Processing: "#6af", Shipped: "#C0C0C0", Delivered: "#0c6", Cancelled: "#e03" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [trackingEdits, setTrackingEdits] = useState({});

  useEffect(() => {
    base44.entities.Order.list("-created_date", 200).catch(() => []).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    await base44.entities.Order.update(order.id, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    if (newStatus === "Shipped") {
      base44.functions.invoke("sendShipmentNotification", {
        email: order.userEmail || order.created_by,
        orderId: order.orderId,
        trackingNumber: trackingEdits[order.id] || order.trackingNumber || ""
      }).catch(() => {});
    }
  };

  const handleTrackingBlur = async (order) => {
    const val = trackingEdits[order.id];
    if (val !== undefined && val !== order.trackingNumber) {
      await base44.entities.Order.update(order.id, { trackingNumber: val });
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, trackingNumber: val } : o));
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Orders</div>
        <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Order Management</h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ fontSize: 10, color: SD, alignSelf: "center" }}>{filtered.length} orders</div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading orders...</div>}
      {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No orders found</div>}

      {/* Desktop table */}
      <div className="admin-orders-desktop" style={{ background: G1, border: `0.5px solid ${G3}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 90px 140px 160px 130px", padding: "10px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
          <span>Order ID</span><span>Items</span><span>Total</span><span>Status</span><span>Tracking</span><span>Date</span>
        </div>
        {!loading && filtered.map(o => {
          const col = STATUS_COLORS[o.status] || SD;
          return (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "130px 1fr 90px 140px 160px 130px", padding: "14px 20px", borderBottom: `0.5px solid ${G3}`, alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = G2}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ fontSize: 11, fontWeight: 900, color: S }}>{o.orderId}</div>
              <div style={{ fontSize: 10, color: SD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(o.items || "").slice(0, 40)}{(o.items || "").length > 40 ? "..." : ""}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>${o.total}</div>
              <select value={o.status} onChange={e => handleStatusChange(o, e.target.value)} style={{ background: G2, border: `0.5px solid ${col}`, color: col, padding: "5px 8px", fontSize: 9, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                defaultValue={o.trackingNumber || ""}
                onChange={e => setTrackingEdits(p => ({ ...p, [o.id]: e.target.value }))}
                onBlur={() => handleTrackingBlur(o)}
                placeholder="Add tracking..."
                style={{ background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "5px 8px", fontSize: 10, outline: "none", fontFamily: "inherit", width: "100%" }}
              />
              <div style={{ fontSize: 9, color: SD }}>{o.created_date ? new Date(o.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="admin-orders-mobile" style={{ display: "none", flexDirection: "column", gap: 8 }}>
        {!loading && filtered.map(o => {
          const col = STATUS_COLORS[o.status] || SD;
          return (
            <div key={o.id} style={{ background: G1, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${col}`, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: S }}>{o.orderId}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>${o.total}</div>
              </div>
              <div style={{ fontSize: 10, color: SD, marginBottom: 10 }}>{(o.items || "").slice(0, 60)}{(o.items || "").length > 60 ? "..." : ""}</div>
              <div style={{ fontSize: 9, color: SD, marginBottom: 12 }}>{o.created_date ? new Date(o.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <select value={o.status} onChange={e => handleStatusChange(o, e.target.value)} style={{ background: G2, border: `0.5px solid ${col}`, color: col, padding: "8px 12px", fontSize: 11, outline: "none", fontFamily: "inherit", cursor: "pointer", width: "100%" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  defaultValue={o.trackingNumber || ""}
                  onChange={e => setTrackingEdits(p => ({ ...p, [o.id]: e.target.value }))}
                  onBlur={() => handleTrackingBlur(o)}
                  placeholder="Tracking number..."
                  style={{ background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "8px 12px", fontSize: 11, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media(max-width:700px){
          .admin-orders-desktop { display: none !important; }
          .admin-orders-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}