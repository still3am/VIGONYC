import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const me = await base44.auth.me();
        if (!me) {
          navigate("/");
          return;
        }
        if (me.role !== "admin") {
          setError("Admin access required");
          setLoading(false);
          return;
        }
        setUser(me);
        setLoading(false);
      } catch (err) {
        setError("Failed to verify admin access");
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: G1 }}>
        <div style={{ fontSize: 12, color: S }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: G1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#e03", marginBottom: 12 }}>🔒 Access Denied</div>
          <div style={{ fontSize: 12, color: SD, marginBottom: 24 }}>{error}</div>
          <button onClick={() => navigate("/")} style={{ background: S, color: "#000", border: "none", padding: "10px 20px", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 2 }}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: G1, minHeight: "100vh", padding: "40px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 12 }}>✦ Admin Dashboard</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Manage Your Store</h1>
          <div style={{ fontSize: 12, color: SD }}>Welcome, <strong>{user?.full_name}</strong></div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginBottom: 40 }}>
          {[
            { title: "Products", desc: "Add, edit, and manage products", path: "/admin/products", icon: "📦" },
            { title: "Drops", desc: "Manage drop calendar and schedule", path: "/admin/drops", icon: "📅" },
          ].map(item => (
            <div key={item.path} onClick={() => navigate(item.path)} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 32, cursor: "pointer", transition: "border-color .2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = S} onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{item.title}</h2>
              <p style={{ fontSize: 12, color: SD, marginBottom: 16 }}>{item.desc}</p>
              <div style={{ fontSize: 10, color: S, letterSpacing: 2, textTransform: "uppercase" }}>Open →</div>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <button onClick={() => base44.auth.logout("/")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
      </div>
    </div>
  );
}