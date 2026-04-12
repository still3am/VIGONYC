import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import confetti from "canvas-confetti";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoOrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire confetti
    confetti({ particleCount: 120, spread: 80, colors: ["#C0C0C0", "#ffffff", "#000000"], origin: { y: 0.4 } });

    base44.entities.Order.filter({ orderId }, "-created_date", 1)
      .then(results => {
        if (results && results.length > 0) setOrder(results[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `2px solid ${G3}`, borderTop: `2px solid ${S}`, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 32px", maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,204,102,.1)", border: ".5px solid rgba(0,204,102,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 32 }}>✓</div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>Order Confirmed</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>Thank You!</h1>
      <div style={{ fontSize: 14, fontWeight: 700, color: S, marginBottom: 8 }}>Order #{orderId}</div>
      <div style={{ fontSize: 12, color: SD, marginBottom: 40 }}>A confirmation email is on its way to you.</div>

      {order && (
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "28px 32px", marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 20 }}>Order Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              ["Items", order.items],
              ["Shipping To", order.shippingAddress],
              order.shippingMethod && ["Shipping Method", order.shippingMethod],
              order.pieces && ["Pieces", `${order.pieces} item${order.pieces === 1 ? "" : "s"}`],
            ].filter(Boolean).map(([k, v]) => v ? (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: `.5px solid ${G3}`, paddingBottom: 10 }}>
                <span style={{ fontSize: 10, color: SD, textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 11, color: "var(--vt-text)", textAlign: "right" }}>{v}</span>
              </div>
            ) : null)}
          </div>
          {order.subtotal > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.subtotal && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: SD }}><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>}
              {order.shippingCost !== undefined && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: SD }}><span>Shipping</span><span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost}`}</span></div>}
              {order.tax && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: SD }}><span>Tax</span><span>${order.tax?.toFixed(2)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16, borderTop: `.5px solid ${G3}`, paddingTop: 12, marginTop: 4 }}>
                <span>Total</span>
                <span style={{ color: S }}>${order.total}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          Continue Shopping
        </button>
        <Link to="/track-order" style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "14px 24px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", textDecoration: "none" }}>
          Track Order →
        </Link>
      </div>
    </div>
  );
}