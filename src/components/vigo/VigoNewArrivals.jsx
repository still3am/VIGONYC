import { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoNewArrivals() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "New Arrivals — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  useEffect(() => {
   base44.entities.Product.filter({ tag: "new" }, "-created_date", 100)
     .then(data => { setProducts(data || []); setLoading(false); })
     .catch(() => setLoading(false));
  }, []);

  const dateRange = useMemo(() => {
   if (products.length === 0) return null;
   const dates = products.map(p => new Date(p.created_date)).filter(d => !isNaN(d));
   if (dates.length === 0) return null;
   const newest = new Date(Math.max(...dates));
   return newest.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [products]);

  return (
    <div style={{ padding: "clamp(32px,5vw,64px) clamp(20px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Just Dropped</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>New Arrivals</h1>
      {!loading && <div style={{ fontSize: 11, color: SD, marginBottom: 32 }}>{products.length} new piece{products.length !== 1 ? "s" : ""} · {dateRange || "Latest Collection"}</div>}

      {loading ? (
        <div className="vigo-na-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {Array(6).fill(0).map((_, i) => <div key={i} style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", aspectRatio: "3/4", animation: "pulse 1.5s infinite" }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <div style={{ fontSize: 32, opacity: .2, marginBottom: 16 }}>∅</div>
          <div style={{ fontSize: 13, color: SD, marginBottom: 24 }}>No new arrivals right now — check back soon.</div>
          <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Browse All</button>
        </div>
      ) : (
        <div className="vigo-na-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id, p)}
              onAdd={() => addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, size: "M", color: "Black", productImage: p.images?.[0] || productImg, price: p.price })}
              onClick={() => navigate(`/product/${p.id}`)} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @media(max-width:900px){.vigo-na-grid{grid-template-columns:repeat(2,1fr) !important;}}
        @media(max-width:480px){.vigo-na-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}