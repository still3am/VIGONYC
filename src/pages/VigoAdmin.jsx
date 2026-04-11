import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVigoSettings } from "../hooks/useVigoSettings";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";
const ADMIN_PASSWORD = "VIGONYC2024";

const SECTIONS = ["Hero", "Banner", "Products", "Brand Story", "Contact & Social", "Theme"];

function Field({ label, value, onChange, type = "text", multiline }) {
  const style = { width: "100%", background: G2, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: multiline ? "vertical" : "none" };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={style} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />}
    </div>
  );
}

function SectionCard({ title, children, accent }) {
  return (
    <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: accent ? `2px solid ${S}` : `.5px solid ${G3}`, marginBottom: 16 }}>
      <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#fff", fontWeight: 700 }}>{title}</div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

export default function VigoAdmin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeSection, setActiveSection] = useState("Hero");
  const [saved, setSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, updateSetting, updateProduct, resetAll } = useVigoSettings();

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthenticated(true); setPwError(false); }
    else { setPwError(true); setPw(""); }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectSection = (s) => {
    setActiveSection(s);
    setMobileMenuOpen(false);
  };

  if (!authenticated) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue',Arial,sans-serif", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#fff", textTransform: "uppercase" }}>VIGO<span style={{ color: S }}>NYC</span></div>
            <div style={{ fontSize: 8, letterSpacing: 4, color: SD, textTransform: "uppercase", marginTop: 4 }}>Admin Dashboard</div>
          </div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "40px 28px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 28, textAlign: "center" }}>Enter Admin Password</div>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••••"
              autoFocus
              style={{ width: "100%", background: G2, border: `.5px solid ${pwError ? "#e03" : G3}`, color: "#fff", padding: "14px 18px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 8, letterSpacing: 4 }}
            />
            {pwError && <div style={{ fontSize: 10, color: "#e03", marginBottom: 16 }}>Incorrect password. Try again.</div>}
            <button onClick={handleLogin} style={{ width: "100%", background: S, color: "#000", border: "none", padding: "14px", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
              Enter Admin
            </button>
            <button onClick={() => navigate("/")} style={{ width: "100%", background: "none", border: "none", color: SD, padding: "12px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
              ← Back to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Helvetica Neue',Arial,sans-serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ background: G1, borderBottom: `.5px solid ${G3}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Mobile hamburger */}
          <button className="admin-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", background: "none", border: `.5px solid ${G3}`, color: SD, width: 36, height: 36, cursor: "pointer", fontSize: 16, alignItems: "center", justifyContent: "center" }}>☰</button>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 3, color: "#fff" }}>VIGO<span style={{ color: S }}>NYC</span></div>
          <div className="admin-editor-label" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 1, height: 20, background: G3 }} />
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Website Editor</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-preview-btn" onClick={() => window.open("/", "_blank")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "7px 12px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Preview</button>
          <button onClick={handleSave} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "7px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
            {saved ? "✓ Saved!" : "Save"}
          </button>
          <button onClick={() => setAuthenticated(false)} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "7px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
        </div>
      </div>

      {/* Mobile section menu overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.95)", zIndex: 200, display: "flex", flexDirection: "column", paddingTop: 56 }}>
          <div style={{ padding: "24px 20px" }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 16 }}>Sections</div>
            {SECTIONS.map(s => (
              <button key={s} onClick={() => selectSection(s)} style={{ display: "block", width: "100%", background: activeSection === s ? "rgba(192,192,192,.07)" : "none", border: "none", borderLeft: activeSection === s ? `2px solid ${S}` : "2px solid transparent", color: activeSection === s ? "#fff" : SD, padding: "16px 20px", fontSize: 14, textAlign: "left", cursor: "pointer", fontFamily: "inherit", marginBottom: 4 }}>{s}</button>
            ))}
            <div style={{ borderTop: `.5px solid ${G3}`, marginTop: 20, paddingTop: 16 }}>
              <button onClick={() => { if (confirm("Reset all settings to defaults?")) { resetAll(); setMobileMenuOpen(false); } }} style={{ background: "none", border: `.5px solid #333`, color: "#444", padding: "10px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Reset to Defaults</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flex: 1 }}>
        {/* Desktop Sidebar */}
        <div className="admin-sidebar" style={{ width: 220, background: G1, borderRight: `.5px solid ${G3}`, padding: "24px 0", flexShrink: 0 }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", padding: "0 20px 16px" }}>Sections</div>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{ display: "block", width: "100%", background: activeSection === s ? "rgba(192,192,192,.07)" : "none", border: "none", borderLeft: activeSection === s ? `2px solid ${S}` : "2px solid transparent", color: activeSection === s ? "#fff" : SD, padding: "12px 20px", fontSize: 11, textAlign: "left", cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>{s}</button>
          ))}
          <div style={{ borderTop: `.5px solid ${G3}`, margin: "20px 0", padding: "16px 20px 0" }}>
            <button onClick={() => { if (confirm("Reset all settings to defaults?")) resetAll(); }} style={{ background: "none", border: `.5px solid #333`, color: "#444", padding: "8px 14px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Reset to Defaults</button>
          </div>
        </div>

        {/* Editor main */}
        <div style={{ flex: 1, padding: "24px 20px", overflowY: "auto", maxHeight: "calc(100vh - 56px)" }}>

          {activeSection === "Hero" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Hero Section</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Homepage Hero</h2>
              <SectionCard title="Hero Content" accent>
                <Field label="Badge Text" value={settings.heroBadge} onChange={v => updateSetting("heroBadge", v)} />
                <Field label="Hero Headline" value={settings.heroHeadline} onChange={v => updateSetting("heroHeadline", v)} multiline />
                <Field label="Hero Copy / Subtext" value={settings.heroCopy} onChange={v => updateSetting("heroCopy", v)} multiline />
                <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Primary Button Text" value={settings.heroCtaPrimary} onChange={v => updateSetting("heroCtaPrimary", v)} />
                  <Field label="Secondary Button Text" value={settings.heroCtaSecondary} onChange={v => updateSetting("heroCtaSecondary", v)} />
                </div>
              </SectionCard>
              <SectionCard title="Chrome Series Banner">
                <Field label="Banner Title" value={settings.chromeBannerTitle} onChange={v => updateSetting("chromeBannerTitle", v)} />
                <Field label="Banner Description" value={settings.chromeBannerDesc} onChange={v => updateSetting("chromeBannerDesc", v)} multiline />
              </SectionCard>
              <SectionCard title="Brand Story Block">
                <Field label="Brand Story Text" value={settings.brandStory} onChange={v => updateSetting("brandStory", v)} multiline />
              </SectionCard>
            </div>
          )}

          {activeSection === "Banner" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Announcement</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Ticker & Drop Banner</h2>
              <SectionCard title="Drop Alert Banner" accent>
                <Field label="Drop Announcement Text" value={settings.announcementText} onChange={v => updateSetting("announcementText", v)} />
              </SectionCard>
              <SectionCard title="Ticker Strip Items">
                {settings.bannerItems.map((item, i) => (
                  <Field key={i} label={`Item ${i + 1}`} value={item} onChange={v => {
                    const updated = [...settings.bannerItems];
                    updated[i] = v;
                    updateSetting("bannerItems", updated);
                  }} />
                ))}
              </SectionCard>
            </div>
          )}

          {activeSection === "Products" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Catalog</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Product Manager</h2>
              {settings.products.map(p => (
                <SectionCard key={p.id} title={p.name} accent={p.visible}>
                  <div className="admin-product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                    <Field label="Name" value={p.name} onChange={v => updateProduct(p.id, "name", v)} />
                    <Field label="Category" value={p.cat} onChange={v => updateProduct(p.id, "cat", v)} />
                    <Field label="Price ($)" value={String(p.price)} onChange={v => updateProduct(p.id, "price", v)} type="number" />
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Visible</div>
                      <button onClick={() => updateProduct(p.id, "visible", !p.visible)} style={{ background: p.visible ? "#0c6" : G2, color: p.visible ? "#000" : SD, border: `.5px solid ${p.visible ? "#0c6" : G3}`, padding: "10px 16px", fontSize: 9, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, whiteSpace: "nowrap" }}>
                        {p.visible ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 4, maxWidth: 200 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Tag</div>
                    <select value={p.tag || ""} onChange={e => updateProduct(p.id, "tag", e.target.value || null)} style={{ background: G2, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit", width: "100%" }}>
                      <option value="">None</option>
                      <option value="new">New</option>
                      <option value="drop">Drop</option>
                      <option value="ltd">Limited</option>
                      <option value="hot">Hot</option>
                    </select>
                  </div>
                </SectionCard>
              ))}
            </div>
          )}

          {activeSection === "Brand Story" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ About</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Brand Story</h2>
              <SectionCard title="Brand Narrative" accent>
                <Field label="Story / About Text" value={settings.brandStory} onChange={v => updateSetting("brandStory", v)} multiline />
                <Field label="Footer Tagline" value={settings.footerTagline} onChange={v => updateSetting("footerTagline", v)} multiline />
              </SectionCard>
            </div>
          )}

          {activeSection === "Contact & Social" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Contact</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Contact & Social</h2>
              <SectionCard title="Contact Info" accent>
                <Field label="General Email" value={settings.emailContact} onChange={v => updateSetting("emailContact", v)} type="email" />
                <Field label="Press Email" value={settings.pressEmail} onChange={v => updateSetting("pressEmail", v)} type="email" />
                <Field label="Phone" value={settings.phoneContact} onChange={v => updateSetting("phoneContact", v)} type="tel" />
              </SectionCard>
              <SectionCard title="Social Media Handles">
                <Field label="Instagram Handle" value={settings.instagramHandle} onChange={v => updateSetting("instagramHandle", v)} />
                <Field label="Twitter/X Handle" value={settings.twitterHandle} onChange={v => updateSetting("twitterHandle", v)} />
                <Field label="TikTok Handle" value={settings.tiktokHandle} onChange={v => updateSetting("tiktokHandle", v)} />
              </SectionCard>
            </div>
          )}

          {activeSection === "Theme" && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Design</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Theme & Colors</h2>
              <SectionCard title="Brand Colors" accent>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Accent / Chrome Color</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <input type="color" value={settings.accentColor} onChange={e => updateSetting("accentColor", e.target.value)} style={{ width: 52, height: 40, background: "none", border: `.5px solid ${G3}`, cursor: "pointer", padding: 2 }} />
                    <input type="text" value={settings.accentColor} onChange={e => updateSetting("accentColor", e.target.value)} style={{ background: G2, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "monospace", width: 120 }} />
                    <div style={{ width: 36, height: 36, background: settings.accentColor, border: `.5px solid #333` }} />
                  </div>
                </div>
                <div style={{ background: G2, border: `.5px solid ${G3}`, borderLeft: `2px solid ${S}`, padding: "14px 18px" }}>
                  <div style={{ fontSize: 10, color: SD, lineHeight: 1.7 }}>
                    The accent color is used for borders, highlights, price text, and chrome elements throughout the site. Default is <code style={{ color: S }}>#C0C0C0</code> (Silver Chrome).
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `.5px solid ${G3}`, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleSave} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
            <button onClick={() => window.open("/", "_blank")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "14px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Preview Site →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          .admin-sidebar { display: none !important; }
          .admin-hamburger { display: flex !important; }
          .admin-editor-label { display: none !important; }
          .admin-2col { grid-template-columns: 1fr !important; }
          .admin-product-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px) {
          .admin-product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}