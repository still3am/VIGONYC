import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const REASONS = ["Wrong size", "Defective item", "Changed my mind", "Arrived damaged", "Other"];

export default function VigoReturns() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    base44.auth.me().then(user => { if (user) setEmail(user.email || ""); }).catch(() => {});
  }, []);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || !reason) return alert("Order number and reason are required.");
    setSubmitting(true);
    await base44.entities.ReturnRequest.create({ orderId: orderId.trim(), userEmail: email.trim(), reason, message, status: "Pending" });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "64px 32px", maxWidth: 680, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Customer Care</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>Start a Return</h1>
      <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 48 }}>Regular items may be returned within 14 days. Drop and limited-edition items are final sale.</p>

      {submitted ? (
         <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid #0c6`, padding: "48px 36px", textAlign: "center" }}>
           <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
           <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>Request Submitted</div>
           <div style={{ fontSize: 12, color: SD, lineHeight: 1.8 }}>
             Your return request for order <strong style={{ color: S }}>#{orderId}</strong> has been submitted.<br />
             We'll contact you within 24 hours with next steps.
           </div>
         </div>
       ) : (
         <>
           <div style={{ background: "rgba(192,192,192,.08)", border: `.5px solid rgba(192,192,192,.2)`, borderLeft: `2px solid ${S}`, padding: "16px 20px", marginBottom: 24, borderRadius: "2px" }}>
             <div style={{ fontSize: 9, color: S, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>Return Policy</div>
             <div style={{ fontSize: 11, color: SD, lineHeight: 1.6 }}>Standard items: 14 days after delivery. Drop & limited-edition items are final sale. Must be unworn with original packaging.</div>
           </div>
           <form onSubmit={handleSubmit} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Order Number *</div>
            <input required value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. VIGO-12345" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Email Address</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Order confirmation email" style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Reason *</div>
            <select required value={reason} onChange={e => setReason(e.target.value)} style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: reason ? "var(--vt-text)" : SD, padding: "12px 16px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
              <option value="">Select a reason...</option>
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Additional Details</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Describe the issue..." style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={submitting} style={{ background: S, color: "#000", border: "none", padding: "16px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting..." : "Submit Return Request"}
          </button>
          </form>
          </>
          )}
          </div>
  );
}