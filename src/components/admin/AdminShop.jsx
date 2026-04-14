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
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setForm(p => ({ ...p, [k]: p[k]?.includes(v) ? p[k].filter(x => x !== v) : [...(p[k] || []), v] }));

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
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "#0f0f0f", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(580px,95vw)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase" }}>{product?.id ? "Edit Product" : "New Product"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
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
                <button key={s} onClick={() => toggleArr("sizes", s)} style={{ padding: "6px 14px", fontSize: 10, background: form.sizes?.includes(s) ? S : G2, color: form.sizes?.includes(s) ? "#000" : SD, border: `0.5px solid ${form.sizes?.includes(s) ? S : G3}`, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Colors</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALL_COLORS.map(c => (
                <button key={c} onClick={() => toggleArr("colors", c)} style={{ padding: "6px 14px", fontSize: 10, background: form.colors?.includes(c) ? S : G2, color: form.colors?.includes(c) ? "#000" : SD, border: `0.5px solid ${form.colors?.includes(c) ? S : G3}`, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Media: Images */}
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Product Images</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {(form.images || []).map((url, i) => (
                <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                  <img src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", border: `0.5px solid ${G3}` }} />
                  <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
                </div>
              ))}
              <label style={{ width: 80, height: 80, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4 }}>
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

          {/* Media: Videos */}
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Product Videos</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {(form.videos || []).map((url, i) => (
                <div key={i} style={{ position: "relative", width: 80, height: 80, background: G2, border: `0.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video src={url} style={{ width: 80, height: 80, objectFit: "cover" }} />
                  <button onClick={() => set("videos", form.videos.filter((_, j) => j !== i))} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.8)", border: "none", color: "#e03", width: 18, height: 18, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
                </div>
              ))}
              <label style={{ width: 80, height: 80, background: G2, border: `0.5px dashed ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 4 }}>
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

          {/* Description */}
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Description</div>
            <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)} rows={3} style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = S} onBlur={e => e.target.style.borderColor = G3} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Stock Count" type="number" value={form.stock ?? 0} onChange={v => set("stock", parseInt(v) || 0)} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20, cursor: "pointer" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.inStock !== false} onChange={e => set("inStock", e.target.checked)} style={{ accentColor: S, width: 14, height: 14 }} />
                <span style={{ fontSize: 11, color: "#fff" }}>In Stock</span>
              </label>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={form.featured || false} onChange={e => set("featured", e.target.checked)} style={{ accentColor: S, width: 14, height: 14 }} />
            <span style={{ fontSize: 11, color: "#fff" }}>Featured product</span>
          </label>

          <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button onClick={onClose} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
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

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Product.list("-created_date", 200).catch(() => []);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) {
      await base44.entities.Product.update(form.id, form);
    } else {
      await base44.entities.Product.create(form);
    }
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Inventory</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Products</h2>
        </div>
        <button onClick={() => setModal("new")} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          + Add Product
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: "100%", maxWidth: 320, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 16px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      <div style={{ background: G1, border: `0.5px solid ${G3}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "10px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
          <span>Product</span><span>Category</span><span>Tag</span><span>Price</span><span></span>
        </div>
        {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading...</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No products found</div>}
        {!loading && filtered.map(p => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "14px 20px", borderBottom: `0.5px solid ${G3}`, alignItems: "center", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = G2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div>
              <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{p.name}</div>
              {p.featured && <span style={{ fontSize: 7, color: S, letterSpacing: 1, textTransform: "uppercase" }}>★ Featured</span>}
            </div>
            <div style={{ fontSize: 11, color: SD }}>{p.cat}</div>
            <div>{p.tag && <span style={{ fontSize: 7, color: S, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: S }}>${p.price}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setModal(p)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "5px 10px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "5px 10px", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
            </div>
          </div>
        ))}
      </div>
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