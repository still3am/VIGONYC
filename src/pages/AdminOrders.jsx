import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2 } from "lucide-react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await base44.entities.Order.list('-created_date', 100);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await base44.entities.Order.update(id, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await base44.entities.Order.delete(id);
      loadOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filtered = statusFilter === "All" ? orders : orders.filter(o => o.status === statusFilter);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
      <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 900, marginBottom: 20 }}>Orders</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              background: statusFilter === s ? S : G1,
              color: statusFilter === s ? "#000" : SD,
              border: `.5px solid ${statusFilter === s ? S : G3}`,
              padding: "8px 16px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: statusFilter === s ? 900 : 400,
              whiteSpace: "nowrap",
              flexShrink: 0,
              minHeight: 44
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(order => (
          <div
            key={order.id}
            style={{
              background: G1,
              border: `.5px solid ${G3}`,
              borderTop: `2px solid ${S}`,
              padding: "clamp(16px, 3vw, 20px)",
              borderRadius: 4,
              cursor: "pointer"
            }}
            onClick={() => setSelectedOrder(order)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 }}>
              <div>
                <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: S, fontWeight: 700, marginBottom: 4 }}>{order.id.slice(0, 8)}</div>
                <div style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#fff", fontWeight: 700 }}>{order.firstName} {order.lastName}</div>
              </div>
              <div style={{ fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 900, color: S }}>${order.total}</div>
            </div>

            <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `.5px solid ${G3}` }}>
              <select
                value={order.status}
                onChange={(e) => { e.stopPropagation(); updateOrderStatus(order.id, e.target.value); }}
                style={{
                  background: G2,
                  color: order.status === "Delivered" ? "#0c6" : "#fff",
                  border: `.5px solid ${G3}`,
                  padding: "8px 12px",
                  fontSize: "clamp(10px, 2vw, 11px)",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  minHeight: 40,
                  width: "100%"
                }}
              >
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "clamp(10px, 2vw, 11px)", color: SD }}>
              <span>{new Date(order.created_date).toLocaleDateString()}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e03",
                  cursor: "pointer",
                  padding: "8px 12px",
                  minHeight: 40,
                  minWidth: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div style={{ marginTop: 24, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "clamp(16px, 4vw, 24px)", borderRadius: 4 }}>
          <h2 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 900, marginBottom: 16 }}>Order Details: {selectedOrder.id.slice(0, 8)}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Customer</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#fff", marginBottom: 8 }}>{selectedOrder.firstName} {selectedOrder.lastName}</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: SD }}>{selectedOrder.email}</div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Shipping Address</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#fff", lineHeight: 1.6 }}>
                {selectedOrder.address}<br />{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Items</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#fff", marginBottom: 4 }}>
                  {item.qty}x {item.name} - ${item.price * item.qty}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: G2, padding: "clamp(12px, 3vw, 16px)", borderRadius: 4, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 2vw, 11px)", marginBottom: 8 }}>
              <span style={{ color: SD }}>Subtotal:</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>${selectedOrder.subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 2vw, 11px)", borderTop: `.5px solid ${G3}`, paddingTop: 8 }}>
              <span style={{ color: "#fff", fontWeight: 900 }}>Total:</span>
              <span style={{ color: S, fontWeight: 900 }}>${selectedOrder.total}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            style={{
              background: "none",
              border: `.5px solid ${G3}`,
              color: SD,
              padding: "clamp(10px, 2vw, 12px) 20px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: 44,
              width: "100%"
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}