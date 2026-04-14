import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const TABS = [
{ id: "profile", label: "Profile" },
{ id: "orders", label: "Orders" },
{ id: "addresses", label: "Addresses" },
{ id: "notifications", label: "Alerts" },
{ id: "settings", label: "Settings" }];


function Field({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: "100%", background: disabled ? G1 : G2, border: `.5px solid ${G3}`, color: disabled ? SD : "var(--vt-text)", padding: "13px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s", opacity: disabled ? 0.6 : 1 }}
        onFocus={(e) => {if (!disabled) e.target.style.borderColor = S;}}
        onBlur={(e) => e.target.style.borderColor = "var(--vt-border)"} />
      
    </div>);

}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: `.5px solid ${G3}` }}>
      <div style={{ paddingRight: 16 }}>
        <div style={{ fontSize: 12, color: "var(--vt-text)", marginBottom: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: SD, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: 48, height: 26, borderRadius: 13, background: checked ? S : G3, border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
        
        <div style={{ position: "absolute", top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: checked ? "#000" : SD, transition: "left .2s" }} />
      </button>
    </div>);

}

const EMPTY_ADDRESS = { label: "", fullName: "", street: "", city: "", state: "", zip: "", country: "US" };

function AddressModal({ address, onSave, onClose }) {
  const [form, setForm] = useState(address || EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.label || !form.fullName || !form.street || !form.city || !form.state || !form.zip) {
      alert("Please fill in all required fields");
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.7)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "min(560px,95vw)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1, color: "var(--vt-text)" }}>{address?.id ? "Edit Address" : "Add New Address"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Address Label (e.g. Home, Work)" value={form.label} onChange={(v) => set("label", v)} />
          <Field label="Full Name" value={form.fullName} onChange={(v) => set("fullName", v)} />
          <Field label="Street Address" value={form.street} onChange={(v) => set("street", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="State" value={form.state} onChange={(v) => set("state", v)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="ZIP Code" value={form.zip} onChange={(v) => set("zip", v)} />
            <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
          </div>
          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save Address"}</button>
            <button onClick={onClose} style={btnGhost}>Cancel</button>
          </div>
        </div>
      </div>
    </>);

}

function ThemeSelector({ user }) {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(() => user?.preferredTheme || theme);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && user?.preferredTheme) {
      setSelectedTheme(user.preferredTheme);
      setTheme(user.preferredTheme);
      setInitialized(true);
    }
  }, [user]);

  const handleThemeChange = async (newTheme) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    await base44.auth.updateMe({ preferredTheme: newTheme });
  };

  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Theme</div>
      <div style={{ display: "flex", gap: 8 }}>
        {["light", "dark", "system"].map((t) =>
        <button
          key={t}
          onClick={() => handleThemeChange(t)}
          style={{
            flex: 1, padding: "12px 16px", fontSize: 10,
            fontWeight: selectedTheme === t ? 700 : 400,
            textTransform: "capitalize",
            border: `.5px solid ${selectedTheme === t ? S : G3}`,
            background: selectedTheme === t ? S : "transparent",
            color: selectedTheme === t ? "#000" : "var(--vt-text)",
            cursor: "pointer", fontFamily: "inherit", transition: "all .2s"
          }}>
          {t}</button>
        )}
      </div>
    </div>);

}

