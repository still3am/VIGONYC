import { useState } from "react";
import SectionDivider from "./SectionDivider";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "Silver", "Graphite"];

export default function VigoProduct({ nav, productImg }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToBag = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ padding: "48px 32px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 40, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 9, letterSpacing: 2 }}>Home</button>
        <span>/</span>
        <button onClick={() => nav("shop")} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 9, letterSpacing: 2 }}>Shop</button>
        <span>/</span>
        <span style={{ color: "#fff" }}>Chrome V Tee</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="vigo-2col">
        {/* Images */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ width: 72, height: 72, background: G1, border: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <img src={productImg} alt="" style={{ width: 56, height: 56, objectFit: "contain", opacity: 0.5 + i * 0.15 }} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "3/4" }}>
            <img src={productImg} alt="Chrome V Tee" style={{ width: "80%", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(192,192,192,.1))" }} />
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>SS25 — Chrome Series</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Chrome V Tee</h1>
          <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 20 }}>Tops / Essential</div>

          <div style={{ fontSize: 32, fontWeight: 900, color: S, marginBottom: 24 }}>$68</div>

          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            {["★","★","★","★","★"].map((s,i) => <span key={i} style={{ color: S, fontSize: 14 }}>{s}</span>)}
            <span style={{ fontSize: 10, color: SD, marginLeft: 8, alignSelf: "center" }}>4.9 (128 reviews)</span>
          </div>

          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 32, borderTop: `.5px solid ${G3}`, paddingTop: 24 }}>
            The Chrome V Tee is the cornerstone of the SS25 drop. Heavyweight 350gsm cotton, oversized silhouette, embossed chrome V logo on chest. Built for the borough.
          </p>

          {/* Color */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Color: <span style={{ color: "#fff" }}>{selectedColor}</span></div>
            <div style={{ display: "flex", gap: 8 }}>
              {colors.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{ padding: "6px 16px", border: `.5px solid ${selectedColor === c ? S : G3}`, background: selectedColor === c ? "rgba(192,192,192,.1)" : "none", color: selectedColor === c ? "#fff" : SD, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Size</div>
              <button style={{ background: "none", border: "none", fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", cursor: "pointer" }}>Size Guide</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{ width: 52, height: 44, border: `.5px solid ${selectedSize === s ? S : G3}`, background: selectedSize === s ? S : "none", color: selectedSize === s ? "#000" : SD, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}` }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: 44, height: 52, background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width: 44, height: 52, background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer" }}>+</button>
            </div>
            <button onClick={addToBag} style={{ flex: 1, background: added ? "#0c6" : S, color: "#000", border: "none", padding: "0 24px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", transition: "background .3s", height: 52 }}>
              {added ? "✓ Added to Bag" : "Add to Bag"}
            </button>
          </div>
          <button style={{ width: "100%", background: "none", border: `.5px solid ${G3}`, color: SD, padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>
            Save to Wishlist
          </button>

          {/* Details */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `.5px solid ${G3}` }}>
            {[["Material", "350gsm 100% Premium Cotton"],["Fit","Oversized / Drop Shoulder"],["Care","Cold wash, lay flat to dry"],["Origin","NYC — Limited Production"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `.5px solid ${G3}` }}>
                <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD }}>{k}</span>
                <span style={{ fontSize: 11, color: "#fff" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.vigo-2col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}