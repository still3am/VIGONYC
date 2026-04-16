import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminShop from "@/components/admin/AdminShop";
import AdminDrops from "@/components/admin/AdminDrops";
import AdminLookbook from "@/components/admin/AdminLookbook";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminReturns from "@/components/admin/AdminReturns";
import AdminPromoCodes from "@/components/admin/AdminPromoCodes";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminNewsletter from "@/components/admin/AdminNewsletter";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminPayments from "@/components/admin/AdminPayments";


const S = "#C0C0C0";
const G1 = "#0d0d0d";
const G2 = "#111111";
const G3 = "#1a1a1a";
const SD = "#555555";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "orders", label: "Orders", icon: "◇", badgeKey: "pendingOrders" },
  { id: "customers", label: "Customers", icon: "◯" },
  { id: "returns", label: "Returns", icon: "↩", badgeKey: "pendingReturns" },
  { id: "payments", label: "Payments", icon: "₿" },
  { id: "shop", label: "Shop", icon: "◻" },
  { id: "drops", label: "Drops", icon: "◆" },
  { id: "lookbook", label: "Lookbook", icon: "◉" },
  { id: "promos", label: "Promos", icon: "%" },
  { id: "reviews", label: "Reviews", icon: "★", badgeKey: "pendingReviews" },
  { id: "newsletter", label: "Newsletter", icon: "✉" },
  { id: "contacts", label: "Contacts", icon: "◎", badgeKey: "newContacts" },
  { id: "about", label: "Content", icon: "✦" },
];

const SECTION_MAP = {
  dashboard: AdminDashboard,
  orders: AdminOrders,
  customers: AdminCustomers,
  returns: AdminReturns,
  payments: AdminPayments,
  shop: AdminShop,
  drops: AdminDrops,
  lookbook: AdminLookbook,
  promos: AdminPromoCodes,
  reviews: AdminReviews,
  newsletter: AdminNewsletter,
  contacts: AdminContacts,
  about: AdminAbout,
};

export default function VigoAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
      if (u?.role === "admin") {
        // Load badge counts
        Promise.all([
          base44.entities.Order.filter({ status: "Pending" }, "-created_date", 100).catch(() => []),
          base44.entities.ReturnRequest.filter({ status: "Pending" }, "-created_date", 100).catch(() => []),
          base44.entities.Review.list("-created_date", 200).catch(() => []),
          base44.entities.ContactEntry.list("-created_date", 200).catch(() => []),
        ]).then(([orders, returns, reviews, contacts]) => {
          setBadges({
            pendingOrders: orders.length,
            pendingReturns: returns.length,
            pendingReviews: reviews.filter(r => !r.approved).length,
            newContacts: contacts.filter(c => c.status === "New" || !c.status).length,
          });
        }).catch(() => {});
      }
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: G1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, background: S, animation: "vigo-pulse 1s infinite" }} />
        <style>{`@keyframes vigo-pulse{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
      </div>
    );
  }

  // Access denied
  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: G1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 48 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, border: `1.5px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 20 }}>✕</div>
          </div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>Access Denied</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Admin Only</div>
          <div style={{ fontSize: 12, color: SD, marginBottom: 32, lineHeight: 1.8 }}>
            This area is restricted to authorized admin users only.<br />
            {!user ? "Please sign in with an admin account." : "Your account does not have admin privileges."}
          </div>
          <button onClick={() => navigate("/")} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            ← Back to Store
          </button>
        </div>
      </div>
    );
  }

  const ActiveSection = SECTION_MAP[section];

  return (
    <div style={{ minHeight: "100vh", background: G1, display: "flex", fontFamily: "Inter, sans-serif", color: "#fff" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#080808", borderRight: `0.5px solid ${G3}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 200 }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: `0.5px solid ${G3}` }}>
          <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${S},transparent)`, marginBottom: 20 }} />
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 4 }}>VIGONYC</div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Admin Panel</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV.map(n => {
            const badgeCount = n.badgeKey ? badges[n.badgeKey] : 0;
            return (
              <button key={n.id} onClick={() => setSection(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 20px",
                background: section === n.id ? `rgba(192,192,192,.06)` : "none",
                border: "none", borderLeft: `2px solid ${section === n.id ? S : "transparent"}`,
                color: section === n.id ? "#fff" : SD, cursor: "pointer", fontFamily: "inherit",
                fontSize: 10, letterSpacing: 2, textTransform: "uppercase", textAlign: "left",
                transition: "all .15s"
              }}>
                <span style={{ fontSize: 12, color: section === n.id ? S : SD, flexShrink: 0 }}>{n.icon}</span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {badgeCount > 0 && <span style={{ background: "#fa0", color: "#000", fontSize: 7, fontWeight: 900, padding: "2px 6px", borderRadius: 2, letterSpacing: 0, minWidth: 16, textAlign: "center" }}>{badgeCount}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: `0.5px solid ${G3}` }}>
          <div style={{ fontSize: 9, color: SD, marginBottom: 12 }}>{user.email}</div>
          <button onClick={() => navigate("/")} style={{ width: "100%", background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "8px 0", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>← View Store</button>
          <button onClick={async () => { await base44.auth.logout(); navigate("/"); }} style={{ width: "100%", background: "none", border: `0.5px solid ${G3}`, color: "#e03", padding: "8px 0", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="admin-mobile-bar" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, background: "#080808", borderBottom: `0.5px solid ${G3}`, padding: "14px 20px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>VIGONYC Admin</div>
        <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "6px 12px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>☰</button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 400 }} />
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 220, background: "#080808", borderRight: `0.5px solid ${G3}`, zIndex: 500, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Menu</div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <nav style={{ flex: 1, padding: "12px 0" }}>
              {NAV.map(n => {
                const badgeCount = n.badgeKey ? badges[n.badgeKey] : 0;
                return (
                  <button key={n.id} onClick={() => { setSection(n.id); setSidebarOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", background: section === n.id ? "rgba(192,192,192,.06)" : "none", border: "none", borderLeft: `2px solid ${section === n.id ? S : "transparent"}`, color: section === n.id ? "#fff" : SD, cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", textAlign: "left" }}>
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {badgeCount > 0 && <span style={{ background: "#fa0", color: "#000", fontSize: 7, fontWeight: 900, padding: "2px 6px", borderRadius: 2, minWidth: 16, textAlign: "center" }}>{badgeCount}</span>}
                  </button>
                );
              })}
            </nav>
            <div style={{ padding: "16px 20px", borderTop: `0.5px solid ${G3}`, display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => { navigate("/"); setSidebarOpen(false); }} style={{ width: "100%", background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "10px 0", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>← View Store</button>
              <button onClick={async () => { await base44.auth.logout(); navigate("/"); }} style={{ width: "100%", background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "10px 0", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 220, minHeight: "100vh" }} className="admin-main">
        {/* Top bar */}
        <div style={{ padding: "0 32px", height: 60, borderBottom: `0.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: G2, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 5, height: 5, background: "#0c6", borderRadius: "50%" }} />
            <span style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Live — SS25</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>
            {NAV.find(n => n.id === section)?.label}
          </div>
          <div style={{ fontSize: 10, color: SD }}>{user.full_name || user.email}</div>
        </div>

        {/* Section content */}
        <div style={{ padding: "clamp(24px,4vw,40px) clamp(20px,4vw,36px)" }}>
          <ActiveSection onNavigate={setSection} />
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-sidebar { display: none !important; }
          .admin-mobile-bar { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  );
}