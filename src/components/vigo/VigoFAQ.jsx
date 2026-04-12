import { useState } from "react";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const faqs = { Orders: [], Returns: [], Brand: [] };

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `.5px solid ${G3}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", color: "var(--vt-text)", fontFamily: "inherit", textAlign: "left" }}>
        <span style={{ fontSize: 13, fontWeight: 500, paddingRight: 24 }}>{q}</span>
        <span style={{ color: S, fontSize: 20, fontWeight: 300, flexShrink: 0, transition: "transform .2s", display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, paddingBottom: 18 }}>{a}</p>}
    </div>
  );
}

export default function VigoFAQ() {
  const [activeSection, setActiveSection] = useState("Orders");
  return (
    <div style={{ padding: "64px 32px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Help Center</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>FAQ</h1>
      <div style={{ display: "flex", gap: 2, marginBottom: 40 }}>
        {Object.keys(faqs).map(section => (
          <button key={section} onClick={() => setActiveSection(section)} style={{ padding: "10px 24px", background: activeSection === section ? S : G1, color: activeSection === section ? "#000" : SD, border: `.5px solid ${activeSection === section ? S : G3}`, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontWeight: activeSection === section ? 900 : 400, fontFamily: "inherit" }}>
            {section}
          </button>
        ))}
      </div>
      <div style={{ borderTop: `.5px solid ${G3}` }}>
        {faqs[activeSection].map(item => <FaqItem key={item.q} {...item} />)}
      </div>
      <div style={{ marginTop: 48, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Still have questions?</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>We're Here to Help</div>
        <a href="/contact" style={{ display: "inline-block", background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", textDecoration: "none", fontFamily: "inherit" }}>Contact Us</a>
      </div>
    </div>
  );
}