import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

// Initialize Stripe - replace with your publishable key
const stripePromise = loadStripe(window.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function StripeApplePay({ amount, orderId, userEmail, shippingAddress, lineItems, onSuccess, onError }) {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initPaymentRequest = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      // Create Payment Request for Apple Pay / Google Pay
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'VIGONYC Order',
          amount: Math.round(amount * 100), // in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check if Apple Pay or Google Pay is available
      const result = await pr.canMakePayment();
      setCanMakePayment(result);
      setPaymentRequest(pr);

      // Handle payment method selection
      pr.on('paymentmethod', async (ev) => {
        setProcessing(true);
        setError(null);

        try {
          // Create Payment Intent on backend
          const intentRes = await base44.functions.invoke("createPaymentIntent", {
            amount,
            orderId,
            userEmail,
            shippingAddress,
            lineItems,
          });

          if (!intentRes.data.success) {
            ev.complete('fail');
            setError(intentRes.data.error || 'Failed to create payment');
            setProcessing(false);
            return;
          }

          const { clientSecret, paymentIntentId } = intentRes.data;

          // Confirm the payment with the payment method from Apple Pay
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            ev.complete('fail');
            setError(confirmError.message);
            setProcessing(false);
            onError?.(confirmError.message);
            return;
          }

          if (paymentIntent.status === 'requires_action') {
            // Handle 3D Secure if needed
            const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
            if (actionError) {
              ev.complete('fail');
              setError(actionError.message);
              setProcessing(false);
              onError?.(actionError.message);
              return;
            }
          }

          ev.complete('success');

          // Record transaction in our system
          const txnId = 'VPY-' + paymentIntentId.slice(-12).toUpperCase();
          
          await base44.functions.invoke("processPayment", {
            amount,
            method: "applepay",
            orderId,
            userEmail,
            stripePaymentIntentId: paymentIntentId,
          });

          onSuccess?.({
            txnId,
            cardLast4: ev.paymentMethod.card?.last4 || 'APAY',
            cardBrand: 'Apple Pay',
            paymentIntentId,
          });

        } catch (err) {
          ev.complete('fail');
          setError(err.message);
          onError?.(err.message);
        } finally {
          setProcessing(false);
        }
      });
    };

    initPaymentRequest();
  }, [amount, orderId, userEmail, shippingAddress, lineItems]);

  // Apple Pay not available
  if (canMakePayment === false) {
    return (
      <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 12, color: SD, marginBottom: 12 }}>
          Apple Pay is not available on this device or browser.
        </div>
        <div style={{ fontSize: 10, color: SD }}>
          Try using Safari on an Apple device with Apple Pay configured.
        </div>
      </div>
    );
  }

  // Loading state
  if (canMakePayment === null) {
    return (
      <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: SD }}>Checking Apple Pay availability...</div>
      </div>
    );
  }

  const handleClick = () => {
    if (paymentRequest) {
      paymentRequest.show();
    }
  };

  return (
    <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `.5px solid ${G3}` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={S}>
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        <div style={{ fontSize: 10, letterSpacing: 3, color: S, textTransform: "uppercase", fontWeight: 700 }}>Apple Pay</div>
        {canMakePayment?.applePay && (
          <span style={{ fontSize: 8, color: "#0c6", marginLeft: "auto", letterSpacing: 1 }}>✓ AVAILABLE</span>
        )}
      </div>

      {error && (
        <div style={{ background: "rgba(224,48,0,0.1)", border: "0.5px solid rgba(224,48,0,0.3)", padding: "10px 12px", marginBottom: 16, fontSize: 10, color: "#e03" }}>
          {error}
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: SD, marginBottom: 4 }}>Quick, secure checkout with Face ID or Touch ID</div>
        <div style={{ fontSize: 9, color: SD }}>Your payment info stays private</div>
      </div>

      <button
        onClick={handleClick}
        disabled={processing || !paymentRequest}
        style={{
          width: "100%",
          background: processing ? G1 : "#000",
          color: "#fff",
          border: "none",
          padding: "16px",
          fontSize: 14,
          fontWeight: 600,
          cursor: processing ? "not-allowed" : "pointer",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: processing ? 0.6 : 1,
          transition: "all 0.2s",
        }}
      >
        {processing ? (
          "Processing..."
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Pay ${amount.toFixed(2)}
          </>
        )}
      </button>

      <div style={{ fontSize: 8, color: SD, textAlign: "center", letterSpacing: 1, marginTop: 12 }}>
        Powered by Stripe · PCI Compliant
      </div>
    </div>
  );
}