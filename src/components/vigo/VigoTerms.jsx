const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const SECTIONS = [
  { title: "Effective Date", body: "These Terms of Service are effective as of January 1, 2025." },
  { title: "Overview", body: "By purchasing from VIGONYC, you agree to the following terms. VIGONYC is a limited-run streetwear brand based in New York City. All sales are final unless otherwise specified below." },
  { title: "Sales Policy", body: "All drop sales are strictly final. Due to the limited and exclusive nature of our drops, we do not offer refunds or exchanges on drop items. No restocks, no exceptions. Regular collection items are subject to our standard return policy." },
  { title: "Returns & Exchanges", body: "Regular (non-drop) items may be returned within 14 days of delivery if unworn, unwashed, and with original tags attached. Drop and limited-edition items are final sale and not eligible for return or exchange. To initiate a return, visit our Returns page." },
  { title: "Shipping Policy", body: "We ship within the United States only. Standard shipping takes 5–7 business days. Expedited options are available at checkout. VIGONYC is not responsible for delays caused by carriers or customs. Free shipping on orders over $150." },
  { title: "Payment Terms", body: "All payments are processed securely at checkout. We accept major credit cards, Apple Pay, and Klarna. Prices are listed in USD and are subject to applicable New York State sales tax." },
  { title: "Intellectual Property", body: "All designs, graphics, logos, and content on the VIGONYC website and products are the intellectual property of VIGONYC / BYSMITH LLC. Unauthorized reproduction is prohibited." },
  { title: "Governing Law", body: "These terms are governed by the laws of the State of New York. Any disputes shall be resolved in the courts of New York County." },
];

export default function VigoTerms() {
  return (
    <div style={{ padding: "64px 32px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Legal</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 12 }}>Terms of Service</h1>
      <div style={{ fontSize: 10, color: SD, marginBottom: 36 }}>Last Updated: April 2026</div>
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