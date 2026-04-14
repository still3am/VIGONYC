import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const SD = "var(--vt-sub)";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";


const CATEGORIES = [
  { name: "Tops", count: "Tees · Hoodies · Crewnecks" },
  { name: "Bottoms", count: "Cargo · Sweats · Denim" },
  { name: "Outerwear", count: "Jackets · Coaches · Bombers" },
  { name: "Accessories", count: "Caps · Bags · Extras" },
];
const REVIEWS = [
  { rating: 5, text: "Literally the best tee I've ever owned. The weight is insane and it fits exactly how streetwear should — not too baggy, not fitted. NYC energy all day.", name: "Marcus T.", loc: "Brooklyn, NY" },
  { rating: 5, text: "Copped the Chrome V hoodie from Drop 01 and haven't taken it off. Quality is elite, no cap. Worth every dollar and more.", name: "Jaylen R.", loc: "Harlem, NY" },
  { rating: 5, text: "I've been waiting for a brand that actually gets it. VIGO is built different. The details, the packaging, the fit — all 10/10.", name: "Nia C.", loc: "Bronx, NY" },
];

function parseDropTarget(target) {
  if (!target) return null;
  const d = new Date(target);
  return isNaN(d.getTime()) ? null : d;
}

function MiniCountdown({ target }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const parsed = parseDropTarget(target);
  useEffect(() => {
    if (!parsed) return;
    const tick = () => {
      const diff = Math.max(0, parsed - Date.now());
      setT({ d: Math.floor(diff / 86400000), h: Math.floor(diff % 86400000 / 3600000), m: Math.floor(diff % 3600000 / 60000), s: Math.floor(diff % 60000 / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <span style={{ display: "inline-flex", gap: 12, alignItems: "baseline" }}>
      {[["D", t.d], ["H", t.h], ["M", t.m], ["S", t.s]].map(([l, v]) =>
        <span key={l} style={{ display: "inline-flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "var(--vt-text)", fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</span>
          <span style={{ fontSize: 8, letterSpacing: 1, color: SD }}>{l}</span>
        </span>
      )}
    </span>
  );
}

export default function VigoHome() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [nextDrop, setNextDrop] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [homeReviews, setHomeReviews] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("vigo_recent") || "[]");
    if (ids.length === 0) return;
    Promise.all(ids.slice(0, 4).map(id => base44.entities.Product.get(id).catch(() => null)))
      .then(results => setRecentProducts(results.filter(Boolean)));
  }, []);

  useEffect(() => { document.title = "VIGONYC — NYC Streetwear"; }, []);
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => { base44.entities.Review.list("-created_date", 6).then(data => setHomeReviews(data || [])).catch(() => {}); }, []);

  useEffect(() => {
    base44.entities.Drop.list("-date", 50).then(drops => {
      const upcoming = drops.find(d => d.status === "upcoming" && d.date);
      if (upcoming) setNextDrop(upcoming);
    }).catch(() => {});
  }, []);

  useEffect(() => {
   base44.entities.Product.list("-created_date", 200).then(all => {
     setAllProducts(all || []);
     const featured = (all || []).filter(p => p.featured);
     setProducts(featured.length > 0 ? featured.slice(0, 4) : (all || []).slice(0, 4));
     setProductsLoading(false);
   }).catch(() => setProductsLoading(false));
  }, []);

  const categoryData = useMemo(() => {
   const counts = {};
   allProducts.forEach(p => { if (p.cat) counts[p.cat] = (counts[p.cat] || 0) + 1; });
   return CATEGORIES.map(c => ({ ...c, productCount: counts[c.name] || 0 }));
  }, [allProducts]);

  const heroProduct = products[0] || null;

  const handleSubscribe = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) { alert("Please enter a valid email address."); return; }
    const user = await base44.auth.me().catch(() => null);
    if (user) {
      await base44.auth.updateMe({ newsletterEmail: email.trim(), notificationsNewsletter: true }).catch(() => {});
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div>
      {/* ── DROP ALERT BANNER ── */}
      {settings.banner_visible !== "false" && <div onClick={() => navigate("/drops")} style={{ background: `linear-gradient(90deg, var(--vt-bg), var(--vt-card), var(--vt-bg))`, borderBottom: `.5px solid ${G3}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer", flexWrap: "wrap" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = S}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--vt-border)"} className="my-3 py-3">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {settings.banner_dot !== "off" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", animation: "vigo-pulse 1.5s infinite" }} />}
        <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>{nextDrop ? `${nextDrop.name} — ${nextDrop.series}` : "Drop 02 — Mirror Series"}</span>
        </div>
        {nextDrop && <MiniCountdown target={new Date(nextDrop.date + (nextDrop.time ? ` ${nextDrop.time}` : ""))} />}
        <span style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Get Notified →</span>
      </div>}

      {/* ── HERO ── */}
      <div className="vigo-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "88vh", borderBottom: `.5px solid ${G3}`, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(12px)", transition: "opacity .5s, transform .5s" }}>
        <div style={{ padding: "72px 48px 72px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="vigo-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(192,192,192,.06)", border: `.5px solid rgba(192,192,192,.15)`, padding: "8px 16px", alignSelf: "center" }}>
            {settings.banner_dot !== "off" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", animation: "vigo-pulse 2s infinite" }} />}
            <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>{settings.banner_text}</span>
          </div>
          <h1 style={{ fontSize: "clamp(56px,7vw,104px)", fontWeight: 900, letterSpacing: -4, lineHeight: .86, marginBottom: 28 }} className="text-center">
            {settings.hero_headline_1}<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              <em style={{ color: "transparent", WebkitTextStroke: `1px ${S}`, fontStyle: "italic" }} className="text-black">{settings.hero_headline_2}</em>
            </span>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, maxWidth: 360, marginBottom: 36, margin: "0 auto 36px" }} className="text-center">
            {settings.hero_sub}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/lookbook")} style={btnO}>View Lookbook</button>
          </div>

          {/* KPIs */}
          <div className="vigo-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 56, borderTop: `.5px solid ${G3}` }}>
            {[[settings.kpi_pieces, "Pieces Dropped"], [settings.kpi_community, "NYC Community"], [settings.kpi_street_ready || "100%", "Street Ready"], [settings.kpi_rating, "Avg. Rating"]].map(([n, l], i, arr) =>
            <div key={l} style={{ padding: "20px 0 0", paddingRight: i < arr.length - 1 ? 16 : 0, borderRight: i < arr.length - 1 ? `.5px solid ${G3}` : "none", paddingLeft: i > 0 ? 16 : 0, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--vt-text)", letterSpacing: -1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            )}
          </div>
        </div>

        {/* Hero image panel */}
        <div style={{ position: "relative", background: G1, borderLeft: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: "clamp(260px, 60vw, 550px)" }}>
          <div style={{ position: "absolute", top: 24, left: 24, width: 32, height: 32, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 72, left: 24, width: 32, height: 32, borderBottom: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 72, right: 24, width: 32, height: 32, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(192,192,192,.06) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <img src={heroProduct?.images?.[0] || productImg} alt={`${heroProduct?.name || "VIGONYC"} — SS25 Collection`} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 80px rgba(192,192,192,.2))", zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.85)", borderTop: `.5px solid rgba(255,255,255,.1)`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: 11, color: "#fff" }}>{heroProduct?.name || settings.hero_product_name || "Chrome V Tee — SS25"}</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginTop: 2 }}>{settings.hero_product_label || "Limited"} · {heroProduct?.stock ? `${heroProduct.stock} Units` : settings.hero_product_units || "100 Units"}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: S }}>{heroProduct?.price ? `$${heroProduct.price}` : "$68"}</span>
              <button onClick={() => navigate(heroProduct ? `/product/${heroProduct.id}` : "/shop")} style={{ background: S, color: "#000", border: "none", padding: "8px 16px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED DROPS ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Featured Drops" sub="SS25 Season" cta="View All →" onCta={() => navigate("/shop")} />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {productsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", aspectRatio: "3/4", animation: "vigo-pulse 1.5s infinite" }} />
            ))
          ) : products.length === 0 && <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No featured products yet — add some in the admin panel.</div>}
          {!productsLoading &&
          products.map((p) =>
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
          )}
        </div>
      </div>

      <SectionDivider label={nextDrop?.series ? `${nextDrop.series} Spotlight` : "SS25 Spotlight"} />

      {/* ── DROP BANNER ── */}
      <div className="vigo-2col" style={{ margin: "0 32px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
        <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>✦ Limited Edition ✦</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: .92, marginBottom: 14, textAlign: "center" }}>
            {nextDrop?.name || "Drop 02"}<br /><span style={{ color: S }}>{nextDrop?.series || "Chrome Series"}</span>
          </div>
          <div style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 32 }}>
            {nextDrop?.description || "Hand-finished chrome hardware. NYC exclusive. Only 100 units. No restocks, no exceptions."}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/drops")} style={btnO}>Drop Calendar →</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: `1px solid ${S}`, borderLeft: `1px solid ${S}` }} />
          <img src={nextDrop?.image || productImg} style={{ width: 260, height: 260, objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(192,192,192,.15))" }} alt="" />
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Shop by Category" sub="" />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {categoryData.map((cat) =>
            <div key={cat.name} onClick={() => navigate(`/shop?cat=${cat.name}`)}
            style={{ background: G1, border: `.5px solid ${G3}`, padding: "40px 24px 32px", cursor: "pointer", transition: "border-color .2s", textAlign: "center", position: "relative", overflow: "hidden" }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = S;}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--vt-border)";}}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>{cat.productCount > 0 ? `${cat.productCount} pieces` : cat.count}</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>{cat.name}</div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginTop: 16 }}>Browse →</div>
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${S}, transparent)` }} />
            </div>
          )}
        </div>
      </div>

      <SectionDivider label="Community Reviews" />

      {/* ── REVIEWS ── */}
      <div style={{ padding: "32px 32px 52px" }}>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {(homeReviews.length > 0 ? homeReviews : REVIEWS).map((r, i) => {
            const isDB = homeReviews.length > 0;
            const rating = isDB ? (r.rating || 5) : r.rating;
            const text = isDB ? (r.body || "") : r.text;
            const name = isDB ? (r.reviewerName || "Anonymous") : r.name;
            const loc = isDB ? (r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Verified Purchase") : r.loc;
            return (
              <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, padding: "28px", position: "relative" }}>
                <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${S}, transparent)` }} />
                <div style={{ color: S, fontSize: 14, marginBottom: 14 }}>{"★".repeat(Math.round(rating))}</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: SD, marginBottom: 20 }}>"{text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vt-text)" }}>{name}</div>
                    <div style={{ fontSize: 8, color: SD, marginTop: 2 }}>{loc}</div>
                  </div>
                  <div style={{ fontSize: 8, color: S, letterSpacing: 2 }}>VERIFIED</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BRAND STORY TEASER ── */}
      <div style={{ margin: "0 32px", borderTop: `2px solid ${S}`, background: G1, border: `.5px solid ${G3}` }} className="vigo-2col-story">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="vigo-2col">
          <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}` }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ The Brand</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: .95, marginBottom: 20 }}>
              {settings.about_headline}
            </div>
            <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 28 }}>
              {settings.about_story}
            </p>
            <button onClick={() => navigate("/about")} style={btnO}>Our Story →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRight: "none" }}>
            {[[settings.kpi_pieces, "Pieces Dropped"], [settings.kpi_community, "Community"], [settings.kpi_rating, "Avg Rating"], [settings.kpi_street_ready || "100%", "Street Ready"]].map(([n, l], i) =>
            <div key={l} style={{ padding: "36px 28px", borderRight: i % 2 === 0 ? `.5px solid ${G3}` : "none", borderBottom: i < 2 ? `.5px solid ${G3}` : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: S, letterSpacing: -1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENTLY VIEWED ── */}
      {recentProducts.length > 0 && (
        <div style={{ padding: "52px 32px 0" }}>
          <SectionHeader title="Recently Viewed" sub="" cta="Shop All →" onCta={() => navigate("/shop")} />
          <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {recentProducts.map(p => (
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
        </div>
      )}

      {/* ── NEWSLETTER ── */}
      <div style={{ margin: "32px 32px 64px", background: `linear-gradient(135deg, var(--vt-bg), var(--vt-card))`, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "52px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", border: `.5px solid rgba(192,192,192,.06)` }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", border: `.5px solid rgba(192,192,192,.04)` }} />
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14, position: "relative" }}>✦ Join The Drop List ✦</div>
        <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, letterSpacing: -1, marginBottom: 12, position: "relative" }}>Get First Access</div>
        <div style={{ fontSize: 12, color: SD, marginBottom: 32, position: "relative" }}>Drop alerts, exclusive offers, NYC-only releases. No spam, ever.</div>
        {subscribed ?
        <div style={{ fontSize: 13, color: "#0c6", padding: "16px 0" }}>✓ You're in. Watch for the next drop alert.</div> :
        <div style={{ display: "flex", gap: 0, maxWidth: 460, margin: "0 auto", position: "relative" }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "14px 20px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <button onClick={handleSubscribe} style={btnP}>Join the List</button>
          </div>
        }
      </div>

      <style>{`
        @media(max-width:900px){
          .vigo-hero-grid{grid-template-columns:1fr !important;}
          .vigo-hero-grid>div:first-child{padding:40px 24px 32px !important; align-items:center !important;}
          .vigo-hero-grid>div:last-child{min-height:260px;}
          .vigo-kpi-grid{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-4col{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-3col{grid-template-columns:1fr !important;}
          .vigo-2col{grid-template-columns:1fr !important;}
          .vigo-hero-badge{align-self:center !important;}
        }
        @media(max-width:480px){.vigo-4col{grid-template-columns:1fr !important;}}
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
      `}</style>
    </div>);
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnO = { background: "none", border: `.5px solid #C0C0C0`, color: "#C0C0C0", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };