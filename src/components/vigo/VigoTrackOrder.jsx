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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const statusConfig = {
    Pending:    { icon: "🕐", color: "#fa0",  label: "Order Placed",   sub: "We've received your order and are getting it ready." },
    Processing: { icon: "⚙️", color: "#3af",  label: "Processing",     sub: "Your items are being carefully prepared and packed." },
    Shipped:    { icon: "🚚", color: S,        label: "On Its Way",     sub: "Your package is moving through our network to reach you." },
    Delivered:  { icon: "✓",  color: "#0c6",  label: "Delivered",      sub: "Your order has arrived. Enjoy your VIGONYC pieces." },
    Cancelled:  { icon: "✕",  color: "#e03",  label: "Cancelled",      sub: "This order has been cancelled." },
    Refunded:   { icon: "↩",  color: "#888",  label: "Refunded",       sub: "Your refund has been processed." },
  };

  const getProgressPct = (status) => {
    const map = { Pending: 10, Processing: 35, Shipped: 70, Delivered: 100, Cancelled: 0, Refunded: 0 };
    return map[status] ?? 0;
  };

  const getTrackingUrl = (o) => {
    if (!o.trackingNumber) return null;
    const carrier = (o.trackingCarrier || "").toLowerCase();
    if (carrier === "ups") return `https://www.ups.com/track?tracknum=${o.trackingNumber}`;
    if (carrier === "fedex") return `https://www.fedex.com/fedextrack/?trknbr=${o.trackingNumber}`;
    if (carrier === "dhl") return `https://www.dhl.com/en/express/tracking.html?AWB=${o.trackingNumber}`;
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${o.trackingNumber}`;
  };

  return (
    <div style={{ padding: "clamp(40px,6vw,80px) clamp(16px,4vw,32px)", maxWidth: 560, margin: "0 auto" }}>

      {!order ? (
        <>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Order Status</div>
            <h1 style={{ fontSize: "clamp(32px,6vw,48px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Track Your Order</h1>
            <p style={{ fontSize: 12, color: SD, lineHeight: 1.8 }}>Enter your order number to see the latest status.</p>
          </div>
          <form onSubmit={handleTrack} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Order Number *</div>
              <input required value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. VGO-AB1234" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "14px 16px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 4 }} />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Email (optional)</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email used at checkout" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "14px 16px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", borderRadius: 4 }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", borderRadius: 50, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
          {notFound && (
            <div style={{ marginTop: 24, background: "rgba(220,30,30,0.06)", border: "0.5px solid rgba(220,30,30,0.2)", borderRadius: 16, padding: "24px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Order Not Found</div>
              <p style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 16 }}>
                Double-check your order number from your confirmation email.<br/>
                Order numbers look like <strong>VGO-AB1234</strong>.
              </p>
              <a href="/contact" style={{ display: "inline-block", background: "var(--vt-card)", border: ".5px solid var(--vt-border)", color: "var(--vt-text)", padding: "10px 22px", borderRadius: 50, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>Contact Support</a>
            </div>
          )}
        </>
      ) : (() => {
        const cfg = statusConfig[order.status] || statusConfig.Pending;
        const pct = getProgressPct(order.status);
        const steps = buildSteps(order);
        const trackUrl = getTrackingUrl(order);
        const isDelivered = order.status === "Delivered";
        const isInTransit = order.status === "Shipped";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <button onClick={handleReset} style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--vt-card)", border: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              </button>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Order #{order.orderId}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vt-text)" }}>Package Information</div>
              </div>
            </div>

            {/* Package Icon Card */}
            <div style={{ background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRadius: 24, padding: "36px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
              {/* Big package emoji / icon */}
              <div style={{ width: 120, height: 120, borderRadius: 28, background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}08)`, border: `1.5px solid ${cfg.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, boxShadow: `0 8px 32px ${cfg.color}18` }}>
                {isDelivered ? "📦" : isInTransit ? "🚚" : "📦"}
              </div>

              {/* Status label */}
              <div>
                <h2 style={{ fontSize: "clamp(20px,4vw,26px)", fontWeight: 900, letterSpacing: -0.5, color: "var(--vt-text)", marginBottom: 6 }}>
                  {cfg.label}
                </h2>
                <p style={{ fontSize: 12, color: SD, lineHeight: 1.7, maxWidth: 320 }}>{cfg.sub}</p>
              </div>

              {/* Progress bar */}
              {pct > 0 && (
                <div style={{ width: "100%", maxWidth: 380 }}>
                  <div style={{ height: 8, background: G3, borderRadius: 8, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})`, borderRadius: 8, transition: "width 1.2s ease", position: "relative" }}>
                      {/* Moving dot */}
                      {pct < 100 && (
                        <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: cfg.color, border: "3px solid var(--vt-bg)", boxShadow: `0 0 0 2px ${cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                      )}
                    </div>
                    {pct === 100 && (
                      <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                  {/* Step labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.done ? cfg.color : G3, margin: "0 auto 4px", transition: "background 0.4s" }} />
                        <div style={{ fontSize: 8, color: s.done ? "var(--vt-text)" : SD, letterSpacing: 0.3, fontWeight: s.done ? 700 : 400 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details card */}
            <div style={{ background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRadius: 16, overflow: "hidden" }}>
              {[
                order.shippingName && ["Shipping To", order.shippingName],
                order.shippingAddress && ["Address", order.shippingAddress],
                order.items && ["Items", order.items],
                ["Total", `$${order.total}`],
                order.shippingMethod && ["Method", order.shippingMethod.charAt(0).toUpperCase() + order.shippingMethod.slice(1)],
              ].filter(Boolean).map(([label, val], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "14px 20px", borderBottom: i < arr.length - 1 ? `.5px solid ${G3}` : "none" }}>
                  <span style={{ fontSize: 10, color: SD, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0, paddingTop: 1 }}>{label}</span>
                  <span style={{ fontSize: 12, color: "var(--vt-text)", fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{val}</span>
                </div>
              ))}
              {trackUrl && (
                <a href={trackUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", textDecoration: "none", borderTop: `.5px solid ${G3}`, background: `${S}08` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vt-text)" }}>Track on carrier site</div>
                      <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>{order.trackingNumber} · {order.trackingCarrier || "USPS"}</div>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              )}
            </div>

            {/* Contact Support */}
            <a href="/contact" style={{ display: "block", textAlign: "center", background: "var(--vt-text)", color: "var(--vt-bg)", border: "none", padding: "17px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 50, textDecoration: "none", letterSpacing: 0.3 }}>
              Contact Support
            </a>

            <button onClick={handleReset} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "13px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: 50 }}>
              Track Another Order
            </button>
          </div>
        );
      })()}
    </div>
  );
}