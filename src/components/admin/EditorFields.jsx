const S = "#C0C0C0";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const inputStyle = {
  width: "100%", background: G2, border: `.5px solid ${G3}`, color: "var(--vt-text)",
  padding: "12px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color .2s",
};
const labelStyle = { fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 };

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <input value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={inputStyle} onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

export function NumberField({ label, value, onChange }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <input type="number" value={value ?? ""} onChange={e => onChange(e.target.value)}
        style={inputStyle} onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

export function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function ToggleField({ label, sub, value, onChange }) {
  const checked = String(value) === "true";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
      <div style={{ paddingRight: 12 }}>
        <div style={{ fontSize: 11, color: "var(--vt-text)", marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 9, color: SD }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(checked ? "false" : "true")} title={checked ? "On" : "Off"}
        style={{ width: 44, height: 24, borderRadius: 12, background: checked ? S : G3, border: "none", cursor: "pointer", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: checked ? "#000" : "#888", transition: "left .2s" }} />
      </button>
    </div>
  );
}