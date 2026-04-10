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

const collections = [
  { name: "Chrome Series", sub: "SS25 — 14 pieces", img: null },
  { name: "NYC Archive", sub: "FW24 — 22 pieces", img: null },
  { name: "Street Essentials", sub: "Core — Always available", img: null },
];

const reviews = [
  { name: "Jordan M.", loc: "Brooklyn, NY", rating: 5, text: "The Chrome V Tee is everything. Quality is insane for the price. Already ordered 3 more." },
  { name: "Aaliyah T.", loc: "Harlem, NY", rating: 5, text: "Finally a brand that gets it. VIGONYC hits different — the silver hardware on the cargo pants is a vibe." },
  { name: "Marcus R.", loc: "Queens, NY", rating: 5, text: "Limited drops are real — got the SS25 hoodie on release day. Worth the W." },
];

export default function VigoHome({ nav, productImg }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, minHeight: "90vh", alignItems: "center", borderBottom: `.5px solid ${G3}` }} className="vigo-hero-grid">
        <div style={{ paddingRight: 48, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: S, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>SS25 Collection — Now Live</span>
          </div>
          <h1 style={{ fontSize: "clamp(52px,7vw,96px)", fontWeight: 900, letterSpacing: -3, lineHeight: .9, marginBottom: 24 }}>
            STREETS<br />OF <em style={{ color: S, fontStyle: "italic" }}>NYC</em>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.8, maxWidth: 380, marginBottom: 32 }}>
            Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => nav("shop")} style={btnP}>Shop the Drop</button>
            <button onClick={() => nav("lookbook")} style={btnO}>View Lookbook</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, marginTop: 48, paddingTop: 32, borderTop: `.5px solid ${G3}` }}>
            {[["500+","Pieces Dropped"],["12K+","NYC Community"],["100%","Street Ready"],["4.9★","Avg. Rating"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: G1, borderLeft: `.5px solid ${G3}`, minHeight: 500 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <img src={productImg} alt="VIGONYC" style={{ width: "70%", maxWidth: 380, objectFit: "contain", filter: "drop-shadow(0 0 60px rgba(192,192,192,.15))" }} />
          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(0,0,0,.8)", border: `.5px solid ${G3}`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#fff" }}>Chrome V Tee — SS25</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: S }}>$68</span>
          </div>
        </div>
      </div>

      {/* Featured drops */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Featured Drops" sub="SS25 Season" cta="View All →" onCta={() => nav("shop")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="vigo-4col">
          {products.map(p => (
            <ProductCard key={p.id} product={p} img={productImg} onClick={() => nav("product")} />
          ))}
        </div>
      </div>

      <SectionDivider label="SS25 Spotlight" />

      {/* Chrome Series block */}
      <div style={{ margin: "0 32px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "grid", gridTemplateColumns: "1fr 1fr" }} className="vigo-2col">
        <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}` }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Limited Edition ✦</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -2, lineHeight: .92, marginBottom: 14 }}>SS25<br /><span style={{ color: S }}>Chrome</span><br />Series</div>
          <div style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 32 }}>Hand-finished chrome hardware. NYC exclusive.<br />Only 100 units. No restocks, no exceptions.</div>
          <button onClick={() => nav("shop")} style={btnP}>Shop Chrome Series</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: `1px solid ${S}`, borderLeft: `1px solid ${S}` }} />
          <img src={productImg} style={{ width: 260, height: 260, objectFit: "contain" }} alt="" />
        </div>
      </div>

      {/* Collections */}
      <div style={{ padding: "52px 32px" }}>
        <SectionHeader title="Collections" sub="All Seasons" cta="Browse →" onCta={() => nav("shop")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }} className="vigo-3col">
          {collections.map((c, i) => (
            <div key={c.name} onClick={() => nav("shop")} style={{ background: G1, border: `.5px solid ${G3}`, padding: "48px 36px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = S}
              onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 12 }}>{c.sub}</div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1 }}>{c.name}</div>
              <div style={{ marginTop: 24, fontSize: 10, letterSpacing: 2, color: S, textTransform: "uppercase" }}>Explore →</div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider label="Community Reviews" />

      {/* Reviews */}
      <div style={{ padding: "52px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="vigo-3col">
          {reviews.map((r, i) => (
            <div key={i} style={{ background: G1, border: `.5px solid ${G3}`, padding: "32px 28px" }}>
              <div style={{ color: S, fontSize: 14, marginBottom: 12 }}>{"★".repeat(r.rating)}</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#ccc", marginBottom: 20 }}>"{r.text}"</p>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>{r.name}</div>
              <div style={{ fontSize: 9, color: SD, letterSpacing: 2, marginTop: 2 }}>{r.loc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email signup */}
      <div style={{ margin: "0 32px 52px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "52px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Join The Drop List ✦</div>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Get First Access</div>
        <div style={{ fontSize: 12, color: SD, marginBottom: 32 }}>Drop alerts, exclusive offers, NYC-only releases. No spam, ever.</div>
        <div style={{ display: "flex", gap: 0, maxWidth: 480, margin: "0 auto" }}>
          <input placeholder="your@email.com" style={{ flex: 1, background: "#111", border: `.5px solid #333`, borderRight: "none", color: "#fff", padding: "14px 20px", fontSize: 12, outline: "none" }} />
          <button style={btnP}>Join the List</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .vigo-hero-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) { .vigo-4col { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .vigo-4col { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) { .vigo-3col { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) { .vigo-2col { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "14px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" };
const btnO = { background: "none", border: ".5px solid #C0C0C0", color: "#C0C0C0", padding: "14px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" };