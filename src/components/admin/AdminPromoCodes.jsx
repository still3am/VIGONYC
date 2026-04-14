import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#0d0d0d";
const G2 = "#111111";
const G3 = "#1a1a1a";
const SD = "#555555";

const EMPTY = { code: "", discountPercent: 10, active: true, expiresAt: "" };

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "11px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.PromoCode.list("-created_date", 100).catch(() => []);
    setCodes(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ code: c.code, discountPercent: c.discountPercent, active: c.active !== false, expiresAt: c.expiresAt || "" }); setEditingId(c.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    if (!form.code.trim()) return alert("Code is required");
    if (!form.discountPercent || form.discountPercent < 1 || form.discountPercent > 100) return alert("Discount must be 1-100%");
    setSaving(true);
    const payload = { ...form, code: form.code.trim().toUpperCase(), discountPercent: Number(form.discountPercent) };
    if (editingId) await base44.entities.PromoCode.update(editingId, payload).catch(() => {});
    else {
      const existing = await base44.entities.PromoCode.filter({ code: payload.code }, "-created_date", 1).catch(() => []);
      if (existing?.length > 0) { alert("Code already exists"); setSaving(false); return; }
      await base44.entities.PromoCode.create(payload).catch(() => {});
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    load();
  };

  const toggleActive = async (c) => {
    await base44.entities.PromoCode.update(c.id, { active: !c.active }).catch(() => {});
    load();
  };

  const del = async (id) => {
    if (!confirm("Delete this promo code?")) return;
    await base44.entities.PromoCode.delete(id).catch(() => {});
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Promotions</div>
          <h2 style={{ fontSize: "clamp(20px,5vw,24px)", fontWeight: 900, color: "#fff", letterSpacing: -1 }}>Promo Codes</h2>
        </div>
        <button onClick={openNew} style={{ background: S, color: "#000", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          + New Code
        </button>
      </div>

      {showForm && (
        <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "20px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>{editingId ? "Edit Code" : "Create Code"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Code (e.g. SAVE20)" value={form.code} onChange={v => setForm(p => ({ ...p, code: v.toUpperCase() }))} placeholder="VIGONYC10" />
            <Field label="Discount %" type="number" value={form.discountPercent} onChange={v => setForm(p => ({ ...p, discountPercent: v }))} placeholder="10" />
          </div>
          <Field label="Expires At (optional)" type="date" value={form.expiresAt} onChange={v => setForm(p => ({ ...p, expiresAt: v }))} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setForm(p => ({ ...p, active: !p.active }))} style={{ width: 40, height: 22, borderRadius: 11, background: form.active ? S : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 2, left: form.active ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: form.active ? "#000" : SD, transition: "left .2s" }} />
            </button>
            <span style={{ fontSize: 11, color: form.active ? "#fff" : SD }}>{form.active ? "Active" : "Inactive"}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, background: S, color: "#000", border: "none", padding: "11px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancel} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "11px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: SD, fontSize: 12 }}>Loading...</div>
      ) : codes.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 28, opacity: .1, marginBottom: 10 }}>%</div>
          <div style={{ fontSize: 12, color: SD }}>No promo codes yet. Create your first one.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {codes.map(c => {
            const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
            return (
              <div key={c.id} style={{ background: G2, border: `.5px solid ${G3}`, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>{c.code}</div>
                    <div style={{ fontSize: 11, color: S, fontWeight: 700 }}>{c.discountPercent}% off</div>
                    <div style={{ fontSize: 8, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", border: `.5px solid ${c.active && !isExpired ? "#0c6" : "#e03"}`, color: c.active && !isExpired ? "#0c6" : "#e03" }}>
                      {isExpired ? "Expired" : c.active ? "Active" : "Inactive"}
                    </div>
                    {c.expiresAt && <div style={{ fontSize: 9, color: SD }}>Exp. {new Date(c.expiresAt).toLocaleDateString()}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => toggleActive(c)} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "7px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                      {c.active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => openEdit(c)} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "7px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                    <button onClick={() => del(c.id)} style={{ background: "none", border: `.5px solid #e03`, color: "#e03", padding: "7px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Del</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}