import { useState } from "react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const TOPICS = ["General Inquiry","Order Issue","Return / Exchange","Collaboration","Press","Other"];

export default function VigoContact() {
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "64px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Get in Touch</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 52 }}>Contact Us</h1>

      <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        {/* Info panel */}
        <div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Reach Us</div>
            {[["📧","Email","hello@vigonyc.com"],["📸","Instagram","@VIGONYC"],["📍","Location","New York City, NY"],["⏰","Response Time","Within 24 hours"],].map(([ic,l,v]) => (
              <div key={l} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 18, marginBottom: 18, borderBottom: `.5px solid ${G3}` }}>
                <span style={{ fontSize: 18 }}>{ic}</span>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 12, color: "#fff" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "24px 28px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 12 }}>Hours</div>
            <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.9 }}>
              Mon – Fri: 10am – 7pm EST<br />
              Sat: 11am – 5pm EST<br />
              Sun: Closed
            </div>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid #0c6`, padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>Message Sent</div>
            <div style={{ fontSize: 12, color: SD }}>We'll get back to you within 24 hours.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First Name" required />
              <Field label="Last Name" required />
            </div>
            <Field label="Email Address" type="email" required />
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Topic *</div>
              <select required value={topic} onChange={e => setTopic(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: `.5px solid #1a1a1a`, color: topic ? "#fff" : SD, padding: "12px 16px", fontSize: 12, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                <option value="">Select a topic</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Message *</div>
              <textarea required rows={5} placeholder="Tell us what's going on..." style={{ width: "100%", background: "#0a0a0a", border: `.5px solid #1a1a1a`, color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <button type="submit" style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Send Message
            </button>
          </form>
        )}
      </div>
      <style>{`@media(max-width:900px){.vigo-2col{grid-template-columns:1fr !important;} .vigo-2col-sm{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Field({ label, type = "text", required }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#777", textTransform: "uppercase", marginBottom: 8 }}>{label}{required && " *"}</div>
      <input type={type} required={required} style={{ width: "100%", background: "#0a0a0a", border: ".5px solid #1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}