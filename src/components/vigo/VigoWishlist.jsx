import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const ALL_PRODUCTS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new" },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop" },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new" },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd" },
  { id: 5, name: "V Jogger", cat: "Bottoms / Comfort", price: 95, tag: "new" },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd" },
];

const TAG_STYLES = {
  new: { background: "#E8E8E8", color: "#000" },
  drop: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
  ltd: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
};

export default function VigoWishlist() {
  const { wishlist, toggleWishlist, addToCart, productImg } = useOutletContext();
  const navigate = useNavigate();
  const [addedIds, setAddedIds] = useState([]);
  const savedItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleAdd = (p) => {
    addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price });
    setAddedIds(prev => [...prev, p.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== p.id)), 2000);
  };

  return (
    <div style={{ padding: "48px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderBottom: `.5px solid ${G3}`, paddingBottom: 28 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Saved Items</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2 }}>Wishlist <span style={{ color: SD }}>({savedItems.length})</span></h1>
        </div>
        {savedItems.length > 0 && (
          <button onClick={() => savedItems.forEach(p => handleAdd(p))} style={{ background: S, color: "#000", border: "none", padding: "13px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            Add All to Bag
          </button>
        )}
      </div>

      {savedItems.length === 0 ? (
        <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "80px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>♡</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Nothing saved yet</div>
          <p style={{ fontSize: 12, color: SD, marginBottom: 32 }}>Hit the ♡ on any product to save it here for later.</p>
          <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Browse the Shop</button>
        </div>
      ) : (
        <div className="vigo-wish-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {savedItems.map(p => {
            const isAdded = addedIds.includes(p.id);
            return (
              <div key={p.id} style={{ background: G1, border: `.5px solid ${G3}`, transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = S}
                onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
                {/* Image */}
                <div style={{ position: "relative", paddingBottom: "110%", background: G2, cursor: "pointer", overflow: "hidden" }} onClick={() => navigate(`/product/${p.id}`)}>
                  <img src={productImg} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 20, transition: "transform .4s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  {/* Tag */}
                  {p.tag && (
                    <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 9px", fontSize: 8, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[p.tag] }}>
                      {p.tag === "new" ? "New" : p.tag === "drop" ? "Drop" : "Ltd"}
                    </div>
                  )}
                  {/* Remove wishlist */}
                  <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }} title="Remove from wishlist"
                    style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.7)", border: `.5px solid ${G3}`, color: S, fontSize: 16, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>♥</button>
                </div>
                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: SD, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>{p.cat}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: S }}>${p.price}</span>
                    <button onClick={() => handleAdd(p)} style={{ background: isAdded ? "#0c6" : S, color: "#000", border: "none", padding: "9px 16px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
                      {isAdded ? "✓ Added" : "+ Bag"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media(max-width:900px){.vigo-wish-grid{grid-template-columns:repeat(2,1fr) !important;}}
        @media(max-width:480px){.vigo-wish-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}