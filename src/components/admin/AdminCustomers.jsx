import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      base44.entities.User.list("-created_date", 200).catch(() => []),
      base44.entities.Order.list("-created_date", 500).catch(() => [])
    ]).then(([u, o]) => {
      setUsers(u || []);
      setOrders(o || []);
      setLoading(false);
    });
  }, []);

  const orderCountFor = (email) => orders.filter(o => o.created_by === email || o.userEmail === email).length;

  const filtered = users.filter(u => !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const withOrders = users.filter(u => orderCountFor(u.email) > 0).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Customers</div>
        <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Customer List</h2>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[["Total Customers", users.length], ["With Orders", withOrders]].map(([l, v]) => (
          <div key={l} style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "14px 20px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: S }}>{v}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or name..." style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", width: "100%", marginBottom: 16, boxSizing: "border-box" }} />

      {/* Desktop table */}
      <div className="admin-cust-desktop" style={{ background: G1, border: `0.5px solid ${G3}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 110px", padding: "10px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
          <span>Name</span><span>Email</span><span>Orders</span><span>Joined</span>
        </div>
        {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading customers...</div>}
        {!loading && filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No customers found</div>}
        {!loading && filtered.map(u => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 110px", padding: "12px 20px", borderBottom: `0.5px solid ${G3}`, alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.background = G2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ fontSize: 12, color: "#fff" }}>{u.full_name || "—"}</div>
            <div style={{ fontSize: 11, color: SD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: orderCountFor(u.email) > 0 ? S : SD }}>{orderCountFor(u.email)}</div>
            <div style={{ fontSize: 9, color: SD }}>{u.created_date ? new Date(u.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="admin-cust-mobile" style={{ display: "none", flexDirection: "column", gap: 6 }}>
        {!loading && filtered.map(u => (
          <div key={u.id} style={{ background: G1, border: `0.5px solid ${G3}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{u.full_name || "—"}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: orderCountFor(u.email) > 0 ? S : SD }}>{orderCountFor(u.email)} orders</div>
            </div>
            <div style={{ fontSize: 11, color: SD, marginBottom: 4 }}>{u.email}</div>
            <div style={{ fontSize: 9, color: SD }}>Joined {u.created_date ? new Date(u.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:600px){
          .admin-cust-desktop { display: none !important; }
          .admin-cust-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}