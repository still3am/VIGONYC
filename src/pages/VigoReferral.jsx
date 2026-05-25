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
    desc: "Welcome to the inner circle.",
  },
  {
    name: "Chrome",
    min: 3000,
    max: 10000,
    color: "#E8E8E8",
    perks: ["Early drop access (24h)", "Double points weekends", "Exclusive Chrome drops", "Free standard shipping"],
    icon: "◉",
    desc: "You're in the upper tier.",
  },
  {
    name: "Obsidian",
    min: 10000,
    max: null,
    color: "#9CA3AF",
    perks: ["Instant drop access", "Archival credits ($25/mo)", "Private Discord channel", "Custom piece requests", "Free overnight shipping"],
    icon: "◈◈",
    desc: "Pinnacle of the vault.",
  },
];

export default function VigoReferral() {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    document.title = "THE VAULT — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        base44.functions.invoke("loyaltyPoints", { action: "get" })
          .then(res => { setLoyalty(res.data.loyalty); setLoading(false); })
          .catch(() => setLoading(false));
        base44.entities.Order.filter({ userEmail: u.email }, "-created_date", 5)
          .then(o => setOrders(o || []))
          .catch(() => {});
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
    setTimeout(() => setCopied(false), 2500);
    toast.success("Referral link copied!");
  };

  const totalEarned = loyalty?.totalEarned || 0;
  const currentTier = TIERS.find(t => t.max === null || totalEarned < t.max) || TIERS[TIERS.length - 1];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressPct = currentTier.max
    ? Math.min(100, ((totalEarned - currentTier.min) / (currentTier.max - currentTier.min)) * 100)
    : 100;

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "refer", label: "Refer & Earn" },
    { id: "tiers", label: "Tiers" },
  ];

  if (!user && !loading) {
    return (
      <div style={{ minHeight: "80vh", background: G1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>✦ Members Only</div>
        <h1 style={{ fontSize: "clamp(32px,6vw,64px)", fontWeight: 900, letterSpacing: -2, lineHeight: 0.95, margin: 0 }}>
          THE <span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VAULT</span>
        </h1>
        <p style={{ fontSize: 12, color: SD, maxWidth: 300, lineHeight: 1.8 }}>
          Earn points, unlock tiers, and get early access to every drop.
        </p>
        <button onClick={() => base44.auth.redirectToLogin()} style={chromeBtn}>Sign In to Access</button>
      </div>
    );
  }

  return (
    <div style={{ background: G1, minHeight: "100vh", color: "var(--vt-text)", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `0.5px solid ${G3}`, background: G1 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,0.025) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,72px) clamp(20px,4vw,40px) clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,0.05)", border: "0.5px solid rgba(192,192,192,0.15)", padding: "6px 16px", marginBottom: 18 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
            <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Inner Circle Active</span>
          </div>
          <h1 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 900, letterSpacing: -3, lineHeight: 0.88, marginBottom: 16 }}>
            THE<br />
            <span style={{ background: "linear-gradient(135deg,#666,#C0C0C0,#E8E8E8,#C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VAULT</span>
          </h1>
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 28, maxWidth: 420 }}>
            Earn points on every purchase. Refer your crew. Ascend through the tiers.
          </p>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, background: G2, border: `0.5px solid ${G3}`, padding: 4 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                background: activeTab === tab.id ? S : "transparent",
                color: activeTab === tab.id ? "#000" : SD,
                border: "none",
                padding: "9px 20px",
                fontSize: 8, letterSpacing: 2, textTransform: "uppercase",
                fontWeight: activeTab === tab.id ? 900 : 400,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.18s",
                whiteSpace: "nowrap",
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(16px,4vw,40px)" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {loading ? (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11, letterSpacing: 2 }}>Loading...</div>
            ) : (
              <>
                {/* Hero stats */}
                <div className="vault-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "clamp(16px,3vw,28px) clamp(14px,2.5vw,24px)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Points Balance</div>
                    <div style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: S, letterSpacing: -2, lineHeight: 1 }}>{(loyalty?.points || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>available to redeem</div>
                  </div>
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${currentTier.color}`, padding: "clamp(16px,3vw,28px) clamp(14px,2.5vw,24px)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Current Tier</div>
                    <div style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: currentTier.color, letterSpacing: -1, lineHeight: 1 }}>{currentTier.icon} {currentTier.name}</div>
                    <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>{currentTier.desc}</div>
                  </div>
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid #0c6`, padding: "clamp(16px,3vw,28px) clamp(14px,2.5vw,24px)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Referrals</div>
                    <div style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: "#0c6", letterSpacing: -2, lineHeight: 1 }}>{loyalty?.totalReferrals || 0}</div>
                    <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>friends referred</div>
                  </div>
                </div>

                {/* Progress to next tier */}
                {nextTier && (
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Progress to {nextTier.name}</div>
                        <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{totalEarned.toLocaleString()} / {currentTier.max?.toLocaleString()} pts lifetime earned</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: nextTier.color }}>
                        {(currentTier.max - totalEarned).toLocaleString()} pts away
                      </div>
                    </div>
                    <div style={{ height: 5, background: G3, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.max(2, progressPct)}%`, background: `linear-gradient(90deg,#666,${S})`, transition: "width 1s ease", borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 8, color: SD }}>
                      <span style={{ color: currentTier.color }}>{currentTier.name} {currentTier.icon}</span>
                      <span style={{ color: nextTier.color }}>{nextTier.name} {nextTier.icon}</span>
                    </div>
                  </div>
                )}

                {/* Earn rate + perks */}
                <div className="vault-lower-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Earn info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "rgba(192,192,192,0.04)", border: `0.5px solid rgba(192,192,192,0.15)`, borderLeft: `3px solid ${S}`, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(192,192,192,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, color: S, fontWeight: 900 }}>$</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "var(--vt-text)", letterSpacing: -0.5 }}>$1 = 1 Point</div>
                        <div style={{ fontSize: 10, color: SD, marginTop: 3 }}>Auto-credited on every purchase</div>
                      </div>
                    </div>
                    <div style={{ background: "rgba(0,204,102,0.04)", border: `0.5px solid rgba(0,204,102,0.12)`, borderLeft: `3px solid #0c6`, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,204,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, color: "#0c6", fontWeight: 900 }}>↑</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "var(--vt-text)", letterSpacing: -0.5 }}>500 pts / Referral</div>
                        <div style={{ fontSize: 10, color: SD, marginTop: 3 }}>When your friend completes a purchase</div>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab("refer")} style={chromeBtn}>
                      Share Your Referral Link →
                    </button>
                  </div>

                  {/* Current tier perks */}
                  <div style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${currentTier.color}`, padding: "22px 24px" }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: currentTier.color, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>{currentTier.icon} {currentTier.name} Perks</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {currentTier.perks.map(p => (
                        <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ color: currentTier.color, fontSize: 10, flexShrink: 0, marginTop: 1 }}>✦</span>
                          <span style={{ fontSize: 12, color: "var(--vt-text)", lineHeight: 1.6 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    {orders.length > 0 && (
                      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${G3}` }}>
                        <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Recent Orders</div>
                        {orders.slice(0, 3).map(o => (
                          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `0.5px solid ${G3}` }}>
                            <div style={{ fontSize: 10, color: "var(--vt-text)" }}>{o.orderId}</div>
                            {o.loyaltyPointsEarned ? <div style={{ fontSize: 10, color: "#0c6", fontWeight: 700 }}>+{o.loyaltyPointsEarned} pts</div> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* REFER TAB */}
        {activeTab === "refer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Advocate</div>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 8 }}>Refer & Earn</h2>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, maxWidth: 480 }}>
                Share your link. Your friends get 20% off their first order. You get 500 points.
              </p>
            </div>

            <div className="vault-refer-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
              {/* QR Card */}
              {loyalty?.referralCode ? (
                <div style={{ background: "#0a0a0a", border: `0.5px solid rgba(192,192,192,0.15)`, borderTop: `2px solid ${S}`, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "clamp(260px,38vw,320px)" }}>
                  <div style={{ alignSelf: "flex-start", marginBottom: 20, width: "100%" }}>
                    <div style={{ fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1.2 }}>{user?.full_name || "VIGO Member"}</div>
                    <div style={{ fontSize: 9, color: S, marginTop: 5, letterSpacing: 3, fontFamily: "monospace" }}>#{loyalty.referralCode}</div>
                  </div>
                  <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                    <div style={{ background: "#fff", borderRadius: 14, padding: 10, display: "inline-block" }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0a0a0a&qzone=1&format=png`}
                        alt="Referral QR"
                        style={{ width: 190, height: 190, display: "block", borderRadius: 4 }}
                      />
                    </div>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 50, height: 50, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e0e0e0" }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 42, height: 42, objectFit: "contain" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <button onClick={copyReferral} style={{ flex: 1, background: copied ? "#0c6" : S, color: "#000", border: "none", padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "background 0.25s" }}>
                      {copied ? "✓ Copied!" : "Copy Link"}
                    </button>
                    <button onClick={async () => {
                      if (navigator.share) {
                        await navigator.share({ title: "VIGONYC Referral", text: `Use my code ${loyalty.referralCode} for 20% off your first VIGONYC order!`, url: referralLink });
                      } else { copyReferral(); }
                    }} style={{ flex: 1, background: "transparent", color: S, border: `0.5px solid ${S}`, padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>
                      ↑ Share
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "32px", color: SD, fontSize: 12 }}>Loading referral code...</div>
              )}

              {/* Steps + stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { step: "01", title: "Share Your Link or QR", desc: "Send your unique referral link or let them scan your QR code.", color: S },
                  { step: "02", title: "They Get 20% Off", desc: "Your friend's first VIGONYC order is automatically discounted 20%.", color: "#fa0" },
                  { step: "03", title: "You Earn 500 Points", desc: "Once they complete their first purchase, 500 points are credited to your vault.", color: "#0c6" },
                ].map(s => (
                  <div key={s.step} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${s.color}`, padding: "20px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: -2, flexShrink: 0, lineHeight: 1, opacity: 0.3 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}

                {/* Stats box */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: "20px", background: "rgba(0,204,102,0.05)", border: "0.5px solid rgba(0,204,102,0.15)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Your Referrals</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0c6", letterSpacing: -2, lineHeight: 1 }}>{loyalty?.totalReferrals || 0}</div>
                  </div>
                  <div style={{ padding: "20px", background: "rgba(0,204,102,0.05)", border: "0.5px solid rgba(0,204,102,0.15)" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Points Earned</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0c6", letterSpacing: -2, lineHeight: 1 }}>{((loyalty?.totalReferrals || 0) * 500).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIERS TAB */}
        {activeTab === "tiers" && (
          <div>
            <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Ascend</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 8 }}>Loyalty Tiers</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 32, maxWidth: 480, lineHeight: 1.9 }}>The more you engage, the deeper you go. Every tier unlocks exclusive perks.</p>

            <div className="vault-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {TIERS.map((tier, idx) => {
                const isActive = loyalty?.tier === tier.name;
                const isPast = TIERS.indexOf(tier) < TIERS.findIndex(t => t.name === loyalty?.tier);
                const prog = tier.max ? Math.min(100, ((totalEarned - tier.min) / (tier.max - tier.min)) * 100) : 100;
                return (
                  <div key={tier.name} style={{ background: G2, border: `0.5px solid ${isActive ? tier.color : G3}`, borderTop: `3px solid ${tier.color}`, padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,24px)", position: "relative", opacity: isPast ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    {isActive && (
                      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: 2, color: tier.color, border: `0.5px solid ${tier.color}`, padding: "3px 8px", textTransform: "uppercase", background: `${tier.color}10` }}>● Active</div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 10, color: tier.color }}>{tier.icon}</div>
                    <div style={{ fontSize: "clamp(17px,2.5vw,22px)", fontWeight: 900, color: tier.color, letterSpacing: -0.5, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1 }}>
                      {tier.min.toLocaleString()}+ pts{tier.max ? ` · up to ${tier.max.toLocaleString()}` : " · Max tier"}
                    </div>
                    <div style={{ fontSize: 10, color: SD, marginBottom: 16, fontStyle: "italic" }}>{tier.desc}</div>

                    {isActive && tier.max && (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ height: 3, background: G3, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.max(2, prog)}%`, background: tier.color, transition: "width 0.8s ease" }} />
                        </div>
                        <div style={{ fontSize: 8, color: SD, marginTop: 5 }}>{Math.round(prog)}% to {TIERS[idx + 1]?.name}</div>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {tier.perks.map(p => (
                        <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: tier.color, fontSize: 9, flexShrink: 0, marginTop: 2 }}>✦</span>
                          <span style={{ fontSize: 11, color: "var(--vt-text)", lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>

                    {!isActive && !isPast && (
                      <div style={{ marginTop: 18, padding: "9px 14px", background: `${tier.color}08`, border: `0.5px solid ${tier.color}22`, fontSize: 9, color: tier.color, letterSpacing: 1 }}>
                        {(tier.min - totalEarned).toLocaleString()} pts to unlock
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
          .vault-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .vault-stat-grid > div:last-child { grid-column: span 2; }
          .vault-lower-grid { grid-template-columns: 1fr !important; }
          .vault-refer-grid { grid-template-columns: 1fr !important; justify-items: center; }
          .vault-tier-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .vault-stat-grid { grid-template-columns: 1fr !important; }
          .vault-stat-grid > div:last-child { grid-column: unset; }
        }
      `}</style>
    </div>
  );
}

const chromeBtn = {
  background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)",
  color: "#000", border: "none", padding: "13px 32px", fontSize: 9,
  letterSpacing: 3, textTransform: "uppercase", fontWeight: 900,
  cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start",
};