import { useState } from "react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

export default function VigoCheckout({ nav, items, subtotal, productImg }) {
  const [step, setStep] = useState(1);
  const shipping = subtotal >= 150 ? 0 : 12;

  return (
    <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Checkout</div>
      <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>Complete Your Order</h1>

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 24 }}>
        {[["1","Information"],["2","Shipping"],["3","Payment"]].map(([n,l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: parseInt(n) <= step ? S : G1, border: `.5px solid ${parseInt(n) <= step ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: parseInt(n) <= step ? "#000" : SD }}>{n}</div>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: parseInt(n) <= step ? "#fff" : SD }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }} className="vigo-2col">
        {/* Form */}
        <div>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name" />
                <Field label="Last Name" />
              </div>
              <Field label="Email Address" type="email" />
              <Field label="Phone (optional)" type="tel" />
              <Field label="Address" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Field label="City" />
                <Field label="State" />
                <Field label="ZIP" />
              </div>
              <button onClick={() => setStep(2)} style={btnP}>Continue to Shipping</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[["Standard","5-7 business days","Free"],["Express","2-3 business days","$12"],["Overnight","Next day","$28"]].map(([n,d,p]) => (
                <label key={n} style={{ display: "flex", alignItems: "center", gap: 16, background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", cursor: "pointer" }}>
                  <input type="radio" name="shipping" defaultChecked={n === "Standard"} style={{ accentColor: S }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 10, color: SD }}>{d}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p === "Free" ? "#0c6" : "#fff" }}>{p}</span>
                </label>
              ))}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(1)} style={btnGhost}>Back</button>
                <button onClick={() => setStep(3)} style={{ ...btnP, flex: 1 }}>Continue to Payment</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Card Number" placeholder="1234 5678 9012 3456" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Expiry" placeholder="MM / YY" />
                <Field label="CVV" placeholder="123" />
              </div>
              <Field label="Name on Card" />
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={btnGhost}>Back</button>
                <button onClick={() => nav("home")} style={{ ...btnP, flex: 1 }}>Place Order — ${subtotal + shipping}</button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "28px 24px", height: "fit-content" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: SD, marginBottom: 20 }}>Order Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={productImg} alt="" style={{ width: 44, objectFit: "contain", opacity: .8 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#fff" }}>{item.name}</div>
                  <div style={{ fontSize: 9, color: SD }}>Qty: {item.qty}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }}>${item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Subtotal", `$${subtotal}`],["Shipping", shipping === 0 ? "Free" : `$${shipping}`],["Tax (NYC)", `$${Math.round(subtotal * 0.08)}`]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: SD }}>{l}</span>
                <span style={{ fontSize: 11, color: v === "Free" ? "#0c6" : "#fff" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `.5px solid ${G3}`, paddingTop: 12, marginTop: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: S }}>${subtotal + shipping + Math.round(subtotal * 0.08)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.vigo-2col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Field({ label, type = "text", placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#777", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input type={type} placeholder={placeholder} style={{ width: "100%", background: "#0a0a0a", border: ".5px solid #1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "16px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" };
const btnGhost = { background: "none", border: ".5px solid #1a1a1a", color: "#777", padding: "16px 24px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" };