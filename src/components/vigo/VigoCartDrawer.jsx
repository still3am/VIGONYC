const S = "#C0C0C0";

export default function VigoCartDrawer({ open, onClose, items, subtotal, updateQty, onCheckout, productImg }) {
  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.7)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition: "opacity .3s",
      }} />
      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400,
        width: Math.min(420, typeof window !== "undefined" ? window.innerWidth : 420),
        background: "#0a0a0a",
        borderLeft: ".5px solid #1a1a1a",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .35s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: ".5px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>Your Cart ({items.length})</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#777", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 16, paddingBottom: 16, borderBottom: ".5px solid #1a1a1a" }}>
              <div style={{ width: 72, height: 72, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={productImg} alt="" style={{ width: 60, height: 60, objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: "#777", marginTop: 3 }}>{item.meta}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: S }}>${item.price * item.qty}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: ".5px solid #222", padding: "4px 12px" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>−</button>
                    <span style={{ fontSize: 12, color: "#fff", minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: ".5px solid #1a1a1a", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#777" }}>Subtotal</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>${subtotal}</span>
          </div>
          {subtotal > 150 && (
            <div style={{ fontSize: 9, letterSpacing: 1, color: "#0c6", textAlign: "center", background: "rgba(0,204,102,.07)", padding: "8px 12px", border: ".5px solid rgba(0,204,102,.2)" }}>
              Free shipping on orders over $150 ✦ You qualify!
            </div>
          )}
          <button onClick={onCheckout} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", width: "100%" }}>
            Checkout Now
          </button>
          <button onClick={onClose} style={{ background: "none", border: ".5px solid #222", color: "#777", padding: "12px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", width: "100%" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}