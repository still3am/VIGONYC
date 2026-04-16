import { useState } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const addDays = (d, days) => { const r = new Date(d); r.setDate(r.getDate() + days); return r; };
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function VigoSplit({ total, onSuccess }) {
  const [step, setStep] = useState("overview"); // overview | agreement | confirm
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [eSignDone, setESignDone] = useState(false);
  const [placing, setPlacing] = useState(false);

  const p1 = parseFloat((total * 0.5).toFixed(2));
  const p2 = parseFloat((total * 0.5).toFixed(2));
  const dueDate = addDays(new Date(), 14);

  const handleConfirm = async () => {
    setPlacing(true);
    try {
      const res = await base44.functions.invoke("processPayment", { amount: total, method: "vigosplit", orderId: "temp", userEmail: "" });
      if (res.data.success) {
        onSuccess({ txnId: res.data.txnId, cardLast4: res.data.cardLast4, cardBrand: res.data.cardBrand });
      } else {
        alert("VIGOSPLIT payment failed: " + res.data.error);
        setPlacing(false);
      }
    } catch (e) {
      alert("Payment error: " + e.message);
      setPlacing(false);
    }
  };

  if (step === "overview") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Badge */}
        <div style={{ background: "rgba(192,192,192,0.04)", border: "0.5px solid rgba(192,192,192,0.2)", borderLeft: `3px solid ${S}`, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: S, color: "#000", padding: "2px 8px", fontSize: 8, fontWeight: 900, letterSpacing: 2 }}>VIGOSPLIT</div>
              <span style={{ fontSize: 10, color: SD, letterSpacing: 1 }}>Pay in 2 · 0% fee</span>
            </div>
            <div style={{ fontSize: 8, color: "#0c6", letterSpacing: 1 }}>NO INTEREST</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Due Today</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: S }}>${p1.toFixed(2)}</div>
              <div style={{ fontSize: 9, color: SD, marginTop: 4 }}>50% · Order ships immediately</div>
            </div>
            <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Due {fmtDate(dueDate)}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: SD }}>${p2.toFixed(2)}</div>
              <div style={{ fontSize: 9, color: SD, marginTop: 4 }}>50% · 14 days from today</div>
            </div>
          </div>
          <div style={{ marginTop: 12, height: 3, background: G3, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "50%", height: "100%", background: `linear-gradient(90deg, #888, ${S})` }} />
          </div>
          <div style={{ fontSize: 9, color: SD, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span>50% due now</span><span>50% in 14 days</span>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "16px 18px" }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>How VIGOSPLIT Works</div>
          {[
            ["01", "Pay 50% now", "Your order ships right away after Payment 1 clears."],
            ["02", "Reminders sent", "You get reminders 3 days before, 1 day before, and on due date."],
            ["03", "Pay 50% in 14 days", `${fmtDate(dueDate)} · $3 late fee applies if missed.`],
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: G3, flexShrink: 0, lineHeight: 1.2 }}>{n}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{t}</div>
                <div style={{ fontSize: 10, color: SD, lineHeight: 1.6 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep("agreement")}
          style={{ background: S, color: "#000", border: "none", padding: "14px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", width: "100%" }}
        >
          Continue to Agreement →
        </button>
      </div>
    );
  }

  if (step === "agreement") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>✦ VIGOSPLIT Agreement</div>

        {/* Terms */}
        <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${S}`, padding: "16px 18px", fontSize: 11, color: SD, lineHeight: 1.9, maxHeight: 260, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: S, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>VIGOSPLIT Installment Agreement — Binding Contract</div>
          <p style={{ marginBottom: 8 }}>By signing below, you agree to the following terms with <strong style={{ color: "var(--vt-text)" }}>VIGOSPLIT</strong>:</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>1. Binding Payment.</strong> You are entering a legally binding installment plan for your current order.</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>2. Payment 1.</strong> ${p1.toFixed(2)} (50%) is due immediately. Your order will not ship until this clears.</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>3. Payment 2.</strong> ${p2.toFixed(2)} (remaining 50%) is due on <strong style={{ color: "var(--vt-text)" }}>{fmtDate(dueDate)}</strong>, 14 days from today.</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>4. Late Fee.</strong> A <strong style={{ color: "#e03" }}>$3.00 late fee</strong> will be applied if Payment 2 is not received by the due date.</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>5. Reminders.</strong> Automated reminders will be sent 3 days before, 1 day before, and on the due date.</p>
          <p style={{ marginBottom: 6 }}><strong style={{ color: "var(--vt-text)" }}>6. Non-Payment.</strong> Failure to complete payment may result in loss of VIGOSPLIT eligibility and referral to collections.</p>
          <p><strong style={{ color: "var(--vt-text)" }}>7. E-Signature.</strong> Entering your name below constitutes a valid electronic signature.</p>
        </div>

        {/* Checkbox */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }} onClick={() => setAgreed(!agreed)}>
          <div style={{ width: 18, height: 18, minWidth: 18, border: `1.5px solid ${agreed ? S : G3}`, background: agreed ? S : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s", marginTop: 1 }}>
            {agreed && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" fill="none" /></svg>}
          </div>
          <span style={{ fontSize: 11, color: SD, lineHeight: 1.6 }}>I have read and agree to the VIGOSPLIT Installment Agreement. I understand this is a binding payment obligation.</span>
        </label>

        {/* E-Sign */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Electronic Signature</div>
          <input
            value={signature}
            onChange={e => { setSignature(e.target.value); setESignDone(e.target.value.trim().length > 2); }}
            placeholder="Type your full legal name to sign"
            style={{ width: "100%", background: G2, border: `0.5px solid ${eSignDone ? "#0c6" : G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
          />
          {eSignDone && <div style={{ fontSize: 9, color: "#0c6", marginTop: 4 }}>✓ Signature recorded — {new Date().toLocaleString()}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep("overview")} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "13px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          <button
            onClick={() => setStep("confirm")}
            disabled={!agreed || !eSignDone}
            style={{ flex: 1, background: agreed && eSignDone ? S : G2, color: "#000", border: "none", padding: "13px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: agreed && eSignDone ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: agreed && eSignDone ? 1 : 0.5 }}
          >
            Proceed to Payment →
          </button>
        </div>
      </div>
    );
  }

  // confirm
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>✦ Confirm VIGOSPLIT</div>
      <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Charging Today</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: S }}>${p1.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Due {fmtDate(dueDate)}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: SD }}>${p2.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ height: 3, background: G3, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: "50%", height: "100%", background: `linear-gradient(90deg, #888, ${S})` }} />
        </div>
        <div style={{ fontSize: 10, color: SD }}>Order total: <strong style={{ color: "var(--vt-text)" }}>${total.toFixed(2)}</strong> · Agreement signed · $3 late fee if Payment 2 missed</div>
      </div>

      <div style={{ background: "rgba(0,204,102,0.04)", border: "0.5px solid rgba(0,204,102,0.15)", padding: "12px 16px", fontSize: 11, color: SD }}>
        🔒 Agreement signed · Reminders will be sent before {fmtDate(dueDate)}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep("agreement")} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "13px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
        <button
          onClick={handleConfirm}
          disabled={placing}
          style={{ flex: 1, background: placing ? G2 : S, color: "#000", border: "none", padding: "14px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: placing ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: placing ? 0.6 : 1, transition: "all .2s" }}
        >
          {placing ? "Processing..." : `Pay $${p1.toFixed(2)} Now →`}
        </button>
      </div>
    </div>
  );
}