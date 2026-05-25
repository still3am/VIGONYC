import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
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
    perks: ["Early drop notifications", "1 pt per $1 spent", "Referral bonuses"],
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

// Vault Door SVG Hero
function VaultDoor() {
  return (
    <div style={{ position: "relative", width: "clamp(180px, 30vw, 260px)", height: "clamp(180px, 30vw, 260px)", flexShrink: 0 }}>
      <svg viewBox="0 0 260 260" width="100%" height="100%" style={{ filter: "drop-shadow(0 8px 40px rgba(192,192,192,0.15))" }}>
        {/* Vault body */}
        <rect x="10" y="10" width="240" height="240" rx="12" fill="url(#vaultGrad)" stroke="#666" strokeWidth="2"/>
        <rect x="18" y="18" width="224" height="224" rx="9" fill="none" stroke="rgba(192,192,192,0.15)" strokeWidth="1"/>

        {/* Main door circle */}
        <circle cx="130" cy="130" r="90" fill="url(#doorGrad)" stroke="#888" strokeWidth="3"/>
        <circle cx="130" cy="130" r="82" fill="none" stroke="rgba(192,192,192,0.2)" strokeWidth="1"/>

        {/* Bolts around rim */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 130 + 75 * Math.cos(rad);
          const y = 130 + 75 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="6" fill="#888" stroke="#555" strokeWidth="1"/>;
        })}

        {/* Spokes */}
        {[0,60,120,180,240,300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 130 + 20 * Math.cos(rad);
          const y1 = 130 + 20 * Math.sin(rad);
          const x2 = 130 + 60 * Math.cos(rad);
          const y2 = 130 + 60 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#777" strokeWidth="5" strokeLinecap="round"/>;
        })}

        {/* Center hub */}
        <circle cx="130" cy="130" r="22" fill="url(#hubGrad)" stroke="#999" strokeWidth="2"/>
        <circle cx="130" cy="130" r="13" fill="#555" stroke="#777" strokeWidth="1"/>
        <circle cx="130" cy="130" r="5" fill="#888"/>

        {/* Handle arm */}
        <rect x="195" y="125" width="36" height="10" rx="5" fill="#888" stroke="#666" strokeWidth="1"/>
        <circle cx="232" cy="130" r="9" fill="#777" stroke="#555" strokeWidth="1.5"/>

        {/* Top + bottom locking bars */}
        <rect x="110" y="20" width="14" height="28" rx="4" fill="#777" stroke="#555" strokeWidth="1"/>
        <rect x="110" y="212" width="14" height="28" rx="4" fill="#777" stroke="#555" strokeWidth="1"/>

        <defs>
          <linearGradient id="vaultGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a2a2a"/>
            <stop offset="100%" stopColor="#111"/>
          </linearGradient>
          <radialGradient id="doorGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#888"/>
            <stop offset="50%" stopColor="#666"/>
            <stop offset="100%" stopColor="#444"/>
          </radialGradient>
          <radialGradient id="hubGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#bbb"/>
            <stop offset="100%" stopColor="#777"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function VigoReferral() {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    document.title = "The Vault — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        base44.entities.UserLoyalty.filter({ userEmail: u.email }, "-created_date", 1)
          .then(rows => { if (rows?.[0]) setLoyalty(rows[0]); })
          .catch(() => {})
          .finally(() => setLoading(false));
        base44.entities.Order.filter({ userEmail: u.email }, "-created_date", 5)
          .then(orders => {
            const acts = (orders || []).filter(o => o.loyaltyPointsEarned).map(o => ({
              type: "order", label: `Order ${o.orderId}`, points: o.loyaltyPointsEarned, date: o.created_date
            }));
            setActivities(acts.slice(0, 5));
          }).catch(() => {});
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

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
      <div style={{ minHeight: "80vh", background: G1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24 }}>
        <VaultDoor />
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", textAlign: "center" }}>✦ The Vault</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "var(--vt-text)", letterSpacing: -2, textAlign: "center", lineHeight: 1 }}>
          Sign In to Enter<br /><span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Vault</span>
        </h1>
        <p style={{ fontSize: 12, color: SD, textAlign: "center", maxWidth: 320, lineHeight: 1.8 }}>Earn points on every purchase. Refer friends. Unlock exclusive tier perks.</p>
        <button onClick={() => base44.auth.redirectToLogin()} style={chromeBtnFull}>Sign In</button>
      </div>
    );
  }

  return (
    <div style={{ background: G1, minHeight: "100vh", color: "var(--vt-text)", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* HERO */}
      <div style={{ background: G1, borderBottom: `0.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,6vw,72px) clamp(20px,4vw,40px)", display: "flex", alignItems: "center", gap: "clamp(24px,5vw,60px)", flexWrap: "wrap", justifyContent: "center" }}>
          <VaultDoor />
          <div style={{ flex: 1, minWidth: 260, textAlign: "left" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,0.06)", border: "0.5px solid rgba(192,192,192,0.18)", padding: "6px 14px", marginBottom: 18 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
              <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Inner Circle Active</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, marginBottom: 16 }}>
              ACCESS:<br />
              <span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THE VAULT</span>
            </h1>
            <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, marginBottom: 28, maxWidth: 400 }}>
              Every dollar you spend earns points. Refer friends. Ascend tiers. Unlock exclusive drops and perks.
            </p>

            {/* Quick stats if logged in */}
            {loyalty && !loading && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "12px 20px", minWidth: 100 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Balance</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: S, letterSpacing: -1 }}>{(loyalty.points || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 8, color: SD }}>pts</div>
                </div>
                <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${currentTier.color}`, padding: "12px 20px", minWidth: 100 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Tier</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: currentTier.color }}>{currentTier.icon} {currentTier.name}</div>
                  <div style={{ fontSize: 8, color: SD }}>{currentTier.max ? `${(currentTier.max - totalEarned).toLocaleString()} to next` : "Max tier"}</div>
                </div>
                <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid #0c6`, padding: "12px 20px", minWidth: 100 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Referrals</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0c6", letterSpacing: -1 }}>{loyalty.totalReferrals || 0}</div>
                  <div style={{ fontSize: 8, color: SD }}>successful</div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {["overview", "refer", "ascend"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: activeTab === tab ? S : "transparent",
                  color: activeTab === tab ? "#000" : SD,
                  border: `0.5px solid ${activeTab === tab ? S : G3}`,
                  padding: "10px 18px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase",
                  fontWeight: activeTab === tab ? 900 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  {tab === "overview" ? "Overview" : tab === "refer" ? "Refer & Earn" : "Ascend"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(16px,4vw,40px)" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {loading ? (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11, letterSpacing: 2 }}>Loading your vault...</div>
            ) : (
              <>
                {/* Progress bar */}
                {currentTier.max && (
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Progress to {TIERS[TIERS.indexOf(currentTier) + 1]?.name}</div>
                      <div style={{ fontSize: 9, color: S }}>{totalEarned.toLocaleString()} / {currentTier.max.toLocaleString()} pts</div>
                    </div>
                    <div style={{ height: 5, background: G3, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (totalEarned / currentTier.max) * 100)}%`, background: `linear-gradient(90deg,#888,${S})`, transition: "width 0.8s ease", borderRadius: 3 }} />
                    </div>
                  </div>
                )}

                <div className="vault-lower-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Earn rate */}
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${S}`, padding: "24px" }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>How You Earn</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(192,192,192,0.1)", border: "0.5px solid rgba(192,192,192,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, color: S }}>$</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "var(--vt-text)" }}>$1 = 1 Point</div>
                          <div style={{ fontSize: 10, color: SD }}>Auto-applied on every purchase</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,204,102,0.08)", border: "0.5px solid rgba(0,204,102,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#0c6" }}>↗</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "var(--vt-text)" }}>500 pts per referral</div>
                          <div style={{ fontSize: 10, color: SD }}>When your friend makes a purchase</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current tier perks */}
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${currentTier.color}`, padding: "24px" }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: currentTier.color, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>{currentTier.name} Perks</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {currentTier.perks.map(p => (
                        <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: currentTier.color, fontSize: 9, flexShrink: 0, marginTop: 1 }}>✦</span>
                          <span style={{ fontSize: 11, color: "var(--vt-text)", lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                {activities.length > 0 && (
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "20px 24px" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Recent Activity</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {activities.map((act, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < activities.length - 1 ? `0.5px solid ${G3}` : "none" }}>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{act.label}</div>
                            <div style={{ fontSize: 9, color: SD, marginTop: 2 }}>
                              {act.date ? new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "#0c6" }}>+{act.points}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* REFER */}
        {activeTab === "refer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Advocate</div>
              <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Refer & Earn</h2>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, maxWidth: 480 }}>
                Give your crew 20% off their first order. You earn 500 points per successful referral.
              </p>
            </div>

            <div className="vault-refer-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>

              {/* QR Card */}
              {loyalty?.referralCode ? (
                <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `3px solid ${S}`, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "clamp(260px,38vw,320px)" }}>
                  <div style={{ alignSelf: "flex-start", marginBottom: 20, width: "100%" }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 4 }}>Your Referral Code</div>
                    <div style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>{user?.full_name || "VIGO Member"}</div>
                    <div style={{ fontSize: 11, color: S, marginTop: 6, letterSpacing: 2, fontFamily: "monospace" }}>#{loyalty.referralCode}</div>
                  </div>

                  {/* QR Code */}
                  <div style={{ background: "#fff", borderRadius: 16, padding: 14, display: "inline-block", marginBottom: 24, position: "relative" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0a0a0a&qzone=1&format=png`}
                      alt="Referral QR Code"
                      style={{ width: 200, height: 200, display: "block", borderRadius: 6 }}
                    />
                    {/* Logo overlay */}
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e0e0e0" }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 44, height: 44, objectFit: "contain" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <button onClick={copyReferral} style={{ flex: 1, background: copied ? "#0c6" : S, color: "#000", border: "none", padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "background 0.3s" }}>
                      {copied ? "✓ Copied" : "Copy Link"}
                    </button>
                    <button
                      onClick={async () => {
                        if (navigator.share) {
                          await navigator.share({ title: "VIGONYC Referral", text: `Use my code ${loyalty.referralCode} for 20% off your first VIGONYC order!`, url: referralLink });
                        } else { copyReferral(); }
                      }}
                      style={{ flex: 1, background: "transparent", color: S, border: `0.5px solid ${S}`, padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}
                    >
                      ↑ Share
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "32px 28px", width: "clamp(260px,38vw,320px)", display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11 }}>
                  {loading ? "Loading..." : "No referral code found. Contact support."}
                </div>
              )}

              {/* How it works */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>How It Works</div>
                {[
                  { step: "01", title: "Share Your QR or Link", desc: "Show your QR code or send your unique referral link to a friend.", color: S },
                  { step: "02", title: "They Get 20% Off", desc: "Their first order is automatically discounted — no code needed.", color: "#fa0" },
                  { step: "03", title: "You Get 500 Points", desc: "Once they complete a purchase, 500 points are added to your vault.", color: "#0c6" },
                ].map(s => (
                  <div key={s.step} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${s.color}`, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: -2, flexShrink: 0, lineHeight: 1, opacity: 0.4 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "16px 20px", background: "rgba(0,204,102,0.06)", border: "0.5px solid rgba(0,204,102,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Total Referrals</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#0c6" }}>{loyalty?.totalReferrals || 0}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Points Earned</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#0c6" }}>{((loyalty?.totalReferrals || 0) * 500).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASCEND */}
        {activeTab === "ascend" && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Ascend</div>
            <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Loyalty Tiers</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 28, maxWidth: 480, lineHeight: 1.9 }}>The more you spend and refer, the deeper you go. Every tier unlocks new access.</p>

            <div className="vault-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {TIERS.map((tier, idx) => {
                const isActive = loyalty?.tier === tier.name;
                const isPast = TIERS.indexOf(tier) < TIERS.findIndex(t => t.name === loyalty?.tier);
                const progress = tier.max ? Math.min(100, (totalEarned - tier.min) / (tier.max - tier.min) * 100) : 100;
                return (
                  <div key={tier.name} style={{ background: G2, border: `0.5px solid ${isActive ? tier.color : G3}`, borderTop: `3px solid ${tier.color}`, padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,24px)", position: "relative", opacity: isPast ? 0.55 : 1, transition: "opacity 0.2s" }}>
                    {isActive && (
                      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: 2, color: tier.color, border: `0.5px solid ${tier.color}`, padding: "3px 8px", textTransform: "uppercase", background: `${tier.color}10` }}>● Active</div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 10, color: tier.color }}>{tier.icon}</div>
                    <div style={{ fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: tier.color, letterSpacing: -0.5, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 9, color: SD, marginBottom: 16, letterSpacing: 1 }}>
                      {tier.min.toLocaleString()}+ pts {tier.max ? `→ ${tier.max.toLocaleString()}` : "· Max tier"}
                    </div>
                    {isActive && tier.max && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ height: 3, background: G3, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.max(2, progress)}%`, background: tier.color, transition: "width 0.8s ease" }} />
                        </div>
                        <div style={{ fontSize: 8, color: SD, marginTop: 4 }}>{Math.round(progress)}% to {TIERS[idx + 1]?.name}</div>
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {tier.perks.map(p => (
                        <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: tier.color, fontSize: 9, flexShrink: 0, marginTop: 2 }}>✦</span>
                          <span style={{ fontSize: 11, color: "var(--vt-text)", lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    {!isActive && !isPast && (
                      <div style={{ marginTop: 18, padding: "8px 12px", background: `${tier.color}08`, border: `0.5px solid ${tier.color}22`, fontSize: 9, color: tier.color, letterSpacing: 1 }}>
                        {(tier.min - totalEarned).toLocaleString()} pts away
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
        @media(max-width:900px){
          .vault-lower-grid { grid-template-columns: 1fr !important; }
          .vault-refer-grid { grid-template-columns: 1fr !important; }
          .vault-tier-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width:480px){
          .vault-tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const chromeBtnFull = {
  background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)",
  color: "#000", border: "none", padding: "14px 48px", fontSize: 9,
  letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
};