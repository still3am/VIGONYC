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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = query ? `"${query}" — VIGONYC` : "Search — VIGONYC";
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

  return (
    <div style={{ padding: "clamp(32px,5vw,64px) clamp(20px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Search</div>
      <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>
        {query ? `"${query}"` : "Search"}
      </h1>
      {!loading && <div style={{ fontSize: 11, color: SD, marginBottom: 32 }}>{results.length} result{results.length !== 1 ? "s" : ""}</div>}

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
          {(results.length > 0 || !query ? results : suggestions).map(p => (
            <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onAdd={() => addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, size: "M", color: "Black", productImage: p.images?.[0] || productImg, price: p.price })}
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