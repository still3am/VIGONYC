import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const stripePromise = loadStripe("pk_test_51QTL4QHvKzHjDVfGo9bJTHYfk0e3nA4wVQQa1h6sAr7nJd9Jq9z5PnD4gQWqQXpQvKqnDZzEwGpOBDpMpG2k00vq00BtFkqLQC");

function CardForm({ amount, orderId, userEmail, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [zip, setZip] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment method from card element
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: { address: { postal_code: zip } }
      });

      if (pmError) {
        setError(pmError.message);
        onError(pmError.message);
        setProcessing(false);
        return;
      }

      // Send to backend
      const res = await base44.functions.invoke("processPayment", {
        amount,
        method: "card",
        cardData: { paymentMethodId: paymentMethod.id },
        billingZip: zip,
        orderId,
        userEmail
      });

      if (res.data.success) {
        onSuccess(res.data);
      } else {
        setError(res.data.error);
        onError(res.data.error);
      }
    } catch (e) {
      setError(e.message);
      onError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: G2, border: `.5px solid ${G3}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <CardElement options={{
          style: {
            base: { color: "var(--vt-text)", fontSize: "14px", fontFamily: "inherit" },
            invalid: { color: "#e03" }
          }
        }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Billing ZIP</label>
        <input value={zip} onChange={e => setZip(e.target.value.slice(0, 5))} placeholder="10001" style={{ width: "100%", background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)", padding: "12px 14px", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
      </div>
      {error && <div style={{ fontSize: 10, color: "#e03", background: "#e0300a", padding: "10px 12px", marginBottom: 16 }}>{error}</div>}
      <button type="submit" disabled={processing || !stripe || !elements || !zip.trim()} style={{ width: "100%", background: !zip.trim() ? G1 : processing ? G1 : "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8, #C0C0C0)", color: "#000", border: "none", padding: "15px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: !zip.trim() || processing ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: !zip.trim() || processing ? 0.5 : 1, transition: "all 0.2s" }}>
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
      <div style={{ fontSize: 8, color: SD, textAlign: "center", letterSpacing: 1, marginTop: 12 }}>Secured by Stripe · PCI Compliant</div>
    </form>
  );
}

export default function VigopayForm({ amount, orderId, userEmail, onSuccess, onError }) {

  return (
    <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>
        <div style={{ fontSize: 18, color: S }}>🔒</div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: S, textTransform: "uppercase", fontWeight: 700 }}>Secure Checkout</div>
      </div>
      <Elements stripe={stripePromise}>
        <CardForm amount={amount} orderId={orderId} userEmail={userEmail} onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}