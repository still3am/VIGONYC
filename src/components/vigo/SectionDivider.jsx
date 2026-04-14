export default function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 32px", margin: "8px auto", justifyContent: "center", maxWidth: 900 }}>
      <div style={{ flex: 1, height: .5, background: "var(--vt-border)" }} />
      <div style={{ width: 7, height: 7, background: "#C0C0C0", transform: "rotate(45deg)", flexShrink: 0 }} />
      <span style={{ fontSize: 9, letterSpacing: 4, color: "var(--vt-sub)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ width: 7, height: 7, background: "#C0C0C0", transform: "rotate(45deg)", flexShrink: 0 }} />
      <div style={{ flex: 1, height: .5, background: "var(--vt-border)" }} />
    </div>
  );
}