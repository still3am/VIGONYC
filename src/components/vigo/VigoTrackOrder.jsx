import { useState } from "react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const STEPS = [
  { label: "Order Placed", desc: "Your order has been confirmed.", done: true },
  { label: "Processing", desc: "We're picking and packing your items.", done: true },
  { label: "Shipped", desc: "Your order is on the way — USPS tracking active.", done: true },
  { label: "Out for Delivery", desc: "Your package is with the carrier.", done: false },
  { label: "Delivered", desc: "Order delivered to your address.", done: false },
];

export default function VigoTrackOrder() {
  const [orderNum, setOrderNum] = useState("");
  const [email, setEmail] = useState("");
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNum.trim()) setTracked(true);
  };

  return (
    <div style={{ padding: "64px 32px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Order Status</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>Track Your Order</h1>

      {!tracked ? (
        <form onSubmit={handleTrack} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Order Number *</div>
            <input required value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. VIGO-12345" style={{ width: "100%", background: "#111", border: `.5px solid ${G3}`, color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Email Address *</div>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="The email used to place the order" style={{ width: "100%", background: "#111", border: `.5px solid ${G3}`, color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <button type="submit" style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Track Order</button>
        </form>
      ) : (
        <div>
          {/* Order summary */}
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px 28px", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Order</div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>#{orderNum}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Estimated Delivery</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: S }}>Apr 14 – Apr 16</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Carrier</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>USPS Priority</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "32px 28px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 28 }}>Shipment Status</div>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                {/* Indicator */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: step.done ? S : G3, border: `.5px solid ${step.done ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {step.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 28, background: step.done ? `rgba(192,192,192,.3)` : G3, margin: "4px 0" }} />}
                </div>
                {/* Text */}
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 24 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: step.done ? "#fff" : SD }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 3 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setTracked(false)} style={{ marginTop: 20, background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Track Another Order</button>
        </div>
      )}
    </div>
  );
}