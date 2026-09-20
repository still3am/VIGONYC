export const S = "#C0C0C0";
export const G1 = "var(--vt-bg)";
export const G2 = "var(--vt-card)";
export const G3 = "var(--vt-border)";
export const SD = "var(--vt-sub)";

export const inputStyle = { width: "100%", background: G1, border: `0.5px solid ${G3}`, color: "var(--vt-text)", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
export const btnPrimary = { background: S, color: "#000", border: "none", padding: "9px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
export const btnGhost = { background: "none", border: `0.5px solid ${G3}`, color: "var(--vt-text)", padding: "9px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };

export function Empty({ msg }) {
  return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>{msg}</div>;
}