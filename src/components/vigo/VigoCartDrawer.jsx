const S = "#C0C0C0";
const G3 = "#1a1a1a";
const SD = "#777";

export default function VigoCartDrawer({ open, onClose, items, subtotal, updateQty, removeFromCart, onCheckout, productImg }) {
  const shipping = subtotal >= 150 ? 0 : 12;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.7)", opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity .3s" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400, width: "min(420px,100vw)", background: "#0a0a0a", borderLeft: `.5px solid ${G3}`, display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>Your Bag</span>
            <span style={{ fontSize: 10, color: SD, marginLeft: 8 }}>({items.length} items)</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: SD }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🛍</div>
              <div style={{ fontSize: 12 }}>Your bag is empty</div>
            </div>
          )}
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>
              <div style={{ width: 70, height: 70, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={productImg} alt="" style={{ width: 58, objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{item.name}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0 }}>✕</button>
                </div>
                <div style={{ fontSize: 9, color: SD, marginBottom: 10 }}>{item.meta}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: S }}>${item.price * item.qty}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, border: `.5px solid #222`, padding: "3px 10px" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 16, lineHeight: 1, fontFamily: "inherit" }}>−</button>
                    <span style={{ fontSize: 12, color: "#fff", minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 16, lineHeight: 1, fontFamily: "inherit" }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: `.5px solid ${G3}`, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          {subtotal >= 150 && (
            <div style={{ fontSize: 9, letterSpacing: 1, color: "#0c6", textAlign: "center", background: "rgba(0,204,102,.07)", padding: "8px 12px", border: ".5px solid rgba(0,204,102,.2)" }}>
              ✦ You qualify for free shipping!
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD }}>Subtotal</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>${subtotal}</span>
          </div>
          {shipping > 0 && <div style={{ fontSize: 9, color: SD, textAlign: "right" }}>+ ${shipping} shipping</div>}
          <button onClick={onCheckout} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
            Checkout Now
          </button>
          <button onClick={onClose} style={{ background: "none", border: `.5px solid #222`, color: SD, padding: "12px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}