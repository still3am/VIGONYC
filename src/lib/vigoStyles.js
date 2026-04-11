import { S, G3, SD, G2, G1, error, success } from "./vigoColors";
import { VIGO_CONFIG } from "./vigoConfig";

export const buttonStyles = {
  primary: {
    background: S,
    color: "#000",
    border: "none",
    padding: "14px 32px",
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: 900,
    cursor: "pointer",
    fontFamily: "inherit",
    minHeight: VIGO_CONFIG.touchTargetMin,
    transition: "background 0.2s",
  },
  outline: {
    background: "none",
    border: `.5px solid ${S}`,
    color: S,
    padding: "14px 32px",
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    minHeight: VIGO_CONFIG.touchTargetMin,
    transition: "all 0.2s",
  },
  ghost: {
    background: "none",
    border: `.5px solid ${G3}`,
    color: SD,
    padding: "11px 20px",
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    minHeight: VIGO_CONFIG.touchTargetMin,
    transition: "all 0.2s",
  },
  danger: {
    background: "none",
    border: `.5px solid ${error}`,
    color: error,
    padding: "11px 20px",
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    minHeight: VIGO_CONFIG.touchTargetMin,
  },
};

// Form field styles
export const formStyles = {
  label: {
    fontSize: 9,
    letterSpacing: 2,
    color: SD,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    background: G2,
    border: `.5px solid ${G3}`,
    color: "#fff",
    padding: "12px 16px",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    minHeight: VIGO_CONFIG.touchTargetMin,
    transition: "border-color 0.2s",
  },
  errorText: {
    fontSize: 10,
    color: error,
    marginTop: 4,
  },
};

// Grid utilities
export function getGridColumns(columns = 3) {
  return `repeat(${columns}, 1fr)`;
}

export const gridStyles = {
  gap: VIGO_CONFIG.gridGap,
};