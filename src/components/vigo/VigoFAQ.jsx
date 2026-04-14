import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const faqs = {
  Orders: [
    { q: "When does the next drop happen?", a: "Drops are announced on our site and via email. Sign up for the drop list to get first access — we always sell out fast." },
    { q: "Can I cancel or change my order?", a: "Orders are processed immediately. If you need to make a change, contact us within 1 hour of placing the order and we'll do our best to help." },
    { q: "Do you offer international shipping?", a: "Currently we ship within the US only. International shipping is coming soon — drop your email to be notified when it launches." },
    { q: "How long does shipping take?", a: "Standard shipping takes 5–7 business days. Expedited options are available at checkout for 2–3 business day delivery." },
  ],
  Returns: [
    { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for unworn, unwashed items with tags attached. Sale items and limited drops are final sale." },
    { q: "How do I start a return?", a: "returns" },
    { q: "When will I receive my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect your return. You'll get a confirmation email once it's done." },
  ],
  Brand: [
    { q: "Where is VIGONYC based?", a: "We're born and bred in New York City — designed in Manhattan, shot across all five boroughs." },
    { q: "Are your drops ever restocked?", a: "No. Every drop is strictly limited. Once it's gone, it's gone. No restocks, no exceptions. That's the point." },
    { q: "Do you do collaborations?", a: "We're always open to creative partnerships that align with our vision. Reach out via the contact page with your proposal." },
  ],
};

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const isReturns = a === "returns";
  return (
    <div style={{ borderBottom: `.5px solid ${G3}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", color: "var(--vt-text)", fontFamily: "inherit", textAlign: "left" }}>
        <span style={{ fontSize: 13, fontWeight: 500, paddingRight: 24 }}>{q}</span>
        <span style={{ color: S, fontSize: 20, fontWeight: 300, flexShrink: 0, transition: "transform .2s", display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && (
        isReturns ? (
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, paddingBottom: 18 }}>
            Visit our <Link to="/returns" style={{ color: S }}>Returns page</Link> to submit a request online. We'll get back to you within 24 hours.
          </p>
        ) : (
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, paddingBottom: 18 }}>{a}</p>
        )
      )}
    </div>
  );
}

export default function VigoFAQ() {
  const [activeSection, setActiveSection] = useState("Orders");
  const [faqSearch, setFaqSearch] = useState("");

  useEffect(() => {
    document.title = "FAQ — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const searchResults = useMemo(() => {
    if (!faqSearch.trim()) return null;
    const q = faqSearch.toLowerCase();
    return Object.values(faqs).flat().filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
  }, [faqSearch]);

  return (
    <div style={{ padding: "64px 32px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Help Center</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 24 }}>FAQ</h1>
      <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} placeholder="Search FAQ..." style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 18px", fontSize: 12, outline: "none", fontFamily: "inherit", marginBottom: 24, boxSizing: "border-box" }} />
      {!searchResults && (
        <div style={{ display: "flex", gap: 2, marginBottom: 40 }}>
          {Object.keys(faqs).map(section => (
            <button key={section} onClick={() => setActiveSection(section)} style={{ padding: "10px 24px", background: activeSection === section ? S : G1, color: activeSection === section ? "#000" : SD, border: `.5px solid ${activeSection === section ? S : G3}`, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontWeight: activeSection === section ? 900 : 400, fontFamily: "inherit" }}>
              {section}
            </button>
          ))}
        </div>
      )}
      <div style={{ borderTop: `.5px solid ${G3}` }}>
        {searchResults
          ? searchResults.length > 0
            ? searchResults.map(item => <FaqItem key={item.q} {...item} />)
            : <div style={{ padding: "32px 0", color: SD, fontSize: 13 }}>No results for "{faqSearch}"</div>
          : faqs[activeSection].map(item => <FaqItem key={item.q} {...item} />)}
      </div>
      <div style={{ marginTop: 48, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Still have questions?</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>We're Here to Help</div>
        <Link to="/contact" style={{ display: "inline-block", background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", textDecoration: "none", fontFamily: "inherit" }}>Contact Us</Link>
      </div>
    </div>
  );
}