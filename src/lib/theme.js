export const SILVER = "#C0C0C0";
export const VT_SUB = "var(--vt-sub)";
export const VT_BG = "var(--vt-bg)";
export const VT_CARD = "var(--vt-card)";
export const VT_BORDER = "var(--vt-border)";
export const VT_TEXT = "var(--vt-text)";

export const btnPrimary = {
  background: SILVER,
  color: "#000",
  border: "none",
  padding: "14px 32px",
  fontSize: 10,
  letterSpacing: 3,
  textTransform: "uppercase",
  fontWeight: 900,
  cursor: "pointer",
  fontFamily: "inherit",
};

export const btnOutline = {
  background: "none",
  border: `.5px solid ${SILVER}`,
  color: SILVER,
  padding: "14px 32px",
  fontSize: 10,
  letterSpacing: 3,
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const btnGhost = {
  background: "none",
  border: ".5px solid var(--vt-border)",
  color: "var(--vt-sub)",
  padding: "12px 20px",
  fontSize: 9,
  letterSpacing: 2,
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "inherit",
};