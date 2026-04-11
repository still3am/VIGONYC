import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Edit2, Trash2, Eye } from "lucide-react";

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
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Orders</h1>

      <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
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
              fontWeight: statusFilter === s ? 900 : 400
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `.5px solid ${G3}`, background: G2 }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Order ID</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Customer</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Total</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#fff" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} style={{ borderBottom: `.5px solid ${G3}` }}>
                  <td style={{ padding: "12px 16px", color: S, fontWeight: 700 }}>{order.id.slice(0, 8)}</td>
                  <td style={{ padding: "12px 16px", color: "#fff" }}>{order.firstName} {order.lastName}</td>
                  <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700 }}>${order.total}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        background: G2,
                        color: order.status === "Delivered" ? "#0c6" : "#fff",
                        border: `.5px solid ${G3}`,
                        padding: "4px 8px",
                        fontSize: 10,
                        fontFamily: "inherit",
                        cursor: "pointer"
                      }}
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px", color: SD }}>{new Date(order.created_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <button onClick={() => setSelectedOrder(order)} style={{ background: "none", border: "none", color: S, cursor: "pointer", marginRight: 8 }}>
                      <Eye size={16} />
                    </button>
                    <button onClick={() => deleteOrder(order.id)} style={{ background: "none", border: "none", color: "#e03", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div style={{ marginTop: 24, background: G1, border: `.5px solid ${G3}`, padding: "24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Order Details: {selectedOrder.id.slice(0, 8)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Customer</div>
                <div style={{ fontSize: 12, color: "#fff" }}>{selectedOrder.firstName} {selectedOrder.lastName}</div>
                <div style={{ fontSize: 11, color: SD }}>{selectedOrder.email}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Shipping Address</div>
                <div style={{ fontSize: 11, color: "#fff", lineHeight: 1.6 }}>
                  {selectedOrder.address}<br />{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
                </div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Items</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 11, color: "#fff", marginBottom: 4 }}>
                    {item.qty}x {item.name} - ${item.price * item.qty}
                  </div>
                ))}
              </div>
              <div style={{ background: G2, padding: "12px", borderRadius: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: SD }}>Subtotal:</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>${selectedOrder.subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: SD }}>Shipping:</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>${selectedOrder.shipping}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, borderTop: `.5px solid ${G3}`, paddingTop: 8, marginTop: 8 }}>
                  <span style={{ color: "#fff", fontWeight: 900 }}>Total:</span>
                  <span style={{ color: S, fontWeight: 900, fontSize: 14 }}>${selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedOrder(null)} style={{ marginTop: 16, background: "none", border: `.5px solid ${G3}`, color: SD, padding: "10px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}