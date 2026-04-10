import { useState } from "react";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const allProducts = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", opacity: 1 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
  { id: 5, name: "V Jogger", cat: "Bottoms / Comfort", price: 95, tag: "new", opacity: 0.7 },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear / Heavy", price: 245, tag: "ltd", opacity: 0.5 },
  { id: 7, name: "NYC Tote", cat: "Accessories", price: 38, tag: null, opacity: 0.8 },
  { id: 8, name: "VIGO Socks 3-Pack", cat: "Accessories", price: 28, tag: "new", opacity: 0.9 },
];

const filters = ["All", "Tops", "Bottoms", "Outerwear", "Accessories", "Headwear"];

export default function VigoShop({ nav, productImg }) {
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState("featured");

  return (
    <div style={{ padding: "48px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ SS25 Season</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 0 }}>Shop All</h1>
      </div>

      {/* Filter + Sort bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} style={{
              background: active === f ? S : "none",
              color: active === f ? "#000" : SD,
              border: `.5px solid ${active === f ? S : G3}`,
              padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
              fontWeight: active === f ? 900 : 400,
            }}>{f}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", outline: "none" }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="new">Newest</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="vigo-4col">
        {allProducts.map(p => (
          <ProductCard key={p.id} product={p} img={productImg} onClick={() => nav("product")} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) { .vigo-4col { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .vigo-4col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}