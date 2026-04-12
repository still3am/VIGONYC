const S = "#C0C0C0";

export default function SectionHeader({ title, sub, cta, onCta }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 3, height: 36, background: `linear-gradient(to bottom, ${S}, transparent)` }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1, color: "var(--vt-text)" }}>{title}</div>
          {sub && <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--vt-sub)", textTransform: "uppercase", marginTop: 3 }}>{sub}</div>}
        </div>
      </div>
      {cta && <button onClick={onCta} style={{ background: "none", border: "none", fontSize: 10, letterSpacing: 2, color: "var(--vt-sub)", textTransform: "uppercase", cursor: "pointer", borderBottom: ".5px solid var(--vt-border)", paddingBottom: 2 }}>{cta}</button>}
    </div>
  );
}