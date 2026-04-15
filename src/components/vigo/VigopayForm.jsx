import { useState } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const BRAND_ICONS = {
  Visa: "V",
  Mastercard: "M",
  Amex: "A",
  Discover: "D",
  Unknown: "?"
};

export default function VigopayForm({ amount, orderId, userEmail, onSuccess, onError }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const detectBrand = (num) => {
    const clean = num.replace(/\s/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    if (/^6/.test(clean)) return "Discover";
    return "Unknown";
  };

  const formatCardNumber = (val) => {
    const clean = val.replace(/\s/g, "");
    return clean.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length >= 2) return clean.slice(0, 2) + "/" + clean.slice(2, 4);
    return clean;
  };

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 19) {
      setCardNumber(formatted);
      setErrors(prev => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    setErrors(prev => ({ ...prev, expiry: "" }));
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(val);
    setErrors(prev => ({ ...prev, cvv: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const cleanCard = cardNumber.replace(/\s/g, "");

    if (!cleanCard || cleanCard.length < 13) newErrors.cardNumber = "Invalid card number";
    if (!expiry || expiry.length < 5) newErrors.expiry = "Invalid expiry";
    if (!cvv || cvv.length < 3) newErrors.cvv = "Invalid CVV";
    if (!name.trim()) newErrors.name = "Cardholder name required";
    if (!zip.trim() || zip.length < 5) newErrors.zip = "Valid ZIP required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setProcessing(true);
    try {
      const res = await base44.functions.invoke("processPayment", {
        amount,
        method: "card",
        cardData: {
          number: cardNumber.replace(/\s/g, ""),
          expiry,
          cvv,
          name
        },
        billingZip: zip,
        orderId,
        userEmail
      });

      if (res.data.success) {
        onSuccess(res.data);
      } else {
        setErrors({ submit: res.data.error });
        onError(res.data.error);
      }
    } catch (e) {
      setErrors({ submit: e.message });
      onError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const brand = detectBrand(cardNumber);
  const brandColor = brand !== "Unknown" ? S : SD;

  return (
    <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>
        <div style={{ fontSize: 18, color: S }}>🔒</div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: S, textTransform: "uppercase", fontWeight: 700 }}>VIGOPAY</div>
      </div>

      {/* Brand icons row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {["Visa", "Mastercard", "Amex", "Discover"].map(b => (
          <div key={b} style={{ width: 48, height: 32, background: brand === b ? S : G1, border: `.5px solid ${brand === b ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: brand === b ? "#000" : SD, transition: "all .2s" }}>
            {BRAND_ICONS[b]}
          </div>
        ))}
      </div>

      {/* Card number */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Card Number</label>
        <input
          value={cardNumber}
          onChange={handleCardChange}
          placeholder="4111 1111 1111 1111"
          style={{
            width: "100%",
            background: G1,
            border: `.5px solid ${errors.cardNumber ? "#e03" : G3}`,
            color: "var(--vt-text)",
            padding: "12px 14px",
            fontSize: 13,
            fontFamily: "monospace",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        {errors.cardNumber && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{errors.cardNumber}</div>}
      </div>

      {/* Expiry & CVV */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Expiry</label>
          <input
            value={expiry}
            onChange={handleExpiryChange}
            placeholder="MM / YY"
            style={{
              width: "100%",
              background: G1,
              border: `.5px solid ${errors.expiry ? "#e03" : G3}`,
              color: "var(--vt-text)",
              padding: "12px 14px",
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          {errors.expiry && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{errors.expiry}</div>}
        </div>
        <div>
          <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>CVV</label>
          <input
            value={cvv}
            onChange={handleCvvChange}
            placeholder="•••"
            type="password"
            style={{
              width: "100%",
              background: G1,
              border: `.5px solid ${errors.cvv ? "#e03" : G3}`,
              color: "var(--vt-text)",
              padding: "12px 14px",
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          {errors.cvv && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{errors.cvv}</div>}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Cardholder Name</label>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
          placeholder="John Doe"
          style={{
            width: "100%",
            background: G1,
            border: `.5px solid ${errors.name ? "#e03" : G3}`,
            color: "var(--vt-text)",
            padding: "12px 14px",
            fontSize: 12,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        {errors.name && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{errors.name}</div>}
      </div>

      {/* Billing ZIP */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Billing ZIP</label>
        <input
          value={zip}
          onChange={e => { setZip(e.target.value.slice(0, 5)); setErrors(prev => ({ ...prev, zip: "" })); }}
          placeholder="10001"
          style={{
            width: "100%",
            background: G1,
            border: `.5px solid ${errors.zip ? "#e03" : G3}`,
            color: "var(--vt-text)",
            padding: "12px 14px",
            fontSize: 12,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        {errors.zip && <div style={{ fontSize: 9, color: "#e03", marginTop: 4 }}>{errors.zip}</div>}
      </div>

      {/* Submit error */}
      {errors.submit && <div style={{ fontSize: 10, color: "#e03", background: "#e0300a", padding: "10px 12px", marginBottom: 16 }}>{errors.submit}</div>}

      {/* Pay button */}
      <button
        onClick={handleSubmit}
        disabled={processing}
        style={{
          width: "100%",
          background: processing ? G1 : "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8, #C0C0C0)",
          color: "#000",
          border: "none",
          padding: "15px",
          fontSize: 9,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontWeight: 900,
          cursor: processing ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: processing ? 0.6 : 1,
          marginBottom: 12
        }}
      >
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>

      {/* Footer */}
      <div style={{ fontSize: 8, color: SD, textAlign: "center", letterSpacing: 1 }}>256-bit SSL · PCI Compliant · Powered by VIGOPAY</div>
    </div>
  );
}