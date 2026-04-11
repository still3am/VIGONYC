import { useState } from "react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const faqs = {
  Orders: [
    { q: "How long does shipping take?", a: "Standard shipping takes 5–7 business days. Express (2–3 days) and Overnight options are available at checkout." },
    { q: "Do you ship internationally?", a: "Currently we ship within the US only. International shipping is coming in late 2025." },
    { q: "Can I change or cancel my order?", a: "Orders can be changed or cancelled within 1 hour of placing. After that, it goes into production and cannot be changed." },
    { q: "How do I track my order?", a: "You'll receive a tracking link via email once your order ships. You can also use our Track Order page." },
  ],
  Returns: [
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached." },
    { q: "How do I start a return?", a: "Visit the Track Order page, enter your order number and email, then select 'Start Return'. We'll email you a prepaid label." },
    { q: "When will I get my refund?", a: "Refunds are processed within 5–7 business days of receiving your return. Original payment method only." },
    { q: "Are sale items returnable?", a: "Items purchased at a discount of 30% or more are final sale and cannot be returned." },
  ],
  Brand: [
    { q: "Where is VIGONYC made?", a: "All pieces are designed and produced in New York City. We keep production local and limited intentionally." },
    { q: "Why no restocks?", a: "We believe in scarcity over excess. Every drop is limited. When it's gone, it's gone — that's the VIGO philosophy." },
    { q: "How do I stay updated on drops?", a: "Join our drop list via the homepage newsletter. Drop alerts go out 48 hours before release — sign up or miss out." },
    { q: "Do you do collaborations?", a: "We're selective with collabs. DM us on Instagram @VIGONYC or email collab@vigonyc.com with your pitch." },
  ],
};

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `.5px solid ${G3}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", color: "#fff", fontFamily: "inherit", textAlign: "left" }}>
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

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 40 }}>
        {Object.keys(faqs).map(section => (
          <button key={section} onClick={() => setActiveSection(section)} style={{ padding: "10px 24px", background: activeSection === section ? S : G1, color: activeSection === section ? "#000" : SD, border: `.5px solid ${activeSection === section ? S : G3}`, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontWeight: activeSection === section ? 900 : 400, fontFamily: "inherit" }}>
            {section}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div style={{ borderTop: `.5px solid ${G3}` }}>
        {faqs[activeSection].map(item => <FaqItem key={item.q} {...item} />)}
      </div>

      {/* Contact CTA */}
      <div style={{ marginTop: 48, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Still have questions?</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>We're Here to Help</div>
        <a href="/contact" style={{ display: "inline-block", background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", textDecoration: "none", fontFamily: "inherit" }}>Contact Us</a>
      </div>
    </div>
  );
}