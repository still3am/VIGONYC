import { useState } from "react";

const S = "#C0C0C0";
const G3 = "#1a1a1a";

const TAG_STYLES = {
  new: { background: "#E8E8E8", color: "#000" },
  drop: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
  hot: { background: "#e03", color: "#fff" },
  ltd: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
};
const TAG_LABELS = { new: "New", drop: "Drop 01", hot: "Hot", ltd: "Ltd" };

export default function ProductCard({ product, img, onClick, onAdd, onWishlist, wishlisted }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", background: "#0a0a0a", border: `.5px solid ${hovered ? S : G3}`, transition: "border-color .2s", position: "relative", overflow: "hidden" }}>
      {/* Shine overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 50%)", opacity: hovered ? 1 : 0, transition: "opacity .3s", pointerEvents: "none", zIndex: 1 }} />

      {/* Image */}
      <div style={{ position: "relative", paddingBottom: "120%", background: "#111", overflow: "hidden" }}>
        <img src={img} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: product.opacity, padding: 16, transition: "transform .5s", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        {/* Tags */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4, zIndex: 2 }}>
          {product.tag && <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag] }}>{TAG_LABELS[product.tag]}</span>}
          {product.tag2 && <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag2] }}>{TAG_LABELS[product.tag2]}</span>}
        </div>
        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); onWishlist?.(); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.7)", border: `.5px solid ${G3}`, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, fontSize: 15, color: wishlisted ? S : "#666", opacity: hovered ? 1 : 0.6, transition: "opacity .2s" }}>
          {wishlisted ? "♥" : "♡"}
        </button>
        {/* Add to bag */}
        <button onClick={e => { e.stopPropagation(); onAdd?.(); }} style={{ position: "absolute", bottom: 10, left: 10, right: 10, background: S, color: "#000", border: "none", padding: "10px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "opacity .2s, transform .2s", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Bag
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 18px", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{product.name}</div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: "#444", textTransform: "uppercase", marginTop: 3 }}>{product.cat}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: S }}>${product.price}</span>
          <span style={{ fontSize: 8, letterSpacing: 1, color: "#333", textTransform: "uppercase" }}>Quick Add +</span>
        </div>
      </div>
    </div>
  );
}