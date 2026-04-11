import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import SectionHeader from "./SectionHeader";

const S = "#C0C0C0";
const SD = "#777";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";

const products = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", opacity: 1 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
];

const categories = ["Tops","Bottoms","Outerwear","Accessories"];

const reviews = [
  { name: "Jordan M.", loc: "Brooklyn, NY", rating: 5, text: "The Chrome V Tee is everything. Quality is insane for the price. Already ordered 3 more." },
  { name: "Aaliyah T.", loc: "Harlem, NY", rating: 5, text: "Finally a brand that gets it. VIGONYC hits different — the silver hardware on the cargo pants is a vibe." },
  { name: "Marcus R.", loc: "Queens, NY", rating: 5, text: "Limited drops are real — got the SS25 hoodie on release day. Worth the W." },
];

export default function VigoHome() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div>
      {/* ── HERO ── */}
      <div className="vigo-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "88vh", borderBottom: `.5px solid ${G3}` }}>
        {/* Left */}
        <div style={{ padding: "64px 48px 64px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 2s infinite" }} />
            <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>SS25 Collection — Now Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(52px,6.5vw,96px)", fontWeight: 900, letterSpacing: -3, lineHeight: .88, marginBottom: 24 }}>
            STREETS<br />OF <em style={{ color: S, fontStyle: "italic" }}>NYC</em>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, maxWidth: 380, marginBottom: 36 }}>
            Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => navigate("/lookbook")} style={btnO}>View Lookbook</button>
          </div>
          {/* KPIs */}
          <div className="vigo-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 52, paddingTop: 28, borderTop: `.5px solid ${G3}` }}>
            {[["500+","Pieces Dropped"],["12K+","NYC Community"],["100%","Street Ready"],["4.9★","Avg. Rating"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div style={{ position: "relative", background: G1, borderLeft: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <img src={productImg} alt="VIGONYC SS25" style={{ width: "70%", maxWidth: 360, objectFit: "contain", filter: "drop-shadow(0 0 60px rgba(192,192,192,.18))" }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: "rgba(0,0,0,.85)", border: `.5px solid ${G3}`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#fff" }}>Chrome V Tee — SS25</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: S }}>$68</span>
          </div>
        </div>
      </div>

      {/* ── DROPS ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Featured Drops" sub="SS25 Season" cta="View All →" onCta={() => navigate("/shop")} />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} img={productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
              onClick={() => navigate(`/product/${p.id}`)} />
          ))}
        </div>
      </div>

      <SectionDivider label="SS25 Spotlight" />

      {/* ── SS25 CHROME BANNER ── */}
      <div className="vigo-2col" style={{ margin: "0 32px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}` }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Limited Edition ✦</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: .92, marginBottom: 14 }}>SS25<br /><span style={{ color: S }}>Chrome</span><br />Series</div>
          <div style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 32 }}>Hand-finished chrome hardware. NYC exclusive.<br />Only 100 units. No restocks, no exceptions.</div>
          <button onClick={() => navigate("/shop")} style={btnP}>Shop Chrome Series</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: `1px solid ${S}`, borderLeft: `1px solid ${S}` }} />
          <img src={productImg} style={{ width: 240, height: 240, objectFit: "contain" }} alt="" />
        </div>
      </div>

      {/* ── 4 CATEGORIES ── */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Shop by Category" sub="" cta="" />
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {categories.map((cat) => (
            <div key={cat} onClick={() => navigate(`/shop?cat=${cat}`)} style={{ background: G1, border: `.5px solid ${G3}`, padding: "48px 24px", cursor: "pointer", textAlign: "center", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = S}
              onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>{cat}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginTop: 12 }}>Browse →</div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider label="Community Reviews" />

      {/* ── REVIEWS ── */}
      <div style={{ padding: "32px 32px 52px" }}>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, padding: "28px" }}>
              <div style={{ color: S, fontSize: 13, marginBottom: 12 }}>{"★".repeat(r.rating)}</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#ccc", marginBottom: 20 }}>"{r.text}"</p>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{r.name}</div>
              <div style={{ fontSize: 9, color: SD, marginTop: 2 }}>{r.loc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div style={{ margin: "0 32px 64px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "52px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Join The Drop List ✦</div>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Get First Access</div>
        <div style={{ fontSize: 12, color: SD, marginBottom: 32 }}>Drop alerts, exclusive offers, NYC-only releases. No spam, ever.</div>
        <div style={{ display: "flex", gap: 0, maxWidth: 460, margin: "0 auto" }}>
          <input placeholder="your@email.com" style={{ flex: 1, background: "#111", border: `.5px solid #333`, borderRight: "none", color: "#fff", padding: "14px 20px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <button style={btnP}>Join the List</button>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){.vigo-hero-grid{grid-template-columns:1fr !important;} .vigo-hero-grid>div:last-child{min-height:300px;} .vigo-kpi-grid{grid-template-columns:repeat(2,1fr) !important;} .vigo-4col{grid-template-columns:repeat(2,1fr) !important;} .vigo-3col{grid-template-columns:1fr !important;} .vigo-2col{grid-template-columns:1fr !important;}}
        @media(max-width:480px){.vigo-4col{grid-template-columns:1fr !important;}}
        @keyframes vigo-pulse{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "14px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnO = { background: "none", border: ".5px solid #C0C0C0", color: "#C0C0C0", padding: "14px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };