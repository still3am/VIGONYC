import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { S, G2, G3, SD, btnPrimary, btnGhost, Empty } from "@/components/admin/adminUi";

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    setLoading(true);
    base44.entities.Review.list("-created_date", 200).then(r => setItems(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = async (id, data, msg) => {
    await base44.entities.Review.update(id, data).catch(() => {});
    toast.success(msg);
    setItems(p => p.map(x => x.id === id ? { ...x, ...data } : x));
  };
  const remove = async (id) => {
    await base44.entities.Review.delete(id).catch(() => {});
    toast.success("Review deleted");
    setItems(p => p.filter(x => x.id !== id));
  };

  const filtered = filter === "pending" ? items.filter(r => !r.approved) : filter === "approved" ? items.filter(r => r.approved) : items;

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading reviews...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["pending", "Pending"], ["approved", "Approved"], ["all", "All"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ background: filter === id ? S : "none", color: filter === id ? "#000" : SD, border: `0.5px solid ${filter === id ? S : G3}`, padding: "7px 14px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>
      {filtered.length === 0 ? <Empty msg="No reviews." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: G2, border: `0.5px solid ${G3}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{r.reviewerName || "Anonymous"} · {"★".repeat(Math.min(5, Math.max(1, r.rating || 5)))}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>Product: {r.productId}</div>
                </div>
                <span style={{ fontSize: 8, letterSpacing: 2, color: r.approved ? "#0c6" : "#fa0", textTransform: "uppercase" }}>{r.approved ? "Approved" : "Pending"}</span>
              </div>
              {r.title && <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>}
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.7, marginBottom: 12 }}>{r.body}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!r.approved && <button onClick={() => update(r.id, { approved: true }, "Review approved")} style={btnPrimary}>Approve</button>}
                {r.approved && <button onClick={() => update(r.id, { approved: false }, "Unapproved")} style={btnGhost}>Unapprove</button>}
                <button onClick={() => remove(r.id)} style={{ ...btnGhost, color: "#e03", borderColor: "#e03" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}