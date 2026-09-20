import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { S, G1, G3, SD, btnGhost } from "@/components/admin/adminUi";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminContact from "@/components/admin/AdminContact";
import AdminReturns from "@/components/admin/AdminReturns";
import AdminReviews from "@/components/admin/AdminReviews";
import { Pencil, ExternalLink } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Messages" },
  { id: "returns", label: "Returns" },
  { id: "reviews", label: "Reviews" },
];

export default function VigoAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u && u.role === "admin") setIsAdmin(true);
      else navigate("/account");
    }).catch(() => navigate("/account"));
  }, [navigate]);

  useEffect(() => { document.title = "Admin — VIGONYC"; return () => { document.title = "VIGONYC — NYC Streetwear"; }; }, []);

  if (!isAdmin) return <div style={{ minHeight: "100vh", background: G1, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11, letterSpacing: 2 }}>Loading admin...</div>;

  return (
    <div style={{ minHeight: "100vh", background: G1, color: "var(--vt-text)" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase" }}>✦ Control Center</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, marginTop: 4 }}>Admin Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/editor")} style={{ ...btnGhost, display: "inline-flex", alignItems: "center", gap: 8 }}><Pencil size={13} /> Content Editor</button>
            <button onClick={() => navigate("/")} style={{ ...btnGhost, display: "inline-flex", alignItems: "center", gap: 8 }}><ExternalLink size={13} /> View Store</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, borderBottom: `0.5px solid ${G3}`, marginBottom: 24, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              background: "transparent", color: active === t.id ? "var(--vt-text)" : SD, border: "none",
              borderBottom: active === t.id ? `2px solid ${S}` : "2px solid transparent",
              padding: "12px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
              fontWeight: active === t.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", outline: "none"
            }}>{t.label}</button>
          ))}
        </div>

        {active === "overview" && <AdminOverview />}
        {active === "orders" && <AdminOrders />}
        {active === "products" && <AdminProducts />}
        {active === "contact" && <AdminContact />}
        {active === "returns" && <AdminReturns />}
        {active === "reviews" && <AdminReviews />}
      </div>
    </div>
  );
}