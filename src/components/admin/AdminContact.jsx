import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { S, G1, G2, G3, SD, btnPrimary, btnGhost, inputStyle, Empty } from "@/components/admin/adminUi";

export default function AdminContact() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState({});

  useEffect(() => {
    setLoading(true);
    base44.entities.ContactEntry.list("-created_date", 200).then(c => setItems(c || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status, msg) => {
    await base44.entities.ContactEntry.update(id, { status }).catch(() => {});
    toast.success(msg);
    setItems(p => p.map(x => x.id === id ? { ...x, status } : x));
  };

  const sendReply = async (id) => {
    const text = (reply[id] || "").trim();
    if (!text) return;
    await base44.entities.ContactEntry.update(id, { adminReply: text, status: "Replied" }).catch(() => {});
    toast.success("Reply saved");
    setItems(p => p.map(x => x.id === id ? { ...x, adminReply: text, status: "Replied" } : x));
    setReply(p => ({ ...p, [id]: "" }));
  };

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading messages...</div>;

  return (
    <div>
      {items.length === 0 ? <Empty msg="No messages yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(c => (
            <div key={c.id} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${c.status === "New" ? "#fa0" : c.status === "Replied" ? "#0c6" : G3}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{c.firstName} {c.lastName}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>{c.email} · {c.topic}</div>
                </div>
                <span style={{ fontSize: 8, letterSpacing: 2, color: c.status === "New" ? "#fa0" : SD, textTransform: "uppercase" }}>{c.status}</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--vt-text)", lineHeight: 1.7, marginBottom: 12 }}>{c.message}</p>
              {c.adminReply && <div style={{ fontSize: 11, color: SD, background: G1, border: `0.5px solid ${G3}`, padding: "10px 14px", marginBottom: 12 }}>↳ {c.adminReply}</div>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input value={reply[c.id] || ""} onChange={e => setReply(p => ({ ...p, [c.id]: e.target.value }))} placeholder="Type a reply..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
                <button onClick={() => sendReply(c.id)} style={btnPrimary}>Reply</button>
                {c.status !== "Read" && <button onClick={() => setStatus(c.id, "Read", "Marked read")} style={btnGhost}>Mark Read</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}