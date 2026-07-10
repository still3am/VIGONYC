import { useState } from "react";
import { ChevronDown, Trash2, RotateCcw, EyeOff } from "lucide-react";
import { TextField, TextAreaField, NumberField, SelectField, ToggleField } from "@/components/admin/EditorFields";
import { SECTIONS } from "@/components/admin/adminContentConfig";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

function FieldRow({ f, draft, saved, setField, hidden, onToggleHidden }) {
  const isDirty = String(draft[f.key] ?? "") !== String(saved[f.key] ?? "");

  if (hidden) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 12px", background: G2, border: `.5px solid ${G3}`, borderLeft: `2px solid ${G3}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <EyeOff size={13} style={{ color: SD, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{f.label}</div>
            <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>Hidden from page</div>
          </div>
        </div>
        <button onClick={() => onToggleHidden(f.key, false)} style={{ background: "none", border: `.5px solid ${G3}`, color: S, padding: "6px 10px", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <RotateCcw size={11} /> Restore
        </button>
      </div>
    );
  }

  const props = { label: f.label, value: draft[f.key], onChange: v => setField(f.key, v) };
  let comp;
  if (f.type === "textarea") comp = <TextAreaField {...props} rows={f.rows} />;
  else if (f.type === "number") comp = <NumberField {...props} />;
  else if (f.type === "select") comp = <SelectField {...props} options={f.options} />;
  else if (f.type === "toggle") comp = <ToggleField {...props} />;
  else comp = <TextField {...props} />;

  return (
    <div style={{ position: "relative", borderLeft: `2px solid ${isDirty ? S : "transparent"}`, paddingLeft: 12, transition: "border-color .15s" }}>
      {f.deletable && (
        <button onClick={() => onToggleHidden(f.key, true)} title="Delete from page" style={{ position: "absolute", top: 0, right: 0, background: "none", border: "none", color: SD, cursor: "pointer", padding: 2, display: "flex", opacity: 0.45 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#e03"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0.45; e.currentTarget.style.color = SD; }}>
          <Trash2 size={12} />
        </button>
      )}
      {comp}
    </div>
  );
}

function SectionCard({ group, draft, saved, setField, hidden, onToggleHiddenSection, hiddenFields, onToggleFieldHidden }) {
  const [open, setOpen] = useState(true);
  const dirtyCount = group.fields.filter(f => String(draft[f.key] ?? "") !== String(saved[f.key] ?? "")).length;

  if (hidden) {
    return (
      <div style={{ background: G1, border: `.5px solid ${G3}`, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <EyeOff size={14} style={{ color: SD, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: .3, textDecoration: "line-through", color: SD }}>{group.title}</span>
            <span style={{ fontSize: 8, color: SD, border: `.5px solid ${G3}`, padding: "1px 6px", borderRadius: 8 }}>Hidden</span>
          </div>
          <button onClick={() => onToggleHiddenSection(group.id, false)} style={{ background: "none", border: `.5px solid ${G3}`, color: S, padding: "6px 10px", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <RotateCcw size={11} /> Restore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: G1, border: `.5px solid ${G3}`, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, paddingRight: 6 }}>
        <button onClick={() => setOpen(!open)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--vt-text)", textAlign: "left" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: .3 }}>
            {group.title}
            {dirtyCount > 0 && <span style={{ fontSize: 8, color: S, background: G2, border: `.5px solid ${G3}`, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{dirtyCount}</span>}
          </span>
          <ChevronDown size={15} style={{ color: SD, transform: open ? "none" : "rotate(-90deg)", transition: "transform .2s", flexShrink: 0 }} />
        </button>
        {group.deletable && (
          <button onClick={() => { if (window.confirm(`Delete the "${group.title}" section from the page? You can restore it anytime.`)) onToggleHiddenSection(group.id, true); }} title="Delete section" style={{ background: "none", border: "none", color: SD, cursor: "pointer", padding: 6, display: "flex", opacity: 0.45 }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#e03"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.45; e.currentTarget.style.color = SD; }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>
      {open && (
        <div style={{ padding: "4px 14px 16px", display: "flex", flexDirection: "column", gap: 14, borderTop: `.5px solid ${G3}` }}>
          {group.note && <div style={{ fontSize: 10, color: SD, background: G2, border: `.5px solid ${G3}`, padding: "10px 12px", lineHeight: 1.6, marginTop: 10 }}>{group.note}</div>}
          {group.fields.map(f => (
            <FieldRow key={f.key} f={f} draft={draft} saved={saved} setField={setField} hidden={hiddenFields.includes(f.key)} onToggleHidden={onToggleFieldHidden} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorPanel({ draft, saved, setField, activePage, hiddenSections = [], hiddenFields = [], onToggleSection, onToggleField }) {
  const def = SECTIONS[activePage];
  return (
    <div style={{ padding: "8px 14px 32px" }}>
      {def.groups.map(g => (
        <SectionCard key={g.id || g.title} group={g} draft={draft} saved={saved} setField={setField} hidden={hiddenSections.includes(g.id)} onToggleHiddenSection={onToggleSection} hiddenFields={hiddenFields} onToggleFieldHidden={onToggleField} />
      ))}
    </div>
  );
}