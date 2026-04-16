import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { sanitize, sanitizeObject } from "@/lib/sanitize";
import VigopayForm from "./VigopayForm";
import VigoSplit from "./VigoSplit";

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
  const [loyalty, setLoyalty] = useState(null);
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoError, setPromoError] = useState("");
  const [promoId, setPromoId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState({});
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  // Points redemption
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const promoAttemptsRef = useRef(0);
  const promoLockedUntilRef = useRef(null);

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
          // Load loyalty
          base44.functions.invoke("loyaltyPoints", { action: "get" }).then(res => {
            setLoyalty(res.data.loyalty);
          }).catch(() => {});
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
  const shippingCost = shippingMethod === "overnight" ? 28 : shippingMethod === "express" ? 12 : (subtotal >= freeShippingThreshold ? 0 : 8);
  const tax = parseFloat((subtotal * 0.0887).toFixed(2));
  const discount = promoApplied ? Math.round(subtotal * promoDiscount / 100) : 0;
  // Points: 100 pts = $1
  const maxRedeemable = loyalty ? Math.min(loyalty.points, Math.floor((subtotal + shippingCost + tax - discount) * 100 / 100) * 100) : 0;
  const pointsDiscount = usePoints ? parseFloat((Math.min(pointsToRedeem, maxRedeemable) / 100).toFixed(2)) : 0;
  const total = parseFloat(Math.max(0, subtotal + shippingCost + tax - discount - pointsDiscount).toFixed(2));

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    if (promoLockedUntilRef.current && Date.now() < promoLockedUntilRef.current) {
      setPromoError("Too many attempts. Please wait 60 seconds.");
      return;
    }
    promoAttemptsRef.current += 1;
    if (promoAttemptsRef.current > 5) {
      promoLockedUntilRef.current = Date.now() + 60000;
      promoAttemptsRef.current = 0;
      setPromoError("Too many attempts. Please wait 60 seconds.");
      return;
    }
    try {
      const code = sanitize(promoCode.trim().toUpperCase());
      const results = await base44.entities.PromoCode.filter({ code }, "-created_date", 1);
      const promo = results?.[0];
      if (!promo || promo.active === false) { setPromoError("Invalid or expired promo code."); setPromoApplied(false); return; }
      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) { setPromoError("This promo code has expired."); setPromoApplied(false); return; }
      if (promo.minimumOrder && subtotal < promo.minimumOrder) {
        setPromoError(`This code requires a minimum order of $${promo.minimumOrder}.`);
        setPromoApplied(false);
        return;
      }
      if (promo.usageLimit && (promo.usageCount || 0) >= promo.usageLimit) {
        setPromoError("This promo code has reached its usage limit.");
        setPromoApplied(false);
        return;
      }
      setPromoDiscount(promo.discountPercent);
      setPromoId(promo.id);
      setPromoApplied(true);
      setPromoError("");
      promoAttemptsRef.current = 0;
    } catch { setPromoError("Failed to validate promo code."); }
  };

  const setField = (k, v) => {
    setContact(p => ({ ...p, [k]: v }));
    if (fieldErrors[k]) setFieldErrors(prev => ({ ...prev, [k]: "" }));
  };

  const validateStep1 = () => {
    const errors = {};
    if (!contact.firstName.trim()) errors.firstName = "Required";
    if (!contact.lastName.trim()) errors.lastName = "Required";
    if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email)) errors.email = "Valid email required";
    if (!contact.address.trim()) errors.address = "Required";
    if (!contact.city.trim()) errors.city = "Required";
    if (!contact.state.trim()) errors.state = "Required";
    if (!contact.zip.trim()) errors.zip = "Required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (txnId, cardLast4, cardBrand) => {
    setPlacing(true);
    const safeContact = sanitizeObject(contact);
    try {
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const genId = "VGO-" + suffix + String(Date.now()).slice(-4);
      const itemsJson = JSON.stringify(cartItems.map(i => ({ productId: i.productId, name: i.productName, size: i.size, color: i.color, qty: i.qty, price: i.price, image: i.productImage })));
      const loyaltyPts = Math.floor(total * 5);
      const loyaltyPointsUsed = usePoints ? Math.min(pointsToRedeem, maxRedeemable) : 0;

      await base44.entities.Order.create({
        orderId: genId,
        items: cartItems.map(i => `${sanitize(i.productName)}${i.size ? ` (${i.size})` : ""} x${i.qty}`).join(", "),
        itemsJson,
        total,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingCost,
        tax,
        discount,
        pointsDiscount,
        loyaltyPointsUsed,
        pieces: cartItems.reduce((s, i) => s + i.qty, 0),
        status: "Pending",
        shippingAddress: `${safeContact.address}, ${safeContact.city}, ${safeContact.state} ${safeContact.zip}`,
        shippingName: `${safeContact.firstName} ${safeContact.lastName}`,
        userEmail: safeContact.email,
        shippingMethod,
        promoCode: promoApplied ? promoCode.toUpperCase() : "",
        isGift,
        giftMessage: isGift ? sanitize(giftMessage) : "",
        loyaltyPointsEarned: loyaltyPts,
        paymentMethod: payMethod,
        paymentStatus: "captured",
        paymentRef: txnId,
        cardLast4: cardLast4 || "",
        cardBrand: cardBrand || ""
      });

      // Capture payment
      if (txnId && txnId.startsWith("VPY-")) {
        await base44.functions.invoke("capturePayment", { txnId }).catch(() => {});
      }

      // Update stock + soldCount
      for (const item of cartItems) {
        const prod = await base44.entities.Product.get(item.productId).catch(() => null);
        if (prod) {
          const updates = {};
          if (typeof prod.stock === "number" && prod.stock > 0) {
            const newStock = Math.max(0, prod.stock - item.qty);
            updates.stock = newStock;
            updates.inStock = newStock > 0;
          }
          updates.soldCount = (prod.soldCount || 0) + item.qty;
          await base44.entities.Product.update(item.productId, updates).catch(() => {});
        }
      }

      // Increment promo usage count
      if (promoApplied && promoId) {
        base44.entities.PromoCode.update(promoId, { usageCount: (await base44.entities.PromoCode.get(promoId).catch(() => ({ usageCount: 0 }))).usageCount + 1 }).catch(() => {});
      }

      await Promise.all(cartItems.map(i => base44.entities.CartItem.delete(i.id)));

      // Redeem points if used
      if (loyaltyPointsUsed > 0) {
        base44.functions.invoke("loyaltyPoints", { action: "redeemPoints", data: { points: loyaltyPointsUsed } }).catch(() => {});
      }

      // Award purchase points
      base44.functions.invoke("loyaltyPoints", { action: "addPoints", data: { points: loyaltyPts, reason: `Order ${genId}` } }).catch(() => {});

      window.dispatchEvent(new CustomEvent("vigo:cart-update", { detail: { delta: -cartItems.reduce((s, i) => s + i.qty, 0) } }));
      setPlacedOrderData({ orderId: genId, total, loyaltyPts, cardLast4, cardBrand, payMethod });
      setOrderPlaced(true);
    } catch (e) {
      console.error(e);
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

  if (cartLoaded && cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{ padding: "80px 32px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16, opacity: .2 }}>∅</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Your cart is empty</h1>
        <button onClick={() => navigate("/shop")} style={btnP}>Shop Now</button>
      </div>
    );
  }

  if (orderPlaced) {
    const { orderId, total: tot, loyaltyPts, cardLast4, cardBrand, payMethod: pm } = placedOrderData;
    return (
      <div style={{ padding: "80px 32px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20, color: "#0c6", animation: "vigo-confirm-pop 0.5s ease" }}>✓</div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>Order Confirmed</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Thank You!</h1>
        <div style={{ fontSize: 12, color: SD, marginBottom: 8 }}>Your order has been placed successfully.</div>
        <div style={{ background: "var(--vt-card)", border: ".5px solid var(--vt-border)", borderTop: "2px solid #C0C0C0", padding: "20px 24px", marginTop: 24, textAlign: "left", maxWidth: 480, margin: "16px auto 24px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 12 }}>Order Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: SD }}>Order</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>#{orderId}</span>
          </div>
          {cardLast4 && cardBrand && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: SD }}>Payment</span>
              <span style={{ fontSize: 11 }}>VIGOPAY · {cardBrand} ···· {cardLast4}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: SD }}>Shipping</span>
            <span style={{ fontSize: 11, textTransform: "capitalize" }}>{shippingMethod}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: ".5px solid var(--vt-border)", paddingTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#C0C0C0" }}>${tot}</span>
          </div>
          {isGift && <div style={{ fontSize: 10, color: "#fa0", marginTop: 8 }}>🎁 Gift order</div>}
        </div>
        <div style={{ background: "rgba(0,204,102,0.06)", border: "0.5px solid rgba(0,204,102,0.2)", padding: "14px 20px", margin: "0 auto 20px", maxWidth: 480, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>✦</span>
          <div>
            <div style={{ fontSize: 11, color: "#0c6", fontWeight: 700 }}>+{(loyaltyPts || 0).toLocaleString()} points earned</div>
            <div style={{ fontSize: 9, color: "var(--vt-sub)", letterSpacing: 1 }}>Added to your Exchange balance</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={btnP}>Continue Shopping</button>
          <button onClick={() => navigate(`/track-order?order=${orderId}`)} style={btnGhost}>Track Order →</button>
        </div>
        <style>{`@keyframes vigo-confirm-pop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "clamp(24px,5vw,48px) clamp(16px,4vw,32px)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Secure Checkout</div>
      <h1 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 900, letterSpacing: -2, marginBottom: 36 }}>Checkout</h1>

      <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: `.5px solid ${G3}`, paddingBottom: 24 }}>
        {[["1","Contact & Shipping"],["2","Shipping Method"],["3","Payment"]].map(([n,l]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexWrap: "wrap" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: parseInt(n) < step ? "#0c6" : parseInt(n) === step ? S : G1, border: `.5px solid ${parseInt(n) <= step ? (parseInt(n) < step ? "#0c6" : S) : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: parseInt(n) <= step ? "#000" : SD, flexShrink: 0 }}>
              {parseInt(n) < step ? "✓" : n}
            </div>
            <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: parseInt(n) <= step ? "var(--vt-text)" : SD }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="vigo-checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr clamp(300px,35%,400px)", gap: "clamp(24px,4vw,48px)" }}>
        <div>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {savedAddresses.length > 0 && (
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Use a Saved Address</div>
                  <select onChange={e => {
                    const sel = savedAddresses[parseInt(e.target.value)];
                    if (sel) setContact(prev => ({ ...prev, address: sel.street, city: sel.city, state: sel.state, zip: sel.zip }));
                  }} style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                    <option value="">— Select a saved address —</option>
                    {savedAddresses.map((a, i) => <option key={a.id} value={i}>{a.label}: {a.street}, {a.city}</option>)}
                  </select>
                </div>
              )}
              <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name" value={contact.firstName} onChange={v => setField("firstName", v)} error={fieldErrors.firstName} />
                <Field label="Last Name" value={contact.lastName} onChange={v => setField("lastName", v)} error={fieldErrors.lastName} />
              </div>
              <Field label="Email" type="email" value={contact.email} onChange={v => setField("email", v)} error={fieldErrors.email} />
              <Field label="Phone" type="tel" value={contact.phone} onChange={v => setField("phone", v)} />
              <Field label="Address" value={contact.address} onChange={v => setField("address", v)} error={fieldErrors.address} />
              <div className="vigo-3col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Field label="City" value={contact.city} onChange={v => setField("city", v)} error={fieldErrors.city} />
                <Field label="State" value={contact.state} onChange={v => setField("state", v)} error={fieldErrors.state} />
                <Field label="ZIP" value={contact.zip} onChange={v => setField("zip", v)} error={fieldErrors.zip} />
              </div>
              <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, marginTop: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} style={{ accentColor: S, width: 16, height: 16 }} />
                  <span style={{ fontSize: 12, color: "var(--vt-text)" }}>This is a gift</span>
                </label>
                {isGift && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Gift Message (optional, max 200 chars)</div>
                    <textarea value={giftMessage} onChange={e => setGiftMessage(e.target.value)} rows={3} maxLength={200} placeholder="Write a personal message for the recipient..." style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                    <div style={{ fontSize: 9, color: SD, textAlign: "right", marginTop: 4 }}>{giftMessage.length}/200</div>
                  </div>
                )}
              </div>
              <button onClick={() => { if (validateStep1()) setStep(2); }} style={btnP}>Continue to Shipping →</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["standard","Standard","5–7 business days", subtotal >= freeShippingThreshold ? "Free" : "$8",""],["express","Express","2–3 business days","$12",""],["overnight","Overnight","Next business day","$28",""]].map(([v,n,d,p,note]) => (
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
              {/* Points redemption */}
              {loyalty && loyalty.points >= 1000 && (
                <div style={{ background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.2)", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: usePoints ? 12 : 0 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vt-text)" }}>Use Loyalty Points</div>
                      <div style={{ fontSize: 9, color: SD }}>Balance: {loyalty.points.toLocaleString()} pts = ${(loyalty.points / 100).toFixed(2)}</div>
                    </div>
                    <button onClick={() => setUsePoints(!usePoints)} style={{ width: 44, height: 24, borderRadius: 12, background: usePoints ? S : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 3, left: usePoints ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: usePoints ? "#000" : SD, transition: "left .2s" }} />
                    </button>
                  </div>
                  {usePoints && (
                    <div>
                      <input type="range" min={0} max={maxRedeemable} step={100} value={pointsToRedeem} onChange={e => setPointsToRedeem(Number(e.target.value))} style={{ width: "100%", accentColor: S, marginBottom: 8 }} />
                      <div style={{ fontSize: 10, color: S, fontWeight: 700 }}>Using {pointsToRedeem.toLocaleString()} pts = -${(pointsToRedeem / 100).toFixed(2)} off</div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["card","💳 Card"],["applepay","🍎 Apple Pay"],["vigosplit","◈ VIGOSPLIT"]].map(([v,l]) => (
                  <button key={v} onClick={() => setPayMethod(v)} style={{ padding: "10px 20px", background: payMethod === v ? S : G1, color: payMethod === v ? "#000" : SD, border: `.5px solid ${payMethod === v ? S : G3}`, fontSize: 10, cursor: "pointer", fontWeight: payMethod === v ? 900 : 400, fontFamily: "inherit", letterSpacing: 1 }}>{l}</button>
                ))}
              </div>
              {payMethod === "card" && (
                <VigopayForm
                  amount={total}
                  orderId={Math.random().toString(36).slice(2, 6).toUpperCase() + String(Date.now()).slice(-4)}
                  userEmail={contact.email}
                  onSuccess={(data) => handlePlaceOrder(data.txnId, data.cardLast4, data.cardBrand)}
                  onError={() => {}}
                />
              )}
              {payMethod === "applepay" && (
                <div style={{ background: G1, border: `.5px solid ${G3}`, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🍎</div>
                  <div style={{ fontSize: 12, color: SD }}>Tap Pay to complete with Apple Pay.</div>
                  <button onClick={() => handlePlaceOrder("APL-" + Date.now(), "****", "Apple Pay")} style={{ ...btnP, marginTop: 16, width: 200, margin: "16px auto 0", display: "block" }}>Complete with Apple Pay</button>
                </div>
              )}
              {payMethod === "vigosplit" && total >= 150 && (
                <VigoSplit
                  total={total}
                  onSuccess={(data) => handlePlaceOrder(data.txnId, data.cardLast4, data.cardBrand)}
                />
              )}
              {payMethod === "vigosplit" && total < 150 && (
                <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", fontSize: 12, color: SD }}>
                  VIGOSPLIT requires a minimum order of <strong style={{ color: "var(--vt-text)" }}>$150</strong>. Your current total is <strong style={{ color: "var(--vt-text)" }}>${total.toFixed(2)}</strong>.
                </div>
              )}
              {payMethod === "card" && (
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} style={btnGhost}>← Back</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
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

            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              <input value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(""); }} placeholder="Promo code" style={{ flex: 1, background: "var(--vt-card)", border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} onKeyDown={e => e.key === "Enter" && applyPromo()} />
              <button onClick={applyPromo} style={{ background: promoApplied ? "#0c6" : S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {promoApplied ? "✓ Applied" : "Apply"}
              </button>
            </div>
            {promoError && <div style={{ fontSize: 10, color: "#e03", marginBottom: 12 }}>{promoError}</div>}

            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[
                ["Subtotal", `$${subtotal.toFixed(2)}`],
                ["Shipping", shippingCost === 0 ? "Free" : `$${shippingCost}`],
                ["NYC Tax (8.875%)", `$${tax}`],
                promoApplied ? [`Promo (${promoCode.toUpperCase()})`, `-$${discount}`] : null,
                usePoints && pointsToRedeem > 0 ? [`Points (${pointsToRedeem.toLocaleString()} pts)`, `-$${pointsDiscount.toFixed(2)}`] : null
              ].filter(Boolean).map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: SD }}>{l}</span>
                  <span style={{ fontSize: 11, color: l.startsWith("Promo") || l.startsWith("Points") ? "#0c6" : l === "Shipping" && shippingCost === 0 ? "#0c6" : "var(--vt-text)" }}>{v}</span>
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
        @media(max-width:900px){
          .vigo-checkout-grid{grid-template-columns:1fr !important;}
          .vigo-checkout-grid > div:last-child { order: -1; }
          .vigo-2col-sm,.vigo-3col-sm{grid-template-columns:1fr !important;}
        }
      `}</style>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--vt-sub)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} placeholder={placeholder} value={value || ""} onChange={onChange ? e => onChange(e.target.value) : undefined} style={{ width: "100%", background: "var(--vt-card)", border: `.5px solid ${error ? "#e03" : "var(--vt-border)"}`, color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
      {error && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "15px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "15px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };