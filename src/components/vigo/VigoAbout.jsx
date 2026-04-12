import { useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoAbout({ logo }) {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "60vh", borderBottom: `.5px solid ${G3}` }}>
        <div style={{ padding: "72px 48px 72px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Our Story</div>
          <h1 style={{ fontSize: "clamp(40px,5.5vw,76px)", fontWeight: 900, letterSpacing: -2, lineHeight: .9, marginBottom: 28 }}>Born From<br />The Streets</h1>
          <p style={{ fontSize: 14, color: SD, lineHeight: 1.9, marginBottom: 20, maxWidth: 420 }}>
            VIGONYC was founded in 2024 by creatives from all five boroughs — designers, photographers, and artists who grew up in the culture and wanted to dress it right.
          </p>
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9 }}>
            Every piece we drop carries the DNA of the streets that raised us. Limited production. No compromises. NYC or nothing.
          </p>
        </div>
        <div style={{ background: G1, borderLeft: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}` }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
          <img src={logo} alt="VIGONYC" style={{ width: 220, height: 220, objectFit: "contain" }} />
        </div>
      </div>

      {/* Values */}
      <div style={{ padding: "64px 32px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ What We Stand For</div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 36 }}>Our Values</div>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {[
            ["Quality First", "350gsm+ fabrics, hand-finished details, zero shortcuts. Every piece passes the borough test before it drops."],
            ["Limited Always", "We don't restock. We don't mass produce. When it's gone — it's gone. That's the point."],
            ["NYC Only", "Designed in New York. Inspired by New York. For the people who actually make New York what it is."],
          ].map(([t,d]) => (
            <div key={t} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px" }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>{t}</div>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: G1, borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}` }}>
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["2024","Founded"],["500+","Pieces Dropped"],["12K+","Community"],["5","Boroughs"]].map(([n,l],i,arr) => (
            <div key={l} style={{ textAlign: "center", padding: "40px 16px", borderRight: i < arr.length-1 ? `.5px solid ${G3}` : "none" }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: S }}>{n}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team section */}
      <div style={{ padding: "64px 32px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ The Crew</div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 36 }}>Founded in the Five Boroughs</div>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[["Manhattan","Design & Creative"],["Brooklyn","Photography & Lookbook"],["Queens","Operations & Drops"]].map(([b,r]) => (
            <div key={b} style={{ background: G1, border: `.5px solid ${G3}`, padding: "32px" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 8 }}>{b}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "0 32px 64px" }}>
        <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "18px 56px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          Shop the Collection
        </button>
      </div>

      <style>{`@media(max-width:900px){.vigo-2col,.vigo-3col,.vigo-4col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}