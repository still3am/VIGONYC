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
const PRESET_COLORS = [
  { name: "Black", hex: "#111111" }, { name: "White", hex: "#f5f5f5" },
  { name: "Chrome", hex: "#C0C0C0" }, { name: "Grey", hex: "#888888" },
  { name: "Navy", hex: "#1a2744" }, { name: "Red", hex: "#cc0033" },
  { name: "Olive", hex: "#4a5240" }, { name: "Cream", hex: "#f0ead6" },
];

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 7, letterSpacing: 3, color: S, textTransform: "uppercase", paddingBottom: 10, borderBottom: `0.5px solid ${G3}`, marginBottom: 14 }}>
      ✦ {children}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [pendingColor, setPendingColor] = useState("#C0C0C0");
  const [pendingColorName, setPendingColorName] = useState("");
  const [colorMeta, setColorMeta] = useState(() => {
    const meta = {};
    (product?.colors || []).forEach(c => { if (c.startsWith("#")) meta[c] = c; });
    PRESET_COLORS.forEach(({ name, hex }) => { meta[name] = hex; });
    return meta;
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setForm(p => ({ ...p, [k]: p[k]?.includes(v) ? p[k].filter(x => x !== v) : [...(p[k] || []), v] }));

  const addPendingColor = () => {
    const name = pendingColorName.trim() || pendingColor;
    if (!(form.colors || []).includes(name)) {
      set("colors", [...(form.colors || []), name]);
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

  const availStatus = form.inStock === false ? "sold_out" : (form.stock > 0 && form.stock <= 5 ? "low_stock" : "in_stock");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(680px,97vw)", maxHeight: "94vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 7, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 2 }}>✦ {product?.id ? "Edit" : "New"} Product</div>
            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: -0.5, color: "#fff" }}>{form.name || "Untitled Product"}</div>
          </div>
          <button onClick={onClose} style={{ background: G2, border: `0.5px solid ${G3}`, color: SD, width: 32, height: 32, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── BASIC INFO ── */}
          <div>
            <SectionLabel>Basic Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Product Name *" value={form.name} onChange={v => set("name", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Price (USD) *" type="number" value={form.price} onChange={v => set("price", v)} />
                <SelectField label="Category *" value={form.cat} options={CATS} onChange={v => set("cat", v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Collection" value={form.collection} onChange={v => set("collection", v)} />
                <SelectField label="Tag" value={form.tag} options={TAGS} onChange={v => set("tag", v)} />
              </div>
              <div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Description</div>
                <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)} rows={3}
                  style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
              </div>
            </div>
          </div>

          {/* ── AVAILABILITY ── */}
          <div>
            <SectionLabel>Availability</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <Field label="Stock Count" type="number" value={form.stock ?? 0} onChange={v => set("stock", parseInt(v) || 0)} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "11px 14px", background: form.featured ? "rgba(192,192,192,.08)" : G2, border: `0.5px solid ${form.featured ? S : G3}`, transition: "all .2s" }}>
                  <input type="checkbox" checked={form.featured || false} onChange={e => set("featured", e.target.checked)} style={{ accentColor: S, width: 13, height: 13, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: form.featured ? S : SD, letterSpacing: 1, textTransform: "uppercase" }}>★ Featured</span>
                </label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["in_stock", "#0c6", "● In Stock"], ["low_stock", "#fa0", "● Low Stock"], ["sold_out", "#e03", "● Sold Out"]].map(([val, color, label]) => {
                const active = availStatus === val;
                return (
                  <button key={val} onClick={() => {
                    if (val === "sold_out") set("inStock", false);
                    else { set("inStock", true); if (val === "low_stock" && (form.stock === 0 || form.stock > 5)) set("stock", 3); }
                  }} style={{ flex: 1, padding: "11px 8px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", border: `0.5px solid ${active ? color : G3}`, background: active ? `${color}15` : G2, color: active ? color : SD, cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 700 : 400, transition: "all .2s" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SIZES ── */}
          <div>
            <SectionLabel>Sizes</SectionLabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALL_SIZES.map(s => {
                const on = form.sizes?.includes(s);
                return (
                  <button key={s} onClick={() => toggleArr("sizes", s)} style={{ padding: "9px 18px", fontSize: 11, fontWeight: on ? 700 : 400, background: on ? S : G2, color: on ? "#000" : SD, border: `0.5px solid ${on ? S : G3}`, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", letterSpacing: 1 }}>{s}</button>
                );
              })}
            </div>
          </div>

          {/* ── COLORS ── */}
          <div>
            <SectionLabel>Colors</SectionLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              {PRESET_COLORS.map(({ name, hex }) => {
                const selected = (form.colors || []).includes(name);
                return (
                  <button key={name} title={name} onClick={() => {
                    if (selected) set("colors", form.colors.filter(x => x !== name));
                    else { set("colors", [...(form.colors || []), name]); setColorMeta(prev => ({ ...prev, [name]: hex })); }
                  }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: hex, border: selected ? `2.5px solid ${S}` : "2.5px solid transparent", outline: "1.5px solid rgba(255,255,255,.12)", boxSizing: "border-box", transition: "all .15s" }} />
                    <span style={{ fontSize: 7, color: selected ? S : SD, letterSpacing: 1, textTransform: "uppercase" }}>{name}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: G2, border: `0.5px solid ${G3}`, padding: "8px 12px", marginBottom: 10 }}>
              <input type="color" value={pendingColor} onChange={e => setPendingColor(e.target.value)} style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
              <input value={pendingColorName} onChange={e => setPendingColorName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPendingColor()} placeholder="Custom color name…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 11, fontFamily: "inherit" }} />
              <button onClick={addPendingColor} style={{ background: S, color: "#000", border: "none", padding: "6px 14px", fontSize: 8, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", fontWeight: 900 }}>+ Add</button>
            </div>
            {(form.colors || []).length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(form.colors || []).map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 5, background: G2, border: `0.5px solid ${G3}`, padding: "4px 10px 4px 7px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colorMeta[c] || c, border: "0.5px solid rgba(255,255,255,.15)", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "#ccc" }}>{c}</span>
                    <button onClick={() => { set("colors", form.colors.filter(x => x !== c)); setColorMeta(prev => { const n = { ...prev }; delete n[c]; return n; }); }} style={{ background: "none", border: "none", color: "#e03", cursor: "pointer", fontSize: 11, padding: "0 0 0 3px", lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── MEDIA ── */}
          <div>
            <SectionLabel>Media</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Images */}
              <div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Images</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(form.images || []).map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 76, height: 76 }}>
                      <img src={url} alt="" style={{ width: 76, height: 76, objectFit: "cover", border: `0.5px solid ${G3}`, display: "block" }} />
                      {i === 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.7)", fontSize: 6, color: S, textAlign: "center", padding: "2px", letterSpacing: 1 }}>MAIN</div>}
                      <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ))}
                  <label style={{ width: 76, height: 76, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4, transition: "border-color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = S} onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
                    {uploadingImg
                      ? <div style={{ width: 20, height: 20, border: `2px solid ${G3}`, borderTop: `2px solid ${S}`, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                      : <><span style={{ fontSize: 22, color: SD, lineHeight: 1 }}>+</span><span style={{ fontSize: 7, color: SD, letterSpacing: 1 }}>IMAGE</span></>}
                    <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={async (e) => {
                      setUploadingImg(true);
                      const files = Array.from(e.target.files);
                      const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
                      set("images", [...(form.images || []), ...urls]);
                      setUploadingImg(false);
                    }} />
                  </label>
                </div>
                <div style={{ fontSize: 8, color: SD, marginTop: 6 }}>First image = main product photo</div>
              </div>

              {/* Videos */}
              <div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Videos</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(form.videos || []).map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 76, height: 76, background: "#000", border: `0.5px solid ${G3}`, overflow: "hidden" }}>
                      <video src={url} muted playsInline preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onMouseEnter={e => e.target.play()}
                        onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }} />
                      <div style={{ position: "absolute", bottom: 3, right: 3, background: "rgba(0,0,0,.7)", borderRadius: 2, padding: "1px 4px", fontSize: 7, color: "#fff", pointerEvents: "none" }}>▶</div>
                      <button onClick={() => set("videos", form.videos.filter((_, j) => j !== i))} style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ))}
                  <label style={{ width: 76, height: 76, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4, transition: "border-color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = S} onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
                    {uploadingVid
                      ? <div style={{ width: 20, height: 20, border: `2px solid ${G3}`, borderTop: `2px solid ${S}`, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                      : <><span style={{ fontSize: 22, color: SD, lineHeight: 1 }}>▶</span><span style={{ fontSize: 7, color: SD, letterSpacing: 1 }}>VIDEO</span></>}
                    <input type="file" accept="video/*" style={{ display: "none" }} onChange={async (e) => {
                      setUploadingVid(true);
                      const file = e.target.files[0];
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      set("videos", [...(form.videos || []), file_url]);
                      setUploadingVid(false);
                    }} />
                  </label>
                </div>
                <div style={{ fontSize: 8, color: SD, marginTop: 6 }}>Hover thumbnail to preview</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `0.5px solid ${G3}`, display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#0a0a0a" }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: saving ? G2 : S, color: saving ? SD : "#000", border: "none", padding: "14px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .2s" }}>
            {saving ? "Saving..." : product?.id ? "Update Product" : "Create Product"}
          </button>
          <button onClick={onClose} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "14px 22px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
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

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.cat?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.cat === filterCat;
    return matchSearch && matchCat;
  });

  const inStockCount = products.filter(p => p.inStock !== false).length;
  const soldOutCount = products.filter(p => p.inStock === false).length;

  return (
    <div>
      {modal && <ProductModal product={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Inventory</div>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff", margin: 0 }}>Products</h2>
        </div>
        <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 22px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Product
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {[[products.length, "Total", S], [inStockCount, "In Stock", "#0c6"], [soldOutCount, "Sold Out", "#e03"]].map(([n, l, c]) => (
          <div key={l} style={{ flex: 1, background: G1, border: `0.5px solid ${G3}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: c, letterSpacing: -1 }}>{n}</div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: filterCat === "all" ? SD : "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
          <option value="all">All Categories</option>
          {["Tops", "Bottoms", "Outerwear", "Accessories", "Footwear"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {selectedIds.length > 0 && (
          <>
            <button onClick={async () => {
              if (!window.confirm(`Delete ${selectedIds.length} product${selectedIds.length > 1 ? "s" : ""}?`)) return;
              await Promise.all(selectedIds.map(id => base44.entities.Product.delete(id)));
              setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
              setSelectedIds([]);
            }} style={{ background: "#e03", color: "#fff", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Delete {selectedIds.length}
            </button>
            <button onClick={() => setSelectedIds([])} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "10px 12px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
          </>
        )}
      </div>

      {/* Desktop table */}
      <div className="admin-shop-desktop" style={{ background: G1, border: `0.5px solid ${G3}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px 56px 2fr 1fr 70px 70px 100px", padding: "10px 16px", borderBottom: `0.5px solid ${G3}`, fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])} style={{ accentColor: S }} />
          <span></span><span>Product</span><span>Category</span><span>Status</span><span>Price</span><span></span>
        </div>
        {loading && <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading products...</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>No products found</div>}
        {!loading && filtered.map(p => {
          const inStock = p.inStock !== false;
          const statusColor = inStock ? "#0c6" : "#e03";
          const statusLabel = inStock ? "In Stock" : "Sold Out";
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "32px 56px 2fr 1fr 70px 70px 100px", padding: "10px 16px", borderBottom: `0.5px solid ${G3}`, alignItems: "center", gap: 8, transition: "background .15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = G2}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => setModal(p)}>
              <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} onClick={e => e.stopPropagation()} style={{ accentColor: S }} />
              <div style={{ width: 44, height: 44, background: G2, border: `0.5px solid ${G3}`, overflow: "hidden", flexShrink: 0 }}>
                {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: G3 }} />}
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#fff", marginBottom: 3, fontWeight: 500 }}>{p.name}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {p.featured && <span style={{ fontSize: 7, color: S, letterSpacing: 1, textTransform: "uppercase" }}>★ Featured</span>}
                  {p.tag && <span style={{ fontSize: 7, color: SD, border: `0.5px solid ${G3}`, padding: "1px 5px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}
                  {p.collection && <span style={{ fontSize: 7, color: SD }}>{p.collection}</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: SD }}>{p.cat}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
                <span style={{ fontSize: 8, color: statusColor, letterSpacing: 1, textTransform: "uppercase" }}>{statusLabel}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S }}>${p.price}</div>
              <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setModal(p)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "5px 10px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "5px 8px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="admin-shop-mobile" style={{ display: "none", flexDirection: "column", gap: 8 }}>
        {!loading && filtered.map(p => {
          const inStock = p.inStock !== false;
          return (
            <div key={p.id} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "14px 16px" }} onClick={() => setModal(p)}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 60, height: 60, background: G2, border: `0.5px solid ${G3}`, overflow: "hidden", flexShrink: 0 }}>
                  {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: G3 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: SD, marginBottom: 6 }}>{p.cat}{p.collection ? ` · ${p.collection}` : ""}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: S }}>${p.price}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: inStock ? "#0c6" : "#e03" }} />
                      <span style={{ fontSize: 8, color: inStock ? "#0c6" : "#e03", letterSpacing: 1, textTransform: "uppercase" }}>{inStock ? "In Stock" : "Sold Out"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setModal(p)} style={{ flex: 1, background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "9px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "9px 16px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media(max-width:700px){
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
      <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "11px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
        onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <select value={value ?? ""} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: value ? "#fff" : SD, padding: "11px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}