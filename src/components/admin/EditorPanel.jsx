import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TextField, TextAreaField, NumberField, SelectField, ToggleField } from "@/components/admin/EditorFields";
import { SECTIONS } from "@/components/admin/adminContentConfig";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

function renderField(f, draft, saved, setField) {
  const props = { label: f.label, value: draft[f.key], onChange: v => setField(f.key, v) };
  let comp;
  if (f.type === "textarea") comp = <TextAreaField {...props} rows={f.rows} />;
  else if (f.type === "number") comp = <NumberField {...props} />;
  else if (f.type === "select") comp = <SelectField {...props} options={f.options} />;
  else if (f.type === "toggle") comp = <ToggleField {...props} />;
  else comp = <TextField {...props} />;
  const isDirty = String(draft[f.key] ?? "") !== String(saved[f.key] ?? "");
  return (
    <div key={f.key} style={{ borderLeft: `2px solid ${isDirty ? S : "transparent"}`, paddingLeft: 12, transition: "border-color .15s" }}>
      {comp}
    </div>
  );
}

function SectionCard({ group, draft, saved, setField }) {
  const [open, setOpen] = useState(true);
  const dirtyCount = group.fields.filter(f => String(draft[f.key] ?? "") !== String(saved[f.key] ?? "")).length;
  return (
    <div style={{ background: G1, border: `.5px solid ${G3}`, marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--vt-text)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: .3, textAlign: "left" }}>
          {group.title}
          {dirtyCount > 0 && <span style={{ fontSize: 8, color: S, background: G2, border: `.5px solid ${G3}`, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{dirtyCount}</span>}
        </span>
        <ChevronDown size={15} style={{ color: SD, transform: open ? "none" : "rotate(-90deg)", transition: "transform .2s", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: "4px 14px 16px", display: "flex", flexDirection: "column", gap: 14, borderTop: `.5px solid ${G3}` }}>
          {group.note && <div style={{ fontSize: 10, color: SD, background: G2, border: `.5px solid ${G3}`, padding: "10px 12px", lineHeight: 1.6, marginTop: 10 }}>{group.note}</div>}
          {group.fields.map(f => renderField(f, draft, saved, setField))}
        </div>
      )}
    </div>
  );
}

export default function EditorPanel({ draft, saved, setField, activePage }) {
  const def = SECTIONS[activePage];
  return (
    <div style={{ padding: "8px 14px 32px" }}>
      {def.groups.map(g => <SectionCard key={g.title} group={g} draft={draft} saved={saved} setField={setField} />)}
    </div>
  );
}