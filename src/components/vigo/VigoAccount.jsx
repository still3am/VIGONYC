import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "notifications", label: "Alerts" },
  { id: "settings", label: "Settings" },
];

function Field({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        readOnly={!onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: "100%", background: disabled ? G1 : G2, border: `.5px solid ${G3}`, color: disabled ? SD : "#fff", padding: "13px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s", opacity: disabled ? 0.6 : 1 }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = S; }}
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
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userData = await base44.auth.me();
      return userData || {};
    },
  });

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        return await base44.entities.Order.filter({ created_by: user?.email }, '-created_date', 100);
      } catch {
        return [];
      }
    },
    enabled: !!user?.email,
  });

  // Fetch addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      try {
        return await base44.entities.Address.filter({ created_by: user?.email }, '-created_date', 100);
      } catch {
        return [];
      }
    },
    enabled: !!user?.email,
  });

  const [profile, setProfile] = useState({});
  const [notifications, setNotifications] = useState({ drops: true, orders: true, promotions: false, newsletter: true });

  // Sync user data to profile state
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.full_name?.split(' ')[0] || '',
        lastName: user.full_name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
      });
      setNotifications({
        drops: user.notificationsDrops !== false,
        orders: user.notificationsOrders !== false,
        promotions: user.notificationsPromotions === true,
        newsletter: user.notificationsNewsletter !== false,
      });
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe({
        phone: data.phone,
        birthday: data.birthday,
        notificationsDrops: notifications.drops,
        notificationsOrders: notifications.orders,
        notificationsPromotions: notifications.promotions,
        notificationsNewsletter: notifications.newsletter,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.functions.invoke('changePassword', data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('deleteAccount', {});
    },
    onSuccess: () => {
      base44.auth.logout();
    },
  });

  const handleSave = () => saveMutation.mutate(profile);
  const saved = saveMutation.isSuccess;

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(180deg,#0d0d0d 0%,#0a0a0a 100%)", borderBottom: `.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)`, opacity: .4 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(48px,7vw,64px) clamp(20px,4vw,32px)", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "clamp(24px,4vw,32px)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: 0.5, background: S, opacity: 0.5 }} />
              <span style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>✦ My Account</span>
              <div style={{ width: 28, height: 0.5, background: S, opacity: 0.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: "clamp(64px,10vw,88px)", height: "clamp(64px,10vw,88px)", borderRadius: "50%", background: G2, border: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: S }}>{profile.firstName?.charAt(0) || 'U'}</div>
                <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#0c6", border: "2px solid #0a0a0a" }} />
              </div>
              <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, marginBottom: 6 }}>{profile.firstName} {profile.lastName}</h1>
              <div style={{ fontSize: 11, color: SD, marginBottom: 10 }}>{profile.email}</div>
              <div className="vigo-hero-stats" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[['Orders', orders.length.toString()], ['Email', profile.email ? '✓' : '—']].map(([k, v]) => (
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", display: "flex", gap: 0, justifyContent: "center" }}>
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
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(24px,4vw,40px) clamp(16px,4vw,24px)", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Profile */}
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>Personal Info</div>
            <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First Name" value={profile.firstName} onChange={v => setProfile(p => ({ ...p, firstName: v }))} />
              <Field label="Last Name" value={profile.lastName} onChange={v => setProfile(p => ({ ...p, lastName: v }))} />
            </div>
            <Field label="Email Address" type="email" value={profile.email} disabled />
            <Field label="Phone" type="tel" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} />
            <Field label="Birthday" type="date" value={profile.birthday} onChange={v => setProfile(p => ({ ...p, birthday: v }))} />

            <div style={{ paddingTop: 8 }}>
              <button onClick={handleSave} style={{ background: saved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
                {saved ? "✓ Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Order History</div>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", fontSize: 11, color: SD }}>No orders yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {orders.map(order => {
                  const statusColor = order.status === 'Delivered' ? '#0c6' : order.status === 'Shipped' ? '#888' : '#e03';
                  return (
                    <div
                      key={order.id}
                      style={{ background: G1, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)", transition: "border-color .2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = S}
                      onMouseLeave={e => e.currentTarget.style.borderColor = G3}
                    >
                      <div className="vigo-order-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 13, fontWeight: 900 }}>{order.orderId}</div>
                            <div style={{ fontSize: 7, letterSpacing: 2, color: statusColor, textTransform: "uppercase", border: `.5px solid ${statusColor}`, padding: "3px 8px" }}>● {order.status}</div>
                          </div>
                          <div style={{ fontSize: 10, color: SD, marginBottom: 4 }}>{new Date(order.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.pieces || 1} {order.pieces === 1 ? "item" : "items"}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{order.items}</div>
                        </div>
                        <div className="vigo-order-amount" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <div style={{ fontSize: 20, fontWeight: 900, color: S }}>${order.total}</div>
                          <button onClick={() => navigate("/track-order")} style={btnGhost}>Track →</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ textAlign: "center", padding: "24px 0", fontSize: 10, color: SD }}>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
            </div>
          </div>
        )}

        {/* Addresses */}
        {tab === "addresses" && (
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Saved Addresses</div>
            <div className="vigo-2col vigo-address-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {addresses.map(a => (
                <div key={a.id} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.9, marginBottom: 20 }}>
                    {a.fullName}<br />{a.street}<br />{a.city}, {a.state} {a.zip}<br />{a.country}
                  </div>
                  <button style={btnGhost}>Edit Address</button>
                </div>
              ))}
            </div>
            {addresses.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", fontSize: 11, color: SD }}>No saved addresses</div>}
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
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Appearance</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ThemeSelector user={user} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Change Password</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Current Password" type="password" placeholder="••••••••" value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} />
                <Field label="New Password" type="password" placeholder="••••••••" value={passwords.newPass} onChange={v => setPasswords(p => ({ ...p, newPass: v }))} />
                <Field label="Confirm Password" type="password" placeholder="••••••••" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} />
                <button onClick={() => {
                  if (passwords.newPass !== passwords.confirm) { alert('Passwords do not match'); return; }
                  passwordMutation.mutate({ currentPassword: passwords.current, newPassword: passwords.newPass });
                  setPasswords({ current: "", newPass: "", confirm: "" });
                }} style={{ ...btnPrimary, alignSelf: "flex-start" }}>{passwordMutation.isPending ? 'Updating...' : 'Update Password'}</button>
                {passwordMutation.isSuccess && <div style={{ fontSize: 10, color: '#0c6' }}>✓ Password updated</div>}
              </div>
            </div>

            <div style={{ background: G1, border: `.5px solid #e03`, borderTop: `2px solid #e03`, padding: "28px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e03", textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>⚠ Danger Zone</div>
              <p style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 20 }}>Deleting your account is permanent and irreversible. All order history, saved items, and profile data will be removed.</p>
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)} style={{ background: "none", border: ".5px solid #e03", color: "#e03", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
              ) : (
                <div className="vigo-danger-flex" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span className="vigo-danger-span" style={{ fontSize: 11, color: "#ccc" }}>This cannot be undone.</span>
                  <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} style={{ background: "#e03", color: "#fff", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer', fontWeight: 900, fontFamily: "inherit", opacity: deleteMutation.isPending ? 0.6 : 1 }}>{deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}</button>
                  <button onClick={() => setDeleteConfirm(false)} style={btnGhost}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `.5px solid ${G3}` }}>
          <button onClick={() => base44.auth.logout()} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .vigo-2col { grid-template-columns: 1fr !important; }
          .vigo-links-grid { grid-template-columns: 1fr 1fr !important; }
          .vigo-hero-stats { gap: 8px !important; flex-wrap: wrap; }
          .vigo-hero-stats > div { min-width: auto !important; padding: 4px 8px !important; font-size: 10px !important; }
          .vigo-order-row { flex-direction: column !important; align-items: flex-start !important; }
          .vigo-order-amount { align-items: flex-start !important; margin-top: 12px !important; }
          .vigo-address-grid { grid-template-columns: 1fr !important; }
          .vigo-danger-flex { flex-direction: column !important; }
          .vigo-danger-flex button { width: 100% !important; }
          .vigo-danger-span { display: block !important; margin-bottom: 12px !important; }
        }
      `}</style>
    </div>
  );
}

const btnPrimary = { background: S, color: "#000", border: "none", padding: "13px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: `.5px solid ${G3}`, color: SD, padding: "11px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };

function ThemeSelector({ user }) {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    if (user?.preferredTheme) {
      setSelectedTheme(user.preferredTheme);
      setTheme(user.preferredTheme);
    }
  }, [user, setTheme]);

  const handleThemeChange = async (newTheme) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    await base44.auth.updateMe({ preferredTheme: newTheme });
  };

  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Theme</div>
      <div style={{ display: "flex", gap: 8 }}>
        {["light", "dark", "system"].map(t => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: 10,
              fontWeight: selectedTheme === t ? 700 : 400,
              textTransform: "capitalize",
              border: `.5px solid ${selectedTheme === t ? S : G3}`,
              background: selectedTheme === t ? S : "transparent",
              color: selectedTheme === t ? "#000" : "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}