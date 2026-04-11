import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useProducts } from "../hooks/useSiteSettings";
import { base44 } from "@/api/base44Client";
import ProductImageUploader from "../components/vigo/ProductImageUploader";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const TABS = ["Description", "Inventory", "Shipping"];

export default function ProductsManager({ settings, updateProduct }) {
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    tag: null,
    visible: true,
    sizes: [],
    description: "",
    image_url: "",
  });

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
    setActiveTab("Description");
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
    setFormData({ name: "", category: "", price: 0, tag: null, visible: true, sizes: [], description: "", image_url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Catalog</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1 }}>Product Manager</h2>
        <button onClick={() => { setFormData({ name: "", category: "", price: 0, tag: null, visible: true, sizes: [], description: "", image_url: "" }); setEditingId(null); setShowForm(true); }} style={{ background: S, color: "#000", border: "none", padding: "10px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center" }}>
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Products Grid */}
      <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 16, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {products?.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                background: G2,
                border: `.5px solid ${selectedProduct?.id === p.id ? S : G3}`,
                padding: 12,
                cursor: "pointer",
                transition: "all .2s",
                borderTop: selectedProduct?.id === p.id ? `2px solid ${S}` : `.5px solid ${G3}`,
              }}
              onMouseEnter={e => { if (selectedProduct?.id !== p.id) e.currentTarget.style.borderColor = S; }}
              onMouseLeave={e => { if (selectedProduct?.id !== p.id) e.currentTarget.style.borderColor = G3; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, background: p.visible ? "#0c6" : G3, borderRadius: "50%", color: p.visible ? "#000" : SD, fontSize: 9, fontWeight: 900 }}>
                  {p.visible ? "✓" : "—"}
                </div>
              </div>
              <div style={{ fontSize: 8, color: SD, marginBottom: 8 }}>{p.category}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: S }}>${p.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form - Full Width */}
      {showForm && (
        <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 0 }}>
            {/* Left: Image Panel */}
            <div style={{ padding: 24, borderRight: `.5px solid ${G3}` }}>
              <ProductImageUploader
                imageUrl={formData.image_url}
                onImageChange={(url) => setFormData({ ...formData, image_url: url })}
                uploading={uploadingImage}
              />
            </div>

            {/* Right: Form Fields & Tabs */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{editingId ? "Edit Product" : "New Product"}</h3>
                <button onClick={resetForm} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 20 }}>
                  <X size={20} />
                </button>
              </div>

              {/* Basic Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Product Name *</label>
                  <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Price ($)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                    <option value="">Select</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Headwear">Headwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Tag</label>
                  <select value={formData.tag || ""} onChange={e => setFormData({ ...formData, tag: e.target.value || null })} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="drop">Drop</option>
                    <option value="ltd">Limited</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 1, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>Visible</div>
                    <div style={{ fontSize: 8, color: SD }}>Show on storefront</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                    style={{
                      width: 48,
                      height: 26,
                      borderRadius: 13,
                      background: formData.visible ? S : G3,
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background .2s",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ position: "absolute", top: 3, left: formData.visible ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: formData.visible ? "#000" : "#555", transition: "left .2s" }} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16 }}>
                <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `.5px solid ${G3}` }}>
                  {TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === tab ? `2px solid ${S}` : "2px solid transparent",
                        color: activeTab === tab ? "#fff" : SD,
                        fontSize: 9,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: activeTab === tab ? 700 : 400,
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === "Description" && (
                  <div>
                    <label style={{ display: "block", fontSize: 9, color: SD, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Description</label>
                    <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} style={{ width: "100%", background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                  </div>
                )}

                {activeTab === "Inventory" && (
                  <div>
                    <div style={{ fontSize: 11, color: "#ccc" }}>Stock and variant management coming soon.</div>
                  </div>
                )}

                {activeTab === "Shipping" && (
                  <div>
                    <div style={{ fontSize: 11, color: "#ccc" }}>Shipping settings coming soon.</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: `.5px solid ${G3}` }}>
                <button onClick={handleSave} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                  Save Product
                </button>
                <button onClick={resetForm} style={{ background: "transparent", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                {editingId && (
                  <button onClick={() => { handleDelete(editingId); resetForm(); }} style={{ background: "#e03", color: "#fff", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && !showForm && (
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{selectedProduct.name}</h3>
              <p style={{ fontSize: 10, color: SD }}>{selectedProduct.category}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(selectedProduct)} style={{ background: S, color: "#000", border: "none", padding: "8px 14px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(selectedProduct.id)} style={{ background: "#e03", color: "#fff", border: "none", padding: "8px 14px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                Delete
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 1, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Price</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: S }}>${selectedProduct.price}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 1, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Status</div>
              <div style={{ fontSize: 11, color: selectedProduct.visible ? "#0c6" : "#999" }}>{selectedProduct.visible ? "Visible" : "Hidden"}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 1, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Tag</div>
              <div style={{ fontSize: 11, color: "#fff", textTransform: "capitalize" }}>{selectedProduct.tag || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 1, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Created</div>
              <div style={{ fontSize: 10, color: "#999" }}>{new Date(selectedProduct.created_date).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media(max-width:600px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .products-layout > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}