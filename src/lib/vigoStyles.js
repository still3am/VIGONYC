import { S, G3 } from "./vigoColors";

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
  },
  ghost: {
    background: "none",
    border: `.5px solid ${G3}`,
    color: "#777",
    padding: "11px 20px",
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};