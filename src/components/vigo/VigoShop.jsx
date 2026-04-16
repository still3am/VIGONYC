import { useState, useMemo, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import PullToRefresh from "./PullToRefresh";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const SIZES = ["XS","S","M","L","XL","XXL","One Size"];

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: `.5px solid ${G3}`, paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0 12px", color: "var(--vt-text)", fontFamily: "inherit" }}>
        <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: SD }}>{title}</span>
        <span style={{ color: SD, fontSize: 14 }}>{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}

function FilterPanel({ activeCat, setActiveCat, selectedSizes, setSelectedSizes, selectedColors, setSelectedColors, priceRange, setPriceRange, activeCollection, setActiveCollection, toggleArr, categories, collections, allColors, inStockOnly, setInStockOnly }) {
  const COLOR_MAP = {
    black: "#111", white: "#eee", silver: "#C0C0C0", chrome: "#C0C0C0", graphite: "#555",
    grey: "#888", gray: "#888", navy: "#1a2a4a", red: "#cc2200", olive: "#6b7c3c",
    cream: "#f5f0e8", blue: "#1a4a8a", green: "#2a6a3a", brown: "#6a3a1a", pink: "#e8a0a0"
  };
  const getSwatchColor = (colorName) => COLOR_MAP[colorName.toLowerCase()] || "#888";

  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--vt-text)", fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>Filters</div>
      <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `.5px solid ${G3}` }}>
        <button onClick={() => setInStockOnly(!inStockOnly)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
          <div style={{ width: 18, height: 18, border: `.5px solid ${inStockOnly ? S : G3}`, background: inStockOnly ? S : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {inStockOnly && <span style={{ color: "#000", fontSize: 12, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: 11, color: inStockOnly ? "var(--vt-text)" : SD }}>In Stock Only</span>
        </button>
      </div>
      <FilterSection title="Category">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "6px 0", fontSize: 11, color: activeCat === c ? "var(--vt-text)" : SD, fontWeight: activeCat === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Collection">
        {collections.map(c => (
          <button key={c} onClick={() => setActiveCollection(c)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "6px 0", fontSize: 11, color: activeCollection === c ? "var(--vt-text)" : SD, fontWeight: activeCollection === c ? 700 : 400, fontFamily: "inherit", width: "100%" }}>{c}</button>
        ))}
      </FilterSection>
      <FilterSection title="Size">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleArr(selectedSizes, setSelectedSizes, s)} style={{ padding: "6px 10px", border: `.5px solid ${selectedSizes.includes(s) ? S : G3}`, background: selectedSizes.includes(s) ? S : "none", color: selectedSizes.includes(s) ? "#000" : SD, fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
      </FilterSection>
      {allColors.length > 0 && (
        <FilterSection title="Color">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allColors.map(c => (
              <button key={c} onClick={() => toggleArr(selectedColors, setSelectedColors, c)} title={c} style={{ width: 26, height: 26, background: getSwatchColor(c), border: selectedColors.includes(c) ? `2px solid ${S}` : `.5px solid ${G3}`, cursor: "pointer", borderRadius: "50%", position: "relative" }} />
            ))}
          </div>
        </FilterSection>
      )}
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "All";

  const [activeCat, setActiveCat] = useState(initCat);

  useEffect(() => {
    setActiveCat(searchParams.get("cat") || "All");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams.get("cat"), searchParams.get("q")]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(300);
  const [activeCollection, setActiveCollection] = useState("All Collections");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 200).then(data => setAllProducts(data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const CATEGORIES = useMemo(() => ["All", ...new Set(allProducts.map(p => p.cat).filter(Boolean))], [allProducts]);
  const COLLECTIONS = useMemo(() => ["All Collections", ...new Set(allProducts.map(p => p.collection).filter(Boolean))], [allProducts]);
  const ALL_COLORS = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors || []).filter(Boolean))], [allProducts]);

  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = useMemo(() => {
    let p = [...allProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      p = p.filter(x => (x.name||"").toLowerCase().includes(q) || (x.description||"").toLowerCase().includes(q) || (x.cat||"").toLowerCase().includes(q));
    }
    if (activeCat !== "All") p = p.filter(x => x.cat === activeCat);
    if (selectedSizes.length) p = p.filter(x => x.sizes && x.sizes.some(s => selectedSizes.includes(s)));
    if (selectedColors.length) p = p.filter(x => x.colors && x.colors.some(c => selectedColors.includes(c)));
    if (activeCollection !== "All Collections") p = p.filter(x => x.collection === activeCollection);
    if (sort === "featured" || sort === "reviews") p = p.filter(x => x.featured).concat(p.filter(x => !x.featured));
    p = p.filter(x => typeof x.price === "number" && x.price <= priceRange);
    if (sort === "price-asc") p.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") p.sort((a,b) => b.price - a.price);
    if (sort === "new") p = p.filter(x => x.tag === "new").concat(p.filter(x => x.tag !== "new"));
    if (inStockOnly) p = p.filter(x => x.inStock !== false);
    return p;
  }, [activeCat, searchQuery, selectedSizes, selectedColors, priceRange, activeCollection, sort, allProducts, inStockOnly]);

  const handleRefresh = useCallback(() => new Promise(res => {
    base44.entities.Product.list("-created_date", 200).then(data => { setAllProducts(data || []); res(); }).catch(() => res());
  }), []);

  const filterProps = { activeCat, setActiveCat, selectedSizes, setSelectedSizes, selectedColors, setSelectedColors, priceRange, setPriceRange, activeCollection, setActiveCollection, toggleArr, categories: CATEGORIES, collections: COLLECTIONS, allColors: ALL_COLORS, inStockOnly, setInStockOnly };

  useEffect(() => {
    document.title = "Shop All — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const activeFiltersCount = [
    activeCat !== "All" ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    activeCollection !== "All Collections" ? 1 : 0,
    priceRange < 300 ? 1 : 0,
  ].reduce((a,b) => a + b, 0);

  const clearAll = () => { setActiveCat("All"); setSelectedSizes([]); setSelectedColors([]); setPriceRange(300); setActiveCollection("All Collections"); setInStockOnly(false); setSearchQuery(""); };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>

      {/* Mobile bottom-sheet filter drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", background: "var(--vt-bg)", borderTop: `2px solid ${S}`, padding: "0 0 env(safe-area-inset-bottom, 16px)", zIndex: 1, maxHeight: "85vh", display: "flex", flexDirection: "column", animation: "slide-up .25s ease" }}>
            {/* Sheet handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: G3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px 16px" }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, color: "var(--vt-text)", textTransform: "uppercase" }}>Filters</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAll} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Clear All</button>
                )}
                <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: SD, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
              </div>
            </div>
            <div style={{ overflowY: "auto", padding: "0 20px", flex: 1 }}>
              <FilterPanel {...filterProps} />
            </div>
            <div style={{ padding: "16px 20px" }}>
              <button onClick={() => setDrawerOpen(false)} style={{ width: "100%", background: S, color: "#000", border: "none", padding: "15px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                View {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop padding wrapper */}
      <div style={{ padding: "32px 20px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ SS25 Season</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: searchQuery ? 8 : 0 }}>
            {searchQuery ? `Results for "${searchQuery}"` : "Shop All"}
          </h1>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "6px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>✕ Clear Search</button>
          )}
        </div>

        {/* Mobile sticky toolbar */}
        <div className="vigo-mobile-toolbar" style={{ display: "none", position: "sticky", top: 58, zIndex: 100, background: "var(--vt-nav-scrolled)", backdropFilter: "blur(12px)", borderBottom: `.5px solid ${G3}`, marginLeft: -20, marginRight: -20, padding: "0 16px", flexDirection: "column", gap: 0 }}>
          {/* Category pills */}
          <div style={{ display: "flex", overflowX: "auto", gap: 6, padding: "10px 0", WebkitOverflowScrolling: "touch" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} style={{ flexShrink: 0, padding: "6px 14px", background: activeCat === c ? S : "transparent", color: activeCat === c ? "#000" : SD, border: `.5px solid ${activeCat === c ? S : G3}`, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: activeCat === c ? 900 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", borderRadius: 0 }}>{c}</button>
            ))}
            <button onClick={() => { setSort("new"); setActiveCat("All"); }} style={{ flexShrink: 0, padding: "6px 14px", background: sort === "new" && activeCat === "All" ? "#0c6" : "transparent", color: sort === "new" && activeCat === "All" ? "#fff" : SD, border: `.5px solid ${sort === "new" && activeCat === "All" ? "#0c6" : G3}`, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />New
            </button>
          </div>
          {/* Sort + Filter row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: `.5px solid ${G3}` }}>
            <span style={{ fontSize: 9, color: SD }}>{filtered.length} items</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "transparent", border: "none", color: SD, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="new">Newest</option>
                <option value="reviews">Best Sellers</option>
              </select>
              <div style={{ width: .5, height: 14, background: G3 }} />
              <button onClick={() => setDrawerOpen(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: activeFiltersCount > 0 ? S : SD, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filter {activeFiltersCount > 0 && <span style={{ background: S, color: "#000", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900 }}>{activeFiltersCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: sort + filter count row */}
        <div className="vigo-desktop-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {activeFiltersCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: SD }}>{activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active</span>
              <button onClick={clearAll} style={{ background: "none", border: `.5px solid ${G3}`, color: S, padding: "4px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>✕ Clear All</button>
            </div>
          )}
          <span style={{ fontSize: 10, color: SD }}>{filtered.length} products</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: G1, border: `.5px solid ${G3}`, color: SD, padding: "8px 14px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="new">Newest</option>
            <option value="reviews">Best Sellers</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {/* Desktop sidebar */}
          <div className="vigo-shop-sidebar" style={{ width: 220, minWidth: 200, flexShrink: 0 }}>
            <FilterPanel {...filterProps} />
          </div>

          {/* Product grid */}
          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: .3 }}>∅</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>No products found</div>
                <p style={{ fontSize: 11, color: SD, marginBottom: 24 }}>Try adjusting your filters.</p>
                <button onClick={clearAll} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Clear Filters</button>
              </div>
            ) : loading ? (
              <div className="vigo-shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", aspectRatio: "3/4", animation: "vigo-pulse 1.5s infinite" }} />
                ))}
              </div>
            ) : (
              <div className="vigo-shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
                    wishlisted={wishlist.includes(p.id)}
                    onWishlist={() => toggleWishlist(p.id, p)}
                    onAdd={() => addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, size: "M", color: "Black", productImage: p.images?.[0] || productImg, price: p.price })}
                    onClick={() => navigate(`/product/${p.id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes vigo-pulse { 0%,100%{opacity:.6} 50%{opacity:.25} }
        @media(max-width:900px){
          .vigo-shop-sidebar { display: none !important; }
          .vigo-desktop-bar { display: none !important; }
          .vigo-mobile-toolbar { display: flex !important; }
          .vigo-shop-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
        }
        @media(max-width:480px){
          .vigo-shop-grid { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
        }
      `}</style>
    </div>
    </PullToRefresh>
  );
}