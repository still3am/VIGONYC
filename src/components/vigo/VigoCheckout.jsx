import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { calculateShipping, calculateTax, calculateDiscount, validatePromoCode, validateEmail } from "@/lib/vigoConfig";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

export default function VigoCheckout() {
  const { cartItems, subtotal, productImg } = useOutletContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });
  const [formError, setFormError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(subtotal, promoApplied);
  const total = subtotal + shipping + tax - discount;

  const applyPromo = () => {
    if (validatePromoCode(promoCode)) { setPromoApplied(true); setPromoError(false); }
    else { setPromoError(true); setPromoApplied(false); }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    try {
      await base44.functions.invoke('createOrder', {
        items: cartItems,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        paymentMethod: payMethod,
        promoCode: promoApplied ? 'VIGONYC10' : null
      });
      setOrderSuccess(true);
      setTimeout(() => navigate('/account'), 2000);
    } catch (err) {
      setFormError('Order failed: ' + err.message);
    }
    setLoading(false);
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
      setFormError("All fields required");
      return false;
    }
    if (!validateEmail(formData.email)) {
      setFormError("Invalid email");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) setStep(2);
  };

  return (
    <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Secure Checkout</div>
      <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 36 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 24 }}>
        {[["1","Contact & Shipping"],["2","Shipping Method"],["3","Payment"]].map(([n,l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexWrap: "wrap" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: parseInt(n) <= step ? S : G1, border: `.5px solid ${parseInt(n) <= step ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: parseInt(n) <= step ? "#000" : SD, flexShrink: 0 }}>{n}</div>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: parseInt(n) <= step ? "#fff" : SD }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="vigo-checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
        {/* Left: form */}
        <div>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name" />
                <Field label="Last Name" />
              </div>
              <Field label="Email" type="email" />
              <Field label="Phone" type="tel" />
              <Field label="Address" />
              <div className="vigo-3col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Field label="City" />
                <Field label="State" />
                <Field label="ZIP" />
              </div>
              <button onClick={() => setStep(2)} style={btnP}>Continue to Shipping →</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["standard","Standard","5–7 business days","Free","(qualifies)"],["express","Express","2–3 business days","$12",""],["overnight","Overnight","Next business day","$28",""]].map(([v,n,d,p,note]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 16, background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", cursor: "pointer" }}>
                  <input type="radio" name="ship" value={v} defaultChecked={v === "standard"} style={{ accentColor: S }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 10, color: SD }}>{d}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p === "Free" ? "#0c6" : "#fff" }}>{p} <span style={{ fontSize: 9, color: SD }}>{note}</span></span>
                </label>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={() => setStep(1)} style={btnGhost}>← Back</button>
                <button onClick={() => setStep(3)} style={{ ...btnP, flex: 1 }}>Continue to Payment →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Payment methods */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["card","💳 Card"],["applepay","🍎 Apple Pay"],["klarna","🟡 Klarna"]].map(([v,l]) => (
                  <button key={v} onClick={() => setPayMethod(v)} style={{ padding: "10px 20px", background: payMethod === v ? S : G1, color: payMethod === v ? "#000" : SD, border: `.5px solid ${payMethod === v ? S : G3}`, fontSize: 10, cursor: "pointer", fontWeight: payMethod === v ? 900 : 400, fontFamily: "inherit", letterSpacing: 1 }}>{l}</button>
                ))}
              </div>
              {payMethod === "card" && (
                <>
                  <Field label="Card Number" placeholder="1234 5678 9012 3456" />
                  <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Expiry" placeholder="MM / YY" />
                    <Field label="CVV" placeholder="•••" />
                  </div>
                  <Field label="Name on Card" />
                </>
              )}
              {payMethod === "applepay" && (
                <div style={{ background: G1, border: `.5px solid ${G3}`, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🍎</div>
                  <div style={{ fontSize: 12, color: SD }}>Tap Pay to complete with Apple Pay.</div>
                </div>
              )}
              {payMethod === "klarna" && (
                <div style={{ background: G1, border: `.5px solid ${G3}`, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🟡 Klarna</div>
                  <div style={{ fontSize: 12, color: SD }}>Pay in 4 installments of <strong style={{ color: "#fff" }}>${Math.round(total / 4)}</strong>. No interest.</div>
                </div>
              )}
              {orderSuccess ? (
                <div style={{ background: '#0c6', color: '#000', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>✓ Order Placed!</div>
                  <div style={{ fontSize: 11, marginTop: 8 }}>Redirecting to account...</div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} style={btnGhost}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} style={{ ...btnP, flex: 1, opacity: loading ? 0.6 : 1 }}>{loading ? 'Processing...' : `Place Order — $${total}`}</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: SD, marginBottom: 20 }}>Order Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={productImg} alt="" style={{ width: 44, objectFit: "contain", opacity: .8 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#fff" }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: SD }}>{item.meta} · Qty: {item.qty}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>${item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
              <input value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(false); }} placeholder="Promo code" style={{ flex: 1, background: "#111", border: `.5px solid ${G3}`, borderRight: "none", color: "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
              <button onClick={applyPromo} style={{ background: promoApplied ? "#0c6" : S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {promoApplied ? "✓ Applied" : "Apply"}
              </button>
            </div>
            {promoError && <div style={{ fontSize: 10, color: "#e03", marginBottom: 12 }}>Invalid promo code.</div>}

            {/* Totals */}
            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Subtotal", `$${subtotal}`],["Shipping", shipping === 0 ? "Free 🎉" : `$${shipping}`],["NYC Tax (8.875%)", `$${tax}`],promoApplied ? ["Promo (VIGONYC10)", `-$${discount}`] : null].filter(Boolean).map(([l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: SD }}>{l}</span>
                  <span style={{ fontSize: 11, color: l.startsWith("Promo") ? "#0c6" : l === "Shipping" && shipping === 0 ? "#0c6" : "#fff" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `.5px solid ${G3}`, paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: S }}>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.vigo-checkout-grid{grid-template-columns:1fr !important;} .vigo-2col-sm,.vigo-3col-sm{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#777", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} placeholder={placeholder} value={value || ""} onChange={onChange} style={{ width: "100%", background: "#0a0a0a", border: ".5px solid #1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "15px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid #1a1a1a", color: "#777", padding: "15px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };