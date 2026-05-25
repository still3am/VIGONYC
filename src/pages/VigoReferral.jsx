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
    max: 500,
    color: "#C0C0C0",
    perks: ["Early drop notifications", "1 pt per $1 spent", "Referral bonuses"],
    icon: "◈",
  },
  {
    name: "Chrome",
    min: 500,
    max: 2000,
    color: "#E8E8E8",
    perks: ["Early drop access (24h)", "Double points weekends", "Exclusive Chrome drops", "Free standard shipping"],
    icon: "◉",
  },
  {
    name: "Obsidian",
    min: 2000,
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
          .then(rows => { setLoyalty(rows?.[0] || null); setLoading(false); })
          .catch(() => setLoading(false));
        base44.entities.Order.filter({ userEmail: u.email }, "-created_date", 5)
          .then(orders => {
            const acts = (orders || [])
              .filter(o => o.loyaltyPointsEarned)
              .map(o => ({ type: "order", label: `Order ${o.orderId}`, points: o.loyaltyPointsEarned, date: o.created_date }));
            setActivities(acts);
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
  const currentTierIdx = TIERS.findIndex(t => t.max === null || totalEarned < t.max);
  const currentTier = TIERS[currentTierIdx] || TIERS[TIERS.length - 1];

  if (!user && !loading) {
    return (
      <div style={{ minHeight: "80vh", background: G1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 20px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase" }}>✦ The Vault</div>
        <h1 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, color: "var(--vt-text)", letterSpacing: -2, textAlign: "center", lineHeight: 1 }}>
          Sign in to Access<br /><span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Vault</span>
        </h1>
        <p style={{ fontSize: 12, color: SD, textAlign: "center", maxWidth: 320, lineHeight: 1.8 }}>Join the inner circle. Earn points and unlock exclusive drops.</p>
        <button onClick={() => base44.auth.redirectToLogin()} style={chromeBtnFull}>Sign In</button>
      </div>
    );
  }

  const TABS = ["dashboard", "refer", "ascend"];
  const TAB_LABELS = { dashboard: "Overview", refer: "Refer", ascend: "Ascend" };

  return (
    <div style={{ background: G1, minHeight: "100vh", color: "var(--vt-text)", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `0.5px solid ${G3}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,6vw,72px) clamp(20px,4vw,40px) clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.15)", padding: "6px 14px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
            <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Inner Circle Active</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,6vw,68px)", fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, margin: 0 }}>
            ACCESS:<br /><span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THE VAULT</span>
          </h1>
          <p style={{ fontSize: 13, color: SD, lineHeight: 1.9, maxWidth: 440, margin: 0 }}>
            Earn 1 point per $1 spent. Refer friends. Ascend tiers.
          </p>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 8, width: "100%", maxWidth: 360, justifyContent: "center" }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, background: activeTab === tab ? S : "transparent", color: activeTab === tab ? "#000" : SD, border: `0.5px solid ${activeTab === tab ? S : G3}`, padding: "11px 4px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: activeTab === tab ? 900 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px)" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          loading ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11, letterSpacing: 2 }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { label: "Balance", value: (loyalty?.points || 0).toLocaleString(), sub: "pts available", accent: S },
                  { label: "Referrals", value: loyalty?.totalReferrals || 0, sub: "successful", accent: "#0c6" },
                  { label: "Tier", value: currentTier.name, sub: currentTier.max ? `${Math.max(0, currentTier.max - totalEarned).toLocaleString()} to next` : "Max tier", accent: currentTier.color },
                ].map(stat => (
                  <div key={stat.label} style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${stat.accent}`, padding: "clamp(14px,2.5vw,22px) clamp(12px,2vw,18px)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>{stat.label}</div>
                    <div style={{ fontSize: "clamp(18px,3.5vw,30px)", fontWeight: 900, color: stat.accent, letterSpacing: -1, lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 8, color: SD, marginTop: 4 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              {currentTier.max && (
                <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Progress to {TIERS[currentTierIdx + 1]?.name}</div>
                    <div style={{ fontSize: 9, color: S }}>{totalEarned.toLocaleString()} / {currentTier.max.toLocaleString()} pts</div>
                  </div>
                  <div style={{ height: 4, background: G3, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (totalEarned / currentTier.max) * 100)}%`, background: `linear-gradient(90deg,#888,${S})`, transition: "width 0.8s ease", borderRadius: 2 }} />
                  </div>
                </div>
              )}

              {/* Earn rate + perks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(192,192,192,0.04)", border: "0.5px solid rgba(192,192,192,0.12)", padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>How You Earn</div>
                  {[
                    { icon: "$", label: "$1 Spent = 1 Point", sub: "Every purchase" },
                    { icon: "↗", label: "500 Points", sub: "Per successful referral" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(192,192,192,0.1)", border: "0.5px solid rgba(192,192,192,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, color: S }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vt-text)" }}>{item.label}</div>
                        <div style={{ fontSize: 9, color: SD }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${currentTier.color}`, padding: "20px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: currentTier.color, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>{currentTier.name} Perks</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "18px 20px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Recent Activity</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {activities.map((act, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < activities.length - 1 ? `0.5px solid ${G3}` : "none" }}>
                        <div>
                          <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{act.label}</div>
                          <div style={{ fontSize: 8, color: SD, marginTop: 2 }}>
                            {act.date ? new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#0c6" }}>+{act.points}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* REFER */}
        {activeTab === "refer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Advocate</div>
              <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Refer & Earn</h2>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, maxWidth: 500 }}>
                Give your crew 20% off their first order. You earn 500 points per successful referral.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start" }}>
              {/* QR Card */}
              {loyalty?.referralCode ? (
                <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "clamp(260px,38vw,320px)", maxWidth: "100%" }}>
                  <div style={{ alignSelf: "flex-start", marginBottom: 18, width: "100%" }}>
                    <div style={{ fontSize: "clamp(16px,3vw,22px)", fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>{user?.full_name || "VIGO Member"}</div>
                    <div style={{ fontSize: 10, color: S, marginTop: 6, letterSpacing: 2, fontFamily: "monospace" }}>#{loyalty.referralCode}</div>
                  </div>

                  <div style={{ background: "#fff", borderRadius: 14, padding: 10, display: "inline-block", position: "relative", marginBottom: 20 }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0a0a0a&qzone=1&format=png`}
                      alt="Referral QR"
                      style={{ width: 180, height: 180, display: "block", borderRadius: 4 }}
                    />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 46, height: 46, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e0e0e0" }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 40, height: 40, objectFit: "contain" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <button onClick={copyReferral} style={{ flex: 1, background: copied ? "#0c6" : S, color: "#000", border: "none", padding: "12px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "background 0.3s" }}>
                      {copied ? "✓ Copied" : "Copy Link"}
                    </button>
                    <button
                      onClick={async () => {
                        if (navigator.share) {
                          await navigator.share({ title: "VIGONYC Referral", text: `Use my code ${loyalty.referralCode} for 20% off your first VIGONYC order!`, url: referralLink });
                        } else { copyReferral(); }
                      }}
                      style={{ flex: 1, background: "transparent", color: S, border: `0.5px solid ${S}`, padding: "12px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}
                    >
                      ↑ Share
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "28px 24px", color: SD, fontSize: 12 }}>
                  {loading ? "Loading..." : "Sign in to get your referral code."}
                </div>
              )}

              {/* How it works */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>How It Works</div>
                {[
                  { step: "01", title: "Share Your Link", desc: "Send your unique referral link or QR code to a friend.", color: S },
                  { step: "02", title: "They Get 20% Off", desc: "Their first order is automatically discounted.", color: "#fa0" },
                  { step: "03", title: "You Get 500 Points", desc: "Once they complete a purchase, 500 points hit your account.", color: "#0c6" },
                ].map(s => (
                  <div key={s.step} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${s.color}`, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: -2, flexShrink: 0, lineHeight: 1, opacity: 0.4 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "16px 18px", background: "rgba(0,204,102,0.06)", border: "0.5px solid rgba(0,204,102,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Your Referrals</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#0c6" }}>{loyalty?.totalReferrals || 0}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Points Earned</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#0c6" }}>{((loyalty?.totalReferrals || 0) * 500).toLocaleString()}</div>
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
            <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Loyalty Tiers</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 24, maxWidth: 480, lineHeight: 1.8 }}>The more you spend, the deeper you go. Unlock exclusive perks at every level.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TIERS.map((tier, idx) => {
                const isActive = currentTier.name === tier.name;
                const isPast = idx < currentTierIdx;
                const progress = tier.max ? Math.min(100, ((totalEarned - tier.min) / (tier.max - tier.min)) * 100) : 100;
                return (
                  <div key={tier.name} style={{ background: G2, border: `0.5px solid ${isActive ? tier.color : G3}`, borderTop: `3px solid ${tier.color}`, padding: "clamp(18px,3vw,26px) clamp(16px,2.5vw,24px)", opacity: isPast ? 0.6 : 1, position: "relative" }}>
                    {isActive && (
                      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: 2, color: tier.color, border: `0.5px solid ${tier.color}`, padding: "3px 8px", textTransform: "uppercase", background: `${tier.color}10` }}>● Active</div>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: 28, marginBottom: 6, color: tier.color }}>{tier.icon}</div>
                        <div style={{ fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 900, color: tier.color, letterSpacing: -0.5 }}>{tier.name}</div>
                        <div style={{ fontSize: 9, color: SD, marginTop: 2, letterSpacing: 1 }}>
                          {tier.min.toLocaleString()}+ pts {tier.max ? `→ ${tier.max.toLocaleString()}` : "· Max"}
                        </div>
                        {isActive && tier.max && (
                          <div style={{ marginTop: 10, minWidth: 120 }}>
                            <div style={{ height: 3, background: G3, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${Math.max(2, progress)}%`, background: tier.color }} />
                            </div>
                            <div style={{ fontSize: 8, color: SD, marginTop: 4 }}>{Math.round(progress)}% to {TIERS[idx + 1]?.name}</div>
                          </div>
                        )}
                        {!isActive && !isPast && (
                          <div style={{ marginTop: 10, padding: "6px 10px", background: `${tier.color}08`, border: `0.5px solid ${tier.color}22`, fontSize: 9, color: tier.color, letterSpacing: 1 }}>
                            {Math.max(0, tier.min - totalEarned).toLocaleString()} pts away
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 200, display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {tier.perks.map(p => (
                          <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, background: `${tier.color}08`, border: `0.5px solid ${tier.color}18`, padding: "7px 12px" }}>
                            <span style={{ color: tier.color, fontSize: 8, flexShrink: 0 }}>✦</span>
                            <span style={{ fontSize: 10, color: "var(--vt-text)", lineHeight: 1.4 }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes vigo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }
        @media (max-width: 640px) {
          .ref-refer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const chromeBtnFull = {
  background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)",
  color: "#000", border: "none", padding: "14px 40px", fontSize: 9,
  letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
};