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
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd?.();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: "#0a0a0a",
        border: `.5px solid ${hovered ? S : G3}`,
        transition: "border-color .2s, transform .2s",
        transform: hovered ? "translateY(-2px)" : "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Shine */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 50%)", opacity: hovered ? 1 : 0, transition: "opacity .3s", pointerEvents: "none", zIndex: 1 }} />

      {/* Image */}
      <div style={{ position: "relative", paddingBottom: "115%", background: "#111", overflow: "hidden" }}>
        <img
          src={img}
          alt={product.name}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "contain", opacity: product.opacity,
            padding: 20, transition: "transform .5s",
            transform: hovered ? "scale(1.07)" : "scale(1)"
          }}
        />

        {/* Tags */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4, zIndex: 2 }}>
          {product.tag && (
            <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag] }}>
              {TAG_LABELS[product.tag]}
            </span>
          )}
          {product.tag2 && (
            <span style={{ padding: "3px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[product.tag2] }}>
              {TAG_LABELS[product.tag2]}
            </span>
          )}
        </div>

        {/* Wishlist button — always visible on mobile */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist?.(); }}
          style={{
            position: "absolute", top: 10, right: 10,
            background: wishlisted ? "rgba(192,192,192,.15)" : "rgba(0,0,0,.65)",
            border: `.5px solid ${wishlisted ? S : G3}`,
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 2, fontSize: 16,
            color: wishlisted ? S : "#888",
            transition: "all .2s",
            backdropFilter: "blur(4px)",
          }}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 0", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: S }}>${product.price}</span>
          {product.sizes && product.sizes.length > 0 && (
            <span style={{ fontSize: 8, color: "#444", letterSpacing: 1 }}>
              {product.sizes.slice(0, 3).join(" · ")}{product.sizes.length > 3 ? " +" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Add to Bag — always visible at bottom */}
      <div style={{ padding: "12px 14px 14px" }}>
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            background: added ? "#0c6" : S,
            color: "#000",
            border: "none",
            padding: "11px",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background .3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {added ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Added!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}