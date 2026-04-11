import { Trash2 } from "lucide-react";
import { S, G1, G2, G3, SD } from "@/lib/vigoColors";

export default function AdminListView({
  items,
  loading,
  statusFilter,
  setStatusFilter,
  statusOptions,
  selectedItem,
  setSelectedItem,
  onDelete,
  onStatusChange,
  renderListItem,
  renderDetailView,
  title,
}) {
  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  const filtered = statusFilter === "All" ? items : items.filter((i) => i.status === statusFilter);

  return (
    <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
      <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 900, marginBottom: 20 }}>{title}</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              background: statusFilter === s ? S : G1,
              color: statusFilter === s ? "#000" : SD,
              border: `.5px solid ${statusFilter === s ? S : G3}`,
              padding: "8px 16px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: statusFilter === s ? 900 : 400,
              whiteSpace: "nowrap",
              flexShrink: 0,
              minHeight: 44,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: G1,
              border: `.5px solid ${G3}`,
              borderTop: `2px solid ${S}`,
              padding: "clamp(16px, 3vw, 20px)",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setSelectedItem(item)}
          >
            {renderListItem(item, (e) => {
              e.stopPropagation();
              onDelete(item.id);
            })}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ marginTop: 24, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "clamp(16px, 4vw, 24px)", borderRadius: 4 }}>
          {renderDetailView(selectedItem, onStatusChange, () => setSelectedItem(null))}
        </div>
      )}
    </div>
  );
}