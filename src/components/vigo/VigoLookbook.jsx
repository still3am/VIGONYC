const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const shots = [
  { caption: "Chrome V Tee — Lower East Side", opacity: 1 },
  { caption: "NYC Cargo Pant — Brooklyn Bridge", opacity: 0.4 },
  { caption: "Silver Label Hoodie — SoHo", opacity: 0.6 },
  { caption: "5-Panel Cap — Uptown", opacity: 0.45 },
  { caption: "V Jogger — Flatbush", opacity: 0.7 },
  { caption: "Chrome Tech Jacket — Midtown", opacity: 0.5 },
];

const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";

export default function VigoLookbook({ nav }) {
  return (
    <div style={{ padding: "48px 32px" }}>
      <div style={{ marginBottom: 48, borderBottom: `.5px solid ${G3}`, paddingBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ SS25 — Visual Archive</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>Lookbook</h1>
      </div>
      <div style={{ columns: 2, gap: 8 }} className="vigo-lookbook-cols">
        {shots.map((s, i) => (
          <div key={i} style={{ breakInside: "avoid", marginBottom: 8, background: G1, border: `.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
            <div style={{ paddingBottom: i % 3 === 0 ? "130%" : "80%", position: "relative" }}>
              <img src={PRODUCT_IMG} alt={s.caption} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: s.opacity, padding: 32 }} />
            </div>
            <div style={{ padding: "16px 20px", borderTop: `.5px solid ${G3}` }}>
              <div style={{ fontSize: 10, color: "#ccc" }}>{s.caption}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button onClick={() => nav("shop")} style={{ background: S, color: "#000", border: "none", padding: "16px 48px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" }}>
          Shop the Look
        </button>
      </div>
      <style>{`@media(max-width:600px){.vigo-lookbook-cols{columns:1 !important;}}`}</style>
    </div>
  );
}