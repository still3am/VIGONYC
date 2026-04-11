import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminDrops() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    series: "",
    dropNumber: "",
    releaseDate: "",
    description: "",
    tag: "Upcoming",
    tagColor: "#C0C0C0",
    pieces: 100,
    status: "upcoming",
    priceRange: "$68–$245",
    time: "12:00 PM EST",
  });

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = async () => {
    try {
      const data = await base44.entities.Drop.list();
      setDrops(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading drops:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await base44.entities.Drop.update(editingId, formData);
      } else {
        await base44.entities.Drop.create(formData);
      }
      loadDrops();
      resetForm();
    } catch (error) {
      console.error("Error saving drop:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this drop?")) {
      try {
        await base44.entities.Drop.delete(id);
        loadDrops();
      } catch (error) {
        console.error("Error deleting drop:", error);
      }
    }
  };

  const handleEdit = (drop) => {
    setFormData(drop);
    setEditingId(drop.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      series: "",
      dropNumber: "",
      releaseDate: "",
      description: "",
      tag: "Upcoming",
      tagColor: "#C0C0C0",
      pieces: 100,
      status: "upcoming",
      priceRange: "$68–$245",
      time: "12:00 PM EST",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Manage Drops</h1>
        <Button onClick={() => setShowForm(true)} style={{ background: S, color: "#000", display: "flex", gap: 8 }}>
          <Plus size={16} /> New Drop
        </Button>
      </div>

      {showForm && (
        <div style={{ background: G2, border: `.5px solid ${G3}`, padding: 24, marginBottom: 32, position: "relative" }}>
          <button onClick={resetForm} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 20 }}>
            <X size={20} />
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: "#fff" }}>
            {editingId ? "Edit Drop" : "Create New Drop"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Drop Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Series Name</label>
              <Input
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Drop Number</label>
              <Input
                value={formData.dropNumber}
                onChange={(e) => setFormData({ ...formData, dropNumber: e.target.value })}
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Release Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ background: G1, color: "#fff", border: `.5px solid ${G3}`, padding: 8, width: "100%", fontFamily: "inherit" }}
              >
                <option value="upcoming">Upcoming</option>
                <option value="soldout">Sold Out</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                style={{ background: G1, color: "#fff", border: `.5px solid ${G3}`, padding: 8, width: "100%", fontFamily: "inherit" }}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Tag Color</label>
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  type="color"
                  value={formData.tagColor}
                  onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                  style={{ width: 60, height: 38, padding: 2, background: G1, borderColor: G3 }}
                />
                <Input
                  value={formData.tagColor}
                  onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                  style={{ flex: 1, background: G1, color: "#fff", borderColor: G3 }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Number of Units</label>
              <Input
                type="number"
                value={formData.pieces}
                onChange={(e) => setFormData({ ...formData, pieces: parseInt(e.target.value) })}
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Drop Time</label>
              <Input
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="12:00 PM EST"
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Price Range</label>
              <Input
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                placeholder="$68–$245"
                style={{ background: G1, color: "#fff", borderColor: G3 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: SD, marginBottom: 6 }}>Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ background: G1, color: "#fff", borderColor: G3, minHeight: 100 }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={handleSave} style={{ background: S, color: "#000" }}>
              {editingId ? "Update Drop" : "Create Drop"}
            </Button>
            <Button onClick={resetForm} style={{ background: "transparent", border: `.5px solid ${G3}`, color: SD }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {drops.map((drop) => (
          <div key={drop.id} style={{ background: G2, border: `.5px solid ${G3}`, padding: 20, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: drop.tagColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                  {drop.tag}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{drop.series}</h3>
                <p style={{ fontSize: 11, color: SD }}>{drop.dropNumber}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEdit(drop)}
                  style={{ background: "none", border: "none", color: S, cursor: "pointer", padding: 4 }}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(drop.id)}
                  style={{ background: "none", border: "none", color: "#e03", cursor: "pointer", padding: 4 }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: 10, color: SD, marginBottom: 10, lineHeight: 1.6 }}>
              <p style={{ margin: "4px 0" }}>
                <strong>Date:</strong> {new Date(drop.releaseDate).toLocaleDateString()}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Time:</strong> {drop.time}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Units:</strong> {drop.pieces}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Price:</strong> {drop.priceRange}
              </p>
            </div>

            <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.5 }}>{drop.description}</p>
          </div>
        ))}
      </div>

      {drops.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: 60, color: SD }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>—</div>
          <p>No drops created yet. Create your first drop to get started.</p>
        </div>
      )}
    </div>
  );
}