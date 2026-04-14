import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoSearch() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [inputVal, setInputVal] = useState(query);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");

  useEffect(() => {
    document.title = query ? `"${query}" — VIGONYC` : "Search — VIGONYC";
    setInputVal(query);
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, [query]);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 200).then(data => { setAllProducts(data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.cat || "").toLowerCase().includes(q) ||
      (p.collection || "").toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  const suggestions = useMemo(() => allProducts.filter(p => p.featured).slice(0, 4), [allProducts]);
  const cats = useMemo(() => ["All", ...new Set(results.map(p => p.cat).filter(Boolean))], [results]);
  const displayResults = filterCat === "All" ? results : results.filter(p => p.cat === filterCat);

  return (
    <div style={{ padding: "clamp(32px,5vw,64px) clamp(20px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Search</div>
      <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: 24 }}>
        {query ? `"${query}"` : "Search"}
      </h1>
      <form onSubmit={e => { e.preventDefault(); if (inputVal.trim()) navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`); }} style={{ display: "flex", gap: 0, marginBottom: 32, maxWidth: 560 }}>
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Search products, styles, drops..."
          autoFocus
          style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "14px 20px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
        />
        <button type="submit" style={{ background: S, color: "#000", border: "none", padding: "14px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Search</button>
      </form>
      {!loading && <div style={{ fontSize: 11, color: SD, marginBottom: 16 }}>{displayResults.length} result{displayResults.length !== 1 ? "s" : ""}</div>}
      {!loading && cats.length > 2 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "6px 14px", background: filterCat === c ? S : "var(--vt-card)", color: filterCat === c ? "#000" : SD, border: `.5px solid ${filterCat === c ? S : "var(--vt-border)"}`, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <>
          <div style={{ padding: "40px 0", color: SD, fontSize: 13 }}>No results for "{query}".</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>You Might Like</div>
        </>
      )}

      {loading ? (
        <div className="vigo-search-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {Array(6).fill(0).map((_, i) => <div key={i} style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", aspectRatio: "3/4", animation: "pulse 1.5s infinite" }} />)}
        </div>
      ) : (
        <div className="vigo-search-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {(displayResults.length > 0 || !query ? displayResults : suggestions).map(p => (
            <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onAdd={() => {
                if (p.sizes && p.sizes.length > 1) {
                  navigate(`/product/${p.id}`);
                } else {
                  addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, size: p.sizes?.[0] || null, color: p.colors?.[0] || "Black", productImage: p.images?.[0] || productImg, price: p.price });
                }
              }}
              onClick={() => navigate(`/product/${p.id}`)} />
          ))}
        </div>
      )}

      {query && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button onClick={() => navigate("/shop")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 28px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Browse All →</button>
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @media(max-width:900px){.vigo-search-grid{grid-template-columns:repeat(2,1fr) !important;}}
        @media(max-width:480px){.vigo-search-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}