import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SelectDrawer from "./SelectDrawer";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoCheckout() {
  const { productImg } = useOutletContext();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoError, setPromoError] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
        if (user) {
          const nameParts = (user.full_name || "").split(" ");
          setContact(prev => ({ ...prev, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" ") || "", email: user.email || "", phone: user.phone || "" }));
          const [items, addresses] = await Promise.all([
            base44.entities.CartItem.filter({ created_by: user.email }, "-created_date", 100),
            base44.entities.Address.filter({ created_by: user.email }, "-created_date", 20).catch(() => []),
          ]);
          setCartItems(items || []);
          setSavedAddresses(addresses || []);
        }
      } catch (e) {
        console.error("Failed to load cart:", e);
      } finally {
        setCartLoaded(true);
      }
    };
    load();
    document.title = "Checkout — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const freeShippingThreshold = parseInt(settings.free_shipping_threshold || "150");
  const subtotal = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const shipping = shippingMethod === "overnight" ? 28 : shippingMethod === "express" ? 12 : (subtotal >= freeShippingThreshold ? 0 : 12);
  const tax = Math.round(subtotal * 0.0887);
  const discount = promoApplied ? Math.round(subtotal * promoDiscount / 100) : 0;
  const total = subtotal + shipping + tax - discount;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const results = await base44.entities.PromoCode.filter({ code: promoCode.trim().toUpperCase() }, "-created_date", 1);
      const promo = results?.[0];
      if (!promo || promo.active === false) { setPromoError(true); setPromoApplied(false); return; }
      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) { setPromoError(true); setPromoApplied(false); return; }
      setPromoDiscount(promo.discountPercent);
      setPromoApplied(true);
      setPromoError(false);
    } catch { setPromoError(true); }
  };

  const setField = (k, v) => setContact(p => ({ ...p, [k]: v }));

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const genId = "VIGO-" + Math.floor(Math.random() * 90000 + 10000);
      await base44.entities.Order.create({
        orderId: genId,
        items: cartItems.map(i => `${i.productName} x${i.qty}`).join(", "),
        total: total,
        pieces: cartItems.reduce((s, i) => s + i.qty, 0),
        status: "Pending",
        shippingAddress: `${contact.address}, ${contact.city}, ${contact.state} ${contact.zip}`,
        userEmail: contact.email,
      });
      // Update stock
      for (const item of cartItems) {
        const prod = await base44.entities.Product.get(item.productId).catch(() => null);
        if (prod && typeof prod.stock === "number" && prod.stock > 0) {
          const newStock = Math.max(0, prod.stock - item.qty);
          await base44.entities.Product.update(item.productId, { stock: newStock, inStock: newStock > 0 }).catch(() => {});
        }
      }
      await Promise.all(cartItems.map(i => base44.entities.CartItem.delete(i.id)));
      setOrderId(genId);
      setOrderPlaced(true);
    } catch (e) {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartLoaded && !currentUser) {
    return (
      <div style={{ padding: "80px 32px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Sign In Required</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>Sign In to Checkout</h1>
        <p style={{ fontSize: 13, color: SD, marginBottom: 32, lineHeight: 1.8 }}>You need to be signed in to complete your purchase.</p>
        <button onClick={() => base44.auth.redirectToLogin(window.location.href)} style={btnP}>Sign In →</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={{ padding: "80px 32px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>Order Confirmed</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Thank You!</h1>
        <div style={{ fontSize: 12, color: SD, marginBottom: 8 }}>Your order has been placed successfully.</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: S, marginBottom: 32 }}>Order #{orderId}</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={btnP}>Continue Shopping</button>
          <button onClick={() => navigate("/track-order")} style={btnGhost}>Track Order →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Secure Checkout</div>
      <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 36 }}>Checkout</h1>

      <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 24 }}>
        {[["1","Contact & Shipping"],["2","Shipping Method"],["3","Payment"]].map(([n,l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexWrap: "wrap" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: parseInt(n) <= step ? S : G1, border: `.5px solid ${parseInt(n) <= step ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: parseInt(n) <= step ? "#000" : SD, flexShrink: 0 }}>{n}</div>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: parseInt(n) <= step ? "var(--vt-text)" : SD }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="vigo-checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
        <div>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {savedAddresses.length > 0 && (
                <SelectDrawer 
                  label="Use a Saved Address"
                  value=""
                  options={[{ value: "", label: "Select a saved address" }, ...savedAddresses.map((a, i) => ({ value: String(i), label: `${a.label}: ${a.street}, ${a.city}` }))]}
                  onChange={(v) => {
                    const sel = savedAddresses[parseInt(v)];
                    if (sel) setContact(prev => ({ ...prev, address: sel.street, city: sel.city, state: sel.state, zip: sel.zip }));
                  }}
                />
              )}
              <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name" value={contact.firstName} onChange={v => setField("firstName", v)} />
                <Field label="Last Name" value={contact.lastName} onChange={v => setField("lastName", v)} />
              </div>
              <Field label="Email" type="email" value={contact.email} onChange={v => setField("email", v)} />
              <Field label="Phone" type="tel" value={contact.phone} onChange={v => setField("phone", v)} />
              <Field label="Address" value={contact.address} onChange={v => setField("address", v)} />
              <div className="vigo-3col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Field label="City" value={contact.city} onChange={v => setField("city", v)} />
                <Field label="State" value={contact.state} onChange={v => setField("state", v)} />
                <Field label="ZIP" value={contact.zip} onChange={v => setField("zip", v)} />
              </div>
              <button onClick={() => {
                if (!contact.firstName.trim() || !contact.lastName.trim()) return alert("Please enter your full name.");
                if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email)) return alert("Please enter a valid email address.");
                if (!contact.address.trim() || !contact.city.trim() || !contact.state.trim() || !contact.zip.trim()) return alert("Please fill in your complete shipping address.");
                setStep(2);
              }} style={btnP}>Continue to Shipping →</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["standard","Standard","5–7 business days","Free","(qualifies)"],["express","Express","2–3 business days","$12",""],["overnight","Overnight","Next business day","$28",""]].map(([v,n,d,p,note]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 16, background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", cursor: "pointer" }}>
                  <input type="radio" name="ship" value={v} checked={shippingMethod === v} onChange={() => setShippingMethod(v)} style={{ accentColor: S }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 10, color: SD }}>{d}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p === "Free" ? "#0c6" : "var(--vt-text)" }}>{p} <span style={{ fontSize: 9, color: SD }}>{note}</span></span>
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
                  <div style={{ fontSize: 12, color: SD }}>Pay in 4 installments of <strong style={{ color: "var(--vt-text)" }}>${Math.round(total / 4)}</strong>. No interest.</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={btnGhost}>← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || cartItems.length === 0}
                  style={{ ...btnP, flex: 1, opacity: (placing || cartItems.length === 0) ? 0.6 : 1, cursor: (placing || cartItems.length === 0) ? "not-allowed" : "pointer" }}
                >
                  {placing ? "Placing Order..." : `Place Order — $${total}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: SD, marginBottom: 20 }}>Order Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {cartItems.length === 0 && <div style={{ fontSize: 11, color: SD, textAlign: "center", padding: "20px 0" }}>Your cart is empty</div>}
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, background: "var(--vt-card)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={item.productImage || productImg} alt="" style={{ width: 44, objectFit: "contain", opacity: .8 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{item.productName}</div>
                    <div style={{ fontSize: 9, color: SD }}>{item.size && `Size: ${item.size}`}{item.size && item.color ? " · " : ""}{item.color && `Color: ${item.color}`} · Qty: {item.qty}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
              <input value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(false); }} placeholder="Promo code" style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
              <button onClick={applyPromo} style={{ background: promoApplied ? "#0c6" : S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {promoApplied ? "✓ Applied" : "Apply"}
              </button>
            </div>
            {promoError && <div style={{ fontSize: 10, color: "#e03", marginBottom: 12 }}>Invalid or expired promo code.</div>}

            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Subtotal", `$${subtotal.toFixed(2)}`],["Shipping", shipping === 0 ? "Free 🎉" : `$${shipping}`],["NYC Tax (8.875%)", `$${tax}`],promoApplied ? [`Promo (${promoCode.toUpperCase()})`, `-$${discount}`] : null].filter(Boolean).map(([l,v]) => (
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
      <style>{`
        @media(max-width:900px){.vigo-checkout-grid{grid-template-columns:1fr !important;} .vigo-2col-sm,.vigo-3col-sm{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--vt-sub)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} placeholder={placeholder} value={value || ""} onChange={onChange ? e => onChange(e.target.value) : undefined} style={{ width: "100%", background: "var(--vt-card)", border: ".5px solid var(--vt-border)", color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "15px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "15px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };