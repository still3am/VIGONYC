import { TextField, TextAreaField, NumberField, SelectField, ToggleField } from "@/components/admin/EditorFields";
import { SECTIONS } from "@/components/admin/adminContentConfig";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

function renderField(f, draft, setField) {
  const props = { key: f.key, label: f.label, value: draft[f.key], onChange: v => setField(f.key, v) };
  if (f.type === "textarea") return <TextAreaField {...props} />;
  if (f.type === "number") return <NumberField {...props} />;
  if (f.type === "select") return <SelectField {...props} options={f.options} />;
  if (f.type === "toggle") return <ToggleField {...props} />;
  return <TextField {...props} />;
}

export default function EditorPanel({ draft, setField, activePage, setActivePage, activeGroup, setActiveGroup }) {
  const pages = Object.entries(SECTIONS);
  const def = SECTIONS[activePage];
  const group = def.groups[activeGroup] || def.groups[0];
  return (
    <div>
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: G1 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 14px 10px" }}>
          {pages.map(([id, p]) => (
            <button key={id} onClick={() => setActivePage(id)} style={{ padding: "8px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: activePage === id ? 900 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", background: activePage === id ? S : "transparent", color: activePage === id ? "#000" : SD, border: `.5px solid ${activePage === id ? S : G3}` }}>{p.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 14px 10px", borderBottom: `.5px solid ${G3}` }}>
          {def.groups.map((g, i) => (
            <button key={g.title} onClick={() => setActiveGroup(i)} style={{ padding: "8px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", fontWeight: activeGroup === i ? 700 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", background: "none", color: activeGroup === i ? "var(--vt-text)" : SD, border: "none", borderBottom: activeGroup === i ? `1.5px solid ${S}` : "1.5px solid transparent" }}>{g.title}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "18px 14px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        {group.note && <div style={{ fontSize: 10, color: SD, background: "var(--vt-card)", border: `.5px solid ${G3}`, padding: "10px 12px", lineHeight: 1.6 }}>{group.note}</div>}
        {group.fields.map(f => renderField(f, draft, setField))}
      </div>
    </div>
  );
}