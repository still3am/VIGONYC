import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Monitor, Smartphone, RotateCcw, Save, ExternalLink, Home as HomeIcon, Info, Mail, Globe, Pencil, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DEFAULTS } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import EditorPanel from "@/components/admin/EditorPanel";
import PagePreviewFrame from "@/components/admin/PagePreviewFrame";
import { SECTIONS, PAGE_FOR_SECTION, SECTION_OF_KEY } from "@/components/admin/adminContentConfig";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const NAV = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "global", label: "Global", icon: Globe },
];

const deviceBtn = { border: "none", padding: "7px 9px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" };

export default function VigoAdminEditor() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [draft, setDraft] = useState(DEFAULTS);
  const [saved, setSaved] = useState(DEFAULTS);
  const [previewDraft, setPreviewDraft] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [recordMap, setRecordMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [device, setDevice] = useState("desktop");
  const [mobileView, setMobileView] = useState("edit");

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u && u.role === "admin") setIsAdmin(true);
      else navigate("/account");
    }).catch(() => navigate("/account"));
  }, [navigate]);

  useEffect(() => {
    base44.entities.SiteSettings.list().catch(() => []).then(rows => {
      const map = { ...DEFAULTS };
      const ids = {};
      (rows || []).forEach(r => { if (r.key) { map[r.key] = r.value; ids[r.key] = r.id; } });
      setDraft(map); setSaved(map); setPreviewDraft(map); setRecordMap(ids); setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPreviewDraft(draft), 220);
    return () => clearTimeout(t);
  }, [draft]);

  const setField = (key, val) => setDraft(p => ({ ...p, [key]: val }));

  const hiddenSections = useMemo(() => { try { return JSON.parse(draft.editor_hidden_sections || "[]"); } catch { return []; } }, [draft.editor_hidden_sections]);
  const hiddenFields = useMemo(() => { try { return JSON.parse(draft.editor_hidden_fields || "[]"); } catch { return []; } }, [draft.editor_hidden_fields]);
  const toggleSectionHidden = (id, hide) => setField("editor_hidden_sections", JSON.stringify(hide ? [...new Set([...hiddenSections, id])] : hiddenSections.filter(x => x !== id)));
  const toggleFieldHidden = (key, hide) => setField("editor_hidden_fields", JSON.stringify(hide ? [...new Set([...hiddenFields, key])] : hiddenFields.filter(x => x !== key)));

  const dirty = useMemo(() => Object.keys(draft).some(k => String(draft[k] ?? "") !== String(saved[k] ?? "")), [draft, saved]);
  const dirtyCount = useMemo(() => Object.keys(draft).filter(k => String(draft[k] ?? "") !== String(saved[k] ?? "")).length, [draft, saved]);

  useEffect(() => {
    const handler = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleSave = async () => {
    setSaving(true);
    const changed = Object.keys(draft).filter(k => String(draft[k] ?? "") !== String(saved[k] ?? ""));
    let ok = 0, fail = 0;
    for (const key of changed) {
      const value = String(draft[key] ?? "");
      const section = SECTION_OF_KEY[key] || "global";
      try {
        if (recordMap[key]) {
          await base44.entities.SiteSettings.update(recordMap[key], { key, value, section });
        } else {
          const created = await base44.entities.SiteSettings.create({ key, value, section });
          if (created?.id) setRecordMap(p => ({ ...p, [key]: created.id }));
        }
        ok++;
      } catch { fail++; }
    }
    setSaved({ ...draft });
    setSaving(false);
    if (fail === 0) toast.success(`Saved ${ok} change${ok === 1 ? "" : "s"}`);
    else if (ok > 0) toast.error(`${ok} saved, ${fail} failed`);
    else toast.error("Save failed");
  };

  const handleReset = () => { setDraft(saved); setPreviewDraft(saved); toast("Reverted to saved"); };
  const handleBack = () => { if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return; navigate("/account"); };

  if (!isAdmin || !loaded) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G1 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Loading editor…</div>
    </div>;
  }

  const previewPage = PAGE_FOR_SECTION[activePage];
  const def = SECTIONS[activePage];

  return (
    <div className="ae-shell" style={{ height: "100vh", overflow: "hidden", background: G1, color: "var(--vt-text)", display: "flex", flexDirection: "column" }}>
      <header style={{ background: G1, borderBottom: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <button onClick={handleBack} style={{ background: "none", border: "none", color: SD, cursor: "pointer", padding: 6, display: "flex", alignItems: "center" }} title="Back"><ChevronLeft size={18} /></button>
          <div style={{ minWidth: 0, lineHeight: 1.1 }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Content</div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: .3 }}>{def.label}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="ae-device" style={{ display: "flex", alignItems: "center", gap: 2, background: G2, border: `.5px solid ${G3}`, padding: 3 }}>
            <button onClick={() => setDevice("desktop")} style={{ ...deviceBtn, background: device === "desktop" ? S : "none", color: device === "desktop" ? "#000" : SD }} title="Desktop preview"><Monitor size={15} /></button>
            <button onClick={() => setDevice("mobile")} style={{ ...deviceBtn, background: device === "mobile" ? S : "none", color: device === "mobile" ? "#000" : SD }} title="Mobile preview"><Smartphone size={15} /></button>
          </div>
          {dirty && <span style={{ fontSize: 8, letterSpacing: 1, color: S, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: S }} />{dirtyCount} unsaved</span>}
          <button onClick={handleReset} disabled={!dirty} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "8px 12px", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", cursor: dirty ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: dirty ? 1 : 0.4, display: "flex", alignItems: "center", gap: 6 }}><RotateCcw size={13} /> Reset</button>
          <button onClick={handleSave} disabled={!dirty || saving} style={{ background: dirty ? S : G3, color: dirty ? "#000" : SD, border: "none", padding: "9px 16px", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 800, cursor: dirty ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}><Save size={13} /> {saving ? "Saving…" : "Save"}</button>
        </div>
      </header>

      <div className="ae-body" style={{ flex: 1, display: "grid", gridTemplateColumns: "240px 460px 1fr", gridTemplateRows: "1fr", minHeight: 0 }}>
        <aside className="ae-sidebar" style={{ borderRight: `.5px solid ${G3}`, overflowY: "auto", minHeight: 0, background: G1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 16px 12px", borderBottom: `.5px solid ${G3}` }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2 }}>VIGONYC</div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 2 }}>Content Editor</div>
          </div>
          <nav style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV.map(n => {
              const Icon = n.icon;
              const active = activePage === n.id;
              return (
                <button key={n.id} onClick={() => setActivePage(n.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", background: active ? G2 : "none", border: "none", borderLeft: active ? `2px solid ${S}` : "2px solid transparent", color: active ? "var(--vt-text)" : SD, fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background .15s" }}>
                  <Icon size={16} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                  {n.label}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "12px 14px", borderTop: `.5px solid ${G3}` }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: SD, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1.5 }}>
              <ExternalLink size={13} /> View live site
            </a>
          </div>
        </aside>

        <div className={"ae-editor " + (mobileView === "preview" ? "ae-hide-mobile" : "")} style={{ borderRight: `.5px solid ${G3}`, overflowY: "auto", minHeight: 0 }}>
          <div style={{ padding: "20px 18px 6px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>{def.label}</div>
            <div style={{ fontSize: 11, color: SD, marginTop: 4, lineHeight: 1.6 }}>{def.desc}</div>
          </div>
          <EditorPanel draft={draft} saved={saved} setField={setField} activePage={activePage} hiddenSections={hiddenSections} hiddenFields={hiddenFields} onToggleSection={toggleSectionHidden} onToggleField={toggleFieldHidden} />
        </div>

        <div className={"ae-preview " + (mobileView === "edit" ? "ae-hide-mobile" : "")} style={{ minHeight: 0, overflow: "hidden", background: G2 }}>
          <PagePreviewFrame page={previewPage} settings={previewDraft} device={device} />
        </div>
      </div>

      <div className="ae-bottomnav" style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 12px calc(10px + env(safe-area-inset-bottom,0px))", background: "rgba(18,18,20,0.82)", backdropFilter: "blur(30px) saturate(1.7)", WebkitBackdropFilter: "blur(30px) saturate(1.7)", borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", background: "rgba(30,30,32,0.6)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 30, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.4)" }}>
            {[{ id: "edit", label: "Edit", Icon: Pencil, on: () => setMobileView("edit"), active: mobileView === "edit" }, { id: "preview", label: "Preview", Icon: Eye, on: () => setMobileView("preview"), active: mobileView === "preview" }].map(it => {
              const I = it.Icon;
              return (
                <button key={it.id} onClick={it.on} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, width: 76, height: 48, borderRadius: 24, background: it.active ? "rgba(255,255,255,0.14)" : "transparent", border: `0.5px solid ${it.active ? "rgba(255,255,255,0.2)" : "transparent"}`, boxShadow: it.active ? "inset 0 1px 0 rgba(255,255,255,0.2)" : "none", color: it.active ? "#fff" : "rgba(200,200,200,0.65)", fontSize: 8, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: it.active ? 700 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all .25s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  <I size={18} style={{ transform: it.active ? "scale(1.12)" : "scale(1)", transition: "transform .25s" }} />
                  <span>{it.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .ae-bottomnav{display:none;}
        @media(max-width:1023px){
          .ae-body{display:flex !important; flex-direction:column !important;}
          .ae-sidebar{display:none !important;}
          .ae-device{display:none !important;}
          .ae-bottomnav{display:block !important;}
          .ae-hide-mobile{display:none !important;}
          .ae-editor,.ae-preview{flex:1; min-height:0; border-right:none !important;}
        }
      `}</style>
    </div>
  );
}