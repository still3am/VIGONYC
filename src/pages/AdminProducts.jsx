import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: "",
    tag: "new",
    stock: 0,
    is_active: true,
  });

  useEffect(() => {
    const checkAndLoad = async () => {
      try {
        const me = await base44.auth.me();
        if (!me || me.role !== "admin") {
          navigate("/");
          return;
        }
        setUser(me);
        const data = await base44.entities.Product.list();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    checkAndLoad();
  }, [navigate]);

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      if (editingId) {
        await base44.entities.Product.update(editingId, formData);
        setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } : p));
        toast.success("Product updated");
      } else {
        const created = await base44.entities.Product.create(formData);
        setProducts([...products, created]);
        toast.success("Product created");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", category: "", price: "", description: "", image_url: "", tag: "new", stock: 0, is_active: true });
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await base44.entities.Product.delete(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success("Product deleted");
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: G1, color: S }}>Loading...</div>;

  return (
    <div style={{ background: G1, minHeight: "100vh", padding: "40px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", color: S, fontSize: 10, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", marginBottom: 12 }}>← Back</button>
            <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2 }}>Products</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
              <input placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle} />
              <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} style={inputStyle} />
              <input placeholder="Stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} style={inputStyle} />
              <input placeholder="Image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} style={inputStyle} />
              <select value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} style={inputStyle}>
                <option value="new">New</option>
                <option value="hot">Hot</option>
                <option value="drop">Drop</option>
                <option value="ltd">Limited</option>
              </select>
            </div>
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, gridColumn: "1/-1", minHeight: 80 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={handleSave} style={{ ...btnStyle, background: S, color: "#000" }}>Save Product</button>
              <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "none", border: `.5px solid ${G3}`, color: SD }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: SD }}>No products yet. Create your first one!</div>
          ) : (
            products.map(p => (
              <div key={p.id} style={{ background: G2, border: `.5px solid ${G3}`, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: SD }}>{p.category} · ${p.price} · Stock: {p.stock}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditingId(p.id); setFormData(p); setShowForm(true); }} style={{ ...btnSmall, background: S, color: "#000" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...btnSmall, background: "#e03", color: "#fff" }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { background: G1, border: `.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontFamily: "inherit", fontSize: 11, outline: "none" };
const btnStyle = { border: "none", padding: "10px 20px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" };
const btnSmall = { ...btnStyle, padding: "8px 12px", fontSize: 8 };