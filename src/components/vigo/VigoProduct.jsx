import { useState, useEffect } from "react";
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
  const [reviews, setReviews] = useState([]);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", body: "", reviewerName: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

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
      base44.entities.Product.list("-created_date", 8).then(all => {
        setRelated(all.filter(x => x.id !== id).slice(0, 4));
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
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `2px solid ${G3}`, borderTop: `2px solid ${S}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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
    { title: "Sizing & Fit", content: "This piece runs true to size. We recommend sizing up for an oversized fit. See the size guide for measurements." },
    { title: "Shipping & Returns", content: "Free shipping on orders over $150. Standard shipping 5–7 business days. Returns accepted within 14 days for unworn items." },
    { title: "Care Instructions", content: "Machine wash cold with like colors. Tumble dry low. Do not bleach. Do not iron on print." },
  ];

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (soldOut) return;
    for (let i = 0; i < qty; i++) {
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
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const soldOut = product.inStock === false || product.stock === 0;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return toast.error("Please select a star rating");
    setSubmittingReview(true);
    await base44.entities.Review.create({ productId: id, ...reviewForm });
    const updated = await base44.entities.Review.filter({ productId: id }, "-created_date", 50).catch(() => reviews);
    setReviews(updated);
    setReviewForm({ rating: 0, title: "", body: "", reviewerName: reviewForm.reviewerName });
    setSubmittingReview(false);
    toast.success("Review submitted!");
  };

  return (
    <div style={{ minHeight: "100vh", background: G1 }}>
      {/* Back button (mobile) */}
      <div className="vigo-product-back" style={{ display: "none", padding: "10px clamp(16px,4vw,32px)", borderBottom: `.5px solid ${G3}` }}>
        <button onClick={() => navigate("/shop")} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Shop
        </button>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: "12px clamp(20px,4vw,32px)", borderBottom: `.5px solid ${G3}`, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {[["Home", "/"], ["Shop", "/shop"], [product.cat, `/shop?cat=${product.cat}`]].map(([label, to], i) => (
          <span key={to} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to={to} style={{ fontSize: 9, color: SD, letterSpacing: 1, textDecoration: "none", textTransform: "uppercase" }}>{label}</Link>
            <span style={{ fontSize: 9, color: SD }}>›</span>
          </span>
        ))}
        <span style={{ fontSize: 9, color: "var(--vt-text)", letterSpacing: 1, textTransform: "uppercase" }}>{product.name}</span>
      </div>
      <div style={{ padding: "clamp(20px,4vw,32px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,48px)", marginBottom: "clamp(40px,6vw,60px)" }}>
            {/* Images */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
              <div
                style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
                onTouchStart={e => { e.currentTarget._touchX = e.touches[0].clientX; }}
                onTouchEnd={e => {
                  const dx = e.changedTouches[0].clientX - e.currentTarget._touchX;
                  if (Math.abs(dx) < 40) return;
                  if (dx < 0) setActiveThumb(t => Math.min(t + 1, allMedia.length - 1));
                  else setActiveThumb(t => Math.max(t - 1, 0));
                }}
              >
                {allMedia[activeThumb]?.type === "video" ? (
                  <video
                    key={allMedia[activeThumb].url}
                    src={allMedia[activeThumb].url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
                  />
                ) : (
                  <img src={allMedia[activeThumb]?.url || productImg} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                {allMedia.length > 1 && (
                  <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 2 }}>
                    {allMedia.map((_, i) => (
                      <div key={i} onClick={() => setActiveThumb(i)} style={{ width: i === activeThumb ? 18 : 6, height: 6, borderRadius: 3, background: i === activeThumb ? S : "rgba(192,192,192,.4)", transition: "all .2s", cursor: "pointer" }} />
                    ))}
                  </div>
                )}
              </div>
              {allMedia.length > 1 && (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                  {allMedia.map((media, i) => (
                    <button key={i} onClick={() => setActiveThumb(i)} style={{ flexShrink: 0, width: 60, height: 60, background: G2, border: `.5px solid ${activeThumb === i ? S : G3}`, cursor: "pointer", overflow: "hidden", transition: "all .2s", padding: 0, position: "relative" }}>
                      {media.type === "video" ? (
                        <>
                          <video src={media.url} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}>
                            <span style={{ fontSize: 16, color: "#fff" }}>▶</span>
                          </div>
                        </>
                      ) : (
                        <img src={media.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 16 }}>{product.collection || "SS25"} — {product.cat}</div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 8 }}>{product.name}</h1>
                <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{product.cat}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 24, borderBottom: `.5px solid ${G3}` }}>
                <span style={{ fontSize: 12, color: S }}>{avgRating ? "★".repeat(Math.round(parseFloat(avgRating))) : "☆☆☆☆☆"}</span>
                <span style={{ fontSize: 9, color: SD }}>{avgRating ? `${avgRating} (${reviews.length} review${reviews.length !== 1 ? "s" : ""})` : "No reviews yet"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Price</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: S }}>${product.price}</div>
                </div>
                <button onClick={() => toggleWishlist(id)} style={{ background: wishlisted ? `rgba(192,192,192,.1)` : "transparent", border: `.5px solid ${wishlisted ? S : G3}`, color: wishlisted ? S : SD, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "inherit", transition: "all .2s", marginTop: 12 }}>
                  {wishlisted ? "♥" : "♡"}
                </button>
              </div>

              <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, marginBottom: product.stock > 0 && product.stock <= 10 ? 12 : 28 }}>{product.description || "Premium streetwear from New York City."}</p>
              {product.stock > 0 && product.stock <= 10 && (
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#fa0", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fa0", animation: "vigo-pulse 1.5s infinite" }} />
                  Only {product.stock} left in stock
                </div>
              )}

              {/* Color */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Color: <span style={{ color: "var(--vt-text)" }}>{selectedColor}</span></label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {colors.map((c) => (
                    <button key={c} onClick={() => setSelectedColor(c)} title={c} style={{ padding: "6px 14px", border: selectedColor === c ? `2px solid ${S}` : `.5px solid ${G3}`, background: selectedColor === c ? S : "transparent", color: selectedColor === c ? "#000" : SD, fontSize: 9, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ marginBottom: 28 }}>
                {soldOut && <div style={{ fontSize: 9, letterSpacing: 2, color: "#e03", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>SOLD OUT</div>}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Size {!selectedSize && !soldOut && <span style={{ color: "#e03" }}>*</span>}</label>
                  <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Size Guide →</button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {sizes.map((s) => (
                    <button key={s} onClick={() => !soldOut && setSelectedSize(s)} style={{ width: 48, height: 40, border: `.5px solid ${selectedSize === s && !soldOut ? S : G3}`, background: selectedSize === s && !soldOut ? S : "transparent", color: selectedSize === s && !soldOut ? "#000" : SD, fontSize: 10, fontWeight: 700, cursor: soldOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .15s", opacity: soldOut ? 0.4 : 1 }}>{s}</button>
                  ))}
                </div>
              </div>

              {soldOut && (
                <div style={{ marginBottom: 16 }}>
                  {notifySubmitted ? (
                    <div style={{ fontSize: 10, color: "#0c6", padding: "10px 0" }}>✓ We'll notify you when this restocks.</div>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
                      <button onClick={async () => {
                        if (!notifyEmail.trim() || !/\S+@\S+\.\S+/.test(notifyEmail)) return;
                        await base44.auth.me().then(u => { if (u) base44.auth.updateMe({ restockNotifyEmail: notifyEmail, restockProductId: product.id }).catch(() => {}); }).catch(() => {});
                        setNotifySubmitted(true);
                      }} style={{ background: S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Notify Me</button>
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}` }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 40, height: 48, background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>−</button>
                  <div style={{ width: 32, textAlign: "center", fontSize: 12, borderLeft: `.5px solid ${G3}`, borderRight: `.5px solid ${G3}` }}>{qty}</div>
                  <button onClick={() => setQty((q) => q + 1)} style={{ width: 40, height: 48, background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>+</button>
                </div>
                <button onClick={handleAdd} disabled={soldOut} style={{ flex: 1, background: soldOut ? G2 : added ? "#0c6" : S, color: soldOut ? SD : "#000", border: soldOut ? `.5px solid ${G3}` : "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: soldOut ? "not-allowed" : "pointer", height: 48, transition: "background .3s", fontFamily: "inherit" }}>
                  {soldOut ? "Sold Out" : added ? "✓ Added to Bag" : "Add to Bag"}
                </button>
              </div>

              {/* Share row */}
              <div style={{ display: "flex", gap: 8, paddingTop: 16, paddingBottom: 16, borderTop: `.5px solid ${G3}`, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Share:</span>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={shareBtn}>
                  {copied ? "✓ Copied" : "Copy Link"}
                </button>
                <a href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(product.name)} on @VIGONYC&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" style={{ ...shareBtn, textDecoration: "none" }}>X / Twitter</a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 16, borderTop: `.5px solid ${G3}` }}>
                {[{ icon: Package, title: "Free Shipping", sub: "over $150" }, { icon: RotateCcw, title: "Easy Returns", sub: "30 days" }, { icon: Zap, title: "NYC Made", sub: "Limited run" }].map(({ icon: Icon, title, sub }) => (
                  <div key={title} style={{ textAlign: "center" }}>
                    <Icon size={18} style={{ marginBottom: 8, color: S, margin: "0 auto" }} />
                    <div style={{ fontSize: 8, fontWeight: 700, color: "var(--vt-text)", letterSpacing: 1 }}>{title}</div>
                    <div style={{ fontSize: 7, color: SD, marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div style={{ background: G2, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)", marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: S, marginBottom: 20 }}>Reviews {reviews.length > 0 && `(${reviews.length})`}</div>
            {reviews.length === 0 && <div style={{ fontSize: 12, color: SD, marginBottom: 20 }}>No reviews yet — be the first!</div>}
            {reviews.map((r, i) => (
              <div key={i} style={{ borderBottom: `.5px solid var(--vt-border)`, paddingBottom: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ color: S, fontSize: 12 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <div style={{ fontSize: 9, color: SD }}>{r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</div>
                </div>
                {r.title && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>}
                {r.body && <div style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{r.body}</div>}
                <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>— {r.reviewerName || "Anonymous"}</div>
              </div>
            ))}
            {hasReviewed ? (
              <div style={{ padding: "16px", background: "var(--vt-card)", border: ".5px solid var(--vt-border)", fontSize: 11, color: SD }}>✓ You've already reviewed this product. Thank you!</div>
            ) : (
            <form onSubmit={handleReviewSubmit} style={{ borderTop: `.5px solid var(--vt-border)`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Write a Review</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: star <= reviewForm.rating ? S : SD, padding: "0 2px" }}>★</button>
                ))}
              </div>
              <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title (optional)" style={{ background: G1, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} rows={3} placeholder="Share your experience..." style={{ background: G1, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
              <input value={reviewForm.reviewerName} onChange={e => setReviewForm(f => ({ ...f, reviewerName: e.target.value }))} placeholder="Your name" style={{ background: G1, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
              <button type="submit" disabled={submittingReview} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: submittingReview ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
            )}
          </div>

          <div style={{ background: G2, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)" }}>
            <Accordion type="single" collapsible className="w-full">
              {accordionData.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--vt-text)", fontWeight: 700 }}>{item.title}</AccordionTrigger>
                  <AccordionContent style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
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
                  onWishlist={() => toggleWishlist(p.id)}
                  onAdd={() => addToCart({ id: p.id, productId: p.id, name: p.name, productName: p.name, meta: "Size: M · Color: Black", price: p.price, productImage: p.images?.[0] || productImg })}
                  onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mobile-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--vt-nav-scrolled)", borderTop: `.5px solid ${G3}`, padding: "12px clamp(12px,4vw,24px) env(safe-area-inset-bottom, 12px)", display: "none", gap: 8, zIndex: 150, backdropFilter: "blur(12px)" }}>
        {!selectedSize && <div style={{ fontSize: 9, color: "#e03", textAlign: "center", letterSpacing: 1 }}>SELECT A SIZE</div>}
        <button onClick={handleAdd} style={{ width: "100%", background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", padding: "12px", fontFamily: "inherit", transition: "background .3s" }}>
          {added ? "✓ Added" : `Add to Bag · $${product.price}`}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes vigo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mobile-cta { display: flex !important; flex-direction: column; }
          .vigo-product-back { display: block !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const shareBtn = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "6px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };