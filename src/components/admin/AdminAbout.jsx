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
  { key: "kpi_street_ready", value: "100%", section: "about" },
  { key: "kpi_founded", value: "2024", section: "about" },
  { key: "kpi_boroughs", value: "5", section: "about" },
  { key: "hero_headline_1", value: "STREETS", section: "hero" },
  { key: "hero_headline_2", value: "OF NYC", section: "hero" },
  { key: "hero_sub", value: "Born in New York City. Built from concrete and culture.", section: "hero" },
  { key: "banner_text", value: "SS25 Collection — Now Live", section: "global" },
  { key: "banner_dot", value: "green", section: "global" },
  { key: "ticker_text", value: "Free shipping over $150 ✦ New drop every friday ✦ VIGONYC SS25 ✦ NYC made — limited units ✦ No restocks. Move fast. ✦ Free returns within 30 days", section: "global" },
  { key: "free_shipping_threshold", value: "150", section: "global" },
  { key: "contact_email", value: "hello@vigonyc.com", section: "contact" },
  { key: "contact_instagram", value: "@VIGONYC", section: "contact" },
  { key: "contact_response_time", value: "Within 24 hours", section: "contact" },
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
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Content</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Site Content</h2>
      </div>
      <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr min(360px,100%)", gap: 24, alignItems: "start" }}>
        <div>
          <Section title="Hero Section">
            <Field label="Headline Line 1" value={settings.hero_headline_1} onChange={v => set("hero_headline_1", v)} />
            <Field label="Headline Line 2" value={settings.hero_headline_2} onChange={v => set("hero_headline_2", v)} />
            <TextArea label="Hero Subheading" value={settings.hero_sub} onChange={v => set("hero_sub", v)} />
            <Field label="Banner Text" value={settings.banner_text} onChange={v => set("banner_text", v)} />
            <div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Banner Dot Status</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["green", "#0c6", "Live / Active"], ["red", "#e03", "Sold Out"], ["off", "transparent", "Hidden"]].map(([val, color, label]) => (
                  <button key={val} onClick={() => set("banner_dot", val)} style={{ flex: 1, padding: "10px 8px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${settings.banner_dot === val ? color : G3}`, background: settings.banner_dot === val ? `${color}18` : "transparent", color: settings.banner_dot === val ? color : SD, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                    {val !== "off" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Section>
          <Section title="About Page">
            <Field label="Main Headline" value={settings.about_headline} onChange={v => set("about_headline", v)} />
            <TextArea label="Brand Story" value={settings.about_story} onChange={v => set("about_story", v)} rows={4} />
            <TextArea label="Mission Statement" value={settings.about_mission} onChange={v => set("about_mission", v)} rows={3} />
          </Section>
          <Section title="Brand KPIs">
            <div className="admin-kpi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Pieces Dropped" value={settings.kpi_pieces} onChange={v => set("kpi_pieces", v)} />
              <Field label="Community Size" value={settings.kpi_community} onChange={v => set("kpi_community", v)} />
              <Field label="Avg. Rating" value={settings.kpi_rating} onChange={v => set("kpi_rating", v)} />
              <Field label="Street Ready %" value={settings.kpi_street_ready} onChange={v => set("kpi_street_ready", v)} />
              <Field label="Founded Year" value={settings.kpi_founded} onChange={v => set("kpi_founded", v)} />
              <Field label="Boroughs Count" value={settings.kpi_boroughs} onChange={v => set("kpi_boroughs", v)} />
            </div>
          </Section>
          <Section title="Global Settings">
            <TextArea label="Ticker Text (separate items with ✦)" value={settings.ticker_text} onChange={v => set("ticker_text", v)} rows={3} />
            <Field label="Free Shipping Threshold ($)" value={settings.free_shipping_threshold} onChange={v => set("free_shipping_threshold", v)} />
          </Section>
          <Section title="Contact Info">
            <Field label="Contact Email" value={settings.contact_email} onChange={v => set("contact_email", v)} />
            <Field label="Instagram Handle" value={settings.contact_instagram} onChange={v => set("contact_instagram", v)} />
            <Field label="Response Time" value={settings.contact_response_time} onChange={v => set("contact_response_time", v)} />
          </Section>
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", opacity: saving ? 0.8 : 1 }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
          </button>
        </div>
        <div style={{ position: "sticky", top: 20 }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 12 }}>Live Preview</div>
          <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 20 }}>
            <div style={{ marginBottom: 16, padding: 16, background: G1, border: `0.5px solid ${G3}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, marginBottom: 8, textTransform: "uppercase" }}>Hero</div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1, lineHeight: 1, color: "#fff", marginBottom: 6 }}>{settings.hero_headline_1 || "STREETS"}<br />{settings.hero_headline_2 || "OF NYC"}</div>
              <div style={{ fontSize: 9, color: SD, lineHeight: 1.6, marginBottom: 8 }}>{settings.hero_sub}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(192,192,192,.1)", border: ".5px solid rgba(192,192,192,.2)", padding: "4px 10px" }}>
                {settings.banner_dot !== "off" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", flexShrink: 0 }} />}
                <span style={{ fontSize: 7, color: S, letterSpacing: 2, textTransform: "uppercase" }}>{settings.banner_text}</span>
              </div>
            </div>
            <div style={{ marginBottom: 16, padding: 16, background: G1, border: `0.5px solid ${G3}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, marginBottom: 8, textTransform: "uppercase" }}>About</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{settings.about_headline}</div>
              <div style={{ fontSize: 9, color: SD, lineHeight: 1.6 }}>{settings.about_story}</div>
            </div>
            <div style={{ padding: 16, background: G1, border: `0.5px solid ${G3}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, marginBottom: 8, textTransform: "uppercase" }}>KPIs</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[[settings.kpi_pieces, "Pieces"], [settings.kpi_community, "Community"], [settings.kpi_rating, "Rating"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: S }}>{v}</div>
                    <div style={{ fontSize: 7, color: SD, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 7, color: SD, textAlign: "center", marginTop: 10 }}>Changes shown before saving</div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.admin-content-grid{grid-template-columns:1fr !important;}}
        @media(max-width:480px){.admin-kpi-grid{grid-template-columns:1fr 1fr !important;}}
      `}</style>
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