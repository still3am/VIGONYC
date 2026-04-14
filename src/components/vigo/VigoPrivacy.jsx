import { useSiteSettings } from "@/hooks/useSiteSettings";

const S = "#C0C0C0";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoPrivacy() {
  const { settings } = useSiteSettings();

  const SECTIONS = [
    { title: "What Data We Collect", body: "We collect your name, email address, shipping address, and order history when you make a purchase or create an account. We may also collect device and browsing information for analytics purposes." },
    { title: "How It Is Used", body: "Your data is used for order fulfillment, shipping, customer service communications, and (with your consent) marketing emails about drops and new arrivals. We do not use your data for any other purpose." },
    { title: "Data Storage", body: "All data is stored securely via the Base44 platform, which employs industry-standard encryption and security practices. Your data is stored in the United States." },
    { title: "No Third-Party Data Selling", body: "VIGONYC does not sell, rent, or trade your personal information to any third parties. Ever. Period." },
    { title: "Cookie Usage", body: "We use functional cookies only — those necessary to keep you logged in and maintain your cart. We do not use advertising or tracking cookies." },
    { title: "Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time. To submit a data request, contact us at " + settings.contact_email + "." },
  ];

  return (
    <div style={{ padding: "64px 32px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Legal</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 48 }}>Privacy Policy</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {SECTIONS.map((s, i) => (
          <div key={i} style={{ borderTop: `.5px solid ${G3}`, padding: "28px 0" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 12 }}>{String(i + 1).padStart(2, "0")} — {s.title}</div>
            <p style={{ fontSize: 13, color: SD, lineHeight: 1.9 }}>{s.body}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 24, marginTop: 16 }}>
        <div style={{ fontSize: 10, color: SD }}>© 2025 VIGONYC / BYSMITH LLC. All rights reserved.</div>
      </div>
    </div>
  );
}