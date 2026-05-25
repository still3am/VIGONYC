import { useState, useEffect, useRef } from "react";
import { sanitizeObject } from "@/lib/sanitize";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Package, RotateCcw, Zap, Share2, Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
  const [attempted, setAttempted] = useState(false);
  const [styleWith, setStyleWith] = useState([]);
  const touchStartX = useRef(null);

  const mediaBound = (product?.images?.length || 0) + (product?.videos?.length || 0) || 1;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setActiveThumb(t => Math.max(0, t - 1));
      if (e.key === "ArrowRight") setActiveThumb(t => Math.min(t + 1, mediaBound - 1));
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomed, mediaBound]);

  useEffect(() => {
    setLoading(true); setNotFound(false); setProduct(null); setSelectedSize(null); setActiveThumb(0);
    base44.entities.Product.get(id).then(p => {
      setProduct(p);
      setSelectedColor((p.colors && p.colors[0]) || "Black");
      setLoading(false);
      document.title = `${p.name} — VIGONYC`;
      const MAX_RECENT = 8;
      const recent = JSON.parse(localStorage.getItem("vigo_recent") || "[]");
      localStorage.setItem("vigo_recent", JSON.stringify([id, ...recent.filter(x => x !== id)].slice(0, MAX_RECENT)));
      base44.entities.Product.filter({ cat: p.cat }, "-created_date", 8).then(sameCat => {
        const filtered = sameCat.filter(x => x.id !== id);
        if (filtered.length >= 3) setRelated(filtered.slice(0, 4));
        else base44.entities.Product.list("-created_date", 8).then(all => setRelated(all.filter(x => x.id !== id).slice(0, 4))).catch(() => {});
      }).catch(() => {});
      base44.entities.Review.filter({ productId: id }, "-created_date", 50).then(setReviews).catch(() => {});
      const crossCatMap = { Tops: "Bottoms", Bottoms: "Tops", Outerwear: "Accessories", Accessories: "Tops" };
      base44.entities.Product.filter({ cat: crossCatMap[p.cat] || "Accessories" }, "-created_date", 4).then(cross => setStyleWith((cross || []).filter(x => x.id !== id).slice(0, 2))).catch(() => {});
      base44.auth.me().then(u => {
        if (u) {
          setReviewForm(f => ({ ...f, reviewerName: u.full_name || "" }));
          base44.entities.Review.filter({ productId: id, created_by: u.email }, "-created_date", 1).then(existing => { if (existing?.length > 0) setHasReviewed(true); }).catch(() => {});
        }
      }).catch(() => {});
    }).catch(() => { setNotFound(true); setLoading(false); });
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, [id]);

  useEffect(() => {
    if (window.location.hash === "#reviews" && !loading) {
      setTimeout(() => document.querySelector("[data-reviews]")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [loading]);

  if (loading) return (
    <div style={{ padding: "clamp(20px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
      <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,48px)" }}>
        <div style={{ background: G2, border: `.5px solid ${G3}`, aspectRatio: "3/4", animation: "vigo-skeleton 1.4s ease-in-out infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 16 }}>
          {[80, 200, 60, 120, 100, 48].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 14 : i === 1 ? 56 : i === 5 ? 48 : 18, width: `${w}%`, background: G2, animation: "vigo-skeleton 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes vigo-skeleton{0%,100%{opacity:.6}50%{opacity:.25}} @media(max-width:900px){.product-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );

  if (notFound || !product) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 40, opacity: .2 }}>∅</div>
      <div style={{ fontSize: 18, fontWeight: 900 }}>Product Not Found</div>
      <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Back to Shop</button>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [productImg];
  const videos = product.videos?.length > 0 ? product.videos : [];
  const allMedia = [...images.map(url => ({ type: "image", url })), ...videos.map(url => ({ type: "video", url }))];
  const sizes = product.sizes?.length > 0 ? product.sizes : DEFAULT_SIZES;
  const colors = product.colors?.length > 0 ? product.colors : ["Black"];
  const wishlisted = wishlist.includes(id);
  const soldOut = product.inStock === false || product.stock === 0;
  const approvedReviews = reviews.filter(r => r.approved === true);
  const avgRating = approvedReviews.length ? (approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length).toFixed(1) : null;

  const accordionData = [
    { title: "Description", content: product.description || "Premium quality streetwear from New York City. Built for the borough." },
    ...(product.material || product.care
      ? [{ title: "Material & Care", content: [product.material && `Material: ${product.material}`, product.care && `Care: ${product.care}`].filter(Boolean).join("\n") }]
      : [{ title: "Sizing & Fit", content: "This piece runs true to size. We recommend sizing up for an oversized fit." }]),
    { title: "Shipping & Returns", content: "Free shipping on orders over $150. Standard shipping 5–7 business days. Returns accepted within 14 days for unworn items." },
  ];

  const handleAdd = () => {
    if (!selectedSize) { setAttempted(true); toast.error("Please select a size"); return; }
    if (soldOut) return;
    addToCart({ id: product.id, productId: product.id, name: product.name, productName: product.name, size: selectedSize, color: selectedColor, price: product.price, productImage: images[0], qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: G1 }}>

      {/* Zoom overlay */}
      {zoomed && (
        <div onClick={() => setZoomed(false)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={allMedia[activeThumb]?.url || productImg} alt={product.name} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
          <button onClick={() => setZoomed(false)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.1)", border: ".5px solid rgba(255,255,255,.2)", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {allMedia.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActiveThumb(t => Math.max(0, t - 1)); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.1)", border: ".5px solid rgba(255,255,255,.2)", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={20} /></button>
              <button onClick={e => { e.stopPropagation(); setActiveThumb(t => Math.min(t + 1, allMedia.length - 1)); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.1)", border: ".5px solid rgba(255,255,255,.2)", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={20} /></button>
            </>
          )}
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ padding: "12px clamp(16px,4vw,32px)", borderBottom: `.5px solid ${G3}`, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {[["Home", "/"], ["Shop", "/shop"], [product.cat, `/shop?cat=${product.cat}`]].map(([label, to]) => (
          <span key={to} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link to={to} style={{ fontSize: 9, color: SD, letterSpacing: 1, textDecoration: "none", textTransform: "uppercase" }}>{label}</Link>
            <span style={{ fontSize: 9, color: SD }}>›</span>
          </span>
        ))}
        <span style={{ fontSize: 9, color: "var(--vt-text)", letterSpacing: 1, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100vw - 200px)" }}>{product.name}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(20px,4vw,32px)" }}>
        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,56px)", marginBottom: "clamp(40px,6vw,64px)" }}>

          {/* ── MEDIA COLUMN ── */}
          <div>
            {/* Main image */}
            <div
              style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, aspectRatio: "3/4", position: "relative", overflow: "hidden", borderRadius: 2 }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) < 40) return;
                if (dx < 0) setActiveThumb(t => Math.min(t + 1, allMedia.length - 1));
                else setActiveThumb(t => Math.max(t - 1, 0));
              }}
            >
              {allMedia[activeThumb]?.type === "video" ? (
                <video key={allMedia[activeThumb].url} src={allMedia[activeThumb].url} controls autoPlay muted playsInline loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#000" }} />
              ) : (
                <img src={allMedia[activeThumb]?.url || productImg} alt={product.name} onClick={() => setZoomed(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} />
              )}

              {/* Tag badge */}
              {product.tag && (
                <div style={{ position: "absolute", top: 14, left: 14, background: product.tag === "sale" ? "#e03" : product.tag === "ltd" ? "#333" : "rgba(0,0,0,.75)", color: "#fff", fontSize: 7, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
                  {product.tag.toUpperCase()}
                </div>
              )}

              {/* Nav arrows (desktop) */}
              {allMedia.length > 1 && (
                <>
                  <button onClick={() => setActiveThumb(t => Math.max(0, t - 1))} className="media-arrow" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,.5)", border: ".5px solid rgba(255,255,255,.15)", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeThumb === 0 ? 0.3 : 1 }}><ChevronLeft size={16} /></button>
                  <button onClick={() => setActiveThumb(t => Math.min(t + 1, allMedia.length - 1))} className="media-arrow" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,.5)", border: ".5px solid rgba(255,255,255,.15)", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeThumb === allMedia.length - 1 ? 0.3 : 1 }}><ChevronRight size={16} /></button>
                </>
              )}

              {/* Dot + counter */}
              {allMedia.length > 1 && (
                <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ background: "rgba(0,0,0,.5)", color: "rgba(255,255,255,.8)", fontSize: 9, padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(6px)", letterSpacing: 1 }}>{activeThumb + 1} / {allMedia.length}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {allMedia.map((_, i) => (
                      <div key={i} onClick={() => setActiveThumb(i)} style={{ width: i === activeThumb ? 20 : 6, height: 4, borderRadius: 2, background: i === activeThumb ? S : "rgba(255,255,255,.4)", transition: "all .25s", cursor: "pointer" }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                {allMedia.map((media, i) => (
                  <button key={i} onClick={() => setActiveThumb(i)} style={{ flexShrink: 0, width: 68, height: 68, background: G2, border: `${activeThumb === i ? "2px" : ".5px"} solid ${activeThumb === i ? S : G3}`, cursor: "pointer", overflow: "hidden", padding: 0, borderRadius: 2, transition: "all .2s", position: "relative" }}>
                    {media.type === "video" ? (
                      <>
                        <video src={media.url} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}><span style={{ color: "#fff", fontSize: 14 }}>▶</span></div>
                      </>
                    ) : (
                      <img src={media.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── DETAILS COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Category + collection */}
            <div style={{ fontSize: 8, letterSpacing: 2.5, color: S, textTransform: "uppercase", marginBottom: 10 }}>{product.collection || "SS25"} · {product.cat}</div>

            {/* Title + wishlist */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <h1 style={{ fontSize: "clamp(26px,4.5vw,44px)", fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.05, margin: 0 }}>{product.name}</h1>
              <button onClick={() => toggleWishlist(id, product)} style={{ flexShrink: 0, background: wishlisted ? "rgba(192,192,192,.1)" : "transparent", border: `.5px solid ${wishlisted ? S : G3}`, color: wishlisted ? S : SD, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", marginTop: 4 }}>
                <Heart size={18} fill={wishlisted ? S : "none"} />
              </button>
            </div>

            {/* Rating row */}
            {approvedReviews.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= Math.round(parseFloat(avgRating)) ? S : "none"} stroke={S} />)}
                </div>
                <span style={{ fontSize: 10, color: SD }}>{avgRating} ({approvedReviews.length} review{approvedReviews.length !== 1 ? "s" : ""})</span>
                <a href="#reviews" onClick={e => { e.preventDefault(); document.querySelector("[data-reviews]")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontSize: 9, color: S, textDecoration: "none", letterSpacing: 1 }}>Read ›</a>
              </div>
            )}

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `.5px solid ${G3}` }}>
              <span style={{ fontSize: "clamp(28px,4vw,38px)", fontWeight: 900, color: S }}>${product.price}</span>
              {product.compareAtPrice > product.price && (
                <>
                  <span style={{ fontSize: 18, color: SD, textDecoration: "line-through" }}>${product.compareAtPrice}</span>
                  <span style={{ background: "#e03", color: "#fff", fontSize: 8, fontWeight: 900, letterSpacing: 2, padding: "3px 8px" }}>SALE</span>
                </>
              )}
            </div>

            {/* Low stock */}
            {product.stock > 0 && product.stock <= 10 && (
              <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#fa0", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fa0", animation: "vigo-pulse 1.5s infinite" }} />
                Only {product.stock} left
              </div>
            )}

            {/* Color */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Color: <span style={{ color: "var(--vt-text)", fontWeight: 700 }}>{selectedColor}</span></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{ padding: "8px 16px", border: selectedColor === c ? `2px solid ${S}` : `.5px solid ${G3}`, background: selectedColor === c ? S : "transparent", color: selectedColor === c ? "#000" : SD, fontSize: 9, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", fontWeight: selectedColor === c ? 700 : 400, borderRadius: 2 }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
                  Size {!selectedSize && !soldOut && <span style={{ color: "#e03" }}>*</span>}
                  {soldOut && <span style={{ color: "#e03", marginLeft: 8, fontWeight: 700 }}>SOLD OUT</span>}
                </div>
                <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", fontSize: 8, letterSpacing: 1.5, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>Size Guide →</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sizes.map(s => (
                  <button key={s} onClick={() => !soldOut && setSelectedSize(s)} style={{ minWidth: 52, height: 48, padding: "0 12px", border: selectedSize === s && !soldOut ? `2px solid ${S}` : `.5px solid ${G3}`, background: selectedSize === s && !soldOut ? S : "transparent", color: selectedSize === s && !soldOut ? "#000" : SD, fontSize: 11, fontWeight: 700, cursor: soldOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .15s", opacity: soldOut ? 0.4 : 1, borderRadius: 2 }}>{s}</button>
                ))}
              </div>
              {attempted && !selectedSize && !soldOut && (
                <div style={{ fontSize: 9, color: "#e03", marginTop: 8, letterSpacing: 1 }}>↑ Please select a size to continue</div>
              )}
            </div>

            {/* Sold out notify */}
            {soldOut && (
              <div style={{ marginBottom: 20 }}>
                {notifySubmitted ? (
                  <div style={{ fontSize: 10, color: "#0c6", padding: "12px 16px", border: ".5px solid #0c6", display: "flex", alignItems: "center", gap: 8 }}>✓ We'll notify you when this restocks.</div>
                ) : (
                  <>
                    <div style={{ fontSize: 9, color: SD, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Get notified when back in stock</div>
                    <div style={{ display: "flex" }}>
                      <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: G2, border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "12px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                      <button onClick={async () => {
                        if (!notifyEmail.trim() || !/\S+@\S+\.\S+/.test(notifyEmail)) return;
                        await base44.entities.NewsletterSubscriber.create({ email: notifyEmail.trim().toLowerCase(), source: "back_in_stock", active: true }).catch(() => {});
                        setNotifySubmitted(true);
                      }} style={{ background: S, color: "#000", border: "none", padding: "12px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Notify Me</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Qty + Add to bag */}
            {!soldOut && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}`, borderRadius: 2, overflow: "hidden" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 52, background: G2, border: "none", color: "var(--vt-text)", fontSize: 20, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 700, borderLeft: `.5px solid ${G3}`, borderRight: `.5px solid ${G3}`, lineHeight: "52px" }}>{qty}</div>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 52, background: G2, border: "none", color: "var(--vt-text)", fontSize: 20, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
                <button onClick={handleAdd} style={{ flex: 1, background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", height: 52, transition: "all .3s", fontFamily: "inherit", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {added ? "✓ Added to Bag" : `Add to Bag`}
                </button>
              </div>
            )}

            {reviews.length >= 5 && (
              <div style={{ fontSize: 9, color: SD, display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <span>🔥</span> Popular item — {reviews.length} reviews
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 0", borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}`, marginBottom: 16 }}>
              {[{ icon: Package, title: "Free Shipping", sub: "on orders $150+" }, { icon: RotateCcw, title: "Easy Returns", sub: "within 14 days" }, { icon: Zap, title: "Limited Run", sub: "NYC made" }].map(({ icon: Icon, title, sub }) => (
                <div key={title} style={{ textAlign: "center", padding: "8px 4px" }}>
                  <Icon size={20} style={{ color: S, marginBottom: 6, display: "block", margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 8, fontWeight: 700, color: "var(--vt-text)", letterSpacing: 0.5 }}>{title}</div>
                  <div style={{ fontSize: 7, color: SD, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Share row */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Share</span>
              <button onClick={handleShare} style={shareBtn}>
                <Share2 size={12} />{copied ? "Copied!" : "Link"}
              </button>
              <a href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(product.name)} on @VIGONYC&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" style={{ ...shareBtn, textDecoration: "none" }}>X / Twitter</a>
            </div>

            {/* Description accordion */}
            <div style={{ marginTop: 20, border: `.5px solid ${G3}`, borderRadius: 2 }}>
              <Accordion type="single" collapsible defaultValue="item-0">
                {accordionData.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} style={{ borderBottom: idx < accordionData.length - 1 ? `.5px solid ${G3}` : "none" }}>
                    <AccordionTrigger style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--vt-text)", fontWeight: 700, padding: "16px 16px" }}>{item.title}</AccordionTrigger>
                    <AccordionContent style={{ fontSize: 12, color: SD, lineHeight: 1.85, padding: "0 16px 16px", whiteSpace: "pre-line" }}>{item.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <div data-reviews style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: S, marginBottom: 4, display: "flex", alignItems: "center", gap: 12 }}>
            Reviews {approvedReviews.length > 0 && <span style={{ color: SD }}>({approvedReviews.length})</span>}
          </div>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: "var(--vt-text)", lineHeight: 1 }}>{avgRating}</span>
              <div>
                <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(parseFloat(avgRating)) ? S : "none"} stroke={S} />)}
                </div>
                <div style={{ fontSize: 10, color: SD }}>{approvedReviews.length} review{approvedReviews.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
          )}
          {approvedReviews.length === 0 && <div style={{ fontSize: 12, color: SD, marginBottom: 24, padding: "20px", background: G2, border: `.5px solid ${G3}`, textAlign: "center" }}>No reviews yet — be the first to share your thoughts!</div>}
          <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {approvedReviews.map((r, i) => (
              <div key={i} style={{ background: G2, border: `.5px solid ${G3}`, borderRadius: 2, padding: "18px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? S : "none"} stroke={S} />)}</div>
                  <div style={{ fontSize: 9, color: SD }}>{r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
                </div>
                {r.title && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--vt-text)" }}>{r.title}</div>}
                {r.body && <div style={{ fontSize: 11, color: SD, lineHeight: 1.75 }}>{r.body}</div>}
                <div style={{ fontSize: 9, color: SD, marginTop: 10, paddingTop: 10, borderTop: `.5px solid ${G3}` }}>— {r.reviewerName || "Anonymous"}{r.verified && <span style={{ color: "#0c6", marginLeft: 8 }}>✓ Verified</span>}</div>
              </div>
            ))}
          </div>

          {/* Write review */}
          <div style={{ background: G2, border: `.5px solid ${G3}`, borderRadius: 2, padding: "clamp(16px,3vw,24px)" }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: S, marginBottom: 16 }}>Write a Review</div>
            {hasReviewed ? (
              <div style={{ fontSize: 12, color: SD, padding: "12px 0" }}>✓ You've already reviewed this product. Thank you!</div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!reviewForm.rating) return toast.error("Please select a star rating");
                setSubmittingReview(true);
                await base44.entities.Review.create({ productId: id, approved: false, ...sanitizeObject(reviewForm) });
                const updated = await base44.entities.Review.filter({ productId: id }, "-created_date", 50).catch(() => reviews);
                setReviews(updated);
                setReviewForm({ rating: 0, title: "", body: "", reviewerName: reviewForm.reviewerName });
                setSubmittingReview(false);
                toast.success("Review submitted! It'll appear after approval.");
              }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 9, color: SD, marginBottom: 8, letterSpacing: 1 }}>Your Rating *</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}>
                        <Star size={28} fill={star <= reviewForm.rating ? S : "none"} stroke={S} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="review-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input value={reviewForm.reviewerName} onChange={e => setReviewForm(f => ({ ...f, reviewerName: e.target.value }))} placeholder="Your name" style={inputStyle} />
                  <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title (optional)" style={inputStyle} />
                </div>
                <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} rows={4} placeholder="Share your experience with this product..." style={{ ...inputStyle, resize: "vertical" }} />
                <button type="submit" disabled={submittingReview} style={{ background: S, color: "#000", border: "none", padding: "14px 28px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: submittingReview ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", borderRadius: 2, opacity: submittingReview ? 0.7 : 1 }}>
                  {submittingReview ? "Submitting..." : "Submit Review →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Style it with */}
      {styleWith.length > 0 && (
        <>
          <SectionDivider label="Style It With" />
          <div style={{ padding: "clamp(24px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {styleWith.map(p => (
                <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg} wishlisted={wishlist.includes(p.id)} onWishlist={() => toggleWishlist(p.id, p)} onAdd={() => navigate(`/product/${p.id}`)} onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Related */}
      {related.length > 0 && (
        <>
          <SectionDivider label="You May Also Like" />
          <div style={{ padding: "clamp(24px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg} wishlisted={wishlist.includes(p.id)} onWishlist={() => toggleWishlist(p.id, p)} onAdd={() => navigate(`/product/${p.id}`)} onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile sticky CTA */}
      <div className="mobile-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--vt-nav-scrolled)", borderTop: `.5px solid ${G3}`, padding: "10px clamp(12px,4vw,20px)", paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))", display: "none", flexDirection: "column", gap: 8, zIndex: 150, backdropFilter: "blur(16px)" }}>
        {attempted && !selectedSize && <div style={{ fontSize: 9, color: "#e03", textAlign: "center", letterSpacing: 1, fontWeight: 700 }}>↑ SELECT A SIZE FIRST</div>}
        {/* Size quick-pick on mobile */}
        {!selectedSize && !soldOut && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} style={{ flexShrink: 0, minWidth: 44, height: 38, border: `.5px solid ${G3}`, background: "transparent", color: SD, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 2 }}>{s}</button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => toggleWishlist(id, product)} style={{ width: 48, height: 48, background: wishlisted ? "rgba(192,192,192,.1)" : "transparent", border: `.5px solid ${wishlisted ? S : G3}`, color: wishlisted ? S : SD, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Heart size={18} fill={wishlisted ? S : "none"} />
          </button>
          <button onClick={handleAdd} disabled={soldOut} style={{ flex: 1, background: soldOut ? G2 : added ? "#0c6" : S, color: soldOut ? SD : "#000", border: soldOut ? `.5px solid ${G3}` : "none", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 900, cursor: soldOut ? "not-allowed" : "pointer", height: 48, transition: "all .3s", fontFamily: "inherit", borderRadius: 2 }}>
            {soldOut ? "Sold Out" : added ? "✓ Added to Bag" : `Add to Bag · $${product.price}`}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
        @media(max-width:900px){
          .product-grid{grid-template-columns:1fr !important;}
          .related-grid{grid-template-columns:repeat(2,1fr) !important;}
          .reviews-grid{grid-template-columns:1fr !important;}
          .mobile-cta{display:flex !important;}
          .media-arrow{display:none !important;}
          .review-form-row{grid-template-columns:1fr !important;}
        }
        @media(max-width:480px){
          .related-grid{grid-template-columns:1fr !important;}
        }
      `}</style>
    </div>
  );
}

const shareBtn = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "7px 14px", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 2 };
const inputStyle = { background: "var(--vt-bg)", border: ".5px solid var(--vt-border)", color: "var(--vt-text)", padding: "12px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box", borderRadius: 2 };