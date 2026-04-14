import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function VigoTrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNum, setOrderNum] = useState(searchParams.get("order") || "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const doTrack = async (num, em) => {
    if (!num.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const results = await base44.entities.Order.filter({ orderId: num.trim() }, "-created_date", 1);
      const found = results?.[0];
      if (!found) { setNotFound(true); return; }
      if (em.trim() && found.userEmail && found.userEmail.toLowerCase() !== em.trim().toLowerCase()) {
        setNotFound(true); return;
      }
      setOrder(found);
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const preOrder = searchParams.get("order");
    if (preOrder) { setOrderNum(preOrder); doTrack(preOrder, ""); }
  }, []);

  const handleTrack = (e) => { e.preventDefault(); doTrack(orderNum, email); };

  const handleReset = () => {
    setOrder(null);
    setOrderNum("");
    setEmail("");
    setNotFound(false);
  };

  const buildSteps = (o) => {
    const currentStep = STATUS_STEPS.indexOf(o.status);
    return [
      { label: "Order Placed", desc: "We received your order", done: currentStep >= 0 },
      { label: "Processing", desc: "Your items are being prepared", done: currentStep >= 1 },
      { label: "Shipped", desc: o.trackingNumber || "On its way to you", done: currentStep >= 2 },
      { label: "Delivered", desc: "Enjoy your VIGONYC pieces", done: currentStep >= 3 },
    ];
  };

  return (
    <div style={{ padding: "64px 32px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Order Status</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>Track Your Order</h1>

      {!order ? (
        <>
          <form onSubmit={handleTrack} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Order Number *</div>
              <input required value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. VIGO-12345" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Email Address</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="The email used to place the order" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
          {notFound && (
            <div style={{ marginTop: 20, background: G1, border: `.5px solid ${G3}`, borderTop: "2px solid #e03", padding: "24px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Order Not Found</div>
              <div style={{ fontSize: 11, color: SD }}>We couldn't find an order with that number. Please double-check and try again.</div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px 28px", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Order</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 900 }}>#{order.orderId}</div>
                    <button onClick={() => navigator.clipboard.writeText(order.orderId)} style={{ fontSize: 8, letterSpacing: 1, color: SD, background: "none", border: `.5px solid var(--vt-border)`, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Copy</button>
                  </div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: S }}>{order.status}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>${order.total}</div>
              </div>
            </div>
            {order.trackingNumber && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Tracking Number</div>
                <div style={{ fontSize: 12, color: "var(--vt-text)" }}>{order.trackingNumber}</div>
              </div>
            )}
            {order.shippingAddress && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Shipping To</div>
                <div style={{ fontSize: 12, color: "var(--vt-text)" }}>{order.shippingAddress}</div>
              </div>
            )}
            {order.items && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Items</div>
                <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{order.items}</div>
              </div>
            )}
          </div>

          <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "32px 28px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 28 }}>Shipment Status</div>
            {buildSteps(order).map((step, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: step.done ? S : G3, border: `.5px solid ${step.done ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {step.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {i < arr.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 28, background: step.done ? `rgba(192,192,192,.3)` : G3, margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: step.done ? "var(--vt-text)" : SD }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 3 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleReset} style={{ marginTop: 20, background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Track Another Order</button>
        </div>
      )}
    </div>
  );
}