import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminDrops() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    series: "",
    drop_number: "",
    date: "",
    description: "",
    tag: "Upcoming",
    tag_color: "#C0C0C0",
    pieces: 0,
    status: "upcoming",
    time: "12:00 PM EST",
    price_range: "",
    product_ids: [],
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
        const data = await base44.entities.Drop.list();
        setDrops(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load drops");
        setLoading(false);
      }
    };
    checkAndLoad();
  }, [navigate]);

  const handleSave = async () => {
    if (!formData.name || !formData.series || !formData.date) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      if (editingId) {
        await base44.entities.Drop.update(editingId, formData);
        setDrops(drops.map(d => d.id === editingId ? { ...d, ...formData } : d));
        toast.success("Drop updated");
      } else {
        const created = await base44.entities.Drop.create(formData);
        setDrops([...drops, created]);
        toast.success("Drop created");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", series: "", drop_number: "", date: "", description: "", tag: "Upcoming", tag_color: "#C0C0C0", pieces: 0, status: "upcoming", time: "12:00 PM EST", price_range: "", product_ids: [] });
    } catch (err) {
      toast.error("Failed to save drop");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this drop?")) {
      try {
        await base44.entities.Drop.delete(id);
        setDrops(drops.filter(d => d.id !== id));
        toast.success("Drop deleted");
      } catch (err) {
        toast.error("Failed to delete drop");
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
            <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2 }}>Drops</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            {showForm ? "Cancel" : "+ Add Drop"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <input placeholder="Drop Name (e.g., Drop 02)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
              <input placeholder="Series (e.g., Mirror Series)" value={formData.series} onChange={e => setFormData({ ...formData, series: e.target.value })} style={inputStyle} />
              <input placeholder="Drop Number (e.g., Drop 02)" value={formData.drop_number} onChange={e => setFormData({ ...formData, drop_number: e.target.value })} style={inputStyle} />
              <input placeholder="Date & Time" type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={inputStyle} />
              <input placeholder="Tag (e.g., Upcoming)" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} style={inputStyle} />
              <input placeholder="Tag Color (hex)" value={formData.tag_color} onChange={e => setFormData({ ...formData, tag_color: e.target.value })} style={inputStyle} />
              <input placeholder="Units" type="number" value={formData.pieces} onChange={e => setFormData({ ...formData, pieces: parseInt(e.target.value) })} style={inputStyle} />
              <input placeholder="Price Range (e.g., $68–$245)" value={formData.price_range} onChange={e => setFormData({ ...formData, price_range: e.target.value })} style={inputStyle} />
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                <option value="upcoming">Upcoming</option>
                <option value="soldout">Sold Out</option>
              </select>
            </div>
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, gridColumn: "1/-1", minHeight: 80 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={handleSave} style={{ ...btnStyle, background: S, color: "#000" }}>Save Drop</button>
              <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "none", border: `.5px solid ${G3}`, color: SD }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {drops.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: SD }}>No drops yet. Create your first one!</div>
          ) : (
            drops.map(d => (
              <div key={d.id} style={{ background: G2, border: `.5px solid ${G3}`, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: SD }}>{d.series} · {d.pieces} units · {new Date(d.date).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditingId(d.id); setFormData(d); setShowForm(true); }} style={{ ...btnSmall, background: S, color: "#000" }}>Edit</button>
                  <button onClick={() => handleDelete(d.id)} style={{ ...btnSmall, background: "#e03", color: "#fff" }}>Delete</button>
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