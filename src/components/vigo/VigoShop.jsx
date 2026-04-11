import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PullToRefresh from "./PullToRefresh";
import { useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useVigoSettings } from "../../hooks/useVigoSettings";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

// Products are now loaded from useVigoSettings hook below

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

function FilterPanel({ activeCat, setActiveCat, selectedSizes, setSelectedSizes, selectedColors, setSelectedColors, priceRange, setPriceRange, activeCollection, setActiveCollection, toggleArr }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#fff", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>Filters</div>
      <FilterSection title="Category">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "6px 0", fontSize: 11, color: activeCat === c ? "#fff" : SD, fontWeight: activeCat === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Collection">
        {COLLECTIONS.map(c => (
          <button key={c} onClick={() => setActiveCollection(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "6px 0", fontSize: 11, color: activeCollection === c ? "#fff" : SD, fontWeight: activeCollection === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Size">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleArr(selectedSizes, setSelectedSizes, s)} style={{ padding: "6px 10px", border: `.5px solid ${selectedSizes.includes(s) ? S : G3}`, background: selectedSizes.includes(s) ? S : "none", color: selectedSizes.includes(s) ? "#000" : SD, fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Color">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {COLORS.map(c => {
            const bg = c === "Black" ? "#111" : c === "White" ? "#eee" : c === "Silver" ? "#C0C0C0" : "#666";
            return (
              <button key={c} onClick={() => toggleArr(selectedColors, setSelectedColors, c)} title={c} style={{ width: 26, height: 26, background: bg, border: selectedColors.includes(c) ? `2px solid ${S}` : `.5px solid ${G3}`, cursor: "pointer", borderRadius: "50%", position: "relative" }} />
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
}

export default function VigoShop() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const { settings } = useVigoSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "All";

  const [activeCat, setActiveCat] = useState(initCat);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(300);
  const [activeCollection, setActiveCollection] = useState("All Collections");
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = useMemo(() => {
    let p = [...settings.products];
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

  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => new Promise(res => setTimeout(() => { setRefreshKey(k => k + 1); res(); }, 800)), []);

  const filterProps = { activeCat, setActiveCat, selectedSizes, setSelectedSizes, selectedColors, setSelectedColors, priceRange, setPriceRange, activeCollection, setActiveCollection, toggleArr };

  const CATEGORIES = [...new Set(["All", ...settings.products.map(p => p.cat)])];

  const activeFiltersCount = [
    activeCat !== "All" ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    activeCollection !== "All Collections" ? 1 : 0,
    priceRange < 300 ? 1 : 0,
  ].reduce((a,b) => a + b, 0);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div style={{ padding: "32px 20px", maxWidth: 1400, margin: "0 auto" }}>

      {/* Mobile filter drawer overlay */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)" }} />
          <div style={{ position: "relative", width: 300, maxWidth: "85vw", background: "#050505", borderRight: `.5px solid ${G3}`, padding: "24px 20px", overflowY: "auto", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2 }}>FILTERS</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <FilterPanel {...filterProps} />
            <button onClick={() => setDrawerOpen(false)} style={{ width: "100%", background: S, color: "#000", border: "none", padding: "14px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ SS25 Season</div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: 20 }}>Shop All</h1>

        {/* Mobile: Category scroll tabs */}
        <div className="vigo-cat-tabs" style={{ display: "none", overflowX: "auto", gap: 6, paddingBottom: 4, marginBottom: 16 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{ flexShrink: 0, padding: "8px 16px", background: activeCat === c ? S : "none", color: activeCat === c ? "#000" : SD, border: `.5px solid ${activeCat === c ? S : G3}`, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: activeCat === c ? 900 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: SD }}>{filtered.length} products</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: SD, padding: "8px 14px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="new">Newest</option>
            </select>
            <button className="vigo-filter-btn" onClick={() => setDrawerOpen(true)} style={{ background: "none", border: `.5px solid ${G3}`, color: activeFiltersCount > 0 ? S : SD, padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", display: "none", gap: 6, alignItems: "center" }}>
              Filters {activeFiltersCount > 0 && <span style={{ background: S, color: "#000", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900 }}>{activeFiltersCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Desktop Sidebar */}
        <div className="vigo-shop-sidebar" style={{ width: 220, flexShrink: 0 }}>
          <FilterPanel {...filterProps} />
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: .3 }}>∅</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>No products found</div>
              <p style={{ fontSize: 11, color: SD, marginBottom: 24 }}>Try adjusting your filters.</p>
              <button onClick={() => { setActiveCat("All"); setSelectedSizes([]); setSelectedColors([]); setPriceRange(300); setActiveCollection("All Collections"); }} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Clear Filters</button>
            </div>
          ) : (
            <div className="vigo-shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} img={productImg}
                  wishlisted={wishlist.includes(p.id)}
                  onWishlist={() => toggleWishlist(p.id)}
                  onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
                  onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .vigo-shop-sidebar { display: none !important; }
          .vigo-filter-btn { display: flex !important; }
          .vigo-cat-tabs { display: flex !important; }
          .vigo-shop-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .vigo-shop-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        }
      `}</style>
    </div>
    </PullToRefresh>
  );
}