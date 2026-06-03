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
  desc: "Welcome to the inner circle."
},
{
  name: "Chrome",
  min: 3000,
  max: 10000,
  color: "#E8E8E8",
  perks: ["Early drop access (24h)", "Double points weekends", "Exclusive Chrome drops", "Free standard shipping"],
  icon: "◉",
  desc: "You're in the upper tier."
},
{
  name: "Obsidian",
  min: 10000,
  max: null,
  color: "#9CA3AF",
  perks: ["Instant drop access", "Archival credits ($25/mo)", "Private Discord channel", "Custom piece requests", "Free overnight shipping"],
  icon: "◈◈",
  desc: "Pinnacle of the vault."
}];


function generateReferralCode(userId) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const seed = userId ? userId.slice(-8) : Math.random().toString(36).slice(2);
  for (let i = 0; i < 8; i++) {
    code += chars[seed.charCodeAt(i % seed.length) % chars.length];
  }
  return code;
}

export default function VigoReferral() {
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    document.title = "THE VAULT — VIGONYC";
    return () => {document.title = "VIGONYC — NYC Streetwear";};
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (!u) {setLoading(false);return;}

        // Load loyalty from entity directly
        let loyaltyRecords = await base44.entities.UserLoyalty.filter({ userEmail: u.email }, "-created_date", 1).catch(() => []);
        let loyaltyData = loyaltyRecords?.[0];

        // Create loyalty record if none exists
        if (!loyaltyData) {
          const code = generateReferralCode(u.id);
          loyaltyData = await base44.entities.UserLoyalty.create({
            userEmail: u.email,
            points: 0,
            totalEarned: 0,
            referralCode: code,
            totalReferrals: 0,
            tier: "Silver"
          }).catch(() => ({ userEmail: u.email, points: 0, totalEarned: 0, referralCode: generateReferralCode(u.id), totalReferrals: 0, tier: "Silver" }));
        }

        setLoyalty(loyaltyData);

        // Load orders
        const o = await base44.entities.Order.filter({ userEmail: u.email }, "-created_date", 5).catch(() => []);
        setOrders(o || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const referralLink = loyalty?.referralCode ?
  `${window.location.origin}/?ref=${loyalty.referralCode}` :
  "";

  const copyReferral = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.success("Referral link copied!");
  };

  const totalEarned = loyalty?.totalEarned || 0;
  const currentTier = TIERS.find((t) => t.max === null || totalEarned < t.max) || TIERS[TIERS.length - 1];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressPct = currentTier.max ?
  Math.min(100, (totalEarned - currentTier.min) / (currentTier.max - currentTier.min) * 100) :
  100;

  const TABS = [
  { id: "overview", label: "Overview" },
  { id: "refer", label: "Refer & Earn" },
  { id: "tiers", label: "Tiers" }];


  if (!user && !loading) {
    return (
      <div style={{ minHeight: "80vh", background: G1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>✦ Members Only</div>
        <h1 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 900, letterSpacing: -3, lineHeight: 0.88, margin: 0 }}>
          THE<br />
          <span style={{ background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VAULT</span>
        </h1>
        <p style={{ fontSize: 12, color: SD, maxWidth: 300, lineHeight: 1.8 }}>
          Earn points, unlock tiers, and get early access to every drop.
        </p>
        <button onClick={() => base44.auth.redirectToLogin()} style={chromeBtn}>Sign In to Access</button>
      </div>);

  }

  return (
    <div style={{ background: G1, minHeight: "100vh", color: "var(--vt-text)", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `0.5px solid ${G3}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,0.025) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,72px) clamp(20px,4vw,40px) 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          


          
          <h1 style={{ fontSize: "clamp(44px,8vw,88px)", fontWeight: 900, letterSpacing: -4, lineHeight: 0.86, marginBottom: 16 }}>
            THE<br />
            <span style={{ background: "linear-gradient(135deg,#555,#B0B0B0,#E8E8E8,#C0C0C0,#888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VAULT</span>
          </h1>
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 28, maxWidth: 400 }}>
            Earn points on every purchase. Refer your crew. Ascend through the tiers.
          </p>

          {/* Quick stats if loaded */}
          {loyalty && !loading &&
          <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: S, letterSpacing: -1 }}>{(loyalty.points || 0).toLocaleString()}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Points</div>
              </div>
              <div style={{ width: 1, background: G3 }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: currentTier.color, letterSpacing: -1 }}>{currentTier.name}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Tier</div>
              </div>
              <div style={{ width: 1, background: G3 }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0c6", letterSpacing: -1 }}>{loyalty.totalReferrals || 0}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Referrals</div>
              </div>
            </div>
          }

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, background: G2, border: `0.5px solid ${G3}`, padding: 4, marginBottom: -1 }}>
            {TABS.map((tab) =>
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab === tab.id ? S : "transparent",
              color: activeTab === tab.id ? "#000" : SD,
              border: "none",
              padding: "10px 24px",
              fontSize: 8, letterSpacing: 2, textTransform: "uppercase",
              fontWeight: activeTab === tab.id ? 900 : 400,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.18s",
              whiteSpace: "nowrap"
            }}>
                {tab.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,52px) clamp(16px,4vw,40px)" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" &&
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {loading ?
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 11, letterSpacing: 2 }}>Loading your vault...</div> :

          <>
                {/* Progress to next tier */}
                {nextTier &&
            <div style={{ background: G2, border: `0.5px solid ${G3}`, padding: "22px 26px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 5 }}>Journey to {nextTier.name}</div>
                        <div style={{ fontSize: 13, color: "var(--vt-text)", fontWeight: 600 }}>{totalEarned.toLocaleString()} pts earned lifetime</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9, color: nextTier.color, fontWeight: 700 }}>{(currentTier.max - totalEarned).toLocaleString()} pts to {nextTier.name}</div>
                        <div style={{ fontSize: 8, color: SD, marginTop: 3 }}>{Math.round(progressPct)}% complete</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: G3, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.max(2, progressPct)}%`, background: `linear-gradient(90deg,#555,${S},#E8E8E8)`, transition: "width 1.2s ease", borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: SD }}>
                      <span style={{ color: currentTier.color, fontWeight: 700 }}>{currentTier.icon} {currentTier.name} · {currentTier.min.toLocaleString()} pts</span>
                      <span style={{ color: nextTier.color, fontWeight: 700 }}>{nextTier.icon} {nextTier.name} · {currentTier.max?.toLocaleString()} pts</span>
                    </div>
                  </div>
            }

                <div className="vault-lower-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Earn rates */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 4 }}>How to Earn</div>
                    {[
                { icon: "$", label: "$1 = 1 Point", sub: "Auto-credited on every purchase", color: S },
                { icon: "↑", label: "500 pts / Referral", sub: "Friend completes their first order", color: "#0c6" },
                { icon: "★", label: "200 pts / Review", sub: "Leave a verified product review", color: "#fa0" }].
                map((item) =>
                <div key={item.label} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${item.color}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, color: item.color, fontWeight: 900 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vt-text)" }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: SD, marginTop: 2 }}>{item.sub}</div>
                        </div>
                      </div>
                )}
                    <button onClick={() => setActiveTab("refer")} style={{ ...chromeBtn, alignSelf: "stretch", textAlign: "center", marginTop: 4 }}>
                      Share Referral Link →
                    </button>
                  </div>

                  {/* Current tier perks + orders */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Your Perks</div>
                    <div style={{ background: G2, border: `0.5px solid ${currentTier.color}33`, borderLeft: `3px solid ${currentTier.color}`, padding: "20px 22px", flex: 1 }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: currentTier.color, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>{currentTier.icon} {currentTier.name} Tier</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                        {currentTier.perks.map((p) =>
                    <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <span style={{ color: currentTier.color, fontSize: 9, flexShrink: 0, marginTop: 2 }}>✦</span>
                            <span style={{ fontSize: 12, color: "var(--vt-text)", lineHeight: 1.6 }}>{p}</span>
                          </div>
                    )}
                      </div>

                      {orders.filter((o) => o.loyaltyPointsEarned).length > 0 &&
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${G3}` }}>
                          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Recent Earnings</div>
                          {orders.filter((o) => o.loyaltyPointsEarned).slice(0, 3).map((o) =>
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `0.5px solid ${G3}` }}>
                              <div>
                                <div style={{ fontSize: 10, color: "var(--vt-text)" }}>{o.orderId}</div>
                                <div style={{ fontSize: 8, color: SD, marginTop: 2 }}>{new Date(o.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              </div>
                              <div style={{ fontSize: 12, color: "#0c6", fontWeight: 900 }}>+{o.loyaltyPointsEarned}</div>
                            </div>
                    )}
                        </div>
                  }
                    </div>
                  </div>
                </div>
              </>
          }
          </div>
        }

        {/* REFER TAB */}
        {activeTab === "refer" &&
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Advocate</div>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Refer & Earn</h2>
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, maxWidth: 480 }}>
                Share your link. Your friends get 20% off their first order. You earn 500 points instantly.
              </p>
            </div>

            <div className="vault-refer-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
              {/* QR Card */}
              <div style={{ background: "#0a0a0a", border: "0.5px solid rgba(192,192,192,0.15)", borderTop: `2px solid ${S}`, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", width: "clamp(260px,36vw,320px)" }}>
                <div style={{ alignSelf: "flex-start", marginBottom: 20, width: "100%" }}>
                  <div style={{ fontSize: "clamp(15px,2.5vw,20px)", fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1.2 }}>{user?.full_name || "VIGO Member"}</div>
                  <div style={{ fontSize: 9, color: S, marginTop: 5, letterSpacing: 3, fontFamily: "monospace" }}>
                    {loyalty?.referralCode ? `#${loyalty.referralCode}` : "Loading..."}
                  </div>
                </div>

                {loyalty?.referralCode ?
              <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                    <div style={{ background: "#fff", borderRadius: 14, padding: 10, display: "inline-block" }}>
                      <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0a0a0a&qzone=1&format=png`}
                    alt="Referral QR"
                    style={{ width: 190, height: 190, display: "block", borderRadius: 4 }} />
                  
                    </div>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 50, height: 50, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e0e0e0" }}>
                      <img src="https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/d1ce08d38_IMG_8246-removebg-preview.png" alt="VIGONYC" style={{ width: 42, height: 42, objectFit: "contain" }} />
                    </div>
                  </div> :

              <div style={{ width: 210, height: 210, background: "#111", border: "0.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 10, color: "#666", letterSpacing: 2 }}>
                    LOADING QR...
                  </div>
              }

                <div style={{ display: "flex", gap: 8, width: "100%" }}>
                  <button onClick={copyReferral} style={{ flex: 1, background: copied ? "#0c6" : S, color: "#000", border: "none", padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "background 0.25s" }}>
                    {copied ? "✓ Copied!" : "Copy Link"}
                  </button>
                  <button onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({ title: "VIGONYC Referral", text: `Use my code ${loyalty?.referralCode} for 20% off your first VIGONYC order!`, url: referralLink });
                  } else {copyReferral();}
                }} style={{ flex: 1, background: "transparent", color: S, border: `0.5px solid ${S}`, padding: "13px 0", fontSize: 8, letterSpacing: 3, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>
                    ↑ Share
                  </button>
                </div>
              </div>

              {/* Steps + stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
              { step: "01", title: "Share Your Link or QR", desc: "Send your unique referral link or let them scan your QR code.", color: S },
              { step: "02", title: "They Get 20% Off", desc: "Your friend's first VIGONYC order is automatically discounted 20%.", color: "#fa0" },
              { step: "03", title: "You Earn 500 Points", desc: "Once they complete their first purchase, 500 points are credited to your vault instantly.", color: "#0c6" }].
              map((s) =>
              <div key={s.step} style={{ background: G2, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${s.color}`, padding: "20px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: -2, flexShrink: 0, lineHeight: 1, opacity: 0.3 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: SD, lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
              )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: "20px 22px", background: "rgba(0,204,102,0.04)", border: "0.5px solid rgba(0,204,102,0.15)", borderTop: "2px solid #0c6" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Friends Referred</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#0c6", letterSpacing: -2, lineHeight: 1 }}>{loyalty?.totalReferrals || 0}</div>
                  </div>
                  <div style={{ padding: "20px 22px", background: "rgba(0,204,102,0.04)", border: "0.5px solid rgba(0,204,102,0.15)", borderTop: "2px solid #0c6" }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Points Earned</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#0c6", letterSpacing: -2, lineHeight: 1 }}>{((loyalty?.totalReferrals || 0) * 500).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {/* TIERS TAB */}
        {activeTab === "tiers" &&
        <div>
            <div style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Ascend</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Loyalty Tiers</h2>
            <p style={{ fontSize: 12, color: SD, marginBottom: 32, maxWidth: 480, lineHeight: 1.9 }}>The more you engage, the deeper you go. Every tier unlocks exclusive perks.</p>

            <div className="vault-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {TIERS.map((tier, idx) => {
              const isActive = (loyalty?.tier || "Silver") === tier.name;
              const isPast = TIERS.indexOf(tier) < TIERS.findIndex((t) => t.name === (loyalty?.tier || "Silver"));
              const prog = tier.max ? Math.min(100, (totalEarned - tier.min) / (tier.max - tier.min) * 100) : 100;
              return (
                <div key={tier.name} style={{ background: G2, border: `0.5px solid ${isActive ? tier.color : G3}`, borderTop: `3px solid ${tier.color}`, padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,24px)", position: "relative", opacity: isPast ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    {isActive &&
                  <div style={{ position: "absolute", top: 14, right: 14, fontSize: 7, letterSpacing: 2, color: tier.color, border: `0.5px solid ${tier.color}`, padding: "3px 8px", textTransform: "uppercase", background: `${tier.color}10` }}>● Active</div>
                  }
                    
                    <div style={{ fontSize: "clamp(17px,2.5vw,22px)", fontWeight: 900, color: tier.color, letterSpacing: -0.5, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 9, color: SD, marginBottom: 6, letterSpacing: 1 }}>
                      {tier.min.toLocaleString()}+ pts{tier.max ? ` · up to ${tier.max.toLocaleString()}` : " · Max tier"}
                    </div>
                    <div style={{ fontSize: 10, color: SD, marginBottom: 16, fontStyle: "italic" }}>{tier.desc}</div>

                    {isActive && tier.max &&
                  <div style={{ marginBottom: 18 }}>
                        <div style={{ height: 4, background: G3, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.max(2, prog)}%`, background: tier.color, transition: "width 0.8s ease" }} />
                        </div>
                        <div style={{ fontSize: 8, color: SD, marginTop: 5 }}>{Math.round(prog)}% to {TIERS[idx + 1]?.name}</div>
                      </div>
                  }

                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {tier.perks.map((p) =>
                    <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: tier.color, fontSize: 9, flexShrink: 0, marginTop: 2 }}>✦</span>
                          <span style={{ fontSize: 11, color: "var(--vt-text)", lineHeight: 1.5 }}>{p}</span>
                        </div>
                    )}
                    </div>

                    {!isActive && !isPast &&
                  <div style={{ marginTop: 18, padding: "9px 14px", background: `${tier.color}08`, border: `0.5px solid ${tier.color}22`, fontSize: 9, color: tier.color, letterSpacing: 1 }}>
                        {(tier.min - totalEarned).toLocaleString()} pts to unlock
                      </div>
                  }
                  </div>);

            })}
            </div>
          </div>
        }
      </div>

      <style>{`
        @keyframes vigo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.8)} }
        @media (max-width: 900px) {
          .vault-lower-grid { grid-template-columns: 1fr !important; }
          .vault-refer-grid { grid-template-columns: 1fr !important; justify-items: center; }
          .vault-tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>);

}

const chromeBtn = {
  background: "linear-gradient(135deg,#888,#C0C0C0,#E8E8E8,#C0C0C0)",
  color: "#000", border: "none", padding: "13px 32px", fontSize: 9,
  letterSpacing: 3, textTransform: "uppercase", fontWeight: 900,
  cursor: "pointer", fontFamily: "inherit"
};