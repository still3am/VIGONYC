import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const TABS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "addresses", label: "Addresses", icon: "📍" },
  { id: "notifications", label: "Alerts", icon: "🔔" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const ORDERS = [
  { id: "VIGO-4521", date: "Apr 3, 2025", items: "Chrome V Tee, 5-Panel Cap", total: 120, status: "Delivered", statusColor: "#0c6", pieces: 2 },
  { id: "VIGO-3891", date: "Mar 15, 2025", items: "Silver Label Hoodie", total: 128, status: "Delivered", statusColor: "#0c6", pieces: 1 },
  { id: "VIGO-3201", date: "Feb 28, 2025", items: "NYC Cargo Pant, V Jogger", total: 240, status: "Delivered", statusColor: "#0c6", pieces: 2 },
];

function Field({ label, type = "text", defaultValue, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{ width: "100%", background: G2, border: `.5px solid ${G3}`, color: "#fff", padding: "13px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
        onFocus={e => e.target.style.borderColor = S}
        onBlur={e => e.target.style.borderColor = G3}
      />
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: `.5px solid ${G3}` }}>
      <div style={{ paddingRight: 16 }}>
        <div style={{ fontSize: 12, color: "#fff", marginBottom: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: SD, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: 48, height: 26, borderRadius: 13, background: checked ? S : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: checked ? "#000" : "#555", transition: "left .2s" }} />
      </button>
    </div>
  );
}

export default function VigoAccount() {
  const [tab, setTab] = useState("profile");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({ drops: true, orders: true, promotions: false, newsletter: true });
  const [profile, setProfile] = useState({ firstName: "Jordan", lastName: "NYC", email: "jordan@vigonyc.com", phone: "+1 212 000 0000", birthday: "1998-01-01" });
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => { await new Promise(r => setTimeout(r, 600)); return data; },
    onMutate: (data) => { setProfile(p => ({ ...p, ...data })); },
    onSuccess: () => {},
  });

  const deleteMutation = useMutation({
    mutationFn: async () => { await new Promise(r => setTimeout(r, 800)); },
    onMutate: () => { setDeleted(true); },
    onSuccess: () => { navigate("/"); },
  });

  const handleSave = () => saveMutation.mutate(profile);
  const saved = saveMutation.isSuccess;

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(180deg,#0d0d0d 0%,#0a0a0a 100%)", borderBottom: `.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)`, opacity: .4 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,5vw,48px) clamp(16px,4vw,24px)", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,3vw,28px)", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: "clamp(64px,10vw,88px)", height: "clamp(64px,10vw,88px)", borderRadius: "50%", background: G2, border: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: S }}>J</div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#0c6", border: "2px solid #0a0a0a" }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ My Account</div>
              <h1 style={{ fontSize: "clamp(22px,4vw,40px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, marginBottom: 6 }}>Jordan NYC</h1>
              <div style={{ fontSize: 11, color: SD, marginBottom: 10 }}>jordan@vigonyc.com</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["Member Since", "2024"], ["Orders", "3"], ["Saved", "6"]].map(([k, v]) => (
                  <div key={k} style={{ background: G2, border: `.5px solid ${G3}`, padding: "6px 12px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: S }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `.5px solid ${G3}`, background: G1, position: "sticky", top: 60, zIndex: 10, overflowX: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "14px clamp(12px,2.5vw,20px)",
                background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${S}` : "2px solid transparent",
                color: tab === t.id ? "#fff" : SD,
                fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", fontWeight: tab === t.id ? 700 : 400,
                fontFamily: "inherit", whiteSpace: "nowrap",
                transition: "color .2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span className="vigo-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(24px,4vw,40px) clamp(16px,4vw,24px)" }}>

        {/* Profile */}
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>Personal Info</div>
            <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First Name" defaultValue="Jordan" />
              <Field label="Last Name" defaultValue="NYC" />
            </div>
            <Field label="Email Address" type="email" defaultValue="jordan@vigonyc.com" />
            <Field label="Phone" type="tel" defaultValue="+1 212 000 0000" />
            <Field label="Birthday" type="date" defaultValue="1998-01-01" />

            <div style={{ paddingTop: 8 }}>
              <button onClick={handleSave} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
                {saved ? "✓ Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Order History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {ORDERS.map(order => (
                <div
                  key={order.id}
                  style={{ background: G1, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)", transition: "border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = S}
                  onMouseLeave={e => e.currentTarget.style.borderColor = G3}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 13, fontWeight: 900 }}>{order.id}</div>
                        <div style={{ fontSize: 7, letterSpacing: 2, color: order.statusColor, textTransform: "uppercase", border: `.5px solid ${order.statusColor}`, padding: "3px 8px" }}>● {order.status}</div>
                      </div>
                      <div style={{ fontSize: 10, color: SD, marginBottom: 4 }}>{order.date} · {order.pieces} {order.pieces === 1 ? "item" : "items"}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{order.items}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: S }}>${order.total}</div>
                      <button onClick={() => navigate("/track-order")} style={btnGhost}>Track →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "24px 0", fontSize: 10, color: SD }}>
              3 orders total
            </div>
          </div>
        )}

        {/* Addresses */}
        {tab === "addresses" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Saved Addresses</div>
            <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Default Shipping", addr: "123 Flatbush Ave\nBrooklyn, NY 11238\nUnited States" },
                { label: "Billing Address", addr: "Same as shipping address" },
              ].map(a => (
                <div key={a.label} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.9, marginBottom: 20, whiteSpace: "pre-line" }}>{a.addr}</div>
                  <button style={btnGhost}>Edit Address</button>
                </div>
              ))}
            </div>
            <button style={btnPrimary}>+ Add New Address</button>
          </div>
        )}

        {/* Notifications */}
        {tab === "notifications" && (
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 8 }}>Notification Preferences</div>
            <div style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 24 }}>Choose what you want to hear about — we'll never spam.</div>
            <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "0 24px", marginBottom: 24 }}>
              <Toggle label="Drop Alerts" sub="Get notified when new drops go live" checked={notifications.drops} onChange={v => setNotifications(p => ({ ...p, drops: v }))} />
              <Toggle label="Order Updates" sub="Shipping, delivery, and tracking info" checked={notifications.orders} onChange={v => setNotifications(p => ({ ...p, orders: v }))} />
              <Toggle label="Promotions & Offers" sub="Exclusive deals and early sale access" checked={notifications.promotions} onChange={v => setNotifications(p => ({ ...p, promotions: v }))} />
              <Toggle label="Newsletter" sub="Monthly NYC stories and lookbook releases" checked={notifications.newsletter} onChange={v => setNotifications(p => ({ ...p, newsletter: v }))} />
            </div>
            <button onClick={handleSave} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
              {saved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Change Password</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Current Password" type="password" placeholder="••••••••" />
                <Field label="New Password" type="password" placeholder="••••••••" />
                <Field label="Confirm Password" type="password" placeholder="••••••••" />
                <button style={{ ...btnPrimary, alignSelf: "flex-start" }}>Update Password</button>
              </div>
            </div>

            <div style={{ background: G1, border: `.5px solid #e03`, borderTop: `2px solid #e03`, padding: "28px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e03", textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>⚠ Danger Zone</div>
              <p style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 20 }}>Deleting your account is permanent and irreversible. All order history, saved items, and profile data will be removed.</p>
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)} style={{ background: "none", border: ".5px solid #e03", color: "#e03", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
              ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#ccc" }}>This cannot be undone.</span>
                  <button style={{ background: "#e03", color: "#fff", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 900, fontFamily: "inherit" }}>Yes, Delete</button>
                  <button onClick={() => setDeleteConfirm(false)} style={btnGhost}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `.5px solid ${G3}` }}>
          <button style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .vigo-2col { grid-template-columns: 1fr !important; }
          .vigo-links-grid { grid-template-columns: 1fr 1fr !important; }
          .vigo-tab-icon { display: none; }
        }
      `}</style>
    </div>
  );
}

const btnPrimary = { background: S, color: "#000", border: "none", padding: "13px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: `.5px solid ${G3}`, color: SD, padding: "11px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };