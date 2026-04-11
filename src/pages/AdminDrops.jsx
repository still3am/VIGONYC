import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDrop, setSelectedDrop] = useState(null);
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

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["S","M","T","W","T","F","S"];
  const TODAY = new Date();

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dropOnDay = day => day ? drops.find(dr => isSameDay(new Date(dr.releaseDate), day)) : null;

  return (
    <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Manage Drops</h1>
        <Button onClick={() => setShowForm(true)} style={{ background: S, color: "#000", display: "flex", gap: 8 }}>
          <Plus size={16} /> New Drop
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 32 }}>
        {/* Calendar */}
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `.5px solid ${G3}` }}>
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: "none", border: `.5px solid ${G3}`, color: S, width: 30, height: 30, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
              {MONTHS[month]} <span style={{ color: S }}>{year}</span>
            </div>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: "none", border: `.5px solid ${G3}`, color: S, width: 30, height: 30, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#060606", borderBottom: `.5px solid ${G3}` }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ padding: "8px 4px", textAlign: "center", fontSize: 8, letterSpacing: 1, color: "#333" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {cells.map((day, i) => {
              const drop = dropOnDay(day);
              const isToday = day && isSameDay(day, TODAY);
              const isSelected = selectedDrop && drop && selectedDrop.id === drop.id;
              const isPast = day && day < TODAY && !isToday;
              return (
                <div
                  key={i}
                  onClick={() => { if (drop) { setSelectedDrop(drop); setViewDate(new Date(drop.releaseDate)); } }}
                  style={{
                    minHeight: "clamp(52px,8vw,72px)",
                    padding: "8px 6px 6px",
                    borderRight: (i + 1) % 7 !== 0 ? `.5px solid ${G3}` : "none",
                    borderBottom: `.5px solid ${G3}`,
                    cursor: drop ? "pointer" : "default",
                    background: isSelected ? "rgba(192,192,192,.08)" : "transparent",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { if (drop && !isSelected) e.currentTarget.style.background = "rgba(192,192,192,.04)"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontSize: 10, fontWeight: isToday ? 900 : 400,
                        color: isToday ? "#000" : isPast ? "#2a2a2a" : drop ? "#fff" : "#3a3a3a",
                        width: 20, height: 20,
                        background: isToday ? S : "transparent",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 4,
                      }}>{day.getDate()}</div>
                      {drop && (
                        <div style={{
                          background: "rgba(192,192,192,.12)",
                          borderLeft: `.5px solid ${S}`,
                          padding: "2px 4px",
                          fontSize: 6,
                          letterSpacing: .5,
                          color: S,
                          lineHeight: 1.4,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                          {drop.series}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedDrop ? (
            <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
              <div style={{ padding: "20px", borderBottom: `.5px solid ${G3}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                  <button onClick={() => handleEdit(selectedDrop)} style={{ background: S, color: "#000", border: "none", padding: "8px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center" }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(selectedDrop.id)} style={{ background: "#e03", color: "#fff", border: "none", padding: "8px 12px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center" }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, letterSpacing: -1, marginBottom: 8, color: "#fff" }}>{selectedDrop.series}</h3>
                <p style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{selectedDrop.description}</p>
              </div>
              <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Date", new Date(selectedDrop.releaseDate).toLocaleDateString()], ["Time", selectedDrop.time], ["Units", selectedDrop.pieces]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 22, opacity: .15, marginBottom: 10 }}>✦</div>
              <div style={{ fontSize: 11, color: SD }}>Select a drop to view details.</div>
            </div>
          )}

          {/* All Drops List */}
          <div style={{ background: G1, border: `.5px solid ${G3}` }}>
            <div style={{ padding: "10px 16px", borderBottom: `.5px solid ${G3}`, fontSize: 7, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>All Drops</div>
            {drops.map(dr => (
              <div
                key={dr.id}
                onClick={() => { setSelectedDrop(dr); setViewDate(new Date(dr.releaseDate)); }}
                style={{ padding: "12px 16px", borderBottom: `.5px solid ${G3}`, cursor: "pointer", background: selectedDrop?.id === dr.id ? "rgba(192,192,192,.05)" : "transparent", transition: "background .15s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { if (selectedDrop?.id !== dr.id) e.currentTarget.style.background = "rgba(192,192,192,.03)"; }}
                onMouseLeave={e => { if (selectedDrop?.id !== dr.id) e.currentTarget.style.background = "transparent"; }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{dr.series}</div>
                  <div style={{ fontSize: 8, color: SD }}>{new Date(dr.releaseDate).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 7, color: dr.tagColor, letterSpacing: 1, textTransform: "uppercase" }}>{dr.tag}</div>
              </div>
            ))}
          </div>
        </div>
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

      {drops.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: 60, color: SD }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>—</div>
          <p>No drops created yet. Create your first drop to get started.</p>
        </div>
      )}
    </div>
  );
}