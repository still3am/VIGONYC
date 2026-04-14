import { useState, useEffect } from "react";
import AdminDropsCalendar from "./AdminDropsCalendar";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const EMPTY = { name: "", series: "", description: "", date: "", time: "", pieces: "", price: "", status: "upcoming", tag: "", tagColor: S, image: "", productIds: [] };
const STATUSES = ["upcoming", "live", "soldout"];

function DropModal({ drop, onSave, onClose }) {
  const [form, setForm] = useState(drop || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    base44.entities.Product.list("-created_date", 200).then(setAllProducts).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.series) return alert("Name and series are required.");
    setSaving(true);
    await onSave({ ...form, pieces: parseFloat(form.pieces) || 0 });
    setSaving(false);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "#0f0f0f", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(580px,95vw)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase" }}>{drop?.id ? "Edit Drop" : "New Drop"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Drop Name (e.g. Drop 02)" value={form.name} onChange={v => set("name", v)} />
            <Field label="Series (e.g. Mirror Series)" value={form.series} onChange={v => set("series", v)} />
          </div>
          <TextArea label="Description" value={form.description} onChange={v => set("description", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date" type="date" value={form.date} onChange={v => set("date", v)} />
            <Field label="Time (e.g. 12:00 PM EST)" value={form.time} onChange={v => set("time", v)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Units" type="number" value={form.pieces} onChange={v => set("pieces", v)} />
            <Field label="Price (e.g. From $68)" value={form.price} onChange={v => set("price", v)} />
            <SelectField label="Status" value={form.status} options={STATUSES} onChange={v => set("status", v)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Tag Label (e.g. Coming Soon)" value={form.tag} onChange={v => set("tag", v)} />
            <Field label="Tag Color (hex)" value={form.tagColor} onChange={v => set("tagColor", v)} />
          </div>

          {/* Image Upload */}
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Drop Cover Image</div>
            {form.image && (
              <div style={{ position: "relative", width: "100%", height: 160, marginBottom: 8, overflow: "hidden", background: G2 }}>
                <img src={form.image} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => set("image", "")} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            )}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 6 }}>
              <span style={{ background: G2, border: `0.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                {uploadingImg ? "Uploading..." : "Upload Image"}
              </span>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploadingImg(true);
                try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); set("image", file_url); } catch {}
                setUploadingImg(false);
              }} />
            </label>
            <div style={{ fontSize: 8, color: SD, marginBottom: 4 }}>Or paste URL:</div>
            <input value={form.image || ""} onChange={e => set("image", e.target.value)} placeholder="https://..." style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "8px 12px", fontSize: 11, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>

          {/* Product Linking */}
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Products in This Drop</div>
            {allProducts.length === 0 && <div style={{ fontSize: 10, color: SD }}>Loading products...</div>}
            <div style={{ maxHeight: 180, overflowY: "auto", border: `0.5px solid ${G3}`, background: G2 }}>
              {allProducts.map(p => (
                <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `0.5px solid ${G3}` }}>
                  <input type="checkbox" checked={(form.productIds || []).includes(p.id)} onChange={() => {
                    const curr = form.productIds || [];
                    set("productIds", curr.includes(p.id) ? curr.filter(x => x !== p.id) : [...curr, p.id]);
                  }} style={{ accentColor: S }} />
                  <span style={{ fontSize: 11, color: "#fff", flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 9, color: SD }}>${p.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Drop"}
            </button>
            <button onClick={onClose} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDrops() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("list");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Drop.list("-created_date", 100).catch(() => []);
    setDrops(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) await base44.entities.Drop.update(form.id, form);
    else await base44.entities.Drop.create(form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this drop?")) return;
    await base44.entities.Drop.delete(id);
    load();
  };

  const statusColor = s => s === "live" ? "#0c6" : s === "upcoming" ? S : "#e03";

  return (
    <div>
      {modal && <DropModal drop={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Schedule</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Drops</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, border: `0.5px solid ${G3}` }}>
          {[["list","List"],["calendar","Calendar"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? S : G2, color: view === v ? "#000" : SD, border: "none", borderRight: `0.5px solid ${G3}`, padding: "10px 18px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: view === v ? 900 : 400, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
          <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "10px 20px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>+ New Drop</button>
        </div>
      </div>

      {view === "calendar" && (
        <AdminDropsCalendar drops={drops} onEdit={d => setModal(d)} onDelete={handleDelete} />
      )}

      {view === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading...</div>}
          {!loading && drops.length === 0 && (
            <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 24, opacity: .15, marginBottom: 12 }}>✦</div>
              <div style={{ fontSize: 13, color: SD, marginBottom: 20 }}>No drops scheduled yet</div>
              <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Schedule First Drop</button>
            </div>
          )}
          {!loading && drops.map(d => (
            <div key={d.id} style={{ background: G1, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${statusColor(d.status)}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = G2}
              onMouseLeave={e => e.currentTarget.style.background = G1}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{d.name} — {d.series}</div>
                  <span style={{ fontSize: 7, color: statusColor(d.status), border: `0.5px solid ${statusColor(d.status)}`, padding: "2px 8px", letterSpacing: 1, textTransform: "uppercase" }}>{d.status}</span>
                </div>
                <div style={{ fontSize: 10, color: SD }}>
                  {d.date && new Date(d.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  {d.time && ` · ${d.time}`}
                  {d.pieces && ` · ${d.pieces} units`}
                  {d.price && ` · ${d.price}`}
                </div>
                {d.description && <div style={{ fontSize: 11, color: SD, marginTop: 4 }}>{d.description.slice(0, 80)}{d.description.length > 80 ? "..." : ""}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModal(d)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 9, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }}>Edit</button>
                <button onClick={() => handleDelete(d.id)} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "8px 16px", fontSize: 9, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={3} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}