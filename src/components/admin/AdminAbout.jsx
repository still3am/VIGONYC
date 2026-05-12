import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Monitor, Smartphone } from "lucide-react";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const DEFAULT_SETTINGS = [
  // Hero
  { key: "hero_headline_1", value: "STREETS", section: "hero" },
  { key: "hero_headline_2", value: "OF NYC", section: "hero" },
  { key: "hero_sub", value: "Born in New York City. Built from concrete and culture.", section: "hero" },
  { key: "banner_text", value: "SS25 Collection — Now Live", section: "global" },
  { key: "banner_dot", value: "green", section: "global" },
  { key: "banner_visible", value: "true", section: "global" },
  { key: "hero_product_name", value: "Chrome V Tee — SS25", section: "hero" },
  { key: "hero_product_units", value: "100 Units", section: "hero" },
  // About
  { key: "about_headline", value: "Born From The Five Boroughs", section: "about" },
  { key: "about_story", value: "VIGONYC is more than clothing — it's a declaration. Every thread carries the energy of the streets that built us.", section: "about" },
  { key: "about_mission", value: "Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.", section: "about" },
  { key: "about_values", value: "Authenticity. Quality. Culture. We build for the streets, not the trend cycle.", section: "about" },
  // KPIs
  { key: "kpi_pieces", value: "500+", section: "about" },
  { key: "kpi_community", value: "12K+", section: "about" },
  { key: "kpi_rating", value: "4.9★", section: "about" },
  { key: "kpi_founded", value: "2024", section: "about" },
  { key: "kpi_street_ready", value: "100%", section: "about" },
  { key: "kpi_boroughs", value: "5", section: "about" },
  // Crew
  { key: "crew_line_1", value: "Manhattan — Design & Creative", section: "about" },
  { key: "crew_line_2", value: "Brooklyn — Photography & Lookbook", section: "about" },
  { key: "crew_line_3", value: "Queens — Operations & Drops", section: "about" },
  // Global
  { key: "ticker_text", value: "Free shipping over $150 ✦ New drop every friday ✦ VIGONYC SS25 ✦ NYC made — limited units ✦ No restocks. Move fast. ✦ Free returns within 30 days", section: "global" },
  { key: "free_shipping_threshold", value: "150", section: "global" },
  { key: "footer_tagline", value: "Built from concrete and culture.", section: "global" },
  { key: "footer_copyright", value: "© 2025 VIGONYC. All rights reserved.", section: "global" },
  // Contact / Socials
  { key: "contact_email", value: "hello@vigonyc.com", section: "contact" },
  { key: "contact_instagram", value: "@VIGONYC", section: "contact" },
  { key: "contact_tiktok", value: "@VIGONYC", section: "contact" },
  { key: "contact_twitter", value: "@VIGONYC", section: "contact" },
  { key: "contact_response_time", value: "Within 24 hours", section: "contact" },
  { key: "store_hours", value: "Online 24/7 — NYC Pop-Ups announced via Instagram", section: "contact" },
  // Coming Soon
  { key: "coming_soon_active", value: "false", section: "global" },
  { key: "coming_soon_headline", value: "COMING\nSOON", section: "global" },
  { key: "coming_soon_badge", value: "Something New Is Coming", section: "global" },
  { key: "coming_soon_body", value: "The next drop is loading. NYC streetwear, built different.\nBe first to know when we go live.", section: "global" },
  { key: "coming_soon_footer_tag", value: "NYC — SS25 · Limited Units · No Restocks", section: "global" },
];

export default function AdminAbout() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewTab, setPreviewTab] = useState("hero");
  const [previewMode, setPreviewMode] = useState("desktop");

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
    toast.success("Settings saved!");
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));
  const comingSoon = settings.coming_soon_active === "true";

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading settings...</div>;

  const PREVIEW_TABS = ["hero", "about", "coming soon", "contact", "footer"];

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Content</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Site Content</h2>
      </div>

      <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr min(400px,100%)", gap: 28, alignItems: "start" }}>
        {/* LEFT: all editable sections */}
        <div>
          {/* Coming Soon Mode — now inside save flow */}
          <Section title="Coming Soon Mode">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: comingSoon ? "#e03" : "#0c6", marginBottom: 4 }}>
                  {comingSoon ? "⚠ Coming Soon Mode ACTIVE — Store hidden from visitors" : "✓ Store Live — Visible to all visitors"}
                </div>
                <div style={{ fontSize: 10, color: SD, lineHeight: 1.6 }}>
                  {comingSoon ? "Non-admin visitors see the Coming Soon page." : "Enable to show a Coming Soon page to all non-admin visitors."}
                </div>
              </div>
              <button
                onClick={() => set("coming_soon_active", comingSoon ? "false" : "true")}
                style={{ width: 52, height: 28, borderRadius: 14, background: comingSoon ? "#e03" : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
              >
                <div style={{ position: "absolute", top: 4, left: comingSoon ? 28 : 4, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
              </button>
            </div>
            <Field label="Coming Soon Headline (use \n for line break)" value={settings.coming_soon_headline} onChange={v => set("coming_soon_headline", v)} />
            <Field label="Badge Text" value={settings.coming_soon_badge} onChange={v => set("coming_soon_badge", v)} />
            <TextArea label="Body Text (use \n for line break)" value={settings.coming_soon_body} onChange={v => set("coming_soon_body", v)} rows={3} />
            <Field label="Footer Tag Line" value={settings.coming_soon_footer_tag} onChange={v => set("coming_soon_footer_tag", v)} />
          </Section>

          <Section title="Hero Section">
            <Field label="Headline Line 1" value={settings.hero_headline_1} onChange={v => set("hero_headline_1", v)} />
            <Field label="Headline Line 2" value={settings.hero_headline_2} onChange={v => set("hero_headline_2", v)} />
            <TextArea label="Hero Subheading" value={settings.hero_sub} onChange={v => set("hero_sub", v)} />
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Banner Text</div>
                <button onClick={() => set("banner_visible", settings.banner_visible === "false" ? "true" : "false")} style={{ fontSize: 7, letterSpacing: 2, textTransform: "uppercase", border: `.5px solid ${settings.banner_visible === "false" ? "#e03" : "#0c6"}`, background: "transparent", color: settings.banner_visible === "false" ? "#e03" : "#0c6", padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                  {settings.banner_visible === "false" ? "● Hidden" : "● Visible"}
                </button>
              </div>
              <input value={settings.banner_text ?? ""} onChange={e => set("banner_text", e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", opacity: settings.banner_visible === "false" ? 0.4 : 1 }}
                onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Banner Dot Status</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["green", "#0c6", "Live"], ["red", "#e03", "Sold Out"], ["off", "transparent", "Hidden"]].map(([val, color, label]) => (
                  <button key={val} onClick={() => set("banner_dot", val)} style={{ flex: 1, padding: "10px 8px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${settings.banner_dot === val ? color : G3}`, background: settings.banner_dot === val ? `${color}18` : "transparent", color: settings.banner_dot === val ? color : SD, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                    {val !== "off" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Hero Product Name" value={settings.hero_product_name} onChange={v => set("hero_product_name", v)} />
            <Field label="Hero Product Units" value={settings.hero_product_units} onChange={v => set("hero_product_units", v)} />
          </Section>

          <Section title="About Page">
            <Field label="Main Headline" value={settings.about_headline} onChange={v => set("about_headline", v)} />
            <TextArea label="Brand Story" value={settings.about_story} onChange={v => set("about_story", v)} rows={4} />
            <TextArea label="Mission Statement" value={settings.about_mission} onChange={v => set("about_mission", v)} rows={3} />
            <TextArea label="Brand Values" value={settings.about_values} onChange={v => set("about_values", v)} rows={2} />
          </Section>

          <Section title="Brand KPIs">
            <div className="admin-kpi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Pieces Dropped" value={settings.kpi_pieces} onChange={v => set("kpi_pieces", v)} />
              <Field label="Community Size" value={settings.kpi_community} onChange={v => set("kpi_community", v)} />
              <Field label="Avg. Rating" value={settings.kpi_rating} onChange={v => set("kpi_rating", v)} />
              <Field label="Founded Year" value={settings.kpi_founded} onChange={v => set("kpi_founded", v)} />
              <Field label="Street Ready %" value={settings.kpi_street_ready} onChange={v => set("kpi_street_ready", v)} />
              <Field label="Boroughs" value={settings.kpi_boroughs} onChange={v => set("kpi_boroughs", v)} />
            </div>
          </Section>

          <Section title="Crew / Team Lines">
            <Field label="Line 1 (Borough — Role)" value={settings.crew_line_1} onChange={v => set("crew_line_1", v)} />
            <Field label="Line 2 (Borough — Role)" value={settings.crew_line_2} onChange={v => set("crew_line_2", v)} />
            <Field label="Line 3 (Borough — Role)" value={settings.crew_line_3} onChange={v => set("crew_line_3", v)} />
          </Section>

          <Section title="Global Settings">
            <TextArea label="Ticker Text (separate items with ✦)" value={settings.ticker_text} onChange={v => set("ticker_text", v)} rows={3} />
            <Field label="Free Shipping Threshold ($)" value={settings.free_shipping_threshold} onChange={v => set("free_shipping_threshold", v)} />
          </Section>

          <Section title="Footer">
            <Field label="Footer Tagline" value={settings.footer_tagline} onChange={v => set("footer_tagline", v)} />
            <Field label="Copyright Text" value={settings.footer_copyright} onChange={v => set("footer_copyright", v)} />
          </Section>

          <Section title="Contact & Social">
            <Field label="Contact Email" value={settings.contact_email} onChange={v => set("contact_email", v)} />
            <Field label="Response Time" value={settings.contact_response_time} onChange={v => set("contact_response_time", v)} />
            <Field label="Store Hours / Availability" value={settings.store_hours} onChange={v => set("store_hours", v)} />
            <div className="admin-kpi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Instagram" value={settings.contact_instagram} onChange={v => set("contact_instagram", v)} />
              <Field label="TikTok" value={settings.contact_tiktok} onChange={v => set("contact_tiktok", v)} />
              <Field label="Twitter / X" value={settings.contact_twitter} onChange={v => set("contact_twitter", v)} />
            </div>
          </Section>

          <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", opacity: saving ? 0.8 : 1 }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
          </button>
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ position: "sticky", top: 20 }}>
          {/* Preview header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Live Preview</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPreviewMode("desktop")} title="Desktop" style={{ background: previewMode === "desktop" ? S : "transparent", border: `0.5px solid ${previewMode === "desktop" ? S : G3}`, color: previewMode === "desktop" ? "#000" : SD, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Monitor size={13} />
              </button>
              <button onClick={() => setPreviewMode("mobile")} title="Mobile" style={{ background: previewMode === "mobile" ? S : "transparent", border: `0.5px solid ${previewMode === "mobile" ? S : G3}`, color: previewMode === "mobile" ? "#000" : SD, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Smartphone size={13} />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${PREVIEW_TABS.length}, 1fr)`, gap: 4, marginBottom: 12 }}>
            {PREVIEW_TABS.map(t => (
              <button key={t} onClick={() => setPreviewTab(t)} style={{ padding: "6px 4px", fontSize: 7, letterSpacing: 1, textTransform: "uppercase", background: previewTab === t ? S : "transparent", color: previewTab === t ? "#000" : SD, border: `0.5px solid ${previewTab === t ? S : G3}`, cursor: "pointer", fontFamily: "inherit", fontWeight: previewTab === t ? 900 : 400, transition: "all .15s" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Preview frame */}
          <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, overflow: "hidden" }}>
            {/* Simulated browser chrome */}
            <div style={{ background: "#080808", borderBottom: `0.5px solid ${G3}`, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#e03" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fa0" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0c6" }} />
              <div style={{ flex: 1, background: "#111", borderRadius: 3, padding: "3px 10px", marginLeft: 8 }}>
                <span style={{ fontSize: 7, color: SD }}>vigonyc.com{previewTab === "hero" ? "/" : previewTab === "about" ? "/about" : previewTab === "coming soon" ? "/" : previewTab === "contact" ? "/contact" : "/"}</span>
              </div>
              <span style={{ fontSize: 7, color: SD, letterSpacing: 1 }}>{previewMode === "mobile" ? "390px" : "1280px"}</span>
            </div>

            {/* Simulated mobile frame */}
            <div style={{ padding: previewMode === "mobile" ? "12px" : "0", background: previewMode === "mobile" ? "#111" : "transparent" }}>
              <div style={{
                background: "#0a0a0a",
                borderRadius: previewMode === "mobile" ? 16 : 0,
                border: previewMode === "mobile" ? `1px solid ${G3}` : "none",
                overflow: "hidden",
                maxHeight: 520,
                overflowY: "auto",
              }}>

                {/* HERO PREVIEW */}
                {previewTab === "hero" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff" }}>
                    {/* Top chrome line */}
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />
                    {/* Nav bar */}
                    <div style={{ background: "rgba(10,10,10,0.95)", borderBottom: `0.5px solid ${G3}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 9, letterSpacing: 3, color: S }}>VIGONYC</span>
                      <div style={{ display: "flex", gap: 12 }}>
                        {["Shop","Drops","About"].map(n => <span key={n} style={{ fontSize: 7, color: SD, letterSpacing: 1 }}>{n}</span>)}
                      </div>
                    </div>
                    {/* Banner */}
                    {settings.banner_visible !== "false" && (
                      <div style={{ background: "rgba(192,192,192,0.06)", borderBottom: `0.5px solid ${G3}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                        {settings.banner_dot !== "off" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", flexShrink: 0 }} />}
                        <span style={{ fontSize: 8, letterSpacing: 2, color: S }}>{settings.banner_text}</span>
                      </div>
                    )}
                    {/* Hero content */}
                    <div style={{ padding: "28px 20px", backgroundImage: "radial-gradient(rgba(192,192,192,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                      <div style={{ fontSize: 9, letterSpacing: 3, color: SD, marginBottom: 12 }}>NYC STREETWEAR — SS25</div>
                      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9, color: "#fff", marginBottom: 14 }}>
                        {settings.hero_headline_1}<br /><span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{settings.hero_headline_2}</span>
                      </div>
                      <div style={{ fontSize: 10, color: SD, lineHeight: 1.7, marginBottom: 16, maxWidth: 240 }}>{settings.hero_sub}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ background: S, color: "#000", padding: "8px 16px", fontSize: 7, letterSpacing: 2, fontWeight: 900 }}>Shop Now</div>
                        <div style={{ border: `0.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 7, letterSpacing: 2 }}>Drops</div>
                      </div>
                      <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(192,192,192,0.04)", border: `0.5px solid ${G3}`, display: "inline-flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 8, color: S }}>{settings.hero_product_name}</span>
                        <span style={{ fontSize: 7, color: SD }}>·</span>
                        <span style={{ fontSize: 8, color: SD }}>{settings.hero_product_units}</span>
                      </div>
                    </div>
                    {/* Ticker */}
                    <div style={{ background: "#080808", borderTop: `0.5px solid ${G3}`, padding: "8px 0", overflow: "hidden" }}>
                      <div style={{ display: "flex", gap: 24, animation: "ticker-prev 12s linear infinite", whiteSpace: "nowrap" }}>
                        {(settings.ticker_text || "").split("✦").concat((settings.ticker_text || "").split("✦")).map((t, i) => (
                          <span key={i} style={{ fontSize: 7, color: SD, letterSpacing: 2, flexShrink: 0 }}>{t.trim()} <span style={{ color: S }}>✦</span></span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ABOUT PREVIEW */}
                {previewTab === "about" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff", padding: "24px 20px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 4, color: SD, textTransform: "uppercase", marginBottom: 8 }}>✦ Our Story</div>
                    <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>{settings.about_headline}</div>
                    <div style={{ fontSize: 10, color: SD, lineHeight: 1.8, marginBottom: 16 }}>{settings.about_story}</div>
                    <div style={{ height: "0.5px", background: G3, marginBottom: 16 }} />
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 8 }}>MISSION</div>
                    <div style={{ fontSize: 10, color: SD, lineHeight: 1.8, marginBottom: 16 }}>{settings.about_mission}</div>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 8 }}>VALUES</div>
                    <div style={{ fontSize: 10, color: SD, lineHeight: 1.8, marginBottom: 20 }}>{settings.about_values}</div>
                    {/* KPIs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                      {[[settings.kpi_pieces,"Pieces"],[settings.kpi_community,"Members"],[settings.kpi_rating,"Rating"],[settings.kpi_founded,"Founded"],[settings.kpi_street_ready,"Ready"],[settings.kpi_boroughs,"Boroughs"]].map(([v,l]) => (
                        <div key={l} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "10px 8px", textAlign: "center" }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: S }}>{v}</div>
                          <div style={{ fontSize: 6, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {/* Crew */}
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 10 }}>CREW</div>
                    {[settings.crew_line_1, settings.crew_line_2, settings.crew_line_3].map((l, i) => (
                      <div key={i} style={{ fontSize: 9, color: SD, padding: "6px 0", borderBottom: `0.5px solid ${G3}` }}>{l}</div>
                    ))}
                  </div>
                )}

                {/* COMING SOON PREVIEW */}
                {previewTab === "coming soon" && (
                  <div style={{ fontFamily: "Inter, sans-serif", minHeight: 400, background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", position: "relative" }}>
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
                    <div style={{ backgroundImage: "radial-gradient(rgba(192,192,192,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", position: "absolute", inset: 0 }} />
                    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 36, height: 36, objectFit: "contain", marginBottom: 16 }} />
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.15)", padding: "5px 12px", marginBottom: 16 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: S }} />
                        <span style={{ fontSize: 7, letterSpacing: 3, color: S }}>{settings.coming_soon_badge}</span>
                      </div>
                      <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9, marginBottom: 16, background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "pre-line" }}>
                        {settings.coming_soon_headline?.replace(/\\n/g, "\n") || "COMING\nSOON"}
                      </div>
                      <div style={{ fontSize: 9, color: SD, lineHeight: 1.8, marginBottom: 20, whiteSpace: "pre-line" }}>{settings.coming_soon_body?.replace(/\\n/g, "\n")}</div>
                      <div style={{ display: "flex", gap: 0, maxWidth: 280, margin: "0 auto 20px" }}>
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `0.5px solid ${G3}`, borderRight: "none", padding: "10px 12px", fontSize: 9, color: SD }}>your@email.com</div>
                        <div style={{ background: S, color: "#000", padding: "10px 14px", fontSize: 7, letterSpacing: 2, fontWeight: 900 }}>Notify Me</div>
                      </div>
                      <div style={{ fontSize: 7, color: SD, letterSpacing: 2 }}>{settings.coming_soon_footer_tag}</div>
                      <div style={{ marginTop: 12, padding: "6px 14px", background: comingSoon ? "rgba(224,48,0,0.1)" : "rgba(0,204,102,0.08)", border: `0.5px solid ${comingSoon ? "#e03" : "#0c6"}`, display: "inline-block" }}>
                        <span style={{ fontSize: 7, color: comingSoon ? "#e03" : "#0c6", letterSpacing: 2 }}>{comingSoon ? "⚠ Mode Active" : "✓ Mode Inactive"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTACT PREVIEW */}
                {previewTab === "contact" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff", padding: "24px 20px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 4, color: SD, marginBottom: 8 }}>✦ Contact</div>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1, marginBottom: 20 }}>Get In Touch</div>
                    {[
                      ["Email", settings.contact_email],
                      ["Response Time", settings.contact_response_time],
                      ["Hours", settings.store_hours],
                    ].map(([l, v]) => (
                      <div key={l} style={{ padding: "12px 0", borderBottom: `0.5px solid ${G3}` }}>
                        <div style={{ fontSize: 7, color: SD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 10, color: "#fff" }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 10 }}>Follow Us</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[["IG", settings.contact_instagram], ["TK", settings.contact_tiktok], ["X", settings.contact_twitter]].map(([icon, handle]) => (
                          <div key={icon} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "8px 12px", display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 8, color: S }}>{icon}</span>
                            <span style={{ fontSize: 8, color: SD }}>{handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* FOOTER PREVIEW */}
                {previewTab === "footer" && (
                  <div style={{ fontFamily: "Inter, sans-serif" }}>
                    <div style={{ padding: "28px 20px 20px", background: "#080808" }}>
                      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#555,transparent)", marginBottom: 24 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: 3, color: S, marginBottom: 8 }}>VIGONYC</div>
                          <div style={{ fontSize: 9, color: SD, lineHeight: 1.8 }}>{settings.footer_tagline}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Follow</div>
                          {[settings.contact_instagram, settings.contact_tiktok, settings.contact_twitter].map((h, i) => (
                            <div key={i} style={{ fontSize: 9, color: SD, marginBottom: 4 }}>{h}</div>
                          ))}
                        </div>
                      </div>
                      {/* Ticker strip */}
                      <div style={{ background: G1, padding: "6px 0", marginBottom: 16, overflow: "hidden" }}>
                        <div style={{ display: "flex", gap: 16, animation: "ticker-prev 12s linear infinite", whiteSpace: "nowrap" }}>
                          {(settings.ticker_text || "").split("✦").map((t, i) => (
                            <span key={i} style={{ fontSize: 7, color: SD, letterSpacing: 1, flexShrink: 0 }}>{t.trim()} <span style={{ color: S }}>✦</span></span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ fontSize: 7, color: SD }}>{settings.footer_copyright}</div>
                        <div style={{ display: "flex", gap: 12 }}>
                          {["Terms","Privacy","Returns"].map(l => <span key={l} style={{ fontSize: 7, color: SD }}>{l}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          <div style={{ fontSize: 7, color: SD, textAlign: "center", marginTop: 8, letterSpacing: 1 }}>Updates live as you type · Save to apply</div>
        </div>
      </div>

      <style>{`
        @media(max-width:1100px){.admin-content-grid{grid-template-columns:1fr !important;}}
        @media(max-width:480px){.admin-kpi-grid{grid-template-columns:1fr 1fr !important;}}
        @keyframes ticker-prev { from{transform:translateX(0)} to{transform:translateX(-50%)} }
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