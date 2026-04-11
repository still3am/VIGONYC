import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useProducts } from "../hooks/useSiteSettings";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function ProductsManager({ settings, updateProduct }) {
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    tag: null,
    visible: true,
    sizes: [],
  });

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      Object.keys(formData).forEach(key => {
        updateProduct(editingId, key, formData[key]);
      });
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      base44.entities.Product.delete(id);
      setSelectedProduct(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "", price: 0, tag: null, visible: true, sizes: [] });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Catalog</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1 }}>Product Manager</h2>
        <button onClick={() => setShowForm(true)} style={{ background: S, color: "#000", border: "none", padding: "10px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center" }}>
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Grid + Detail Layout */}
      <div className="products-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Products Grid */}
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 16 }}>
          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {products?.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                style={{
                  background: G2,
                  border: `.5px solid ${selectedProduct?.id === p.id ? S : G3}`,
                  padding: 14,
                  cursor: "pointer",
                  transition: "all .2s",
                  borderTop: selectedProduct?.id === p.id ? `2px solid ${S}` : `.5px solid ${G3}`,
                }}
                onMouseEnter={e => { if (selectedProduct?.id !== p.id) e.currentTarget.style.borderColor = S; }}
                onMouseLeave={e => { if (selectedProduct?.id !== p.id) e.currentTarget.style.borderColor = G3; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 8, color: SD, letterSpacing: 1 }}>{p.category}</div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, background: p.visible ? "#0c6" : G3, borderRadius: "50%", color: p.visible ? "#000" : SD, fontSize: 10, fontWeight: 900 }}>
                    {p.visible ? "✓" : "—"}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `.5px solid ${G3}` }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: S }}>${p.price}</span>
                  {p.tag && <span style={{ fontSize: 7, color: S, letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedProduct ? (
            <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
              <div style={{ padding: "20px", borderBottom: `.5px solid ${G3}` }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <button onClick={() => handleEdit(selectedProduct)} style={{ background: S, color: "#000", border: "none", padding: "8px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(selectedProduct.id)} style={{ background: "#e03", color: "#fff", border: "none", padding: "8px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "#fff" }}>{selectedProduct.name}</h3>
                <p style={{ fontSize: 10, color: SD, lineHeight: 1.6 }}>{selectedProduct.category}</p>
              </div>
              <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, display: "grid", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Price</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: S }}>${selectedProduct.price}</div>
                </div>
                {selectedProduct.tag && (
                  <div>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Tag</div>
                    <div style={{ fontSize: 10, color: "#fff", textTransform: "capitalize" }}>{selectedProduct.tag}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Opacity</div>
                  <div style={{ fontSize: 10, color: "#fff" }}>{Math.round(selectedProduct.opacity * 100)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Visibility</div>
                  <div style={{ fontSize: 10, color: selectedProduct.visible ? "#0c6" : "#e03" }}>
                    {selectedProduct.visible ? "Visible" : "Hidden"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 22, opacity: .15, marginBottom: 10 }}>✦</div>
              <div style={{ fontSize: 11, color: SD }}>Select a product to view details.</div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {showForm && (
        <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, marginTop: 24, position: "relative" }}>
          <button onClick={resetForm} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 20 }}>
            <X size={20} />
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, color: "#fff" }}>{editingId ? "Edit Product" : "New Product"}</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Category</label>
              <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Price ($)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Tag</label>
              <select value={formData.tag || ""} onChange={e => setFormData({ ...formData, tag: e.target.value || null })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="drop">Drop</option>
                <option value="ltd">Limited</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Description</label>
              <input value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Visibility</label>
              <button onClick={() => setFormData({ ...formData, visible: !formData.visible })} style={{ background: formData.visible ? "#0c6" : G2, color: formData.visible ? "#000" : SD, border: `.5px solid ${formData.visible ? "#0c6" : G3}`, width: "100%", padding: "10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>
                {formData.visible ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSave} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Save Changes
            </button>
            <button onClick={resetForm} style={{ background: "transparent", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px) {
          .products-layout { grid-template-columns: 1fr !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media(max-width:480px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}