import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const EMPTY = { title: "", subtitle: "", image_url: "", collection: "", featured: false, sort_order: 0 };

function EntryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("image_url", file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.image_url) return alert("Title and image are required.");
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 500, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(680px,95vw)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 3 }}>✦ Editorial</div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1, color: "#fff", textTransform: "uppercase" }}>{entry?.id ? "Edit Entry" : "New Lookbook Entry"}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, fontSize: 14, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Left: Image */}
          <div style={{ borderRight: `0.5px solid ${G3}`, padding: "20px" }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Image</div>
            <div style={{ position: "relative", aspectRatio: "4/5", background: G2, border: `0.5px solid ${G3}`, marginBottom: 10, overflow: "hidden" }}>
              {form.image_url ? (
                <img src={form.image_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ fontSize: 28, opacity: 0.12 }}>✦</div>
                  <div style={{ fontSize: 9, color: SD, letterSpacing: 1 }}>No image</div>
                </div>
              )}
              <label style={{ position: "absolute", inset: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: form.image_url ? "rgba(0,0,0,.45)" : "transparent", opacity: form.image_url ? 0 : 1, transition: "opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => { if (form.image_url) e.currentTarget.style.opacity = 0; }}>
                <div style={{ background: "rgba(0,0,0,.75)", border: `0.5px solid ${G3}`, padding: "8px 14px", fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase" }}>
                  {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Image"}
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </label>
            </div>
            <div style={{ fontSize: 8, color: SD, marginBottom: 6, letterSpacing: 1 }}>Or paste URL</div>
            <input value={form.image_url ?? ""} onChange={e => set("image_url", e.target.value)} placeholder="https://..." style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "9px 12px", fontSize: 10, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
          </div>

          {/* Right: Fields */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Title *" value={form.title} onChange={v => set("title", v)} />
            <Field label="Subtitle / Caption" value={form.subtitle} onChange={v => set("subtitle", v)} />
            <Field label="Collection" value={form.collection} onChange={v => set("collection", v)} />
            <Field label="Sort Order" type="number" value={form.sort_order} onChange={v => set("sort_order", parseInt(v) || 0)} />

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: form.featured ? "rgba(192,192,192,.06)" : "transparent", border: `0.5px solid ${form.featured ? S : G3}`, padding: "12px", transition: "all .2s", marginTop: 4 }}>
              <input type="checkbox" checked={form.featured || false} onChange={e => set("featured", e.target.checked)} style={{ accentColor: S, width: 14, height: 14, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, color: form.featured ? S : "#fff", fontWeight: 700 }}>Featured Entry</div>
                <div style={{ fontSize: 9, color: SD, marginTop: 2 }}>Displayed as hero in the lookbook</div>
              </div>
            </label>

            <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", gap: 8 }}>
              <button onClick={handleSave} disabled={saving || uploading} style={{ flex: 1, background: S, color: "#000", border: "none", padding: "12px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save Entry"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLookbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.LookbookEntry.list("sort_order", 100).catch(() => []);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) await base44.entities.LookbookEntry.update(form.id, form);
    else await base44.entities.LookbookEntry.create(form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this lookbook entry?")) return;
    await base44.entities.LookbookEntry.delete(id);
    load();
  };

  return (
    <div>
      {modal && <EntryModal entry={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Editorial</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Lookbook</h2>
        </div>
        <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Entry
        </button>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading...</div>}
      {!loading && entries.length === 0 && (
        <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: SD, marginBottom: 20 }}>No lookbook entries yet</div>
          <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Add First Entry</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="admin-3col">
        {!loading && entries.map(e => (
          <div key={e.id} style={{ background: G1, border: `0.5px solid ${G3}`, overflow: "hidden", position: "relative" }}
            onMouseEnter={el => el.currentTarget.querySelector('.card-overlay').style.opacity = 1}
            onMouseLeave={el => el.currentTarget.querySelector('.card-overlay').style.opacity = 0}>
            <div style={{ position: "relative", aspectRatio: "4/5", background: G2, overflow: "hidden" }}>
              {e.image_url ? (
                <img src={e.image_url} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease" }}
                  onMouseEnter={el => el.target.style.transform = "scale(1.04)"}
                  onMouseLeave={el => el.target.style.transform = "scale(1)"} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 12 }}>No Image</div>
              )}
              {e.featured && (
                <div style={{ position: "absolute", top: 10, left: 10, background: S, color: "#000", fontSize: 7, letterSpacing: 2, padding: "3px 8px", textTransform: "uppercase", fontWeight: 900 }}>★ Featured</div>
              )}
              {/* Hover Overlay */}
              <div className="card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0, transition: "opacity .2s" }}>
                <button onClick={() => setModal(e)} style={{ background: S, color: "#000", border: "none", padding: "9px 18px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "9px 14px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
              </div>
            </div>
            <div style={{ padding: "14px 16px", borderTop: `0.5px solid ${G3}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{e.title}</div>
              {e.subtitle && <div style={{ fontSize: 10, color: SD, marginBottom: 4 }}>{e.subtitle}</div>}
              {e.collection && <div style={{ fontSize: 8, color: S, letterSpacing: 2, textTransform: "uppercase" }}>{e.collection}</div>}
            </div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){.admin-3col{grid-template-columns:1fr 1fr !important;}} @media(max-width:480px){.admin-3col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input type={type} value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}