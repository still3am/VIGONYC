import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { DEFAULTS } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import EditorPanel from "@/components/admin/EditorPanel";
import PagePreviewFrame from "@/components/admin/PagePreviewFrame";
import { SECTIONS, PAGE_FOR_SECTION, SECTION_OF_KEY } from "@/components/admin/adminContentConfig";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

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
  const [activeGroup, setActiveGroup] = useState(0);
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

  useEffect(() => { setActiveGroup(0); }, [activePage]);

  useEffect(() => {
    const t = setTimeout(() => setPreviewDraft(draft), 220);
    return () => clearTimeout(t);
  }, [draft]);

  const setField = (key, val) => setDraft(p => ({ ...p, [key]: val }));

  const dirty = useMemo(() => Object.keys(draft).some(k => String(draft[k] ?? "") !== String(saved[k] ?? "")), [draft, saved]);

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

  if (!isAdmin || !loaded) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G1 }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Loading editor…</div>
    </div>;
  }

  const previewPage = PAGE_FOR_SECTION[activePage];
  const pageLabel = SECTIONS[activePage].label;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: G1, color: "var(--vt-text)", display: "flex", flexDirection: "column" }}>
      <header style={{ background: G1, borderBottom: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <button onClick={() => navigate("/account")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "8px 12px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>← Back</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1 }}>Content Editor</div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{pageLabel} · live preview</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {dirty && <span style={{ fontSize: 8, letterSpacing: 1, color: S, textTransform: "uppercase" }}>● Unsaved</span>}
          <button onClick={handleReset} disabled={!dirty} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "9px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: dirty ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: dirty ? 1 : 0.4 }}>Reset</button>
          <button onClick={handleSave} disabled={!dirty || saving} style={{ background: dirty ? S : G3, color: dirty ? "#000" : SD, border: "none", padding: "9px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: dirty ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </header>

      <div className="ae-toggle" style={{ display: "none", padding: "8px 14px", borderBottom: `.5px solid ${G3}`, gap: 8, flexShrink: 0 }}>
        <button onClick={() => setMobileView("edit")} style={{ flex: 1, padding: "11px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: mobileView === "edit" ? 900 : 400, background: mobileView === "edit" ? S : "transparent", color: mobileView === "edit" ? "#000" : SD, border: `.5px solid ${mobileView === "edit" ? S : G3}`, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
        <button onClick={() => setMobileView("preview")} style={{ flex: 1, padding: "11px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: mobileView === "preview" ? 900 : 400, background: mobileView === "preview" ? S : "transparent", color: mobileView === "preview" ? "#000" : SD, border: `.5px solid ${mobileView === "preview" ? S : G3}`, cursor: "pointer", fontFamily: "inherit" }}>Preview</button>
      </div>

      <div className="ae-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "420px 1fr", minHeight: 0 }}>
        <div className={mobileView === "preview" ? "ae-hide-md" : ""} style={{ borderRight: `.5px solid ${G3}`, overflowY: "auto", minHeight: 0 }}>
          <EditorPanel draft={draft} setField={setField} activePage={activePage} setActivePage={setActivePage} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
        </div>
        <div className={mobileView === "edit" ? "ae-hide-md" : ""} style={{ overflowY: "auto", minHeight: 0, background: "var(--vt-bg)" }}>
          <PagePreviewFrame page={previewPage} settings={previewDraft} />
        </div>
      </div>

      <style>{`
        @media(max-width:1023px){
          .ae-grid{grid-template-columns:1fr !important;}
          .ae-toggle{display:flex !important;}
          .ae-hide-md{display:none !important;}
        }
      `}</style>
    </div>
  );
}