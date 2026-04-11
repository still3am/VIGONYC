import { useOutletContext, useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const ALL_PRODUCTS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52 },
  { id: 5, name: "V Jogger", cat: "Bottoms / Comfort", price: 95 },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245 },
];

export default function VigoWishlist() {
  const { wishlist, toggleWishlist, addToCart, productImg } = useOutletContext();
  const navigate = useNavigate();
  const savedItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ padding: "64px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Saved Items</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>Wishlist ({savedItems.length})</h1>

      {savedItems.length === 0 ? (
        <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "64px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>♡</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Nothing saved yet</div>
          <p style={{ fontSize: 12, color: SD, marginBottom: 28 }}>Hit the ♡ on any product to save it here.</p>
          <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Browse Shop</button>
        </div>
      ) : (
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {savedItems.map(p => (
            <div key={p.id} style={{ background: G1, border: `.5px solid ${G3}` }}>
              <div style={{ position: "relative", paddingBottom: "110%", background: "#111", cursor: "pointer" }} onClick={() => navigate(`/product/${p.id}`)}>
                <img src={productImg} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 20 }} />
                <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.7)", border: "none", color: S, fontSize: 18, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>♥</button>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: SD, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{p.cat}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: S }}>${p.price}</span>
                  <button onClick={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })} style={{ background: S, color: "#000", border: "none", padding: "8px 16px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>+ Bag</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:900px){.vigo-4col{grid-template-columns:repeat(2,1fr) !important;}} @media(max-width:480px){.vigo-4col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}