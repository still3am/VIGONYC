import { useState } from "react";

const S = "#C0C0C0";

const TAG_STYLES = {
  new: { background: "#E8E8E8", color: "#000" },
  drop: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
  hot: { background: "#e03", color: "#fff" },
  ltd: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
};

const TAG_LABELS = { new: "New", drop: "Drop 01", hot: "Hot", ltd: "Ltd" };

export default function ProductCard({ product, img, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", background: "#0a0a0a", border: ".5px solid #1a1a1a", transition: "border-color .2s", position: "relative", borderColor: hovered ? S : "#1a1a1a" }}>
      {/* Image area */}
      <div style={{ position: "relative", paddingBottom: "120%", overflow: "hidden", background: "#111" }}>
        <img src={img} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: product.opacity, transition: "transform .5s", transform: hovered ? "scale(1.04)" : "scale(1)", padding: 16 }} />
        {/* Tags */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 4 }}>
          {product.tag && <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag] }}>{TAG_LABELS[product.tag]}</span>}
          {product.tag2 && <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag2] }}>{TAG_LABELS[product.tag2]}</span>}
        </div>
        {/* Wishlist */}
        <button onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.6)", border: ".5px solid #222", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        {/* Add btn on hover */}
        <button onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 12, right: 12, width: 32, height: 32, background: S, color: "#000", border: "none", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: hovered ? 1 : 0, transition: "opacity .2s", fontWeight: 300, lineHeight: 1 }}>+</button>
      </div>
      {/* Info */}
      <div style={{ padding: "16px 16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{product.name}</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginTop: 4 }}>{product.cat}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: S }}>${product.price}</span>
        </div>
      </div>
    </div>
  );
}