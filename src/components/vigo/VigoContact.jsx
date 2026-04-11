import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useForm } from "@/hooks/useFormField";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const TOPICS = ["General Inquiry", "Order Issue", "Return / Exchange", "Collaboration", "Press", "Other"];

function TopicPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ width: "100%", background: "#0a0a0a", border: `.5px solid ${value ? "#C0C0C0" : "#1a1a1a"}`, color: value ? "#fff" : "#777", padding: "13px 16px", fontSize: 12, outline: "none", fontFamily: "inherit", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box", textAlign: "left" }}
      >
        <span>{value || "Select a topic"}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent style={{ background: "#111", border: "none", borderTop: "2px solid #C0C0C0" }}>
          <DrawerHeader>
            <DrawerTitle style={{ color: "#fff", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textAlign: "left" }}>Select Topic</DrawerTitle>
          </DrawerHeader>
          <div style={{ padding: "0 0 env(safe-area-inset-bottom,16px)" }}>
            {TOPICS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { onChange(t); setOpen(false); }}
                style={{ width: "100%", background: value === t ? "rgba(192,192,192,.08)" : "none", border: "none", borderBottom: ".5px solid #1a1a1a", color: value === t ? "#C0C0C0" : "#ccc", padding: "18px 24px", fontSize: 13, textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                {t}
                {value === t && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function VigoContact() {
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { values: formData, handleChange, validateAll } = useForm({ firstName: '', lastName: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateAll({
      firstName: { required: true, label: 'First Name' },
      lastName: { required: true, label: 'Last Name' },
      email: { required: true, type: 'email' },
      message: { required: true, minLength: 10 }
    });
    if (!isValid || !topic) return;
    
    setLoading(true);
    try {
      await base44.functions.invoke('sendContactEmail', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        topic,
        message: formData.message
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setLoading(false);
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
              <Field label="First Name" required value={formData.firstName} onChange={(v) => handleChange('firstName', v)} />
              <Field label="Last Name" required value={formData.lastName} onChange={(v) => handleChange('lastName', v)} />
            </div>
            <Field label="Email Address" type="email" required value={formData.email} onChange={(v) => handleChange('email', v)} />
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Topic *</div>
              <TopicPicker value={topic} onChange={setTopic} />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Message *</div>
              <textarea required rows={5} placeholder="Tell us what's going on..." value={formData.message} onChange={(e) => handleChange('message', e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: `.5px solid #1a1a1a`, color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
      <style>{`@media(max-width:900px){.vigo-2col{grid-template-columns:1fr !important;} .vigo-2col-sm{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Field({ label, type = "text", required, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#777", textTransform: "uppercase", marginBottom: 8 }}>{label}{required && " *"}</div>
      <input type={type} required={required} value={value || ''} onChange={(e) => onChange?.(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: ".5px solid #1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}