import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

function CheckoutForm({ cartItems, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // { discountPercent }
  const [promoError, setPromoError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [shipMethod, setShipMethod] = useState("standard");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const subtotal = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const shipping = shipMethod === "overnight" ? 28 : shipMethod === "express" ? 12 : subtotal >= 150 ? 0 : 12;
  const tax = Math.round(subtotal * 0.0887);
  const discount = promoApplied ? Math.round(subtotal * (promoApplied.discountPercent / 100)) : 0;
  const total = subtotal + shipping + tax - discount;

  const applyPromo = async () => {
    setPromoError("");
    const res = await base44.functions.invoke("validatePromo", { code: promoCode, subtotal });
    if (res.data?.valid) {
      setPromoApplied({ discountPercent: res.data.discountPercent });
    } else {
      setPromoError(res.data?.error || "Invalid promo code");
      setPromoApplied(null);
    }
  };

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;
    setPlacing(true);

    try {
      // Get Stripe PaymentIntent
      const intentRes = await base44.functions.invoke("createPaymentIntent", { amount: total });
      const { clientSecret } = intentRes.data;

      let paymentMethodId = null;
      if (payMethod === "card") {
        const cardEl = elements.getElement(CardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({ type: "card", card: cardEl });
        if (error) { toast.error(error.message); setPlacing(false); return; }
        paymentMethodId = paymentMethod.id;

        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethodId });
        if (confirmError) { toast.error(confirmError.message); setPlacing(false); return; }
      }

      const genId = "VIGO-" + Math.floor(Math.random() * 90000 + 10000);
      await base44.entities.Order.create({
        orderId: genId,
        items: cartItems.map(i => `${i.productName} x${i.qty}`).join(", "),
        total,
        subtotal,
        tax,
        shippingCost: shipping,
        shippingMethod: shipMethod,
        pieces: cartItems.reduce((s, i) => s + i.qty, 0),
        status: "Pending",
        customerEmail: form.email,
        customerName: `${form.firstName} ${form.lastName}`,
        shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
        paymentMethod: payMethod,
      });

      await Promise.all(cartItems.map(i => base44.entities.CartItem.delete(i.id)));
      toast.success(`Order ${genId} placed! Check your email for confirmation.`);
      navigate(`/order-confirmation/${genId}`);
    } catch (e) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Secure Checkout</div>
      <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 36 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 24, flexWrap: "wrap" }}>
        {[["1", "Contact & Shipping"], ["2", "Shipping Method"], ["3", "Payment"]].map(([n, l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: parseInt(n) <= step ? S : G1, border: `.5px solid ${parseInt(n) <= step ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: parseInt(n) <= step ? "#000" : SD, flexShrink: 0 }}>{n}</div>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: parseInt(n) <= step ? "var(--vt-text)" : SD }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="vigo-checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
        <div>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name" value={form.firstName} onChange={v => setField("firstName", v)} />
                <Field label="Last Name" value={form.lastName} onChange={v => setField("lastName", v)} />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={v => setField("email", v)} />
              <Field label="Phone" type="tel" value={form.phone} onChange={v => setField("phone", v)} />
              <Field label="Address" value={form.address} onChange={v => setField("address", v)} />
              <div className="vigo-3col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Field label="City" value={form.city} onChange={v => setField("city", v)} />
                <Field label="State" value={form.state} onChange={v => setField("state", v)} />
                <Field label="ZIP" value={form.zip} onChange={v => setField("zip", v)} />
              </div>
              <button onClick={() => { if (validateStep1()) setStep(2); }} style={btnP}>Continue to Shipping →</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["standard", "Standard", "5–7 business days", subtotal >= 150 ? "Free" : "$12"], ["express", "Express", "2–3 business days", "$12"], ["overnight", "Overnight", "Next business day", "$28"]].map(([v, n, d, p]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 16, background: G1, border: `.5px solid ${shipMethod === v ? S : G3}`, padding: "20px 24px", cursor: "pointer" }}>
                  <input type="radio" name="ship" value={v} checked={shipMethod === v} onChange={() => setShipMethod(v)} style={{ accentColor: S }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 10, color: SD }}>{d}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p === "Free" ? "#0c6" : "var(--vt-text)" }}>{p}</span>
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
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["card", "💳 Card"]].map(([v, l]) => (
                  <button key={v} onClick={() => setPayMethod(v)} style={{ padding: "10px 20px", background: payMethod === v ? S : G1, color: payMethod === v ? "#000" : SD, border: `.5px solid ${payMethod === v ? S : G3}`, fontSize: 10, cursor: "pointer", fontWeight: payMethod === v ? 900 : 400, fontFamily: "inherit", letterSpacing: 1 }}>{l}</button>
                ))}
              </div>

              <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 12 }}>Card Details</div>
                <CardElement options={{ style: { base: { fontSize: "14px", color: "var(--vt-text)", fontFamily: "Inter, sans-serif", "::placeholder": { color: SD } } } }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={btnGhost}>← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || cartItems.length === 0 || !stripe}
                  style={{ ...btnP, flex: 1, opacity: (placing || cartItems.length === 0) ? 0.6 : 1, cursor: (placing || cartItems.length === 0) ? "not-allowed" : "pointer" }}
                >
                  {placing ? "Placing Order..." : `Place Order — $${total}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: SD, marginBottom: 20 }}>Order Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {cartItems.length === 0 && <div style={{ fontSize: 11, color: SD, textAlign: "center", padding: "20px 0" }}>Your cart is empty</div>}
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, background: G2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={item.productImage} alt="" loading="lazy" decoding="async" style={{ width: 44, objectFit: "contain", opacity: .8 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{item.productName}</div>
                    <div style={{ fontSize: 9, color: SD }}>{item.size && `Size: ${item.size}`}{item.size && item.color ? " · " : ""}{item.color && `Color: ${item.color}`} · Qty: {item.qty}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              <input value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(""); }} placeholder="Promo code" style={{ flex: 1, background: G2, border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
              <button onClick={applyPromo} style={{ background: promoApplied ? "#0c6" : S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {promoApplied ? "✓ Applied" : "Apply"}
              </button>
            </div>
            {promoError && <div style={{ fontSize: 10, color: "#e03", marginBottom: 12 }}>{promoError}</div>}

            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Shipping", shipping === 0 ? "Free 🎉" : `$${shipping}`], ["NYC Tax (8.875%)", `$${tax}`], promoApplied ? ["Promo Discount", `-$${discount}`] : null].filter(Boolean).map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: SD }}>{l}</span>
                  <span style={{ fontSize: 11, color: l.startsWith("Promo") ? "#0c6" : l === "Shipping" && shipping === 0 ? "#0c6" : "var(--vt-text)" }}>{v}</span>
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
    </div>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} value={value || ""} onChange={onChange ? e => onChange(e.target.value) : undefined} style={{ width: "100%", background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

export default function VigoCheckout() {
  const { productImg } = useOutletContext();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me().catch(() => null);
      if (user) {
        const items = await base44.entities.CartItem.filter({ created_by: user.email }, "-created_date", 100).catch(() => []);
        setCartItems(items);
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm cartItems={cartItems} />
      </Elements>
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "15px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid var(--vt-border)", color: SD, padding: "15px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };