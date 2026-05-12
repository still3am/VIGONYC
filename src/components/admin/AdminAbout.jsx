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
  { key: "hero_headline_1", value: "STREETS", section: "hero" },
  { key: "hero_headline_2", value: "OF NYC", section: "hero" },
  { key: "hero_sub", value: "Born in New York City. Built from concrete and culture.", section: "hero" },
  { key: "banner_text", value: "SS25 Collection — Now Live", section: "global" },
  { key: "banner_dot", value: "green", section: "global" },
  { key: "banner_visible", value: "true", section: "global" },
  { key: "hero_product_name", value: "Chrome V Tee — SS25", section: "hero" },
  { key: "hero_product_units", value: "100 Units", section: "hero" },
  { key: "about_headline", value: "Born From The Five Boroughs", section: "about" },
  { key: "about_story", value: "VIGONYC is more than clothing — it's a declaration. Every thread carries the energy of the streets that built us.", section: "about" },
  { key: "about_mission", value: "Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.", section: "about" },
  { key: "about_values", value: "Authenticity. Quality. Culture. We build for the streets, not the trend cycle.", section: "about" },
  { key: "kpi_pieces", value: "500+", section: "about" },
  { key: "kpi_community", value: "12K+", section: "about" },
  { key: "kpi_rating", value: "4.9★", section: "about" },
  { key: "kpi_founded", value: "2024", section: "about" },
  { key: "kpi_street_ready", value: "100%", section: "about" },
  { key: "kpi_boroughs", value: "5", section: "about" },
  { key: "crew_line_1", value: "Manhattan — Design & Creative", section: "about" },
  { key: "crew_line_2", value: "Brooklyn — Photography & Lookbook", section: "about" },
  { key: "crew_line_3", value: "Queens — Operations & Drops", section: "about" },
  { key: "ticker_text", value: "Free shipping over $150 ✦ New drop every friday ✦ VIGONYC SS25 ✦ NYC made — limited units ✦ No restocks. Move fast. ✦ Free returns within 30 days", section: "global" },
  { key: "free_shipping_threshold", value: "150", section: "global" },
  { key: "footer_tagline", value: "Built from concrete and culture.", section: "global" },
  { key: "footer_copyright", value: "© 2025 VIGONYC. All rights reserved.", section: "global" },
  { key: "contact_email", value: "hello@vigonyc.com", section: "contact" },
  { key: "contact_instagram", value: "@VIGONYC", section: "contact" },
  { key: "contact_tiktok", value: "@VIGONYC", section: "contact" },
  { key: "contact_twitter", value: "@VIGONYC", section: "contact" },
  { key: "contact_response_time", value: "Within 24 hours", section: "contact" },
  { key: "store_hours", value: "Online 24/7 — NYC Pop-Ups announced via Instagram", section: "contact" },
  { key: "coming_soon_active", value: "false", section: "global" },
  { key: "coming_soon_headline", value: "COMING\nSOON", section: "global" },
  { key: "coming_soon_badge", value: "Something New Is Coming", section: "global" },
  { key: "coming_soon_body", value: "The next drop is loading. NYC streetwear, built different.\nBe first to know when we go live.", section: "global" },
  { key: "coming_soon_footer_tag", value: "NYC — SS25 · Limited Units · No Restocks", section: "global" },
];

const PREVIEW_TABS = ["hero", "about", "coming soon", "contact", "footer"];

export default function AdminAbout() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewTab, setPreviewTab] = useState("hero");
  const [previewMode, setPreviewMode] = useState("mobile");

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

  // Scale hero text based on preview mode
  const hSize = previewMode === "mobile" ? 22 : 32;

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Content</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Site Content</h2>
      </div>

      <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

        {/* ── LEFT: editable sections ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          <Section title="Coming Soon Mode">
            {/* Toggle row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 0 8px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: comingSoon ? "#e03" : "#0c6", marginBottom: 3 }}>
                  {comingSoon ? "⚠ Active — Store hidden from visitors" : "✓ Store Live — Visible to all"}
                </div>
                <div style={{ fontSize: 10, color: SD }}>
                  {comingSoon ? "Admins can still access the store." : "Toggle to show Coming Soon to visitors."}
                </div>
              </div>
              {/* Toggle switch — proper controlled component */}
              <div
                onClick={() => set("coming_soon_active", comingSoon ? "false" : "true")}
                style={{
                  width: 52, height: 28, borderRadius: 14,
                  background: comingSoon ? "#e03" : G3,
                  cursor: "pointer", position: "relative",
                  transition: "background .25s", flexShrink: 0,
                  border: `1px solid ${comingSoon ? "#e03" : "#444"}`,
                }}
              >
                <div style={{
                  position: "absolute", top: 3,
                  left: comingSoon ? 27 : 3,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#fff",
                  transition: "left .25s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }} />
              </div>
            </div>
            <Field label="Headline (use \n for line break)" value={settings.coming_soon_headline} onChange={v => set("coming_soon_headline", v)} />
            <Field label="Badge Text" value={settings.coming_soon_badge} onChange={v => set("coming_soon_badge", v)} />
            <TextArea label="Body Text (use \n for line break)" value={settings.coming_soon_body} onChange={v => set("coming_soon_body", v)} rows={3} />
            <Field label="Footer Tag Line" value={settings.coming_soon_footer_tag} onChange={v => set("coming_soon_footer_tag", v)} />
          </Section>

          <Section title="Hero Section">
            <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Headline Line 1" value={settings.hero_headline_1} onChange={v => set("hero_headline_1", v)} />
              <Field label="Headline Line 2" value={settings.hero_headline_2} onChange={v => set("hero_headline_2", v)} />
            </div>
            <TextArea label="Hero Subheading" value={settings.hero_sub} onChange={v => set("hero_sub", v)} rows={2} />
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Banner Text</div>
                <button onClick={() => set("banner_visible", settings.banner_visible === "false" ? "true" : "false")}
                  style={{ fontSize: 7, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${settings.banner_visible === "false" ? "#e03" : "#0c6"}`, background: "transparent", color: settings.banner_visible === "false" ? "#e03" : "#0c6", padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                  {settings.banner_visible === "false" ? "● Hidden" : "● Visible"}
                </button>
              </div>
              <input value={settings.banner_text ?? ""} onChange={e => set("banner_text", e.target.value)}
                style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", opacity: settings.banner_visible === "false" ? 0.4 : 1 }}
                onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Banner Dot Status</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["green","#0c6","Live"],["red","#e03","Sold Out"],["off","transparent","Hidden"]].map(([val,color,label]) => (
                  <button key={val} onClick={() => set("banner_dot", val)}
                    style={{ flex: 1, padding: "9px 6px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${settings.banner_dot === val ? color : G3}`, background: settings.banner_dot === val ? `${color}18` : "transparent", color: settings.banner_dot === val ? color : SD, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .2s" }}>
                    {val !== "off" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Hero Product Name" value={settings.hero_product_name} onChange={v => set("hero_product_name", v)} />
              <Field label="Hero Product Units" value={settings.hero_product_units} onChange={v => set("hero_product_units", v)} />
            </div>
          </Section>

          <Section title="About Page">
            <Field label="Main Headline" value={settings.about_headline} onChange={v => set("about_headline", v)} />
            <TextArea label="Brand Story" value={settings.about_story} onChange={v => set("about_story", v)} rows={3} />
            <TextArea label="Mission Statement" value={settings.about_mission} onChange={v => set("about_mission", v)} rows={2} />
            <TextArea label="Brand Values" value={settings.about_values} onChange={v => set("about_values", v)} rows={2} />
          </Section>

          <Section title="Brand KPIs">
            <div className="admin-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
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
            <TextArea label="Ticker Text (separate items with ✦)" value={settings.ticker_text} onChange={v => set("ticker_text", v)} rows={2} />
            <Field label="Free Shipping Threshold ($)" value={settings.free_shipping_threshold} onChange={v => set("free_shipping_threshold", v)} />
          </Section>

          <Section title="Footer">
            <Field label="Footer Tagline" value={settings.footer_tagline} onChange={v => set("footer_tagline", v)} />
            <Field label="Copyright Text" value={settings.footer_copyright} onChange={v => set("footer_copyright", v)} />
          </Section>

          <Section title="Contact & Social">
            <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Contact Email" value={settings.contact_email} onChange={v => set("contact_email", v)} />
              <Field label="Response Time" value={settings.contact_response_time} onChange={v => set("contact_response_time", v)} />
            </div>
            <Field label="Store Hours / Availability" value={settings.store_hours} onChange={v => set("store_hours", v)} />
            <div className="admin-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Field label="Instagram" value={settings.contact_instagram} onChange={v => set("contact_instagram", v)} />
              <Field label="TikTok" value={settings.contact_tiktok} onChange={v => set("contact_tiktok", v)} />
              <Field label="Twitter / X" value={settings.contact_twitter} onChange={v => set("contact_twitter", v)} />
            </div>
          </Section>

          <button onClick={handleSave} disabled={saving}
            style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", opacity: saving ? 0.8 : 1, marginBottom: 40 }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
          </button>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div style={{ position: "sticky", top: 20 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Live Preview</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[["desktop", <Monitor size={12} />], ["mobile", <Smartphone size={12} />]].map(([mode, icon]) => (
                <button key={mode} onClick={() => setPreviewMode(mode)}
                  style={{ background: previewMode === mode ? S : "transparent", border: `0.5px solid ${previewMode === mode ? S : G3}`, color: previewMode === mode ? "#000" : SD, padding: "5px 9px", cursor: "pointer", display: "flex", alignItems: "center", transition: "all .15s" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Tab bar — scrollable on mobile */}
          <div style={{ display: "flex", gap: 3, marginBottom: 10, overflowX: "auto", paddingBottom: 2 }}>
            {PREVIEW_TABS.map(t => (
              <button key={t} onClick={() => setPreviewTab(t)}
                style={{ padding: "5px 8px", fontSize: 7, letterSpacing: 1, textTransform: "uppercase", background: previewTab === t ? S : "transparent", color: previewTab === t ? "#000" : SD, border: `0.5px solid ${previewTab === t ? S : G3}`, cursor: "pointer", fontFamily: "inherit", fontWeight: previewTab === t ? 900 : 400, whiteSpace: "nowrap", flexShrink: 0, transition: "all .15s" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Preview shell */}
          <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, overflow: "hidden" }}>
            {/* Browser chrome bar */}
            <div style={{ background: "#080808", borderBottom: `0.5px solid ${G3}`, padding: "7px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e03" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fa0" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0c6" }} />
              <div style={{ flex: 1, background: "#111", borderRadius: 3, padding: "2px 8px", marginLeft: 6 }}>
                <span style={{ fontSize: 7, color: SD }}>vigonyc.com/{previewTab === "hero" ? "" : previewTab === "about" ? "about" : previewTab === "coming soon" ? "" : previewTab}</span>
              </div>
              <span style={{ fontSize: 7, color: SD, flexShrink: 0 }}>{previewMode === "mobile" ? "390px" : "1280px"}</span>
            </div>

            {/* Mobile frame wrapper */}
            <div style={{ padding: previewMode === "mobile" ? "10px" : "0", background: previewMode === "mobile" ? "#0d0d0d" : "transparent" }}>
              <div style={{
                background: "#0a0a0a",
                borderRadius: previewMode === "mobile" ? 14 : 0,
                border: previewMode === "mobile" ? `1.5px solid #333` : "none",
                overflow: "hidden",
                maxHeight: 500,
                overflowY: "auto",
                /* Mobile adds a top notch indicator */
              }}>
                {previewMode === "mobile" && (
                  <div style={{ height: 12, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: "#222" }} />
                  </div>
                )}

                {/* ── HERO ── */}
                {previewTab === "hero" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff" }}>
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#888,transparent)" }} />
                    {/* Nav */}
                    <div style={{ background: "rgba(10,10,10,0.97)", borderBottom: `0.5px solid ${G3}`, padding: previewMode === "mobile" ? "8px 12px" : "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: previewMode === "mobile" ? 8 : 9, letterSpacing: 3, color: S }}>VIGONYC</span>
                      {previewMode === "desktop" && (
                        <div style={{ display: "flex", gap: 12 }}>
                          {["Shop","Drops","About"].map(n => <span key={n} style={{ fontSize: 7, color: SD, letterSpacing: 1 }}>{n}</span>)}
                        </div>
                      )}
                      {previewMode === "mobile" && <div style={{ display: "flex", gap: 6 }}><div style={{ width: 14, height: 1, background: SD }} /><div style={{ width: 14, height: 1, background: SD }} /><div style={{ width: 10, height: 1, background: SD }} /></div>}
                    </div>
                    {/* Banner */}
                    {settings.banner_visible !== "false" && (
                      <div style={{ background: "rgba(192,192,192,0.06)", borderBottom: `0.5px solid ${G3}`, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                        {settings.banner_dot !== "off" && <div style={{ width: 4, height: 4, borderRadius: "50%", background: settings.banner_dot === "red" ? "#e03" : "#0c6", flexShrink: 0 }} />}
                        <span style={{ fontSize: previewMode === "mobile" ? 7 : 8, letterSpacing: 2, color: S }}>{settings.banner_text}</span>
                      </div>
                    )}
                    {/* Hero body */}
                    <div style={{ padding: previewMode === "mobile" ? "20px 14px" : "28px 20px", backgroundImage: "radial-gradient(rgba(192,192,192,0.03) 1px,transparent 1px)", backgroundSize: "20px 20px" }}>
                      <div style={{ fontSize: previewMode === "mobile" ? 7 : 9, letterSpacing: 2, color: SD, marginBottom: 8 }}>NYC STREETWEAR — SS25</div>
                      <div style={{ fontSize: hSize, fontWeight: 900, letterSpacing: -1, lineHeight: 0.95, color: "#fff", marginBottom: 10 }}>
                        {settings.hero_headline_1}
                        <br />
                        <span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {settings.hero_headline_2}
                        </span>
                      </div>
                      <div style={{ fontSize: previewMode === "mobile" ? 8 : 10, color: SD, lineHeight: 1.7, marginBottom: 12, maxWidth: previewMode === "mobile" ? "100%" : 240 }}>{settings.hero_sub}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <div style={{ background: S, color: "#000", padding: previewMode === "mobile" ? "6px 12px" : "8px 16px", fontSize: 7, letterSpacing: 2, fontWeight: 900 }}>Shop Now</div>
                        <div style={{ border: `0.5px solid ${G3}`, color: SD, padding: previewMode === "mobile" ? "6px 10px" : "8px 14px", fontSize: 7, letterSpacing: 1 }}>Drops</div>
                      </div>
                      <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(192,192,192,0.04)", border: `0.5px solid ${G3}`, display: "inline-flex", gap: 6, alignItems: "center", maxWidth: "100%" }}>
                        <span style={{ fontSize: previewMode === "mobile" ? 7 : 8, color: S, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{settings.hero_product_name}</span>
                        <span style={{ fontSize: 7, color: SD, flexShrink: 0 }}>· {settings.hero_product_units}</span>
                      </div>
                    </div>
                    {/* Ticker */}
                    <div style={{ background: "#080808", borderTop: `0.5px solid ${G3}`, padding: "6px 0", overflow: "hidden" }}>
                      <div style={{ display: "flex", gap: 20, animation: "ticker-prev 14s linear infinite", whiteSpace: "nowrap" }}>
                        {(settings.ticker_text || "").split("✦").concat((settings.ticker_text || "").split("✦")).map((t, i) => (
                          <span key={i} style={{ fontSize: 7, color: SD, letterSpacing: 1, flexShrink: 0 }}>{t.trim()} <span style={{ color: S }}>✦</span></span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ABOUT ── */}
                {previewTab === "about" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff", padding: "20px 16px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 4, color: SD, textTransform: "uppercase", marginBottom: 6 }}>✦ Our Story</div>
                    <div style={{ fontSize: previewMode === "mobile" ? 18 : 22, fontWeight: 900, letterSpacing: -1, marginBottom: 10, lineHeight: 1.1 }}>{settings.about_headline}</div>
                    <div style={{ fontSize: 9, color: SD, lineHeight: 1.8, marginBottom: 12 }}>{settings.about_story}</div>
                    <div style={{ height: "0.5px", background: G3, marginBottom: 12 }} />
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 6 }}>MISSION</div>
                    <div style={{ fontSize: 9, color: SD, lineHeight: 1.8, marginBottom: 12 }}>{settings.about_mission}</div>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 6 }}>VALUES</div>
                    <div style={{ fontSize: 9, color: SD, lineHeight: 1.8, marginBottom: 16 }}>{settings.about_values}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
                      {[[settings.kpi_pieces,"Pieces"],[settings.kpi_community,"Members"],[settings.kpi_rating,"Rating"],[settings.kpi_founded,"Founded"],[settings.kpi_street_ready,"Ready"],[settings.kpi_boroughs,"Boroughs"]].map(([v,l]) => (
                        <div key={l} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "8px 4px", textAlign: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 900, color: S }}>{v}</div>
                          <div style={{ fontSize: 6, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 8 }}>CREW</div>
                    {[settings.crew_line_1, settings.crew_line_2, settings.crew_line_3].map((l, i) => (
                      <div key={i} style={{ fontSize: 8, color: SD, padding: "5px 0", borderBottom: `0.5px solid ${G3}` }}>{l}</div>
                    ))}
                  </div>
                )}

                {/* ── COMING SOON ── */}
                {previewTab === "coming soon" && (
                  <div style={{ fontFamily: "Inter, sans-serif", minHeight: 360, background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 20px", position: "relative", textAlign: "center" }}>
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
                    <div style={{ backgroundImage: "radial-gradient(rgba(192,192,192,0.04) 1px,transparent 1px)", backgroundSize: "20px 20px", position: "absolute", inset: 0 }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 32, height: 32, objectFit: "contain", marginBottom: 12 }} />
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.15)", padding: "4px 10px", marginBottom: 14 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: S }} />
                        <span style={{ fontSize: 6, letterSpacing: 3, color: S }}>{settings.coming_soon_badge}</span>
                      </div>
                      <div style={{ fontSize: previewMode === "mobile" ? 28 : 36, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9, marginBottom: 14, background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "pre-line" }}>
                        {settings.coming_soon_headline?.replace(/\\n/g, "\n") || "COMING\nSOON"}
                      </div>
                      <div style={{ fontSize: 8, color: SD, lineHeight: 1.8, marginBottom: 16, whiteSpace: "pre-line" }}>{settings.coming_soon_body?.replace(/\\n/g, "\n")}</div>
                      <div style={{ display: "flex", gap: 0, maxWidth: 260, margin: "0 auto 14px" }}>
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `0.5px solid ${G3}`, borderRight: "none", padding: "8px 10px", fontSize: 8, color: SD }}>your@email.com</div>
                        <div style={{ background: S, color: "#000", padding: "8px 12px", fontSize: 7, letterSpacing: 2, fontWeight: 900 }}>Notify Me</div>
                      </div>
                      <div style={{ fontSize: 7, color: SD, letterSpacing: 2, marginBottom: 10 }}>{settings.coming_soon_footer_tag}</div>
                      <div style={{ padding: "4px 12px", background: comingSoon ? "rgba(224,48,0,0.1)" : "rgba(0,204,102,0.08)", border: `0.5px solid ${comingSoon ? "#e03" : "#0c6"}`, display: "inline-block" }}>
                        <span style={{ fontSize: 7, color: comingSoon ? "#e03" : "#0c6", letterSpacing: 2 }}>{comingSoon ? "⚠ Mode Active" : "✓ Mode Inactive"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CONTACT ── */}
                {previewTab === "contact" && (
                  <div style={{ fontFamily: "Inter, sans-serif", color: "#fff", padding: "20px 16px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 4, color: SD, marginBottom: 6 }}>✦ Contact</div>
                    <div style={{ fontSize: previewMode === "mobile" ? 18 : 22, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>Get In Touch</div>
                    {[["Email", settings.contact_email],["Response Time", settings.contact_response_time],["Hours", settings.store_hours]].map(([l, v]) => (
                      <div key={l} style={{ padding: "10px 0", borderBottom: `0.5px solid ${G3}` }}>
                        <div style={{ fontSize: 7, color: SD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: 9, color: "#fff" }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 7, letterSpacing: 3, color: S, marginBottom: 8 }}>Follow Us</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[["IG", settings.contact_instagram],["TK", settings.contact_tiktok],["X", settings.contact_twitter]].map(([icon, handle]) => (
                          <div key={icon} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "6px 10px", display: "flex", gap: 5, alignItems: "center" }}>
                            <span style={{ fontSize: 7, color: S }}>{icon}</span>
                            <span style={{ fontSize: 7, color: SD }}>{handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FOOTER ── */}
                {previewTab === "footer" && (
                  <div style={{ fontFamily: "Inter, sans-serif", background: "#080808", padding: "20px 16px" }}>
                    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#555,transparent)", marginBottom: 20 }} />
                    <div style={{ display: "grid", gridTemplateColumns: previewMode === "mobile" ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 8, letterSpacing: 3, color: S, marginBottom: 6 }}>VIGONYC</div>
                        <div style={{ fontSize: 8, color: SD, lineHeight: 1.8 }}>{settings.footer_tagline}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Follow</div>
                        {[settings.contact_instagram, settings.contact_tiktok, settings.contact_twitter].map((h, i) => (
                          <div key={i} style={{ fontSize: 8, color: SD, marginBottom: 3 }}>{h}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: G1, padding: "5px 0", marginBottom: 14, overflow: "hidden" }}>
                      <div style={{ display: "flex", gap: 16, animation: "ticker-prev 12s linear infinite", whiteSpace: "nowrap" }}>
                        {(settings.ticker_text || "").split("✦").map((t, i) => (
                          <span key={i} style={{ fontSize: 7, color: SD, letterSpacing: 1, flexShrink: 0 }}>{t.trim()} <span style={{ color: S }}>✦</span></span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontSize: 7, color: SD }}>{settings.footer_copyright}</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        {["Terms","Privacy","Returns"].map(l => <span key={l} style={{ fontSize: 7, color: SD }}>{l}</span>)}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          <div style={{ fontSize: 7, color: SD, textAlign: "center", marginTop: 6, letterSpacing: 1 }}>Updates live as you type · Save to apply</div>
        </div>
      </div>

      <style>{`
        @media(max-width:1100px){
          .admin-content-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width:600px){
          .admin-2col { grid-template-columns: 1fr !important; }
          .admin-3col { grid-template-columns: 1fr 1fr !important; }
        }
        @keyframes ticker-prev { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#111", border: "0.5px solid #222", borderTop: "2px solid #C0C0C0", padding: "20px", marginBottom: 14 }}>
      <div style={{ fontSize: 8, letterSpacing: 3, color: "#C0C0C0", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <input value={value ?? ""} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "9px 12px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={rows}
        style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "9px 12px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}