import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ChromeSphere from "@/components/referral/ChromeSphere";
import PointTracker from "@/components/referral/PointTracker";
import NeuralScanner from "@/components/referral/NeuralScanner";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const TIERS = [
  {
    name: "Silver",
    min: 0,
    max: 3000,
    color: "#C0C0C0",
    perks: ["Early drop notifications", "5 pts per $1 spent", "Referral bonuses"],
    icon: "◈",
  },
  {
    name: "Chrome",
    min: 3000,
    max: 10000,
    color: "#E8E8E8",
    perks: ["Early drop access (24h)", "Double points weekends", "Exclusive Chrome drops", "Free standard shipping"],
    icon: "◉",
  },
  {
    name: "Obsidian",
    min: 10000,
    max: null,
    color: "#9CA3AF",
    perks: ["Instant drop access", "Archival credits ($25/mo)", "Private Discord channel", "Custom piece requests", "Free overnight shipping"],
    icon: "◈◈",
  },
];

export default function VigoReferral() {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "The Exchange — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        base44.functions.invoke("loyaltyPoints", { action: "get" })
          .then(res => { setLoyalty(res.data.loyalty); setLoading(false); })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  const handleScanResult = (data) => {
    base44.functions.invoke("loyaltyPoints", { action: "get" })
      .then(res => setLoyalty(res.data.loyalty));
    if (data.pointsAdded > 0) toast.success(`+${data.pointsAdded} points earned!`);
  };

  const referralLink = loyalty?.referralCode
    ? `${window.location.origin}/?ref=${loyalty.referralCode}`
    : "";

  const copyReferral = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  const totalEarned = loyalty?.totalEarned || 0;
  const currentTier = TIERS.find(t => t.max === null || totalEarned < t.max) || TIERS[TIERS.length - 1];

  if (!user && !loading) {
    return (
      <div style={{ minHeight: "80vh", background: G1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase" }}>✦ The Exchange</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--vt-text)", letterSpacing: -2, textAlign: "center" }}>Sign in to Access<br /><span style={{ color: S }}>The Exchange</span></h1>
        <p style={{ fontSize: 12, color: SD, textAlign: "center", maxWidth: 320 }}>Join the inner circle. Earn points, authenticate gear, and unlock exclusive drops.</p>
        <button onClick={() => base44.auth.redirectToLogin()} style={chromeBtnFull}>Sign In</button>
      </div>
    );
  }

  return (
    <div style={{ background: G1, minHeight: "100vh", color: "var(--vt-text)", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Top silver accent */}
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #888, #E8E8E8, #C0C0C0, #E8E8E8, #888, transparent)" }} />

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `0.5px solid ${G3}`, background: G1 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(40px,7vw,80px) clamp(20px,4vw,40px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.15)", padding: "6px 14px", marginBottom: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
            <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Inner Circle Active</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, marginBottom: 20 }}>
            ACCESS:<br /><span style={{ background: "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THE EXCHANGE</span>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 32, maxWidth: 480 }}>
            A modular loyalty system for the inner circle. Earn, advocate, and ascend.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["dashboard", "scan", "refer", "ascend"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? S : "transparent", color: activeTab === tab ? "#000" : SD, border: `0.5px solid ${activeTab === tab ? S : G3}`, padding: "8px 18px", fontSize: 8, letterSpacing: 3, textTransform: "uppercase", fontWeight: activeTab === tab ? 900 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {tab === "dashboard" ? "Overview" : tab === "scan" ? "Scan Gear" : tab === "refer" ? "Advocate" : "Ascend"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT PANELS */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,5vw,52px) clamp(20px,4vw,40px)" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 24 }}>✦ Your Profile</div>
            {loading ? (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD }}>Loading...</div>
            ) : (
              <div className="ref-dash-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
                <PointTracker points={loyalty?.points || 0} totalEarned={loyalty?.totalEarned || 0} />

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Stats */}
                  <div className="ref-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {[
                      { label: "Points Balance", value: (loyalty?.points || 0).toLocaleString(), color: S },
                      { label: "Total Earned", value: (loyalty?.totalEarned || 0).toLocaleString(), color: "#E8E8E8" },
                      { label: "Referrals", value: loyalty?.totalReferrals || 0, color: "#0c6" },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${stat.color}`, padding: "20px 16px" }}>
                        <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{stat.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, letterSpacing: -1 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Current tier */}
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${currentTier.color}`, padding: "20px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 20, color: currentTier.color }}>{currentTier.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: currentTier.color }}>{currentTier.name} Tier</div>
                        <div style={{ fontSize: 9, color: SD, letterSpacing: 1 }}>
                          {currentTier.max ? `${(currentTier.max - (loyalty?.totalEarned || 0)).toLocaleString()} pts to next tier` : "Maximum tier"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {currentTier.perks.map(p => (
                        <span key={p} style={{ fontSize: 8, color: currentTier.color, border: `0.5px solid ${currentTier.color}22`, background: `${currentTier.color}0a`, padding: "4px 10px", letterSpacing: 1 }}>{p}</span>
                      ))}
                    </div>
                  </div>

                  {/* Earn rate */}
                  <div style={{ background: "rgba(192,192,192,0.04)", border: "0.5px solid rgba(192,192,192,0.1)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 20, color: S }}>$</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vt-text)" }}>$1 spent = 5 Points</div>
                      <div style={{ fontSize: 9, color: SD }}>Points auto-applied on every purchase</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCANNER */}
        {activeTab === "scan" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Neural Scanner</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Scan Gear</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 28, maxWidth: 480 }}>
              Authenticate physical garments with their QR tag to earn points, or scan a friend's referral QR to apply their code.
            </p>
            <div style={{ maxWidth: 400 }}>
              <NeuralScanner onScanResult={handleScanResult} />
            </div>
          </div>
        )}

        {/* ADVOCATE (REFER) */}
        {activeTab === "refer" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Advocate</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Refer & Earn</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 32, maxWidth: 480 }}>
              Give your crew 20% off their first order. You earn 500 points per successful referral.
            </p>

            <div className="ref-refer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Link Generator */}
              <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 16 }}>Your Referral Link</div>
                <div style={{ display: "flex", marginBottom: 14 }}>
                  <input readOnly value={referralLink} style={{ flex: 1, background: G1, border: `0.5px solid ${G3}`, borderRight: "none", color: S, padding: "12px 14px", fontSize: 10, outline: "none", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }} />
                  <button onClick={copyReferral} style={{ background: copied ? "#0c6" : S, color: "#000", border: "none", padding: "12px 20px", fontSize: 8, letterSpacing: 2, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "background 0.3s", whiteSpace: "nowrap" }}>
                    {copied ? "✓ Copied" : "Copy Link"}
                  </button>
                </div>

                {/* QR Code display */}
                {loyalty?.referralCode && (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 9, color: SD, marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>Your Referral QR</div>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(referralLink)}&bgcolor=0a0a0a&color=C0C0C0&qzone=1`}
                      alt="Referral QR"
                      style={{ width: 160, height: 160, imageRendering: "pixelated", border: `0.5px solid ${G3}` }}
                    />
                    <div style={{ fontSize: 8, color: SD, marginTop: 10, letterSpacing: 2 }}>Code: {loyalty.referralCode}</div>
                  </div>
                )}
              </div>

              {/* How it works */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { step: "01", title: "Share Your Link", desc: "Send your unique referral link or QR code to a friend." },
                  { step: "02", title: "They Get 20% Off", desc: "Their first order is automatically discounted." },
                  { step: "03", title: "You Get 500 Points", desc: "Once they complete a purchase, 500 points hit your account." },
                ].map(s => (
                  <div key={s.step} style={{ background: G2, border: `0.5px solid ${G3}`, padding: "20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: G3, letterSpacing: -2, flexShrink: 0, lineHeight: 1 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "14px 18px", background: "rgba(0,204,102,0.06)", border: "0.5px solid rgba(0,204,102,0.15)", fontSize: 11, color: "#0c6" }}>
                  Total referrals: <strong>{loyalty?.totalReferrals || 0}</strong> · Points from referrals: <strong>{(loyalty?.totalReferrals || 0) * 500}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASCEND (TIERS) */}
        {activeTab === "ascend" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Ascend</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Loyalty Tiers</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 32, maxWidth: 480 }}>The more you engage, the deeper you go. Unlock exclusive perks at every level.</p>

            <div className="ref-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {TIERS.map(tier => {
                const isActive = loyalty?.tier === tier.name;
                const isPast = TIERS.indexOf(tier) < TIERS.findIndex(t => t.name === loyalty?.tier);
                return (
                  <div key={tier.name} style={{ background: G2, border: `0.5px solid ${isActive ? tier.color : G3}`, borderTop: `3px solid ${tier.color}`, padding: "28px 24px", position: "relative", opacity: isPast ? 0.6 : 1 }}>
                    {isActive && (
                      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: 2, color: tier.color, border: `0.5px solid ${tier.color}`, padding: "3px 8px", textTransform: "uppercase" }}>Active</div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 10, color: tier.color }}>{tier.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: tier.color, letterSpacing: -0.5, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 9, color: SD, marginBottom: 20, letterSpacing: 1 }}>
                      {tier.min.toLocaleString()}+ pts {tier.max ? `· up to ${tier.max.toLocaleString()}` : "· Max tier"}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {tier.perks.map(p => (
                        <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ color: tier.color, fontSize: 10, flexShrink: 0, marginTop: 1 }}>✦</span>
                          <span style={{ fontSize: 11, color: "var(--vt-text)", lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    {!isActive && !isPast && (
                      <div style={{ marginTop: 20, fontSize: 9, color: SD, letterSpacing: 1 }}>
                        {(tier.min - (loyalty?.totalEarned || 0)).toLocaleString()} pts away
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes vigo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }
        @media (max-width: 900px) {
          .ref-hero-grid { grid-template-columns: 1fr !important; }
          .ref-dash-grid { grid-template-columns: 1fr !important; }
          .ref-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .ref-refer-grid { grid-template-columns: 1fr !important; }
          .ref-tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const chromeBtnFull = {
  background: "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8, #C0C0C0)",
  color: "#000", border: "none", padding: "14px 40px", fontSize: 9,
  letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
};