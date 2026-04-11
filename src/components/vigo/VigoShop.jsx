import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const ALL_PRODUCTS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops", price: 68, tag: "new", opacity: 1, colors: ["Black","White"], sizes: ["S","M","L","XL"], collection: "Chrome Series" },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms", price: 145, tag: "drop", opacity: 0.4, colors: ["Black","Graphite"], sizes: ["S","M","L"], collection: "Archive" },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops", price: 128, tag: "new", tag2: "hot", opacity: 0.6, colors: ["Silver","Black"], sizes: ["M","L","XL"], collection: "Chrome Series" },
  { id: 4, name: "5-Panel Cap", cat: "Headwear", price: 52, tag: "ltd", opacity: 0.45, colors: ["Black"], sizes: ["One Size"], collection: "Essentials" },
  { id: 5, name: "V Jogger", cat: "Bottoms", price: 95, tag: "new", opacity: 0.7, colors: ["Black","Graphite"], sizes: ["S","M","L","XL"], collection: "Essentials" },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd", opacity: 0.5, colors: ["Black"], sizes: ["S","M","L"], collection: "Chrome Series" },
  { id: 7, name: "NYC Tote", cat: "Accessories", price: 38, tag: null, opacity: 0.8, colors: ["Black","White"], sizes: ["One Size"], collection: "Essentials" },
  { id: 8, name: "VIGO Socks 3-Pack", cat: "Accessories", price: 28, tag: "new", opacity: 0.9, colors: ["Black","Silver"], sizes: ["One Size"], collection: "Essentials" },
];

const CATEGORIES = ["All","Tops","Bottoms","Outerwear","Headwear","Accessories"];
const SIZES = ["XS","S","M","L","XL","XXL","One Size"];
const COLORS = ["Black","White","Silver","Graphite"];
const COLLECTIONS = ["All Collections","Chrome Series","Archive","Essentials"];

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: `.5px solid ${G3}`, paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0 12px", color: "#fff", fontFamily: "inherit" }}>
        <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: SD }}>{title}</span>
        <span style={{ color: SD, fontSize: 14 }}>{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}

export default function VigoShop() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "All";

  const [activeCat, setActiveCat] = useState(initCat);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(300);
  const [activeCollection, setActiveCollection] = useState("All Collections");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = useMemo(() => {
    let p = [...ALL_PRODUCTS];
    if (activeCat !== "All") p = p.filter(x => x.cat === activeCat);
    if (selectedSizes.length) p = p.filter(x => x.sizes.some(s => selectedSizes.includes(s)));
    if (selectedColors.length) p = p.filter(x => x.colors.some(c => selectedColors.includes(c)));
    if (activeCollection !== "All Collections") p = p.filter(x => x.collection === activeCollection);
    p = p.filter(x => x.price <= priceRange);
    if (sort === "price-asc") p.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") p.sort((a,b) => b.price - a.price);
    if (sort === "new") p = p.filter(x => x.tag === "new").concat(p.filter(x => x.tag !== "new"));
    return p;
  }, [activeCat, selectedSizes, selectedColors, priceRange, activeCollection, sort]);

  const Sidebar = () => (
    <div style={{ width: 220, flexShrink: 0 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#fff", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>Filters</div>
      <FilterSection title="Category">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "5px 0", fontSize: 11, color: activeCat === c ? "#fff" : SD, fontWeight: activeCat === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Collection">
        {COLLECTIONS.map(c => (
          <button key={c} onClick={() => setActiveCollection(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "5px 0", fontSize: 11, color: activeCollection === c ? "#fff" : SD, fontWeight: activeCollection === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Size">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleArr(selectedSizes, setSelectedSizes, s)} style={{ padding: "5px 10px", border: `.5px solid ${selectedSizes.includes(s) ? S : G3}`, background: selectedSizes.includes(s) ? S : "none", color: selectedSizes.includes(s) ? "#000" : SD, fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Color">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {COLORS.map(c => {
            const bg = c === "Black" ? "#111" : c === "White" ? "#eee" : c === "Silver" ? "#C0C0C0" : "#666";
            return (
              <button key={c} onClick={() => toggleArr(selectedColors, setSelectedColors, c)} title={c} style={{ width: 22, height: 22, background: bg, border: selectedColors.includes(c) ? `2px solid ${S}` : `.5px solid ${G3}`, cursor: "pointer", borderRadius: "50%", position: "relative" }}>
                {selectedColors.includes(c) && <span style={{ position: "absolute", inset: -1, borderRadius: "50%", border: `2px solid ${S}` }} />}
              </button>
            );
          })}
        </div>
      </FilterSection>
      <FilterSection title={`Price: Up to $${priceRange}`}>
        <input type="range" min={20} max={300} value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} style={{ width: "100%", accentColor: S }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: SD, marginTop: 6 }}>
          <span>$20</span><span>$300</span>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div style={{ padding: "48px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36, borderBottom: `.5px solid ${G3}`, paddingBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ SS25 Season</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>Shop All</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* View toggle */}
          <div style={{ display: "flex", border: `.5px solid ${G3}` }}>
            {["grid","list"].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{ padding: "8px 14px", background: viewMode === v ? S : "none", color: viewMode === v ? "#000" : SD, border: "none", cursor: "pointer", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "inherit" }}>{v}</button>
            ))}
          </div>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: SD, padding: "8px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="new">Newest</option>
          </select>
          {/* Mobile filter toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="vigo-filter-btn" style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "8px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Filters</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Sidebar — desktop always visible, mobile conditionally */}
        <div className="vigo-shop-sidebar" style={{ display: sidebarOpen ? "block" : undefined }}>
          <Sidebar />
        </div>
        {/* Products */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: SD, marginBottom: 20 }}>{filtered.length} products</div>
          {viewMode === "grid" ? (
            <div className="vigo-shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} img={productImg}
                  wishlisted={wishlist.includes(p.id)}
                  onWishlist={() => toggleWishlist(p.id)}
                  onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
                  onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{ display: "flex", gap: 20, background: G1, border: `.5px solid ${G3}`, padding: "16px", cursor: "pointer", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = S}
                  onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
                  <div style={{ width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={productImg} alt="" style={{ width: 70, objectFit: "contain", opacity: p.opacity }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{p.cat}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: S }}>${p.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .vigo-shop-sidebar { display: block; }
        @media(max-width:900px){ .vigo-shop-sidebar { display: none; } .vigo-shop-sidebar.vigo-filter-open { display: block; position: fixed; top: 0; left: 0; bottom: 0; z-index: 200; background: #000; width: 280px; overflow-y: auto; padding: 24px; } .vigo-filter-btn { display: flex !important; } .vigo-shop-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(min-width:901px){ .vigo-filter-btn { display: none !important; } }
        @media(max-width:480px){ .vigo-shop-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}