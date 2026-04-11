const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const sizes = [
  { size: "XS", chest: "32–34", waist: "26–28", hip: "34–36", length: "26" },
  { size: "S",  chest: "34–36", waist: "28–30", hip: "36–38", length: "27" },
  { size: "M",  chest: "38–40", waist: "32–34", hip: "40–42", length: "28" },
  { size: "L",  chest: "42–44", waist: "36–38", hip: "44–46", length: "29" },
  { size: "XL", chest: "46–48", waist: "40–42", hip: "48–50", length: "30" },
  { size: "XXL",chest: "50–52", waist: "44–46", hip: "52–54", length: "31" },
];

export default function SizeGuideModal({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.8)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(640px,95vw)", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 4 }}>✦ Fit Guide</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1 }}>Size Guide</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 11, color: SD, marginBottom: 20, lineHeight: 1.7 }}>All measurements in inches. Our fits are oversized by default — size down if you prefer a slimmer look.</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `.5px solid ${G3}` }}>
                {["Size","Chest","Waist","Hip","Length"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD, fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, i) => (
                <tr key={row.size} style={{ borderBottom: `.5px solid ${G3}`, background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 900, color: S, fontSize: 12 }}>{row.size}</td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#ccc" }}>{row.chest}"</td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#ccc" }}>{row.waist}"</td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#ccc" }}>{row.hip}"</td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#ccc" }}>{row.length}"</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(192,192,192,.05)", border: `.5px solid ${G3}` }}>
            <p style={{ fontSize: 10, color: SD, lineHeight: 1.7 }}>📏 How to measure: Chest — measure around the fullest part. Waist — measure around your natural waist. Hip — measure around the fullest part of your hips.</p>
          </div>
        </div>
      </div>
    </>
  );
}