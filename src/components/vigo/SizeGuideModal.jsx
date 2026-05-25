import { useState, useEffect } from "react";
import { X, Ruler } from "lucide-react";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
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

const fitTips = [
  { label: "Oversized", desc: "Size up 1–2 sizes for a relaxed, streetwear look." },
  { label: "True to Size", desc: "Order your usual size for a regular fit." },
  { label: "Slim Fit", desc: "Size down for a more tailored silhouette." },
];

const measureGuide = [
  { icon: "📏", label: "Chest", desc: "Measure around the fullest part of your chest, keeping tape level." },
  { icon: "〰️", label: "Waist", desc: "Measure around your natural waistline, just above your hips." },
  { icon: "🍑", label: "Hip", desc: "Measure around the fullest part of your hips and seat." },
  { icon: "📐", label: "Inseam", desc: "From the crotch seam down to your ankle bone." },
];

export default function SizeGuideModal({ open, onClose }) {
  const [category, setCategory] = useState("Tops");
  const [tab, setTab] = useState("chart");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }} />

      {/* Modal — slides up from bottom on mobile, centered on desktop */}
      <div className="size-guide-modal" style={{
        position: "fixed", zIndex: 900,
        background: G1, display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Silver top accent */}
        <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)", flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Ruler size={18} style={{ color: S }} />
            <div>
              <div style={{ fontSize: 7, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 2 }}>VIGONYC</div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, color: "var(--vt-text)" }}>Size Guide</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: G2, border: `.5px solid ${G3}`, color: SD, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Top-level tabs: Chart / How to Measure */}
        <div style={{ display: "flex", borderBottom: `.5px solid ${G3}`, flexShrink: 0 }}>
          {[{ key: "chart", label: "Size Chart" }, { key: "measure", label: "How to Measure" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "13px 8px", background: "none", border: "none",
              borderBottom: tab === t.key ? `2px solid ${S}` : "2px solid transparent",
              color: tab === t.key ? "var(--vt-text)" : SD,
              fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
              fontWeight: tab === t.key ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
              transition: "all .15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {tab === "chart" && (
            <>
              {/* Category selector */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["Tops", "Bottoms"].map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    flex: 1, padding: "10px", background: category === c ? S : G2,
                    border: `.5px solid ${category === c ? S : G3}`,
                    color: category === c ? "#000" : SD, fontSize: 9, letterSpacing: 2,
                    textTransform: "uppercase", fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit", transition: "all .15s", borderRadius: 2,
                  }}>{c}</button>
                ))}
              </div>

              {/* Fit tip */}
              <div style={{ background: G2, border: `.5px solid ${G3}`, borderRadius: 2, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>💡</span>
                <p style={{ fontSize: 11, color: SD, lineHeight: 1.7, margin: 0 }}>
                  All measurements in <strong style={{ color: "var(--vt-text)" }}>inches</strong>. Vigo fits run <strong style={{ color: "var(--vt-text)" }}>oversized by default</strong> — size down for a slimmer look, stay true for the street fit.
                </p>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto", border: `.5px solid ${G3}`, borderRadius: 2, marginBottom: 20 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 340 }}>
                  <thead>
                    <tr style={{ background: G2 }}>
                      {(category === "Tops" ? ["Size", "Chest", "Waist", "Hip", "Length"] : ["Size", "Waist", "Hip", "Inseam"]).map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: SD, fontWeight: 600, borderBottom: `.5px solid ${G3}`, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(category === "Tops" ? topsData : bottomsData).map((row, i) => (
                      <tr key={row.size} style={{ borderBottom: `.5px solid ${G3}`, background: i % 2 === 0 ? "rgba(128,128,128,.03)" : "transparent", transition: "background .15s" }}>
                        <td style={{ padding: "14px", fontWeight: 900, color: S, fontSize: 13, whiteSpace: "nowrap" }}>{row.size}</td>
                        {category === "Tops" ? (
                          <>
                            <td style={tdStyle}>{row.chest}"</td>
                            <td style={tdStyle}>{row.waist}"</td>
                            <td style={tdStyle}>{row.hip}"</td>
                            <td style={tdStyle}>{row.length}"</td>
                          </>
                        ) : (
                          <>
                            <td style={tdStyle}>{row.waist}"</td>
                            <td style={tdStyle}>{row.hip}"</td>
                            <td style={tdStyle}>{row.inseam}"</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fit preference */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 10 }}>Choose Your Fit</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {fitTips.map(tip => (
                    <div key={tip.label} style={{ display: "flex", gap: 12, padding: "12px 14px", background: G2, border: `.5px solid ${G3}`, borderRadius: 2 }}>
                      <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: 1.5, color: S, textTransform: "uppercase", whiteSpace: "nowrap", paddingTop: 2, minWidth: 80 }}>{tip.label}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.6 }}>{tip.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "measure" && (
            <>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, marginBottom: 24 }}>
                Use a flexible measuring tape. Have a friend help for best results. Measure snug but not tight.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {measureGuide.map((m, i) => (
                  <div key={m.label} style={{ display: "flex", gap: 16, padding: "16px 18px", background: G2, border: `.5px solid ${G3}`, borderRadius: 2 }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vt-text)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: SD, lineHeight: 1.7 }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(192,192,192,.06)", border: `.5px solid ${G3}`, borderRadius: 2, padding: "16px 18px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 10 }}>Pro Tips</div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Wear minimal clothing when measuring for accuracy.", "Keep tape parallel to the floor for horizontal measurements.", "Don't suck in — breathe naturally.", "When between sizes, size up for a comfortable fit."].map(tip => (
                    <li key={tip} style={{ fontSize: 11, color: SD, lineHeight: 1.6 }}>{tip}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: `.5px solid ${G3}`, flexShrink: 0, display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: S, color: "#000", border: "none", padding: "14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", borderRadius: 2 }}>
            Done
          </button>
        </div>
      </div>

      <style>{`
        .size-guide-modal {
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(680px, 95vw);
          max-height: 90vh;
          border: .5px solid var(--vt-border);
          border-radius: 4px;
        }
        @media (max-width: 640px) {
          .size-guide-modal {
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            width: 100% !important;
            max-height: 92vh;
            border-radius: 16px 16px 0 0;
            border-left: none;
            border-right: none;
            border-bottom: none;
          }
        }
      `}</style>
    </>
  );
}

const tdStyle = { padding: "14px", fontSize: 12, color: "var(--vt-sub)", whiteSpace: "nowrap" };