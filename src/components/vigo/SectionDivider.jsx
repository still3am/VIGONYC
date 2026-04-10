export default function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 32px", margin: "8px 0" }}>
      <div style={{ flex: 1, height: .5, background: "#1a1a1a" }} />
      <div style={{ width: 7, height: 7, background: "#C0C0C0", transform: "rotate(45deg)", flexShrink: 0 }} />
      <span style={{ fontSize: 9, letterSpacing: 4, color: "#777", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ width: 7, height: 7, background: "#C0C0C0", transform: "rotate(45deg)", flexShrink: 0 }} />
      <div style={{ flex: 1, height: .5, background: "#1a1a1a" }} />
    </div>
  );
}