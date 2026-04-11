import { useState } from "react";
import { useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const TABS = ["Profile","Orders","Settings"];

export default function VigoAccount() {
  const [tab, setTab] = useState("Profile");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "64px 32px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ My Account</div>
      <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 40 }}>Account</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 36 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 24px", background: tab === t ? S : G1, color: tab === t ? "#000" : SD, border: `.5px solid ${tab === t ? S : G3}`, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontWeight: tab === t ? 900 : 400, fontFamily: "inherit" }}>{t}</button>
        ))}
      </div>

      {tab === "Profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="vigo-2col-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="First Name" defaultValue="Jordan" />
            <Field label="Last Name" defaultValue="NYC" />
          </div>
          <Field label="Email Address" type="email" defaultValue="jordan@vigonyc.com" />
          <Field label="Phone" type="tel" defaultValue="+1 212 000 0000" />
          <button style={{ background: S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}>Save Changes</button>
        </div>
      )}

      {tab === "Orders" && (
        <div>
          {[["VIGO-4521","Apr 3, 2025","Chrome V Tee, 5-Panel Cap","$120","Delivered"],["VIGO-3891","Mar 15, 2025","Silver Label Hoodie","$128","Delivered"]].map(([id,date,items,total,status]) => (
            <div key={id} style={{ background: G1, border: `.5px solid ${G3}`, padding: "20px 24px", marginBottom: 2, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Order {id}</div>
                <div style={{ fontSize: 10, color: SD }}>{date} · {items}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: S, marginBottom: 4 }}>{total}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#0c6", textTransform: "uppercase" }}>{status}</div>
              </div>
              <button onClick={() => navigate("/track-order")} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Track</button>
            </div>
          ))}
        </div>
      )}

      {tab === "Settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="New Password" type="password" />
          <Field label="Confirm Password" type="password" />
          <button style={{ background: S, color: "#000", border: "none", padding: "14px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}>Update Password</button>

          {/* Delete account */}
          <div style={{ marginTop: 40, background: G1, border: `.5px solid #e03`, padding: "28px 28px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e03", marginBottom: 8 }}>Danger Zone</div>
            <p style={{ fontSize: 11, color: SD, lineHeight: 1.7, marginBottom: 20 }}>Deleting your account is permanent. All your order history, saved items, and profile data will be removed and cannot be recovered.</p>
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)} style={{ background: "none", border: ".5px solid #e03", color: "#e03", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#ccc", alignSelf: "center" }}>Are you sure? This cannot be undone.</span>
                <button style={{ background: "#e03", color: "#fff", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 900, fontFamily: "inherit" }}>Yes, Delete</button>
                <button onClick={() => setDeleteConfirm(false)} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@media(max-width:600px){.vigo-2col-sm{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function Field({ label, type = "text", defaultValue }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "#777", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <input type={type} defaultValue={defaultValue} style={{ width: "100%", background: "#0a0a0a", border: ".5px solid #1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}