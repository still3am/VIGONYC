import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const STATUS_COLORS = { New: "#fa0", Read: S, Replied: "#0c6" };

export default function AdminContacts() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replying, setReplying] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ContactEntry.list("-created_date", 200).catch(() => []);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (e) => {
    if (e.status === "New") {
      await base44.entities.ContactEntry.update(e.id, { status: "Read" }).catch(() => {});
      setEntries(prev => prev.map(x => x.id === e.id ? { ...x, status: "Read" } : x));
    }
  };

  const handleExpand = (id, entry) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    markRead(entry);
  };

  const handleReply = async (entry) => {
    const draft = replyDrafts[entry.id];
    if (!draft?.trim()) return;
    setReplying(entry.id);
    // Save reply to the entry
    await base44.entities.ContactEntry.update(entry.id, { adminReply: draft, status: "Replied" }).catch(() => {});
    // Send email notification
    await base44.integrations.Core.SendEmail({
      to: entry.email,
      subject: `Re: Your message to VIGONYC`,
      body: `Hi${entry.firstName ? ` ${entry.firstName}` : ""},\n\n${draft}\n\n— VIGONYC Team\nhello@vigonyc.com`,
    }).catch(() => {});
    setEntries(prev => prev.map(x => x.id === entry.id ? { ...x, adminReply: draft, status: "Replied" } : x));
    setReplyDrafts(prev => ({ ...prev, [entry.id]: "" }));
    setReplying(null);
    toast.success("Reply sent!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact entry?")) return;
    await base44.entities.ContactEntry.delete(id).catch(() => {});
    setEntries(prev => prev.filter(x => x.id !== id));
  };

  const filtered = entries.filter(e => {
    const matchFilter = filter === "All" || e.status === filter;
    const matchSearch = !search || (e.email || "").toLowerCase().includes(search.toLowerCase()) || (e.message || "").toLowerCase().includes(search.toLowerCase()) || (e.firstName || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const newCount = entries.filter(e => e.status === "New" || !e.status).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Inbox</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Contact Messages</h2>
          {newCount > 0 && <span style={{ background: "#fa0", color: "#000", fontSize: 8, fontWeight: 900, padding: "3px 10px", letterSpacing: 1, textTransform: "uppercase" }}>{newCount} New</span>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
        {[[entries.length, "Total", S], [newCount, "Unread", "#fa0"], [entries.filter(e => e.status === "Replied").length, "Replied", "#0c6"]].map(([n, l, c]) => (
          <div key={l} style={{ flex: 1, background: G1, border: `0.5px solid ${G3}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{n}</div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          {["All", "New", "Read", "Replied"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ fontSize: 10, color: SD, alignSelf: "center" }}>{filtered.length} messages</div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading messages...</div>}
      {!loading && filtered.length === 0 && <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No messages found</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {!loading && filtered.map(e => {
          const col = STATUS_COLORS[e.status] || STATUS_COLORS.New;
          const isExp = expanded === e.id;
          const name = [e.firstName, e.lastName].filter(Boolean).join(" ") || e.name || "Unknown";
          return (
            <div key={e.id} style={{ background: G1, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${col}` }}>
              {/* Row */}
              <div style={{ padding: "14px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                onClick={() => handleExpand(e.id, e)}
                onMouseEnter={ev => ev.currentTarget.style.background = G2}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{name}</span>
                    <span style={{ fontSize: 10, color: SD }}>{e.email}</span>
                    <span style={{ fontSize: 7, color: col, border: `0.5px solid ${col}`, padding: "2px 7px", letterSpacing: 1, textTransform: "uppercase" }}>{e.status || "New"}</span>
                    {e.topic && <span style={{ fontSize: 7, color: SD, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1 }}>{e.topic}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: SD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(e.message || "").slice(0, 80)}{(e.message || "").length > 80 ? "..." : ""}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: SD }}>{e.created_date ? new Date(e.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                  <span style={{ color: SD, fontSize: 12 }}>{isExp ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded */}
              {isExp && (
                <div style={{ padding: "0 20px 20px", borderTop: `0.5px solid ${G3}` }}>
                  <div style={{ paddingTop: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Message</div>
                    <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.8, background: G2, padding: "14px 16px", border: `0.5px solid ${G3}`, whiteSpace: "pre-wrap" }}>{e.message}</div>
                  </div>
                  {e.adminReply && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 8, letterSpacing: 2, color: "#0c6", textTransform: "uppercase", marginBottom: 8 }}>Your Reply</div>
                      <div style={{ fontSize: 12, color: SD, lineHeight: 1.7, background: G2, padding: "12px 16px", border: `0.5px solid #0c623`, whiteSpace: "pre-wrap" }}>{e.adminReply}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{e.adminReply ? "Update Reply" : "Reply"}</div>
                    <textarea
                      value={replyDrafts[e.id] || ""}
                      onChange={ev => setReplyDrafts(p => ({ ...p, [e.id]: ev.target.value }))}
                      rows={4}
                      placeholder="Type your reply..."
                      style={{ width: "100%", background: G2, border: `0.5px solid ${G3}`, color: "#fff", padding: "12px 14px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }}
                      onFocus={ev => ev.target.style.borderColor = S}
                      onBlur={ev => ev.target.style.borderColor = G3}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => handleReply(e)}
                        disabled={replying === e.id || !replyDrafts[e.id]?.trim()}
                        style={{ background: S, color: "#000", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", opacity: !replyDrafts[e.id]?.trim() ? 0.5 : 1 }}
                      >
                        {replying === e.id ? "Sending..." : "Send Reply"}
                      </button>
                      <a href={`mailto:${e.email}`} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "10px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Open Mail ↗</a>
                      <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "10px 14px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}