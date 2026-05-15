import { useState, useEffect } from "react";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const topsData = [
  { size: "XS", chest: "32–34", waist: "26–28", hip: "34–36", length: "26" },
  { size: "S",  chest: "34–36", waist: "28–30", hip: "36–38", length: "27" },
  { size: "M",  chest: "38–40", waist: "32–34", hip: "40–42", length: "28" },
  { size: "L",  chest: "42–44", waist: "36–38", hip: "44–46", length: "29" },
  { size: "XL", chest: "46–48", waist: "40–42", hip: "48–50", length: "30" },
  { size: "XXL",chest: "50–52", waist: "44–46", hip: "52–54", length: "31" },
];

const bottomsData = [
  { size: "XS", waist: "26–28", hip: "34–36", inseam: "30" },
  { size: "S",  waist: "28–30", hip: "36–38", inseam: "30" },
  { size: "M",  waist: "32–34", hip: "40–42", inseam: "31" },
  { size: "L",  waist: "36–38", hip: "44–46", inseam: "32" },
  { size: "XL", waist: "40–42", hip: "48–50", inseam: "32" },
  { size: "XXL",waist: "44–46", hip: "52–54", inseam: "33" },
];

export default function SizeGuideModal({ open, onClose }) {
  const [category, setCategory] = useState("Tops");

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const cats = ["Tops", "Bottoms"];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.8)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(640px,95vw)", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 4 }}>✦ Fit Guide</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1, color: "var(--vt-text)" }}>Size Guide</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `.5px solid ${G3}`, flexShrink: 0 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              flex: 1, padding: "12px", background: "none", border: "none",
              borderBottom: category === c ? `2px solid ${S}` : "2px solid transparent",
              color: category === c ? "var(--vt-text)" : SD,
              fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
              fontWeight: category === c ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
            }}>{c}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ padding: "24px 28px", flex: 1 }}>
          <p style={{ fontSize: 11, color: SD, marginBottom: 20, lineHeight: 1.7 }}>All measurements in inches. Our fits are oversized by default — size down if you prefer a slimmer look.</p>
          {category === "Tops" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `.5px solid ${G3}` }}>
                  {["Size","Chest","Waist","Hip","Length"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD, fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topsData.map((row, i) => (
                  <tr key={row.size} style={{ borderBottom: `.5px solid ${G3}`, background: i % 2 === 0 ? "rgba(128,128,128,.04)" : "transparent" }}>
                    <td style={{ padding: "12px", fontWeight: 900, color: S, fontSize: 12 }}>{row.size}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.chest}"</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.waist}"</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.hip}"</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.length}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {category === "Bottoms" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `.5px solid ${G3}` }}>
                  {["Size","Waist","Hip","Inseam"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD, fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bottomsData.map((row, i) => (
                  <tr key={row.size} style={{ borderBottom: `.5px solid ${G3}`, background: i % 2 === 0 ? "rgba(128,128,128,.04)" : "transparent" }}>
                    <td style={{ padding: "12px", fontWeight: 900, color: S, fontSize: 12 }}>{row.size}</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.waist}"</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.hip}"</td>
                    <td style={{ padding: "12px", fontSize: 12, color: SD }}>{row.inseam}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(128,128,128,.06)", border: `.5px solid ${G3}` }}>
            <p style={{ fontSize: 10, color: SD, lineHeight: 1.7 }}>📏 How to measure: Chest — around the fullest part. Waist — around your natural waist. Hip — around the fullest part of your hips. Inseam — from crotch seam to ankle.</p>
          </div>
        </div>

        {/* Close button */}
        <div style={{ padding: "16px 28px", borderTop: `.5px solid ${G3}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: "100%", background: S, color: "#000", border: "none", padding: "14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            Close Size Guide
          </button>
        </div>
      </div>
    </>
  );
}