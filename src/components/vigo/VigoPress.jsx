import { useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const features = [
  { outlet: "Hypebeast", date: "March 2025", headline: "VIGONYC Is The NYC Brand You Need to Know in 2025", type: "Feature" },
  { outlet: "Complex", date: "February 2025", headline: "The New Wave: 10 Emerging Streetwear Labels Redefining the Game", type: "Roundup" },
  { outlet: "High Snobiety", date: "January 2025", headline: "Chrome Aesthetics Are Taking Over — VIGONYC Leads the Pack", type: "Trend Report" },
  { outlet: "The New York Times", date: "December 2024", headline: "From the Boroughs: NYC's New Guard of Luxury Streetwear", type: "Profile" },
  { outlet: "Vogue", date: "November 2024", headline: "Street Level Luxury: The Labels Dressing New York's Creative Class", type: "Fashion Feature" },
  { outlet: "GQ", date: "October 2024", headline: "Best Dressed: The Downtown NYC Look, Perfected", type: "Style Guide" },
];

const quotes = [
  { text: "VIGONYC isn't chasing trends — they're setting them.", source: "Hypebeast", year: "2025" },
  { text: "The most important new streetwear brand out of New York. Full stop.", source: "Complex", year: "2025" },
  { text: "Chrome, concrete, culture. VIGONYC distills NYC into fabric.", source: "High Snobiety", year: "2025" },
];

export default function VigoPress() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "72px 32px 52px", borderBottom: `.5px solid ${G3}` }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Media & Press</div>
        <h1 style={{ fontSize: "clamp(44px,6vw,88px)", fontWeight: 900, letterSpacing: -3, lineHeight: .9, marginBottom: 20 }}>
          As Seen<br /><span style={{ color: S }}>In</span>
        </h1>
        <p style={{ fontSize: 13, color: SD, maxWidth: 440, lineHeight: 1.9 }}>
          For press inquiries, interviews, and collaboration requests, contact press@vigonyc.com
        </p>
      </div>

      {/* Pull quotes */}
      <div style={{ borderBottom: `.5px solid ${G3}`, overflow: "hidden" }}>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ padding: "48px 36px", borderRight: i < quotes.length - 1 ? `.5px solid ${G3}` : "none", position: "relative" }}>
              <div style={{ fontSize: 64, color: S, opacity: .1, fontFamily: "Georgia", lineHeight: 1, position: "absolute", top: 24, left: 28 }}>"</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#ccc", marginBottom: 20, position: "relative", zIndex: 1 }}>"{q.text}"</p>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", fontWeight: 700 }}>— {q.source}, {q.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features list */}
      <div style={{ padding: "52px 32px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase", marginBottom: 28, borderBottom: `.5px solid ${G3}`, paddingBottom: 16 }}>Coverage</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 0", borderBottom: `.5px solid ${G3}`, flexWrap: "wrap", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.querySelector(".press-arrow").style.transform = "translateX(4px)"}
              onMouseLeave={e => e.currentTarget.querySelector(".press-arrow").style.transform = "translateX(0)"}>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{f.outlet}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, marginTop: 3 }}>{f.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{f.headline}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 8, letterSpacing: 2, border: `.5px solid ${G3}`, color: SD, padding: "4px 10px", textTransform: "uppercase" }}>{f.type}</span>
                <span className="press-arrow" style={{ color: S, fontSize: 16, transition: "transform .2s" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Press kit download */}
      <div style={{ margin: "0 32px 64px", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "52px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Press Resources</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Press Kit</div>
          <p style={{ fontSize: 12, color: SD, maxWidth: 380, lineHeight: 1.8 }}>
            High-res logos, brand guidelines, product imagery, and founder bio. All in one place.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={{ background: S, color: "#000", border: "none", padding: "16px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            Download Press Kit
          </button>
          <button onClick={() => navigate("/contact")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Press Inquiries →
          </button>
        </div>
      </div>

      <style>{`@media(max-width:900px){.vigo-3col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}