export default function VigoAccount() {
  const [tab, setTab] = useState("profile");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [addressModal, setAddressModal] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userData = await base44.auth.me().catch(() => null);
      return userData || null;
    }
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {return await base44.entities.Order.filter({ created_by: user?.email }, '-created_date', 100);}
      catch {return [];}
    },
    enabled: !!user?.email
  });

  const { data: addresses = [], isLoading: addressesLoading, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      try {return await base44.entities.Address.filter({ created_by: user?.email }, '-created_date', 100);}
      catch {return [];}
    },
    enabled: !!user?.email
  });

  const [profile, setProfile] = useState({});
  const [notifications, setNotifications] = useState({ drops: true, orders: true, promotions: false, newsletter: true });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.full_name?.split(' ')[0] || '',
        lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || ''
      });
      setNotifications({
        drops: user.notificationsDrops !== false,
        orders: user.notificationsOrders !== false,
        promotions: user.notificationsPromotions === true,
        newsletter: user.notificationsNewsletter !== false
      });
    }
  }, [user]);

  const saveProfile = async () => {
    try {
      await base44.auth.updateMe({
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        phone: profile.phone,
        birthday: profile.birthday
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      alert("Failed to save profile. Please try again.");
    }
  };

  const saveNotifications = async () => {
    try {
      await base44.auth.updateMe({
        notificationsDrops: notifications.drops,
        notificationsOrders: notifications.orders,
        notificationsPromotions: notifications.promotions,
        notificationsNewsletter: notifications.newsletter
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2500);
    } catch {
      alert("Failed to save notification preferences. Please try again.");
    }
  };

  const savePassword = async () => {
    if (!passwords.current || !passwords.newPass) {alert("Please fill in all password fields");return;}
    if (passwords.newPass !== passwords.confirm) {alert("Passwords do not match");return;}
    if (passwords.newPass.length < 8) {alert("Password must be at least 8 characters");return;}
    try {
      await base44.functions.invoke('changePassword', { currentPassword: passwords.current, newPassword: passwords.newPass });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch {
      alert("Failed to update password. Please check your current password and try again.");
    }
  };

  const saveAddress = async (form) => {
    if (form.id) {
      await base44.entities.Address.update(form.id, form);
    } else {
      await base44.entities.Address.create(form);
    }
    refetchAddresses();
  };

  const deleteAddress = async (id) => {
    if (!confirm("Remove this address?")) return;
    await base44.entities.Address.delete(id);
    refetchAddresses();
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke('deleteAccount', {});
      base44.auth.logout();
    } catch {
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (!userLoading && !user) {
    return (
      <div style={{ padding: "80px 32px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Account</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>Sign In to Your Account</h1>
        <p style={{ fontSize: 13, color: SD, marginBottom: 32 }}>Access your orders, saved addresses, and profile.</p>
        <button onClick={() => base44.auth.redirectToLogin(window.location.href)} style={btnPrimary}>Sign In →</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh" }}>
      {addressModal &&
      <AddressModal
        address={addressModal === "new" ? null : addressModal}
        onSave={saveAddress}
        onClose={() => setAddressModal(null)} />

      }

      {/* Hero Header */}
      <div style={{ background: "linear-gradient(180deg,var(--vt-card) 0%,var(--vt-bg) 100%)", borderBottom: `.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)`, opacity: .4 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(48px,7vw,64px) clamp(20px,4vw,32px)", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: 0.5, background: S, opacity: 0.5 }} />
              <span style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>✦ My Account</span>
              <div style={{ width: 28, height: 0.5, background: S, opacity: 0.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: "clamp(64px,10vw,88px)", height: "clamp(64px,10vw,88px)", borderRadius: "50%", background: G2, border: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: S }}>{profile.firstName?.charAt(0) || 'U'}</div>
                
              </div>
              <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, marginBottom: 6 }}>{profile.firstName} {profile.lastName}</h1>
              <div style={{ fontSize: 11, color: SD, marginBottom: 10 }}>{profile.email}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[['Orders', orders.length.toString()], ['Addresses', addresses.length.toString()]].map(([k, v]) =>
                <div key={k} style={{ background: G2, border: `.5px solid ${G3}`, padding: "6px 16px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: S }}>{v}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `.5px solid ${G3}`, background: G1, position: "sticky", top: 60, zIndex: 10, overflowX: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)", display: "flex", justifyContent: "center" }}>
          {TABS.map((t) =>
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "14px clamp(12px,2.5vw,20px)", background: "none", border: "none",
            borderBottom: tab === t.id ? `2px solid ${S}` : "2px solid transparent",
            color: tab === t.id ? "var(--vt-text)" : SD, fontSize: 9, letterSpacing: 2,
            textTransform: "uppercase", cursor: "pointer", fontWeight: tab === t.id ? 700 : 400,
            fontFamily: "inherit", whiteSpace: "nowrap", transition: "color .2s"
          }}>{t.label}</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(24px,4vw,40px) clamp(16px,4vw,24px)", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* ── PROFILE ── */}
        {tab === "profile" &&
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 600 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>Personal Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="vigo-2col">
              <Field label="First Name" value={profile.firstName} onChange={(v) => setProfile((p) => ({ ...p, firstName: v }))} />
              <Field label="Last Name" value={profile.lastName} onChange={(v) => setProfile((p) => ({ ...p, lastName: v }))} />
            </div>
            <Field label="Email Address" type="email" value={profile.email} disabled />
            <Field label="Phone" type="tel" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} placeholder="+1 (555) 000-0000" />
            <Field label="Birthday" type="date" value={profile.birthday} onChange={(v) => setProfile((p) => ({ ...p, birthday: v }))} />
            <div style={{ paddingTop: 8 }}>
              <button onClick={saveProfile} style={{ background: profileSaved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
                {profileSaved ? "✓ Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        }

        {/* ── ORDERS ── */}
        {tab === "orders" &&
        <div style={{ width: "100%" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>Order History</div>
            {ordersLoading ?
          <div style={{ textAlign: "center", padding: "60px 20px", color: SD, fontSize: 12 }}>Loading orders...</div> :
          orders.length === 0 ?
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 32, opacity: .15, marginBottom: 12 }}>—</div>
                <div style={{ fontSize: 13, color: SD, marginBottom: 8 }}>No orders yet</div>
                <div style={{ fontSize: 10, color: SD, marginBottom: 24 }}>Your purchase history will appear here</div>
                <button onClick={() => navigate("/shop")} style={btnPrimary}>Browse the Shop</button>
              </div> :

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {orders.map((order) => {
              const statusColor = order.status === 'Delivered' ? '#0c6' : order.status === 'Shipped' ? S : order.status === 'Processing' ? '#fa0' : '#e03';
              return (
                <div key={order.id} style={{ background: G1, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)", transition: "border-color .2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = S}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--vt-border)"}>
                      <div className="vigo-order-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 13, fontWeight: 900 }}>{order.orderId}</div>
                            <div style={{ fontSize: 7, letterSpacing: 2, color: statusColor, textTransform: "uppercase", border: `.5px solid ${statusColor}`, padding: "3px 8px" }}>● {order.status}</div>
                          </div>
                          <div style={{ fontSize: 10, color: SD, marginBottom: 4 }}>
                            {new Date(order.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.pieces || 1} {order.pieces === 1 ? "item" : "items"}
                          </div>
                          <div style={{ fontSize: 11, color: SD }}>{order.items}</div>
                          {order.trackingNumber && <div style={{ fontSize: 9, color: SD, marginTop: 4 }}>Tracking: {order.trackingNumber}</div>}
                        </div>
                        <div className="vigo-order-amount" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <div style={{ fontSize: 20, fontWeight: 900, color: S }}>${order.total}</div>
                          <button onClick={() => navigate("/track-order")} style={btnGhost}>Track →</button>
                        </div>
                      </div>
                    </div>);

            })}
                <div style={{ textAlign: "center", padding: "20px 0", fontSize: 10, color: SD }}>
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
                </div>
              </div>
          }
          </div>
        }

        {/* ── ADDRESSES ── */}
        {tab === "addresses" &&
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Saved Addresses</div>
              <button onClick={() => setAddressModal("new")} style={btnPrimary}>+ Add New Address</button>
            </div>
            {addressesLoading ?
          <div style={{ textAlign: "center", padding: "60px 20px", color: SD, fontSize: 12 }}>Loading addresses...</div> :
          addresses.length === 0 ?
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 32, opacity: .15, marginBottom: 12 }}>⌂</div>
                <div style={{ fontSize: 13, color: SD, marginBottom: 20 }}>No saved addresses yet</div>
                <button onClick={() => setAddressModal("new")} style={btnPrimary}>Add Address</button>
              </div> :

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="vigo-address-grid">
                {addresses.map((a) =>
            <div key={a.id} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 20 }}>
                      {a.fullName}<br />{a.street}<br />{a.city}, {a.state} {a.zip}<br />{a.country}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setAddressModal(a)} style={btnGhost}>Edit</button>
                      <button onClick={() => deleteAddress(a.id)} style={{ ...btnGhost, color: "#e03", borderColor: "#e03" }}>Remove</button>
                    </div>
                  </div>
            )}
              </div>
          }
          </div>
        }

        {/* ── NOTIFICATIONS ── */}
        {tab === "notifications" &&
        <div style={{ maxWidth: 520, width: "100%" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 8 }}>Notification Preferences</div>
            <div style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 24 }}>Choose what you want to hear about — we'll never spam.</div>
            <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "0 24px", marginBottom: 24 }}>
              <Toggle label="Drop Alerts" sub="Get notified when new drops go live" checked={notifications.drops} onChange={(v) => setNotifications((p) => ({ ...p, drops: v }))} />
              <Toggle label="Order Updates" sub="Shipping, delivery, and tracking info" checked={notifications.orders} onChange={(v) => setNotifications((p) => ({ ...p, orders: v }))} />
              <Toggle label="Promotions & Offers" sub="Exclusive deals and early sale access" checked={notifications.promotions} onChange={(v) => setNotifications((p) => ({ ...p, promotions: v }))} />
              <Toggle label="Newsletter" sub="Monthly NYC stories and lookbook releases" checked={notifications.newsletter} onChange={(v) => setNotifications((p) => ({ ...p, newsletter: v }))} />
            </div>
            <button onClick={saveNotifications} style={{ background: notifSaved ? "#0c6" : S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
              {notifSaved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </div>
        }

        {/* ── SETTINGS ── */}
        {tab === "settings" &&
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 520, width: "100%" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Appearance</div>
              <ThemeSelector user={user} />
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Change Password</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Current Password" type="password" placeholder="••••••••" value={passwords.current} onChange={(v) => setPasswords((p) => ({ ...p, current: v }))} />
                <Field label="New Password" type="password" placeholder="Min 8 characters" value={passwords.newPass} onChange={(v) => setPasswords((p) => ({ ...p, newPass: v }))} />
                <Field label="Confirm New Password" type="password" placeholder="••••••••" value={passwords.confirm} onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 4 }}>
                  <button onClick={savePassword} style={{ ...btnPrimary }}>Update Password</button>
                  {pwSaved && <div style={{ fontSize: 10, color: '#0c6' }}>✓ Password updated</div>}
                </div>
              </div>
            </div>

            <div style={{ background: G1, border: `.5px solid #e03`, borderTop: `2px solid #e03`, padding: "28px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e03", textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>⚠ Danger Zone</div>
              <p style={{ fontSize: 11, color: SD, lineHeight: 1.8, marginBottom: 20 }}>Deleting your account is permanent and irreversible. All order history, saved items, and profile data will be removed.</p>
              {!deleteConfirm ?
            <button onClick={() => setDeleteConfirm(true)} style={{ background: "none", border: ".5px solid #e03", color: "#e03", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button> :

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: SD }}>This cannot be undone.</span>
                  <button onClick={deleteAccount} disabled={deleting} style={{ background: "#e03", color: "#fff", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: deleting ? "not-allowed" : "pointer", fontWeight: 900, fontFamily: "inherit", opacity: deleting ? 0.6 : 1 }}>{deleting ? "Deleting..." : "Yes, Delete"}</button>
                  <button onClick={() => setDeleteConfirm(false)} style={btnGhost}>Cancel</button>
                </div>
            }
            </div>
          </div>
        }

        {/* Sign Out */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `.5px solid ${G3}`, width: "100%", display: "flex", justifyContent: "center" }}>
          <button onClick={() => base44.auth.logout()} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .vigo-2col { grid-template-columns: 1fr !important; }
          .vigo-address-grid { grid-template-columns: 1fr !important; }
          .vigo-order-row { flex-direction: column !important; align-items: flex-start !important; }
          .vigo-order-amount { align-items: flex-start !important; margin-top: 12px !important; }
        }
      `}</style>
    </div>);

}

const btnPrimary = { background: "#C0C0C0", color: "#000", border: "none", padding: "13px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: "0.5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "11px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };