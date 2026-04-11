import { useState } from "react";
import { useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
];

const ORDERS = [
  { id: "VIGO-4521", date: "Apr 3, 2025", items: "Chrome V Tee, 5-Panel Cap", total: 120, status: "Delivered", statusColor: "#0c6" },
  { id: "VIGO-3891", date: "Mar 15, 2025", items: "Silver Label Hoodie", total: 128, status: "Delivered", statusColor: "#0c6" },
  { id: "VIGO-3201", date: "Feb 28, 2025", items: "NYC Cargo Pant, V Jogger", total: 240, status: "Delivered", statusColor: "#0c6" },
];

function Field({ label, type = "text", defaultValue, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} style={{ width: "100%", background: G2, border: `.5px solid ${G3}`, color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
        onFocus={e => e.target.style.borderColor = S}
        onBlur={e => e.target.style.borderColor = G3} />
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `.5px solid ${G3}` }}>
      <div>
        <div style={{ fontSize: 12, color: "#fff", marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: SD }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? S : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: checked ? "#000" : "#555", transition: "left .2s" }} />
      </button>
    </div>
  );
}

export default function VigoAccount() {
  const [tab, setTab] = useState("profile");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({ drops: true, orders: true, promotions: false, newsletter: true });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ padding: "48px 24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ My Account</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: -2 }}>My Account</h1>
        </div>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: G1, border: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: S }}>J</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Jordan NYC</div>
            <div style={{ fontSize: 10, color: SD }}>jordan@vigonyc.com</div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase", marginTop: 3 }}>Member Since 2024</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 32, overflowX: "auto", borderBottom: `.5px solid ${G3}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${S}` : "2px solid transparent", color: tab === t.id ? "#fff" : SD, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontWeight: tab === t.id ? 700 : 400, fontFamily: "inherit", whiteSpace: "nowrap", transition: "color .2s" }}>{t.label}</button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="First Name" defaultValue="Jordan" />
            <Field label="Last Name" defaultValue="NYC" />
          </div>
          <Field label="Email Address" type="email" defaultValue="jordan@vigonyc.com" />
          <Field label="Phone" type="tel" defaultValue="+1 212 000 0000" />
          <Field label="Birthday" type="date" defaultValue="1998-01-01" />
          <button onClick={handleSave} style={{ ...btnP, alignSelf: "flex-start", marginTop: 8 }}>{saved ? "✓ Saved!" : "Save Profile"}</button>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div>
          {ORDERS.map(order => (
            <div key={order.id} style={{ background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", marginBottom: 2, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = S}
              onMouseLeave={e => e.currentTarget.style.borderColor = G3}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Order {order.id}</div>
                <div style={{ fontSize: 10, color: SD }}>{order.date} · {order.items}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: S }}>${order.total}</div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: order.statusColor, textTransform: "uppercase", marginTop: 3 }}>● {order.status}</div>
                </div>
                <button onClick={() => navigate("/track-order")} style={btnGhost}>Track →</button>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: "28px 0", fontSize: 10, color: SD }}>
            3 orders · <span style={{ color: S, cursor: "pointer" }}>View all →</span>
          </div>
        </div>
      )}

      {/* Addresses */}
      {tab === "addresses" && (
        <div>
          <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Default Shipping", addr: "123 Flatbush Ave, Brooklyn, NY 11238" },
              { label: "Billing Address", addr: "Same as shipping" },
            ].map(a => (
              <div key={a.label} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
                <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 12 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7, marginBottom: 16 }}>{a.addr}</div>
                <button style={btnGhost}>Edit</button>
              </div>
            ))}
          </div>
          <button style={btnP}>+ Add New Address</button>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: SD, lineHeight: 1.8 }}>Choose what you want to hear about — we'll never spam.</div>
          <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "0 24px", marginTop: 20 }}>
            <Toggle label="Drop Alerts" sub="Get notified when new drops go live" checked={notifications.drops} onChange={v => setNotifications(p => ({ ...p, drops: v }))} />
            <Toggle label="Order Updates" sub="Shipping, delivery, and tracking" checked={notifications.orders} onChange={v => setNotifications(p => ({ ...p, orders: v }))} />
            <Toggle label="Promotions & Offers" sub="Exclusive deals and sale access" checked={notifications.promotions} onChange={v => setNotifications(p => ({ ...p, promotions: v }))} />
            <Toggle label="Newsletter" sub="Monthly NYC stories and lookbook releases" checked={notifications.newsletter} onChange={v => setNotifications(p => ({ ...p, newsletter: v }))} />
          </div>
          <button onClick={handleSave} style={{ ...btnP, marginTop: 24 }}>{saved ? "✓ Saved!" : "Save Preferences"}</button>
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
          <Field label="New Password" type="password" placeholder="••••••••" />
          <Field label="Confirm Password" type="password" placeholder="••••••••" />
          <button style={{ ...btnP, alignSelf: "flex-start" }}>Update Password</button>

          <div style={{ marginTop: 36, background: G1, border: `.5px solid #e03`, padding: "28px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e03", marginBottom: 8 }}>Danger Zone</div>
            <p style={{ fontSize: 11, color: SD, lineHeight: 1.7, marginBottom: 20 }}>Deleting your account is permanent. All order history, saved items, and profile data will be removed.</p>
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)} style={{ background: "none", border: ".5px solid #e03", color: "#e03", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#ccc" }}>This cannot be undone.</span>
                <button style={{ background: "#e03", color: "#fff", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 900, fontFamily: "inherit" }}>Yes, Delete</button>
                <button onClick={() => setDeleteConfirm(false)} style={btnGhost}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:600px){.vigo-2col-sm{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

const btnP = { background: S, color: "#000", border: "none", padding: "13px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: `.5px solid ${G3}`, color: SD, padding: "11px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };