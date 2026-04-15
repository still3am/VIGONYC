import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [filterActive, setFilterActive] = useState("All");

  const load = async () => {
    setLoading(true);
    // Also pull from User entities who have newsletterEmail set
    const [subs, users] = await Promise.all([
      base44.entities.NewsletterSubscriber?.list("-created_date", 500).catch(() => null),
      base44.entities.User.list("-created_date", 500).catch(() => []),
    ]);

    // Merge: use NewsletterSubscriber if available, fallback to users with newsletterEmail
    let combined = [];
    if (subs && subs.length > 0) {
      combined = subs;
    } else {
      // Build from users who opted in
      const userSubs = users.filter(u => u.newsletterEmail || u.notificationsNewsletter).map(u => ({
        id: `user_${u.id}`,
        email: u.newsletterEmail || u.email,
        source: "store",
        active: u.notificationsNewsletter !== false,
        created_date: u.created_date,
        _fromUser: true,
      }));
      combined = userSubs;
    }
    setSubscribers(combined);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (sub) => {
    if (sub._fromUser) return; // can't toggle user-derived entries directly
    await base44.entities.NewsletterSubscriber?.update(sub.id, { active: !sub.active }).catch(() => {});
    setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, active: !s.active } : s));
  };

  const handleDelete = async (sub) => {
    if (!confirm("Remove this subscriber?")) return;
    if (!sub._fromUser) {
      await base44.entities.NewsletterSubscriber?.delete(sub.id).catch(() => {});
    }
    setSubscribers(prev => prev.filter(s => s.id !== sub.id));
  };

  const sources = ["All", ...new Set(subscribers.map(s => s.source).filter(Boolean))];

  const filtered = subscribers.filter(s => {
    const matchSearch = !search || s.email?.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === "All" || s.source === filterSource;
    const matchActive = filterActive === "All" || (filterActive === "Active" ? s.active !== false : s.active === false);
    return matchSearch && matchSource && matchActive;
  });

  const active = subscribers.filter(s => s.active !== false).length;

  const exportCSV = () => {
    const rows = filtered.map(s => [s.email, s.source || "", s.active !== false ? "Active" : "Inactive", s.created_date ? new Date(s.created_date).toLocaleDateString() : ""].join(","));
    const csv = ["Email,Source,Status,Joined", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `vigonyc-subscribers-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Newsletter</div>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Subscribers</h2>
        </div>
        <button onClick={exportCSV} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "10px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Export CSV</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
        {[[subscribers.length, "Total", S], [active, "Active", "#0c6"], [subscribers.length - active, "Inactive", SD]].map(([n, l, c]) => (
          <div key={l} style={{ flex: 1, background: G1, border: `0.5px solid ${G3}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{n}</div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          {sources.map(s => <option key={s} value={s}>{s === "All" ? "All Sources" : s}</option>)}
        </select>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <div style={{ fontSize: 10, color: SD, alignSelf: "center" }}>{filtered.length} results</div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading subscribers...</div>}
      {!loading && filtered.length === 0 && <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No subscribers found.</div>}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div style={{ background: G1, border: `0.5px solid ${G3}`, overflowX: "auto" }}>
          <div style={{ minWidth: 500 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 100px 70px", padding: "10px 16px", borderBottom: `0.5px solid ${G3}`, fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
              <span>Email</span><span>Source</span><span>Status</span><span>Joined</span><span></span>
            </div>
            {filtered.map(sub => {
              const isActive = sub.active !== false;
              return (
                <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 100px 70px", padding: "12px 16px", borderBottom: `0.5px solid ${G3}`, alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = G2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 11, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.email}</div>
                  <div style={{ fontSize: 9, color: SD, textTransform: "uppercase", letterSpacing: 1 }}>{sub.source || "—"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#0c6" : G3, flexShrink: 0 }} />
                    <span style={{ fontSize: 8, color: isActive ? "#0c6" : SD, letterSpacing: 1, textTransform: "uppercase" }}>{isActive ? "Active" : "Off"}</span>
                  </div>
                  <div style={{ fontSize: 9, color: SD }}>{sub.created_date ? new Date(sub.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {!sub._fromUser && <button onClick={() => handleToggle(sub)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "4px 6px", fontSize: 8, cursor: "pointer", fontFamily: "inherit" }}>{isActive ? "Off" : "On"}</button>}
                    <button onClick={() => handleDelete(sub)} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "4px 6px", fontSize: 8, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}