import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const SD = "var(--vt-sub)";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";

const NEXT_DROP = new Date();
const PRODUCTS = [];
const CATEGORIES = [];
const REVIEWS = [];

function MiniCountdown({ target }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({ d: Math.floor(diff / 86400000), h: Math.floor(diff % 86400000 / 3600000), m: Math.floor(diff % 3600000 / 60000), s: Math.floor(diff % 60000 / 1000) });
    };
    tick();const id = setInterval(tick, 1000);return () => clearInterval(id);
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
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {const t = setTimeout(() => setHeroLoaded(true), 80);return () => clearTimeout(t);}, []);

  const handleSubscribe = async () => {
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div>
      {/* ── DROP ALERT BANNER ── */}
      <div onClick={() => navigate("/drops")} style={{ background: `linear-gradient(90deg, var(--vt-bg), var(--vt-card), var(--vt-bg))`, borderBottom: `.5px solid ${G3}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer", flexWrap: "wrap" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = S}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--vt-border)"} className="my-3 py-3">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
          <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>Drop 02 — Mirror Series</span>
        </div>
        <MiniCountdown target={NEXT_DROP} />
        <span style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Get Notified →</span>
      </div>

      {/* ── HERO ── */}
      <div className="vigo-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "88vh", borderBottom: `.5px solid ${G3}`, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "none" : "translateY(12px)", transition: "opacity .5s, transform .5s" }}>
        <div style={{ padding: "72px 48px 72px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(192,192,192,.06)", border: `.5px solid rgba(192,192,192,.15)`, padding: "8px 16px", alignSelf: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 2s infinite" }} />
            <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>SS25 Collection — Now Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(56px,7vw,104px)", fontWeight: 900, letterSpacing: -4, lineHeight: .86, marginBottom: 28 }} className="text-center">
            STREETS<br />OF{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <em style={{ color: "transparent", WebkitTextStroke: `1px ${S}`, fontStyle: "italic" }}>NYC</em>
            </span>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, maxWidth: 360, marginBottom: 36, margin: "0 auto 36px" }} className="text-center">
            Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/lookbook")} style={btnO}>View Lookbook</button>
          </div>

          {/* KPIs */}
          <div className="vigo-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 56, borderTop: `.5px solid ${G3}` }}>
            {[["500+", "Pieces Dropped"], ["12K+", "NYC Community"], ["100%", "Street Ready"], ["4.9★", "Avg. Rating"]].map(([n, l], i, arr) =>
            <div key={l} style={{ padding: "20px 0 0", paddingRight: i < arr.length - 1 ? 16 : 0, borderRight: i < arr.length - 1 ? `.5px solid ${G3}` : "none", paddingLeft: i > 0 ? 16 : 0, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--vt-text)", letterSpacing: -1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            )}
          </div>
        </div>

        {/* Hero image panel */}
        <div style={{ position: "relative", background: G1, borderLeft: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 24, left: 24, width: 32, height: 32, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 72, left: 24, width: 32, height: 32, borderBottom: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", bottom: 72, right: 24, width: 32, height: 32, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(192,192,192,.06) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <img src={productImg} alt="VIGONYC SS25" style={{ width: "68%", maxWidth: 380, objectFit: "contain", filter: "drop-shadow(0 0 80px rgba(192,192,192,.2))", zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.85)", borderTop: `.5px solid rgba(255,255,255,.1)`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
            <div>
              <div style={{ fontSize: 11, color: "#fff" }}>Chrome V Tee — SS25</div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginTop: 2 }}>Limited · 100 Units</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: S }}>$68</span>
              <button onClick={() => navigate("/product/1")} style={{ background: S, color: "#000", border: "none", padding: "8px 16px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED DROPS ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Featured Drops" sub="SS25 Season" cta="View All →" onCta={() => navigate("/shop")} />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {PRODUCTS.map((p) =>
          <ProductCard key={p.id} product={p} img={productImg}
          wishlisted={wishlist.includes(p.id)}
          onWishlist={() => toggleWishlist(p.id)}
          onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
          onClick={() => navigate(`/product/${p.id}`)} />
          )}
        </div>
      </div>

      <SectionDivider label="SS25 Spotlight" />

      {/* ── CHROME SERIES BANNER ── */}
      <div className="vigo-2col" style={{ margin: "0 32px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
        <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Limited Edition ✦</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: .92, marginBottom: 14 }}>
            SS25<br /><span style={{ color: S }}>Chrome</span><br />Series
          </div>
          <div style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 32 }}>
            Hand-finished chrome hardware. NYC exclusive.<br />Only 100 units. No restocks, no exceptions.
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop Chrome Series</button>
            <button onClick={() => navigate("/drops")} style={btnO}>Drop Calendar →</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: `1px solid ${S}`, borderLeft: `1px solid ${S}` }} />
          <img src={productImg} style={{ width: 260, height: 260, objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(192,192,192,.15))" }} alt="" />
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Shop by Category" sub="" />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {CATEGORIES.map((cat) =>
          <div key={cat.name} onClick={() => navigate(`/shop?cat=${cat.name}`)}
          style={{ background: G1, border: `.5px solid ${G3}`, padding: "40px 24px 32px", cursor: "pointer", transition: "border-color .2s", textAlign: "center", position: "relative", overflow: "hidden" }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = S;}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = "var(--vt-border)";}}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>{cat.count}</div>
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
          {REVIEWS.map((r, i) =>
          <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, padding: "28px", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${S}, transparent)` }} />
              <div style={{ color: S, fontSize: 14, marginBottom: 14 }}>{"★".repeat(r.rating)}</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: SD, marginBottom: 20 }}>"{r.text}"</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vt-text)" }}>{r.name}</div>
                  <div style={{ fontSize: 8, color: SD, marginTop: 2 }}>{r.loc}</div>
                </div>
                <div style={{ fontSize: 8, color: S, letterSpacing: 2 }}>VERIFIED</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BRAND STORY TEASER ── */}
      <div style={{ margin: "0 32px", borderTop: `2px solid ${S}`, background: G1, border: `.5px solid ${G3}` }} className="vigo-2col-story">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="vigo-2col">
          <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}` }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ The Brand</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: .95, marginBottom: 20 }}>
              Born From<br />The Five<br />Boroughs
            </div>
            <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 28 }}>
              VIGONYC is more than clothing — it's a declaration. Every thread carries the energy of the streets that built us.
            </p>
            <button onClick={() => navigate("/about")} style={btnO}>Our Story →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRight: "none" }}>
            {[["500+", "Pieces Dropped"], ["12K+", "Community"], ["100%", "NYC Made"], ["4.9★", "Avg Rating"]].map(([n, l], i) =>
            <div key={l} style={{ padding: "36px 28px", borderRight: i % 2 === 0 ? `.5px solid ${G3}` : "none", borderBottom: i < 2 ? `.5px solid ${G3}` : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: S, letterSpacing: -1 }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
              </div>
            )}
          </div>
        </div>
      </div>

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
          .vigo-hero-grid>div:last-child{min-height:320px;}
          .vigo-kpi-grid{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-4col{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-3col{grid-template-columns:1fr !important;}
          .vigo-2col{grid-template-columns:1fr !important;}
        }
        @media(max-width:480px){.vigo-4col{grid-template-columns:1fr !important;}}
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
      `}</style>
    </div>);
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnO = { background: "none", border: `.5px solid #C0C0C0`, color: "#C0C0C0", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };