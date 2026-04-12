import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const DEFAULT_SETTINGS = [
  { key: "about_headline", value: "Born From The Five Boroughs", section: "about" },
  { key: "about_story", value: "VIGONYC is more than clothing — it's a declaration. Every thread carries the energy of the streets that built us.", section: "about" },
  { key: "about_mission", value: "Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.", section: "about" },
  { key: "kpi_pieces", value: "500+", section: "about" },
  { key: "kpi_community", value: "12K+", section: "about" },
  { key: "kpi_rating", value: "4.9★", section: "about" },
  { key: "hero_headline_1", value: "STREETS", section: "hero" },
  { key: "hero_headline_2", value: "OF NYC", section: "hero" },
  { key: "hero_sub", value: "Born in New York City. Built from concrete and culture.", section: "hero" },
  { key: "banner_text", value: "SS25 Collection — Now Live", section: "global" },
];

export default function AdminAbout() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.SiteSettings.list().catch(() => []).then(rows => {
      const map = {};
      DEFAULT_SETTINGS.forEach(d => { map[d.key] = d.value; });
      rows.forEach(r => { map[r.key] = r.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const existing = await base44.entities.SiteSettings.list().catch(() => []);
    const existingMap = {};
    existing.forEach(r => { existingMap[r.key] = r; });

    await Promise.all(
      DEFAULT_SETTINGS.map(d => {
        const val = settings[d.key] ?? d.value;
        if (existingMap[d.key]) {
          return base44.entities.SiteSettings.update(existingMap[d.key].id, { value: val });
        } else {
          return base44.entities.SiteSettings.create({ key: d.key, value: val, section: d.section });
        }
      })
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Content</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Site Content</h2>
      </div>

      {/* Hero Section */}
      <Section title="Hero Section">
        <Field label="Headline Line 1" value={settings.hero_headline_1} onChange={v => set("hero_headline_1", v)} />
        <Field label="Headline Line 2" value={settings.hero_headline_2} onChange={v => set("hero_headline_2", v)} />
        <TextArea label="Hero Subheading" value={settings.hero_sub} onChange={v => set("hero_sub", v)} />
        <Field label="Banner Text" value={settings.banner_text} onChange={v => set("banner_text", v)} />
      </Section>

      {/* About Section */}
      <Section title="About Page">
        <Field label="Main Headline" value={settings.about_headline} onChange={v => set("about_headline", v)} />
        <TextArea label="Brand Story" value={settings.about_story} onChange={v => set("about_story", v)} rows={4} />
        <TextArea label="Mission Statement" value={settings.about_mission} onChange={v => set("about_mission", v)} rows={3} />
      </Section>

      {/* KPIs */}
      <Section title="Brand KPIs">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Pieces Dropped" value={settings.kpi_pieces} onChange={v => set("kpi_pieces", v)} />
          <Field label="Community Size" value={settings.kpi_community} onChange={v => set("kpi_community", v)} />
          <Field label="Avg. Rating" value={settings.kpi_rating} onChange={v => set("kpi_rating", v)} />
        </div>
      </Section>

      <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", opacity: saving ? 0.8 : 1 }}>
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#111", border: "0.5px solid #222", borderTop: "2px solid #C0C0C0", padding: "24px", marginBottom: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: "#C0C0C0", textTransform: "uppercase", marginBottom: 18 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={rows} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}