import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.NewsletterSubscriber.create({
        email: email.trim().toLowerCase(),
        source: "coming_soon",
        active: true,
      });
      setSubmitted(true);
      toast.success("You're on the list.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: G1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      color: "var(--vt-text)",
      padding: "clamp(24px,6vw,60px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(192,192,192,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* Top chrome line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, #888, #E8E8E8, #C0C0C0, #E8E8E8, #888, transparent)",
      }} />

      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: "center", position: "relative", zIndex: 1 }}>
        <img
          src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png"
          alt="VIGONYC"
          style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 20, opacity: 0.9 }}
        />
        <div style={{ fontSize: 9, letterSpacing: 6, color: S, textTransform: "uppercase" }}>VIGONYC</div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(192,192,192,0.05)",
          border: "0.5px solid rgba(192,192,192,0.15)",
          padding: "6px 16px",
          marginBottom: 28,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: S, animation: "cs-pulse 1.8s infinite" }} />
          <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Something New Is Coming</span>
        </div>

        <h1 style={{
          fontSize: "clamp(52px,10vw,96px)",
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 0.9,
          marginBottom: 24,
          background: "linear-gradient(135deg, #888 0%, #C0C0C0 40%, #E8E8E8 60%, #C0C0C0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          COMING<br />SOON
        </h1>

        <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
          The next drop is loading. NYC streetwear, built different.<br />
          Be first to know when we go live.
        </p>

        {submitted ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(0,204,102,0.06)",
            border: "0.5px solid rgba(0,204,102,0.25)",
            padding: "16px 28px",
          }}>
            <span style={{ fontSize: 16, color: "#0c6" }}>✓</span>
            <span style={{ fontSize: 11, color: "#0c6", letterSpacing: 2, textTransform: "uppercase" }}>You're on the list</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, maxWidth: 440, margin: "0 auto" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: `0.5px solid ${G3}`,
                borderRight: "none",
                color: "var(--vt-text)",
                padding: "14px 18px",
                fontSize: 12,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? G3 : "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8, #C0C0C0)",
                color: "#000",
                border: "none",
                padding: "14px 24px",
                fontSize: 8,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 900,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "..." : "Notify Me"}
            </button>
          </form>
        )}

        {/* Decorative dividers */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "48px auto 0", maxWidth: 320 }}>
          <div style={{ flex: 1, height: "0.5px", background: G3 }} />
          <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>VIGONYC</span>
          <div style={{ flex: 1, height: "0.5px", background: G3 }} />
        </div>

        <div style={{ marginTop: 24, fontSize: 9, color: SD, letterSpacing: 2 }}>
          NYC — SS25 · Limited Units · No Restocks
        </div>
      </div>

      {/* Bottom chrome line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, #555, transparent)",
      }} />

      <style>{`
        @keyframes cs-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
      `}</style>
    </div>
  );
}