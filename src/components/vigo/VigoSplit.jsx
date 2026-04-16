import { useState } from "react";

const S = "#C0C0C0";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const addDays = (d, days) => { const r = new Date(d); r.setDate(r.getDate() + days); return r; };

export default function VigoSplit({ total, onSuccess }) {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [processing, setProcessing] = useState(false);

  const p1 = parseFloat((total * 0.5).toFixed(2));
  const p2 = parseFloat((total * 0.5).toFixed(2));
  const dueDate = addDays(new Date(), 14);
  const isValid = agreed && signature.trim().length > 2;

  const handlePay = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess({ txnId: "VSP-" + Date.now(), cardLast4: "SPLT", cardBrand: "VIGOSPLIT" });
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Payment Schedule */}
      <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
        <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Payment Plan</div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Payment 1 */}
          <div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Payment 1</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: S, marginBottom: 6 }}>${p1}</div>
            <div style={{ fontSize: 9, color: SD, lineHeight: 1.5 }}>Today · Order ships immediately</div>
          </div>

          {/* Payment 2 */}
          <div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Payment 2</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: SD, marginBottom: 6 }}>${p2}</div>
            <div style={{ fontSize: 9, color: SD, lineHeight: 1.5 }}>{fmtDate(dueDate)} · $3 late fee</div>
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `0.5px solid ${G3}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "var(--vt-text)" }}>${total.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: 7, color: SD, marginTop: 8, letterSpacing: 1 }}>0% interest • No fees</div>
        </div>
      </div>

      {/* Terms */}
      <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "18px 20px" }}>
        <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Terms</div>
        <ul style={{ fontSize: 9, color: SD, lineHeight: 1.7, margin: "0 0 0 18px", paddingLeft: 0 }}>
          <li style={{ marginBottom: 4 }}>Two equal payments, 14 days apart</li>
          <li style={{ marginBottom: 4 }}>Reminders sent before due date</li>
          <li>No hidden fees or interest</li>
        </ul>
      </div>

      {/* Agreement & Signature */}
      <div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 16 }}>
          <div style={{ width: 18, height: 18, minWidth: 18, border: `1.5px solid ${agreed ? S : G3}`, background: agreed ? S : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s", marginTop: 1 }}>
            {agreed && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" fill="none" /></svg>}
          </div>
          <span style={{ fontSize: 9, color: SD, lineHeight: 1.6 }}>I agree to the VIGOSPLIT payment plan and terms</span>
        </label>

        <div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Signature</div>
          <input
            value={signature}
            onChange={e => setSignature(e.target.value)}
            placeholder="Full name"
            style={{
              width: "100%",
              background: "var(--vt-bg)",
              border: `0.5px solid ${signature.trim().length > 2 ? "#0c6" : G3}`,
              color: "var(--vt-text)",
              padding: "11px 13px",
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              transition: "border-color .2s"
            }}
          />
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePay}
        disabled={!isValid || processing}
        style={{
          width: "100%",
          background: (!isValid || processing) ? "var(--vt-card)" : S,
          color: "#000",
          border: "none",
          padding: "14px",
          fontSize: 9,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontWeight: 900,
          cursor: (!isValid || processing) ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: (!isValid || processing) ? 0.5 : 1,
          transition: "all .2s"
        }}
      >
        {processing ? "Processing..." : `Pay $${p1} Now`}
      </button>
    </div>
  );
}