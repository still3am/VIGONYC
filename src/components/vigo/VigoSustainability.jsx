import { useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const commitments = [
  { icon: "🌱", title: "Organic Materials", desc: "We source 100% GOTS-certified organic cotton for our core essentials. No synthetic shortcuts." },
  { icon: "⚡", title: "Clean Energy", desc: "Our NYC production facility runs on 100% renewable energy. Certified since 2024." },
  { icon: "📦", title: "Zero Waste Packaging", desc: "Every order ships in recycled, biodegradable packaging. No plastic, no excess." },
  { icon: "🔄", title: "Circular Program", desc: "Return worn VIGO pieces for store credit. We repair, resell, or responsibly recycle every item." },
  { icon: "🤝", title: "Fair Wages", desc: "Every worker in our supply chain earns above living wage. We audit every partner annually." },
  { icon: "🗽", title: "NYC Made", desc: "Limited production. Short supply chains. Manufacturing close to home reduces our carbon footprint significantly." },
];

export default function VigoSustainability() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Header */}
      <div style={{ padding: "72px 32px 52px", borderBottom: `.5px solid ${G3}`, textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Responsibility</div>
        <h1 style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 900, letterSpacing: -2, marginBottom: 20 }}>Built to Last.<br />Not to Waste.</h1>
        <p style={{ fontSize: 14, color: SD, maxWidth: 560, margin: "0 auto", lineHeight: 1.9 }}>
          We believe luxury doesn't have to come at the planet's expense. Here's how we're doing it differently.
        </p>
      </div>

      {/* Commitment cards */}
      <div style={{ padding: "52px 32px" }}>
        <div className="vigo-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {commitments.map((c) => (
            <div key={c.title} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 12 }}>{c.title}</div>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact numbers */}
      <div style={{ background: G1, borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}`, padding: "0 32px" }}>
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["85%","Recycled packaging"],["100%","Renewable energy"],["0","Plastic used"],["30+","Supply chain audits"]].map(([n,l],i,arr) => (
            <div key={l} style={{ textAlign: "center", padding: "40px 16px", borderRight: i < arr.length-1 ? `.5px solid ${G3}` : "none" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: S }}>{n}</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "64px 32px" }}>
        <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "18px 56px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          Shop Responsibly
        </button>
      </div>

      <style>{`@media(max-width:900px){.vigo-3col,.vigo-4col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}