import { useState, useEffect, useCallback } from "react";
import { sanitizeObject } from "@/lib/sanitize";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Package, RotateCcw, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function VigoProduct() {
  const { productImg, wishlist, toggleWishlist, addToCart, setSizeGuideOpen } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", body: "", reviewerName: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setActiveThumb(t => Math.max(0, t - 1));
      if (e.key === "ArrowRight") setActiveThumb(t => t + 1);
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomed]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setSelectedSize(null);
    setActiveThumb(0);
    base44.entities.Product.get(id).then(p => {
      setProduct(p);
      setSelectedColor((p.colors && p.colors[0]) || "Black");
      setLoading(false);
      document.title = `${p.name} — VIGONYC`;
      // Save to recently viewed
      const MAX_RECENT = 8;
      const recent = JSON.parse(localStorage.getItem("vigo_recent") || "[]");
      const updated = [id, ...recent.filter(x => x !== id)].slice(0, MAX_RECENT);
      localStorage.setItem("vigo_recent", JSON.stringify(updated));
      base44.entities.Product.filter({ cat: p.cat }, "-created_date", 8).then(sameCat => {
        const filtered = sameCat.filter(x => x.id !== id);
        if (filtered.length >= 3) { setRelated(filtered.slice(0, 4)); }
        else { base44.entities.Product.list("-created_date", 8).then(all => { setRelated(all.filter(x => x.id !== id).slice(0, 4)); }).catch(() => {}); }
      }).catch(() => {});
      base44.entities.Review.filter({ productId: id }, "-created_date", 50).then(setReviews).catch(() => {});
      base44.auth.me().then(u => {
        if (u) {
          setReviewForm(f => ({ ...f, reviewerName: u.full_name || "" }));
          base44.entities.Review.filter({ productId: id, created_by: u.email }, "-created_date", 1).then(existing => { if (existing?.length > 0) setHasReviewed(true); }).catch(() => {});
        }
      }).catch(() => {});
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "clamp(20px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,48px)" }}>
          <div style={{ background: G2, border: `.5px solid ${G3}`, aspectRatio: "3/4", animation: "vigo-skeleton 1.4s ease-in-out infinite" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 16 }}>
            {[80, 200, 60, 120, 100, 48].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? 14 : i === 1 ? 56 : i === 5 ? 48 : 18, width: `${w}%`, background: G2, animation: "vigo-skeleton 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes vigo-skeleton { 0%,100%{opacity:.6} 50%{opacity:.25} }
          @media(max-width:900px){.product-grid{grid-template-columns:1fr !important;}}
        `}</style>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 40, opacity: .2 }}>∅</div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>Product Not Found</div>
        <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Back to Shop</button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [productImg];
  const videos = product.videos && product.videos.length > 0 ? product.videos : [];
  const allMedia = [...images.map(url => ({ type: "image", url })), ...videos.map(url => ({ type: "video", url }))];
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Black"];
  const wishlisted = wishlist.includes(id);

  const accordionData = [
    { title: "Description", content: product.description || "Premium quality streetwear from New York City. Built for the borough." },
    ...(product.material || product.care ? [{ title: "Material & Care", content: [product.material && `Material: ${product.material}`, product.care && `Care: ${product.care}`].filter(Boolean).join("\n") }] : [{ title: "Sizing & Fit", content: "This piece runs true to size. We recommend sizing up for an oversized fit." }]),
    { title: "Shipping & Returns", content: "Free shipping on orders over $150. Standard shipping 5–7 business days. Returns accepted within 14 days for unworn items." },
  ];

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (soldOut) return;
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      meta: `Size: ${selectedSize} · Color: ${selectedColor}`,
      price: product.price,
      productImage: images[0],
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const soldOut = product.inStock === false || product.stock === 0;
   const approvedReviews = reviews.filter(r => r.approved === true);
   const avgRating = approvedReviews.length ? (approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length).toFixed(1) : null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return toast.error("Please select a star rating");
    setSubmittingReview(true);
    await base44.entities.Review.create({ productId: id, approved: false, ...sanitizeObject(reviewForm) });
    const updated = await base44.entities.Review.filter({ productId: id }, "-created_date", 50).catch(() => reviews);
    setReviews(updated);
    setReviewForm({ rating: 0, title: "", body: "", reviewerName: reviewForm.reviewerName });
    setSubmittingReview(false);
    toast.success("Review submitted!");
  };

  return (
    <div style={{ minHeight: "100vh", background: G1 }}>
      {/* Zoom lightbox */}
      {zoomed && (
        <div onClick={() => setZoomed(false)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={allMedia[activeThumb]?.url || productImg} alt={product.name} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
          <button onClick={() => setZoomed(false)} style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* 3-column editorial layout */}
      <div className="product-editorial" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", minHeight: "100vh" }}>

        {/* LEFT — Back nav + Product info + Description */}
        <div style={{ padding: "clamp(28px,4vw,52px) clamp(20px,3vw,40px)", borderRight: `.5px solid ${G3}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <button onClick={() => navigate("/shop")} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, marginBottom: "clamp(32px,5vw,60px)", padding: 0, alignSelf: "flex-start" }}>
            ‹ Back
          </button>

          <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 10 }}>{product.collection || "SS25"} · {product.cat}</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, marginBottom: 24, textTransform: "uppercase" }}>{product.name}</h1>

          {/* Ratings */}
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: S }}>{"★".repeat(Math.round(parseFloat(avgRating)))}{"☆".repeat(5 - Math.round(parseFloat(avgRating)))}</span>
              <span style={{ fontSize: 9, color: SD }}>{avgRating} ({approvedReviews.length})</span>
            </div>
          )}

          {/* Description as bullet list */}
          {product.description && (
            <div style={{ marginBottom: 24 }}>
              {product.description.split(/\n|\./).filter(s => s.trim()).map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                  <span style={{ color: S, flexShrink: 0, fontSize: 8, marginTop: 3 }}>·</span>
                  <span style={{ fontSize: 11, color: SD, lineHeight: 1.6, textTransform: "uppercase", letterSpacing: 0.5 }}>{line.trim()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Material & Care */}
          {(product.material || product.care) && (
            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, marginTop: 8 }}>
              {product.material && <div style={{ fontSize: 10, color: SD, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>· {product.material}</div>}
              {product.care && <div style={{ fontSize: 10, color: SD, textTransform: "uppercase", letterSpacing: 1 }}>· {product.care}</div>}
            </div>
          )}

          {/* Share */}
          <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={shareBtn}>
              {copied ? "✓ Copied" : "Share"}
            </button>
            <a href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(product.name)} on @VIGONYC&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" style={{ ...shareBtn, textDecoration: "none" }}>X</a>
          </div>
        </div>

        {/* CENTER — Large image, full-bleed */}
        <div
          style={{ position: "relative", background: G2, overflow: "hidden", minHeight: "80vh" }}
          onTouchStart={e => { e.currentTarget._touchX = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - e.currentTarget._touchX;
            if (Math.abs(dx) < 40) return;
            if (dx < 0) setActiveThumb(t => Math.min(t + 1, allMedia.length - 1));
            else setActiveThumb(t => Math.max(t - 1, 0));
          }}
        >
          {allMedia[activeThumb]?.type === "video" ? (
            <video key={allMedia[activeThumb].url} src={allMedia[activeThumb].url} controls autoPlay muted playsInline loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <img src={allMedia[activeThumb]?.url || productImg} alt={product.name} onClick={() => setZoomed(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} />
          )}

          {/* Stock badge */}
          {product.stock > 0 && product.stock <= 10 && (
            <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,.8)", border: `.5px solid #fa0`, color: "#fa0", fontSize: 8, letterSpacing: 2, padding: "4px 10px", textTransform: "uppercase" }}>
              Only {product.stock} left
            </div>
          )}
          {soldOut && (
            <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,.8)", border: `.5px solid #e03`, color: "#e03", fontSize: 8, letterSpacing: 2, padding: "4px 10px", textTransform: "uppercase" }}>
              Sold Out
            </div>
          )}

          {/* Thumbnail strip */}
          {allMedia.length > 1 && (
            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
              {allMedia.map((media, i) => (
                <button key={i} onClick={() => setActiveThumb(i)} style={{ width: 48, height: 48, padding: 0, border: `1.5px solid ${activeThumb === i ? S : "rgba(255,255,255,.3)"}`, background: "rgba(0,0,0,.4)", cursor: "pointer", overflow: "hidden", flexShrink: 0, transition: "border-color .2s" }}>
                  {media.type === "video" ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>▶</div>
                  ) : (
                    <img src={media.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Price + purchase controls */}
        <div style={{ padding: "clamp(28px,4vw,52px) clamp(20px,3vw,36px)", borderLeft: `.5px solid ${G3}`, display: "flex", flexDirection: "column" }}>

          {/* Price */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Price</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 900, color: "var(--vt-text)", letterSpacing: -1 }}>${product.price}</div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <div style={{ fontSize: 18, color: SD, textDecoration: "line-through" }}>${product.compareAtPrice}</div>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: "#fff", background: "#e03", padding: "3px 7px", fontWeight: 900 }}>SALE</div>
                </>
              )}
            </div>
          </div>

          {/* Color */}
          {colors.length > 1 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Color: <span style={{ color: "var(--vt-text)" }}>{selectedColor}</span></div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{ padding: "5px 12px", border: selectedColor === c ? `1.5px solid ${S}` : `.5px solid ${G3}`, background: selectedColor === c ? S : "transparent", color: selectedColor === c ? "#000" : SD, fontSize: 9, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Size {!selectedSize && !soldOut && <span style={{ color: "#e03" }}>*</span>}</div>
              <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", fontSize: 8, letterSpacing: 1, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Guide →</button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sizes.map(s => (
                <button key={s} onClick={() => !soldOut && setSelectedSize(s)} style={{ minWidth: 44, height: 36, padding: "0 8px", border: `.5px solid ${selectedSize === s && !soldOut ? S : G3}`, background: selectedSize === s && !soldOut ? S : "transparent", color: selectedSize === s && !soldOut ? "#000" : SD, fontSize: 10, fontWeight: 700, cursor: soldOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .15s", opacity: soldOut ? 0.4 : 1 }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Notify me (sold out) */}
          {soldOut && (
            <div style={{ marginBottom: 16 }}>
              {notifySubmitted ? (
                <div style={{ fontSize: 10, color: "#0c6", padding: "8px 0" }}>✓ We'll notify you when this restocks.</div>
              ) : (
                <div style={{ display: "flex" }}>
                  <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: G2, border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
                  <button onClick={async () => {
                    if (!notifyEmail.trim() || !/\S+@\S+\.\S+/.test(notifyEmail)) return;
                    await base44.entities.ContactEntry.create({ email: notifyEmail, name: notifyEmail, subject: "Back-in-stock alert", message: product.name, status: "New" }).catch(() => {});
                    setNotifySubmitted(true);
                  }} style={{ background: S, color: "#000", border: "none", padding: "10px 14px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Notify</button>
                </div>
              )}
            </div>
          )}

          {/* Qty + Add to cart */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}` }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 48, background: "none", border: "none", color: SD, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>−</button>
              <div style={{ width: 28, textAlign: "center", fontSize: 12, borderLeft: `.5px solid ${G3}`, borderRight: `.5px solid ${G3}` }}>{qty}</div>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 48, background: "none", border: "none", color: SD, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>+</button>
            </div>
            <button onClick={handleAdd} disabled={soldOut} style={{ flex: 1, background: soldOut ? G2 : added ? "#0c6" : "var(--vt-text)", color: soldOut ? SD : "var(--vt-bg)", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: soldOut ? "not-allowed" : "pointer", height: 48, transition: "background .3s", fontFamily: "inherit" }}>
              {soldOut ? "Sold Out" : added ? "✓ Added" : "Add to Cart"}
            </button>
          </div>

          {/* Wishlist */}
          <button onClick={() => toggleWishlist(id, product)} style={{ width: "100%", background: wishlisted ? "rgba(192,192,192,.08)" : "transparent", border: `.5px solid ${wishlisted ? S : G3}`, color: wishlisted ? S : SD, padding: "11px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: 24, transition: "all .2s" }}>
            {wishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
          </button>

          {/* Info links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: `.5px solid ${G3}` }}>
            {[["Size Guide →", () => setSizeGuideOpen(true)], ["Shipping & Returns →", null], ["Free shipping over $150 →", null]].map(([label, action]) => (
              <button key={label} onClick={action || undefined} style={{ background: "none", border: "none", borderBottom: `.5px solid ${G3}`, padding: "14px 0", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: SD, cursor: action ? "pointer" : "default", fontFamily: "inherit", textAlign: "left" }}>{label}</button>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 24 }}>
            {[{ icon: Package, title: "Free Ship", sub: ">$150" }, { icon: RotateCcw, title: "Returns", sub: "30 days" }, { icon: Zap, title: "Limited", sub: "NYC only" }].map(({ icon: Icon, title, sub }) => (
              <div key={title} style={{ textAlign: "center", padding: "10px 4px" }}>
                <Icon size={16} style={{ color: S, marginBottom: 4 }} />
                <div style={{ fontSize: 7, fontWeight: 700, color: "var(--vt-text)", letterSpacing: 1, textTransform: "uppercase" }}>{title}</div>
                <div style={{ fontSize: 7, color: SD, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Below fold: Reviews + Accordion */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(32px,5vw,56px) clamp(20px,4vw,40px)" }}>

        {/* Reviews */}
        <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 40, marginBottom: 40 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: S, marginBottom: 24 }}>Reviews {approvedReviews.length > 0 && `(${approvedReviews.length})`}</div>
          <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              {approvedReviews.length === 0 && <div style={{ fontSize: 12, color: SD, marginBottom: 20 }}>No reviews yet — be the first!</div>}
              {approvedReviews.map((r, i) => (
                <div key={i} style={{ borderBottom: `.5px solid ${G3}`, paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ color: S, fontSize: 12 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                    <div style={{ fontSize: 9, color: SD }}>{r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
                  </div>
                  {r.title && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>}
                  {r.body && <div style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{r.body}</div>}
                  <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>— {r.reviewerName || "Anonymous"}</div>
                </div>
              ))}
            </div>
            <div>
              {hasReviewed ? (
                <div style={{ padding: "16px", background: G2, border: `.5px solid ${G3}`, fontSize: 11, color: SD }}>✓ You've already reviewed this product. Thank you!</div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Write a Review</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: star <= reviewForm.rating ? S : SD, padding: "0 2px" }}>★</button>
                    ))}
                  </div>
                  <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title (optional)" style={{ background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                  <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} rows={3} placeholder="Share your experience..." style={{ background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                  <input value={reviewForm.reviewerName} onChange={e => setReviewForm(f => ({ ...f, reviewerName: e.target.value }))} placeholder="Your name" style={{ background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                  <button type="submit" disabled={submittingReview} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: submittingReview ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div style={{ background: G2, border: `.5px solid ${G3}` }}>
          <Accordion type="single" collapsible className="w-full">
            {accordionData.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} style={{ padding: "0 24px" }}>
                <AccordionTrigger style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--vt-text)", fontWeight: 700 }}>{item.title}</AccordionTrigger>
                <AccordionContent style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <SectionDivider label="You May Also Like" />
          <div style={{ padding: "clamp(24px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
                  wishlisted={wishlist.includes(p.id)}
                  onWishlist={() => toggleWishlist(p.id, p)}
                  onAdd={() => addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, meta: "Size: M · Color: Black", price: p.price, productImage: p.images?.[0] || productImg })}
                  onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile sticky CTA */}
      <div className="mobile-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--vt-nav-scrolled)", borderTop: `.5px solid ${G3}`, padding: "12px clamp(12px,4vw,24px) env(safe-area-inset-bottom, 12px)", display: "none", gap: 8, zIndex: 150, backdropFilter: "blur(12px)" }}>
        {!selectedSize && <div style={{ fontSize: 9, color: "#e03", textAlign: "center", letterSpacing: 1 }}>SELECT A SIZE</div>}
        <button onClick={handleAdd} style={{ width: "100%", background: added ? "#0c6" : "var(--vt-text)", color: "var(--vt-bg)", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", padding: "14px", fontFamily: "inherit", transition: "background .3s" }}>
          {added ? "✓ Added" : `Add to Cart · $${product.price}`}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes vigo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }
        @media (max-width: 1024px) {
          .product-editorial { grid-template-columns: 1fr 1fr !important; }
          .product-editorial > div:first-child { display: none !important; }
        }
        @media (max-width: 700px) {
          .product-editorial { grid-template-columns: 1fr !important; min-height: auto !important; }
          .product-editorial > div:nth-child(2) { min-height: 70vw !important; }
          .product-editorial > div:nth-child(3) { border-left: none !important; border-top: .5px solid var(--vt-border) !important; }
          .mobile-cta { display: flex !important; flex-direction: column; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const shareBtn = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "6px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };