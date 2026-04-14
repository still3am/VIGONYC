import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const EMPTY = { name: "", price: "", cat: "", collection: "", tag: "", sizes: [], colors: [], featured: false, images: [], videos: [], description: "", stock: 0, inStock: true };
const CATS = ["Tops", "Bottoms", "Outerwear", "Accessories", "Footwear"];
const TAGS = ["new", "drop", "ltd", "hot"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_COLORS = ["Black", "White", "Chrome", "Grey", "Navy", "Red"];

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [pendingColor, setPendingColor] = useState("#C0C0C0");
  const [pendingColorName, setPendingColorName] = useState("");
  // colorMeta stores {name -> hex} for display only, not saved to DB
  const [colorMeta, setColorMeta] = useState(() => {
    // Try to init from existing colors that look like hex
    const meta = {};
    (product?.colors || []).forEach(c => { if (c.startsWith("#")) meta[c] = c; });
    return meta;
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setForm(p => ({ ...p, [k]: p[k]?.includes(v) ? p[k].filter(x => x !== v) : [...(p[k] || []), v] }));

  const addPendingColor = () => {
    const name = pendingColorName.trim() || pendingColor;
    if (!(form.colors || []).includes(name)) {
      set("colors", [...(form.colors || []), name]);
      // Store hex so we can show the swatch
      setColorMeta(prev => ({ ...prev, [name]: pendingColor }));
    }
    setPendingColorName("");
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.cat) return alert("Name, price, and category are required.");
    setSaving(true);
    try {
      await onSave({ ...form, price: parseFloat(form.price) });
      onClose();
    } catch (err) {
      alert("Failed to save product: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "#0f0f0f", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(580px,96vw)", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#0f0f0f", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase" }}>{product?.id ? "Edit Product" : "New Product"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Product Name" value={form.name} onChange={v => set("name", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Price (USD)" type="number" value={form.price} onChange={v => set("price", v)} />
            <SelectField label="Category" value={form.cat} options={CATS} onChange={v => set("cat", v)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Collection" value={form.collection} onChange={v => set("collection", v)} />
            <SelectField label="Tag" value={form.tag} options={TAGS} onChange={v => set("tag", v)} />
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Sizes</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALL_SIZES.map(s => (
                <button key={s} onClick={() => toggleArr("sizes", s)} style={{ padding: "7px 14px", fontSize: 10, background: form.sizes?.includes(s) ? S : G2, color: form.sizes?.includes(s) ? "#000" : SD, border: `0.5px solid ${form.sizes?.includes(s) ? S : G3}`, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Colors</div>

            {/* Preset swatches */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {[
                { name: "Black", hex: "#111111" }, { name: "White", hex: "#f5f5f5" },
                { name: "Chrome", hex: "#C0C0C0" }, { name: "Grey", hex: "#888888" },
                { name: "Navy", hex: "#1a2744" }, { name: "Red", hex: "#cc0033" },
              ].map(({ name, hex }) => {
                const selected = (form.colors || []).includes(name);
                return (
                  <button key={name} title={name} onClick={() => {
                    if (selected) { set("colors", form.colors.filter(x => x !== name)); }
                    else { set("colors", [...(form.colors || []), name]); setColorMeta(prev => ({ ...prev, [name]: hex })); }
                  }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: hex, border: selected ? `2px solid ${S}` : "2px solid transparent", outline: selected ? `1px solid ${S}` : "1px solid rgba(255,255,255,.12)", transition: "all .15s", boxSizing: "border-box" }} />
                    <span style={{ fontSize: 7, color: selected ? S : SD, letterSpacing: 1, textTransform: "uppercase", transition: "color .15s" }}>{name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom color picker */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: G2, border: `0.5px solid ${G3}`, padding: "8px 12px", marginBottom: 10 }}>
              <input type="color" value={pendingColor} onChange={e => setPendingColor(e.target.value)} style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0, borderRadius: "50%" }} title="Pick color" />
              <input value={pendingColorName} onChange={e => setPendingColorName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPendingColor()} placeholder="Custom color name…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 11, fontFamily: "inherit" }} />
              <button onClick={addPendingColor} style={{ background: S, color: "#000", border: "none", padding: "5px 12px", fontSize: 8, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", fontWeight: 900, whiteSpace: "nowrap" }}>+ Add</button>
            </div>

            {/* Selected color chips */}
            {(form.colors || []).length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(form.colors || []).map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 5, background: G2, border: `0.5px solid ${G3}`, padding: "4px 10px 4px 7px", borderRadius: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colorMeta[c] || c, border: "0.5px solid rgba(255,255,255,.15)", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "#ccc" }}>{c}</span>
                    <button onClick={() => { set("colors", form.colors.filter(x => x !== c)); setColorMeta(prev => { const n = { ...prev }; delete n[c]; return n; }); }} style={{ background: "none", border: "none", color: "#e03", cursor: "pointer", fontSize: 11, lineHeight: 1, padding: "0 0 0 3px", fontFamily: "inherit", opacity: 0.7 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Product Images</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {(form.images || []).map((url, i) => (
                <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                  <img src={url} alt="" style={{ width: 72, height: 72, objectFit: "cover", border: `0.5px solid ${G3}` }} />
                  <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
              <label style={{ width: 72, height: 72, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4 }}>
                {uploadingImg ? <span style={{ fontSize: 9, color: SD }}>...</span> : <><span style={{ fontSize: 20, color: SD }}>+</span><span style={{ fontSize: 8, color: SD }}>Image</span></>}
                <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={async (e) => {
                  setUploadingImg(true);
                  const files = Array.from(e.target.files);
                  const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
                  set("images", [...(form.images || []), ...urls]);
                  setUploadingImg(false);
                }} />
              </label>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Product Videos</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(form.videos || []).map((url, i) => (
                <div key={i} style={{ position: "relative", width: 72, height: 72, background: G2, border: `0.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video src={url} style={{ width: 72, height: 72, objectFit: "cover" }} />
                  <button onClick={() => set("videos", form.videos.filter((_, j) => j !== i))} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
              <label style={{ width: 72, height: 72, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4 }}>
                {uploadingVid ? <span style={{ fontSize: 9, color: SD }}>...</span> : <><span style={{ fontSize: 20, color: SD }}>+</span><span style={{ fontSize: 8, color: SD }}>Video</span></>}
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={async (e) => {
                  setUploadingVid(true);
                  const file = e.target.files[0];
                  const { file_url } = await base44.integrations.Core.UploadFile({ file });
                  set("videos", [...(form.videos || []), file_url]);
                  setUploadingVid(false);
                }} />
              </label>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Description</div>
            <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)} rows={3} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }} />
          </div>

          <Field label="Stock Count" type="number" value={form.stock ?? 0} onChange={v => set("stock", parseInt(v) || 0)} />

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Availability Status</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["in_stock", "#0c6", "In Stock"], ["low_stock", "#fa0", "Low Stock"], ["sold_out", "#e03", "Sold Out"]].map(([val, color, label]) => {
                const current = form.inStock === false ? "sold_out" : (form.tag === "low" ? "low_stock" : "in_stock");
                const active = current === val;
                return (
                  <button key={val} onClick={() => {
                    if (val === "sold_out") { set("inStock", false); }
                    else if (val === "low_stock") { set("inStock", true); set("tag", "ltd"); }
                    else { set("inStock", true); }
                  }} style={{ flex: 1, padding: "10px 8px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${active ? color : G3}`, background: active ? `${color}18` : "transparent", color: active ? color : SD, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={form.featured || false} onChange={e => set("featured", e.target.checked)} style={{ accentColor: S, width: 14, height: 14 }} />
            <span style={{ fontSize: 11, color: "#fff" }}>Featured product</span>
          </label>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: S, color: "#000", border: "none", padding: "13px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button onClick={onClose} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "13px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Product.list("-created_date", 200).catch(() => []);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) await base44.entities.Product.update(form.id, form);
    else await base44.entities.Product.create(form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await base44.entities.Product.delete(id);
    setDeleting(null);
    load();
  };

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.cat?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {modal && <ProductModal product={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Inventory</div>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Products</h2>
        </div>
        <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Product
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        {selectedIds.length > 0 && (
          <>
            <button onClick={async () => {
              if (!window.confirm(`Delete ${selectedIds.length} product${selectedIds.length > 1 ? "s" : ""}?`)) return;
              await Promise.all(selectedIds.map(id => base44.entities.Product.delete(id)));
              setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
              setSelectedIds([]);
            }} style={{ background: "#e03", color: "#fff", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Delete {selectedIds.length}</button>
            <button onClick={() => setSelectedIds([])} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "10px 12px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </>
        )}
      </div>

      {/* Desktop table */}
      <div className="admin-shop-desktop" style={{ background: G1, border: `0.5px solid ${G3}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px 48px 2fr 1fr 60px 80px 90px", padding: "10px 16px", borderBottom: `0.5px solid ${G3}`, fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", alignItems: "center" }}>
          <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} style={{ accentColor: S }} />
          <span></span><span>Product</span><span>Category</span><span>Tag</span><span>Price</span><span></span>
        </div>
        {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading...</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No products found</div>}
        {!loading && filtered.map(p => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "32px 48px 2fr 1fr 60px 80px 90px", padding: "10px 16px", borderBottom: `0.5px solid ${G3}`, alignItems: "center", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = G2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} onClick={e => e.stopPropagation()} style={{ accentColor: S }} />
            <div style={{ width: 40, height: 40, background: G2, border: `0.5px solid ${G3}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: 40, height: 40, background: G3 }} />}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.featured && <span style={{ fontSize: 7, color: S, letterSpacing: 1, textTransform: "uppercase" }}>★ Featured</span>}
                {p.inStock === false && <span style={{ fontSize: 7, color: "#e03", letterSpacing: 1, textTransform: "uppercase" }}>Sold Out</span>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: SD }}>{p.cat}</div>
            <div>{p.tag && <span style={{ fontSize: 7, color: S, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: S }}>${p.price}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setModal(p)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "5px 10px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "5px 8px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="admin-shop-mobile" style={{ display: "none", flexDirection: "column", gap: 8 }}>
        {!loading && filtered.map(p => (
          <div key={p.id} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, background: G2, border: `0.5px solid ${G3}`, overflow: "hidden", flexShrink: 0 }}>
                {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: G3 }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: SD, marginBottom: 6 }}>{p.cat} {p.collection ? `· ${p.collection}` : ""}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: S }}>${p.price}</span>
                  {p.tag && <span style={{ fontSize: 7, color: S, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}
                  {p.inStock === false && <span style={{ fontSize: 7, color: "#e03", letterSpacing: 1, textTransform: "uppercase" }}>Sold Out</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => setModal(p)} style={{ flex: 1, background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "9px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "9px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:680px){
          .admin-shop-desktop { display: none !important; }
          .admin-shop-mobile { display: flex !important; }
        }
      `}</style>
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

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}