import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { S, G1, G2, G3, SD, btnPrimary, btnGhost, inputStyle, Empty } from "@/components/admin/adminUi";

export default function AdminReturns() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    setLoading(true);
    base44.entities.ReturnRequest.list("-created_date", 200).then(r => setItems(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status, msg) => {
    await base44.entities.ReturnRequest.update(id, { status }).catch(() => {});
    toast.success(msg);
    setItems(p => p.map(x => x.id === id ? { ...x, status } : x));
  };

  const saveNote = async (id) => {
    const text = notes[id] ?? "";
    await base44.entities.ReturnRequest.update(id, { adminNote: text }).catch(() => {});
    toast.success("Note saved");
    setItems(p => p.map(x => x.id === id ? { ...x, adminNote: text } : x));
  };

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading returns...</div>;

  return (
    <div>
      {items.length === 0 ? <Empty msg="No return requests." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(r => (
            <div key={r.id} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${r.status === "Pending" ? "#fa0" : r.status === "Approved" || r.status === "Completed" ? "#0c6" : r.status === "Rejected" ? "#e03" : G3}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Order {r.orderId}</div>
                  <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>{r.userEmail}</div>
                </div>
                <span style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{r.status}</span>
              </div>
              <div style={{ fontSize: 10, color: S, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Reason</div>
              <p style={{ fontSize: 12, color: "var(--vt-text)", lineHeight: 1.7, marginBottom: 8 }}>{r.reason}</p>
              {r.message && <p style={{ fontSize: 11, color: SD, lineHeight: 1.6, marginBottom: 12 }}>{r.message}</p>}
              <input value={notes[r.id] ?? r.adminNote ?? ""} onChange={e => setNotes(p => ({ ...p, [r.id]: e.target.value }))} placeholder="Admin note..." style={{ ...inputStyle, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => saveNote(r.id)} style={btnGhost}>Save Note</button>
                {r.status === "Pending" && <>
                  <button onClick={() => setStatus(r.id, "Approved", "Return approved")} style={btnPrimary}>Approve</button>
                  <button onClick={() => setStatus(r.id, "Rejected", "Return rejected")} style={{ ...btnPrimary, background: "#e03", color: "#fff" }}>Reject</button>
                </>}
                {r.status === "Approved" && <button onClick={() => setStatus(r.id, "Completed", "Marked completed")} style={btnPrimary}>Complete</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}