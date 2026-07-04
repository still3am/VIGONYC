import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const SD = "var(--vt-sub)";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";


const CATEGORIES = [
  { name: "Tops", count: "Tees · Hoodies · Crewnecks", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
  { name: "Bottoms", count: "Cargo · Sweats · Denim", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
  { name: "Outerwear", count: "Jackets · Coaches · Bombers", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80" },
  { name: "Accessories", count: "Caps · Bags · Extras", img: "https://images.unsplash.com/photo-1588850561407-ee193d0d3b86?w=600&q=80" }
];

const REVIEWS = [
  { rating: 5, text: "Literally the best tee I've ever owned. The weight is insane and it fits exactly how streetwear should — not too baggy, not fitted. NYC energy all day.", name: "Marcus T.", loc: "Brooklyn, NY" },
  { rating: 5, text: "Copped the Chrome V hoodie from Drop 01 and haven't taken it off. Quality is elite, no cap. Worth every dollar and more.", name: "Jaylen R.", loc: "Harlem, NY" },
  { rating: 5, text: "I've been waiting for a brand that actually gets it. VIGO is built different. The details, the packaging, the fit — all 10/10.", name: "Nia C.", loc: "Bronx, NY" }
];

const MARQUEE_ITEMS = ["LIMITED RUN", "NYC BORN", "NO RESTOCKS", "BUILT DIFFERENT", "SS25", "BOROUGH TESTED", "CHROME SERIES"];

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
    </span>);
}

export default function VigoHome() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
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
    Promise.all(ids.slice(0, 4).map((id) => base44.entities.Product.get(id).catch(() => null))).
    then((results) => setRecentProducts(results.filter(Boolean)));
  }, []);

  useEffect(() => {document.title = "VIGONYC — NYC Streetwear";}, []);
  useEffect(() => {base44.entities.Review.list("-created_date", 6).then((data) => setHomeReviews(data || [])).catch(() => {});}, []);

  useEffect(() => {
    base44.entities.Drop.list("-date", 50).then((drops) => {
      const upcoming = drops.find((d) => d.status === "upcoming" && d.date);
      if (upcoming) setNextDrop(upcoming);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 200).then((all) => {
      setAllProducts(all || []);
      const featured = (all || []).filter((p) => p.featured);
      setProducts(featured.length > 0 ? featured.slice(0, 4) : (all || []).slice(0, 4));
      setProductsLoading(false);
    }).catch(() => setProductsLoading(false));
  }, []);

  const categoryData = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {if (p.cat) counts[p.cat] = (counts[p.cat] || 0) + 1;});
    return CATEGORIES.map((c) => ({ ...c, productCount: counts[c.name] || 0 }));
  }, [allProducts]);

  const heroProduct = products[0] || null;

  useEffect(() => {
    base44.auth.me().then((u) => {if (u?.email) setEmail(u.email);}).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) return;
    const existing = await base44.entities.NewsletterSubscriber.filter({ email: email.trim().toLowerCase() }, "-created_date", 1).catch(() => []);
    if (!existing?.length) {
      await base44.entities.NewsletterSubscriber.create({ email: email.trim().toLowerCase(), source: "home", active: true }).catch(() => {});
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div>
      {/* ── DROP ALERT BANNER ── */}
      {settings.banner_visible !== "false" && <div onClick={() => navigate("/drops")} style={{ background: `linear-gradient(90deg, var(--vt-bg), var(--vt-card), var(--vt-bg))`, borderBottom: `.5px solid ${G3}`, padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {settings.banner_dot !== "off" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", animation: "vigo-pulse 1.5s infinite" }} />}
        <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>{nextDrop ? `${nextDrop.name} — ${nextDrop.series}` : "Drop 02 — Mirror Series"}</span>
        </div>
        {nextDrop?.date && <MiniCountdown target={nextDrop.date} />}
        <span style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Get Notified →</span>
      </div>}

      {/* ── HERO — full-bleed immersive ── */}
      <div className="vigo-hero" style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden", borderBottom: `.5px solid ${G3}` }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={heroProduct?.images?.[0] || productImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, rgba(192,192,192,.04) 0%, transparent 60%)` }} />
        </div>

        {/* Corner accents */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 36, height: 36, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 36, height: 36, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 36, height: 36, borderBottom: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 36, height: 36, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 6, color: S, textTransform: "uppercase", marginBottom: 24, animation: "vigo-fade-up .6s ease-out" }}>✦ SS25 Collection</div>
          <h1 style={{ fontSize: "clamp(48px,9vw,120px)", fontWeight: 900, letterSpacing: -5, lineHeight: 0.85, marginBottom: 28, animation: "vigo-fade-up .7s ease-out .1s both" }}>
            {settings.hero_headline_1 || "BUILT"}<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              <em style={{ color: "transparent", WebkitTextStroke: `1.5px ${S}`, fontStyle: "italic" }} className="text-black">{settings.hero_headline_2 || "DIFFERENT"}</em>
            </span>
          </h1>
          <p style={{ fontSize: 14, color: SD, lineHeight: 1.9, maxWidth: 420, marginBottom: 40, margin: "0 auto 40px", animation: "vigo-fade-up .8s ease-out .2s both" }}>
            {settings.hero_sub || "NYC streetwear for those who move different."}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", animation: "vigo-fade-up .9s ease-out .3s both" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/lookbook")} style={btnO}>View Lookbook</button>
          </div>
        </div>

        {/* Bottom info bar */}
        {heroProduct && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.85)", borderTop: `.5px solid rgba(255,255,255,.08)`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3, backdropFilter: "blur(10px)" }}>
            <div>
              <div style={{ fontSize: 11, color: "#fff" }}>{heroProduct?.name || "Chrome V Tee — SS25"}</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginTop: 2 }}>{settings.hero_product_label || "Limited"} · {heroProduct?.stock ? `${heroProduct.stock} Units` : settings.hero_product_units || "100 Units"}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: S }}>{heroProduct?.price ? `$${heroProduct.price}` : "$68"}</span>
              <button onClick={() => navigate(heroProduct ? `/product/${heroProduct.id}` : "/shop")} style={{ background: S, color: "#000", border: "none", padding: "8px 16px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Shop Now</button>
            </div>
          </div>
        )}
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ overflow: "hidden", borderBottom: `.5px solid ${G3}`, background: G2, padding: "14px 0" }}>
        <div className="vigo-ticker-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ fontSize: 10, letterSpacing: 5, color: SD, textTransform: "uppercase", padding: "0 28px", display: "inline-flex", alignItems: "center", gap: 28 }}>
              {item} <span style={{ color: S }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED DROPS ── */}
      <div className="vigo-section-pad" style={{ padding: "64px 32px" }}>
        <SectionHeader title="Featured Drops" sub="SS25 Season" cta="View All →" onCta={() => navigate("/shop")} />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {productsLoading ?
          Array(4).fill(0).map((_, i) =>
          <div key={i} style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", aspectRatio: "3/4", animation: "vigo-pulse 1.5s infinite" }} />
          ) :
          products.length === 0 && <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No featured products yet — check back soon for new drops.</div>}
          {!productsLoading &&
          products.map((p) =>
          <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
          wishlisted={wishlist.includes(p.id)}
          onWishlist={() => toggleWishlist(p.id, p)}
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

      {/* ── DROP BANNER — editorial ── */}
      <div className="vigo-drop-banner" style={{ margin: "0 32px", position: "relative", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "grid", gridTemplateColumns: "1.2fr 1fr", overflow: "hidden", minHeight: 400 }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
        <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Limited Edition ✦</div>
          <div style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, letterSpacing: -2, lineHeight: 0.92, marginBottom: 16 }}>
            {nextDrop?.name || "Drop 02"}<br /><span style={{ color: S }}>{nextDrop?.series || "Chrome Series"}</span>
          </div>
          <div style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 32, maxWidth: 380 }}>
            {nextDrop?.description || "Hand-finished chrome hardware. NYC exclusive. Only 100 units. No restocks, no exceptions."}
          </div>
          {nextDrop?.date && <div style={{ marginBottom: 28 }}><MiniCountdown target={nextDrop.date} /></div>}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/drops")} style={btnO}>Drop Calendar →</button>
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", minHeight: 360 }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: `1px solid ${S}`, borderLeft: `1px solid ${S}`, zIndex: 1 }} />
          <img src={nextDrop?.image || productImg} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 6s ease-out" }} alt="" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--vt-bg) 0%, transparent 30%)", zIndex: 1 }} />
        </div>
      </div>

      {/* ── SHOP BY CATEGORY — image cards ── */}
      <div className="vigo-section-pad" style={{ padding: "64px 32px" }}>
        <SectionHeader title="Shop by Category" sub="" />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {categoryData.map((cat) =>
          <div key={cat.name} onClick={() => navigate(`/shop?cat=${cat.name}`)}
          style={{ position: "relative", aspectRatio: "3/4", cursor: "pointer", overflow: "hidden", border: `.5px solid ${G3}`, transition: "border-color .2s" }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = S;}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--vt-border)";}}>
            <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s, opacity .3s", opacity: 0.6 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 16px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 6 }}>{cat.productCount > 0 ? `${cat.productCount} pieces` : "Coming soon"}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{cat.name}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginTop: 10 }}>Browse →</div>
            </div>
          </div>
          )}
        </div>
      </div>

      <SectionDivider label="Community Reviews" />

      {/* ── REVIEWS ── */}
      <div className="vigo-section-pad" style={{ padding: "40px 32px 64px" }}>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {(homeReviews.length > 0 ? homeReviews : REVIEWS).map((r, i) => {
            const isDB = homeReviews.length > 0;
            const rating = isDB ? r.rating || 5 : r.rating;
            const text = isDB ? r.body || "" : r.text;
            const name = isDB ? r.reviewerName || "Anonymous" : r.name;
            const loc = isDB ? r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Verified Purchase" : r.loc;
            return (
              <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, padding: "32px 28px", position: "relative", transition: "border-color .2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = S}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--vt-border)"}>
                <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${S}, transparent)` }} />
                <div style={{ color: S, fontSize: 14, marginBottom: 16 }}>{"★".repeat(Math.min(5, Math.max(1, Math.round(rating || 5))))}</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: SD, marginBottom: 24 }}>"{text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 16, borderTop: `.5px solid ${G3}` }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vt-text)" }}>{name}</div>
                    <div style={{ fontSize: 8, color: SD, marginTop: 2 }}>{loc}</div>
                  </div>
                  <div style={{ fontSize: 8, color: S, letterSpacing: 2 }}>VERIFIED</div>
                </div>
              </div>);
          })}
        </div>
      </div>

      {/* ── BRAND STORY TEASER ── */}
      <div style={{ margin: "0 32px", borderTop: `2px solid ${S}`, background: G1, border: `.5px solid ${G3}` }} className="vigo-2col-story">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="vigo-2col">
          <div style={{ padding: "56px 48px", borderRight: `.5px solid ${G3}` }}>
            <div style={{ fontSize: 9, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ The Brand</div>
            <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, letterSpacing: -1, lineHeight: 0.95, marginBottom: 20 }}>
              {settings.about_headline || "Born in the Bronx. Built for the Borough."}
            </div>
            <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 28 }}>
              {settings.about_story || "VIGONYC is a limited-run streetwear brand rooted in New York City culture. Every piece is designed with intention, produced in limited quantities, and built to last."}
            </p>
            <button onClick={() => navigate("/about")} style={btnO}>Our Story →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {[[settings.kpi_pieces || "200+", "Pieces Dropped"], [settings.kpi_community || "5K+", "Community"], [settings.kpi_rating || "4.9★", "Avg Rating"], [settings.kpi_street_ready || "100%", "Street Ready"]].map(([n, l], i) =>
            <div key={l} style={{ padding: "40px 28px", borderRight: i % 2 === 0 ? `.5px solid ${G3}` : "none", borderBottom: i < 2 ? `.5px solid ${G3}` : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: S, letterSpacing: -1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENTLY VIEWED ── */}
      {recentProducts.length > 0 &&
      <div className="vigo-section-pad" style={{ padding: "64px 32px 0" }}>
          <SectionHeader title="Recently Viewed" sub="" cta="Shop All →" onCta={() => navigate("/shop")} />
          <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {recentProducts.map((p) =>
          <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
          wishlisted={wishlist.includes(p.id)}
          onWishlist={() => toggleWishlist(p.id, p)}
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
      }

      {/* ── NEWSLETTER ── */}
      <div style={{ margin: "64px 32px", background: `linear-gradient(135deg, var(--vt-bg), var(--vt-card))`, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "56px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", border: `.5px solid rgba(192,192,192,.06)` }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 180, height: 180, borderRadius: "50%", border: `.5px solid rgba(192,192,192,.04)` }} />
        <div style={{ fontSize: 9, letterSpacing: 6, color: S, textTransform: "uppercase", marginBottom: 16, position: "relative" }}>✦ Join The Drop List ✦</div>
        <div style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: -1, marginBottom: 12, position: "relative" }}>Get First Access</div>
        <div style={{ fontSize: 13, color: SD, marginBottom: 36, position: "relative", maxWidth: 420, margin: "0 auto 36px" }}>Drop alerts, exclusive offers, NYC-only releases. No spam, ever.</div>
        {subscribed ?
        <div style={{ fontSize: 14, color: "#0c6", padding: "20px 0", position: "relative" }}>✓ You're in. Watch for the next drop alert.</div> :
        <div style={{ display: "flex", gap: 0, maxWidth: 460, margin: "0 auto", position: "relative" }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "16px 20px", fontSize: 13, outline: "none", fontFamily: "inherit" }} onKeyDown={e => e.key === "Enter" && handleSubscribe()} />
            <button onClick={handleSubscribe} style={btnP}>Join the List</button>
          </div>
        }
      </div>

      <style>{`
        @keyframes vigo-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media(max-width:900px){
          .vigo-4col{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-3col{grid-template-columns:1fr !important;}
          .vigo-2col{grid-template-columns:1fr !important;}
          .vigo-2col>div:first-child{border-right: none !important;}
          .vigo-section-pad{padding: 40px 20px !important;}
          .vigo-drop-banner{margin: 0 16px !important; grid-template-columns:1fr !important;}
          .vigo-drop-banner>div:first-child{padding: 36px 24px !important;}
          .vigo-drop-banner>div:last-child{min-height: 280px !important;}
          .vigo-2col-story{margin: 0 !important; border-left: none !important; border-right: none !important;}
          .vigo-hero{min-height: 80vh !important;}
        }
        @media(max-width:480px){
          .vigo-4col{grid-template-columns:1fr !important;}
          .vigo-section-pad{padding: 32px 16px !important;}
        }
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
        @keyframes vigo-skeleton{0%,100%{opacity:.6}50%{opacity:.25}}
      `}</style>
    </div>);
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "15px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnO = { background: "none", border: `.5px solid #C0C0C0`, color: "#C0C0C0", padding: "15px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };