const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";

export default function VigoAbout({ nav, logo }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "80px 32px", borderBottom: `.5px solid ${G3}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="vigo-2col">
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Our Story</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,80px)", fontWeight: 900, letterSpacing: -2, lineHeight: .9, marginBottom: 28 }}>Born From<br />The Streets</h1>
          <p style={{ fontSize: 14, color: SD, lineHeight: 1.9, marginBottom: 20 }}>
            VIGONYC was founded in 2024 by a group of creatives from the five boroughs — designers, photographers, and artists who grew up in the culture and wanted to dress it right.
          </p>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.9 }}>
            Every piece we drop carries the DNA of the streets that raised us. Limited production. No compromises. NYC or nothing.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 48 }}>
          <img src={logo} alt="VIGONYC Logo" style={{ width: 200, height: 200, objectFit: "contain" }} />
        </div>
      </div>

      {/* Values */}
      <div style={{ padding: "64px 32px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 32 }}>Our Values</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }} className="vigo-3col">
          {[
            ["Quality First", "350gsm+ fabrics, hand-finished details, zero shortcuts. Every piece passes the borough test."],
            ["Limited Always", "We don't restock. We don't mass produce. When it's gone, it's gone. That's the point."],
            ["NYC Only", "Designed in New York. Inspired by New York. For the people who make New York what it is."],
          ].map(([t, d]) => (
            <div key={t} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px" }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>{t}</div>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: G1, borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}`, padding: "48px 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }} className="vigo-4col">
        {[["2024","Founded"],["500+","Pieces Dropped"],["12K+","Community"],["5","Boroughs"]].map(([n,l],i) => (
          <div key={l} style={{ textAlign: "center", padding: "24px", borderRight: i < 3 ? `.5px solid ${G3}` : "none" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: S }}>{n}</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "64px 32px" }}>
        <button onClick={() => nav("shop")} style={{ background: S, color: "#000", border: "none", padding: "18px 56px", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" }}>
          Shop the Collection
        </button>
      </div>
      <style>{`
        @media(max-width:900px){.vigo-2col,.vigo-3col,.vigo-4col{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}