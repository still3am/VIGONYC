import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PullToRefresh from "./PullToRefresh";
import ProductCard from "./ProductCard";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";
const TODAY = new Date();

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function useCountdown(ts) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!ts) return;
    const tick = () => {
      const diff = Math.max(0, ts - Date.now());
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ts]);
  return time;
}

function HeroCountdown({ drop }) {
  const t = useCountdown(drop.date instanceof Date && !isNaN(drop.date) ? drop.date.getTime() : null);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {[["Days", t.d], ["Hours", t.h], ["Mins", t.m], ["Secs", t.s]].map(([l, v], i, arr) => (
        <div key={l} style={{ textAlign: "center", padding: "clamp(14px,3vw,22px) clamp(16px,3vw,28px)", borderRight: i < arr.length - 1 ? `.5px solid rgba(192,192,192,.12)` : "none" }}>
          <div style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: -2, color: "var(--vt-text)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginTop: 6 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function MiniCountdown({ drop }) {
  const t = useCountdown(drop.date instanceof Date && !isNaN(drop.date) ? drop.date.getTime() : null);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {[["D", t.d], ["H", t.h], ["M", t.m], ["S", t.s]].map(([l, v]) => (
        <div key={l} style={{ textAlign: "center", background: G2, border: `.5px solid ${G3}`, padding: "8px 10px", minWidth: 44 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "var(--vt-text)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 3 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function VigoDrops() {
  const { productImg, wishlist, toggleWishlist, addToCart } = useOutletContext();
  const navigate = useNavigate();
  const [notified, setNotified] = useState({});
  const [email, setEmail] = useState("");
  const [viewDate, setViewDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [allDrops, setAllDrops] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [dropProducts, setDropProducts] = useState([]);

  useEffect(() => {
    document.title = "Drops — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const loadDrops = useCallback(async () => {
    const data = await base44.entities.Drop.list("-date", 100).catch(() => []);
    const mapped = data.map(d => {
      let dateObj = null;
      if (d.date) {
        dateObj = new Date(d.date + "T00:00:00");
        if (isNaN(dateObj.getTime())) dateObj = null;
      }
      return { ...d, date: dateObj };
    });
    setAllDrops(mapped);
    setSelectedDrop(prev => prev ? mapped.find(d => d.id === prev.id) || null : null);
  }, [setAllDrops, setSelectedDrop]);

  useEffect(() => { loadDrops(); }, [loadDrops]);

  useEffect(() => {
    const drop = allDrops.find(d => d.status === "live") || allDrops.find(d => d.status === "upcoming");
    if (drop?.productIds?.length > 0) {
      Promise.all(drop.productIds.map(id => base44.entities.Product.get(id).catch(() => null)))
        .then(results => setDropProducts(results.filter(Boolean)));
    } else {
      setDropProducts([]);
    }
  }, [allDrops]);

  const ALL_DROPS = allDrops;
  const PAST_DROPS = allDrops.filter(d => d.status === "soldout");
  const nextDrop = allDrops.find(d => d.status === "live") || allDrops.find(d => d.status === "upcoming");
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dropOnDay = day => day ? ALL_DROPS.find(dr => isSameDay(dr.date, day)) : null;
  const handleNotify = async (id) => {
    if (!email.trim()) return;
    const user = await base44.auth.me().catch(() => null);
    if (user) {
      await base44.auth.updateMe({ newsletterEmail: email.trim(), notificationsDrops: true }).catch(() => {});
    }
    setNotified(p => ({ ...p, [id]: true }));
  };
  const handleRefresh = useCallback(() => {
    return new Promise(res => {
      base44.entities.Drop.list("-date", 100)
        .catch(() => [])
        .then(data => {
          const mapped = data.map(d => ({ ...d, date: d.date ? new Date(d.date + "T00:00:00") : null }));
          setAllDrops(mapped);
          setTimeout(res, 400);
        });
    });
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div>
      {nextDrop && (
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `.5px solid ${G3}`, background: "linear-gradient(135deg,var(--vt-bg) 0%,var(--vt-card) 60%,var(--vt-bg) 100%)" }}>
          <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(192,192,192,.06) 0%,transparent 65%)", pointerEvents: "none" }} />
          <div className="vigo-corner tl" style={{ position: "absolute", top: 20, left: 20, width: 24, height: 24, borderTop: "1.5px solid rgba(192,192,192,.25)", borderLeft: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner tr" style={{ position: "absolute", top: 20, right: 20, width: 24, height: 24, borderTop: "1.5px solid rgba(192,192,192,.25)", borderRight: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner bl" style={{ position: "absolute", bottom: 20, left: 20, width: 24, height: 24, borderBottom: "1.5px solid rgba(192,192,192,.25)", borderLeft: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner br" style={{ position: "absolute", bottom: 20, right: 20, width: 24, height: 24, borderBottom: "1.5px solid rgba(192,192,192,.25)", borderRight: "1.5px solid rgba(192,192,192,.25)" }} />

          <div className="vigo-hero-drop-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,6vw,72px) 20px" }}>
            <div className="vigo-hero-drop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,.06)", border: ".5px solid rgba(192,192,192,.15)", padding: "6px 14px", marginBottom: 20 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
                  <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>
                    Next Drop · {nextDrop.date ? nextDrop.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                  </span>
                </div>
                <h1 style={{ fontSize: "clamp(28px,5vw,64px)", fontWeight: 900, letterSpacing: -3, lineHeight: .88, marginBottom: 16 }}>
                  {nextDrop.name}<br /><span style={{ color: S }}>{nextDrop.series}</span>
                </h1>
                <p style={{ fontSize: "clamp(11px,1.5vw,13px)", color: SD, lineHeight: 1.9, maxWidth: 380, marginBottom: 24 }}>{nextDrop.description}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                  {[nextDrop.pieces ? `${nextDrop.pieces} Units` : null, nextDrop.date ? nextDrop.date.toLocaleDateString("en-US", { month: "long", day: "numeric" }) : null, nextDrop.time, nextDrop.price].filter(Boolean).map(m => (
                    <div key={m} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: G2, border: `.5px solid ${G3}`, padding: "5px 10px" }}>
                      <div style={{ width: 4, height: 4, background: S, transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 8, color: SD, letterSpacing: 1, whiteSpace: "nowrap" }}>{m}</span>
                    </div>
                  ))}
                </div>
                {nextDrop.status === "live" ? (
                  <button onClick={() => navigate("/shop")} style={btnP}>Shop Now →</button>
                ) : notified[nextDrop.id] ? (
                  <div style={{ fontSize: 12, color: "#0c6", padding: "10px 0" }}>✓ You're on the list — we'll notify you.</div>
                ) : (
                  <div style={{ display: "flex", maxWidth: 380 }}>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: G2, border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "12px 16px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => handleNotify(nextDrop.id)} style={btnP}>Notify Me</button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 14 }}>Drops In</div>
                <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "100%", marginBottom: 16 }}>
                  <HeroCountdown drop={nextDrop} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom,${S},transparent)`, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 9, color: SD, letterSpacing: 1, lineHeight: 1.7 }}>
                    <div style={{ color: "var(--vt-text)" }}>{nextDrop.date ? nextDrop.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Date TBD"}</div>
                    <div>{nextDrop.time} · No restocks. No exceptions.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dropProducts.length > 0 && (
        <div style={{ padding: "clamp(24px,4vw,40px) 20px", background: G1, borderTop: `.5px solid ${G3}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20 }}>✦ Drop Products</div>
            <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {dropProducts.map(p => (
                <ProductCard key={p.id} product={p} img={p.images?.[0] || productImg}
                  wishlisted={wishlist.includes(p.id)}
                  onWishlist={() => toggleWishlist(p.id, p)}
                  onAdd={() => addToCart({ id: p.id, productId: p.id, productName: p.name, name: p.name, size: "M", color: p.colors?.[0] || "Black", price: p.price, productImage: p.images?.[0] || productImg })}
                  onClick={() => navigate(`/product/${p.id}`)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,52px) 20px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Schedule</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, letterSpacing: -2 }}>Drop Calendar</h2>
        </div>

        <div className="vigo-drops-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `.5px solid ${G3}` }}>
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={navBtn}>←</button>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
                {MONTHS[month]} <span style={{ color: S }}>{year}</span>
              </div>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={navBtn}>→</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: G2, borderBottom: `.5px solid ${G3}` }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ padding: "8px 4px", textAlign: "center", fontSize: 8, letterSpacing: 1, color: SD }}>{d}</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {cells.map((day, i) => {
                const drop = dropOnDay(day);
                const isToday = day && isSameDay(day, TODAY);
                const isSelected = selectedDrop && drop && selectedDrop.id === drop.id;
                const isPast = day && day < TODAY && !isToday;
                return (
                  <div
                    key={i}
                    onClick={() => { if (drop) { setSelectedDrop(prev => prev?.id === drop.id ? null : drop); setViewDate(new Date(drop.date.getFullYear(), drop.date.getMonth(), 1)); } }}
                    style={{ minHeight: "clamp(52px,8vw,72px)", padding: "8px 6px 6px", borderRight: (i + 1) % 7 !== 0 ? `.5px solid ${G3}` : "none", borderBottom: `.5px solid ${G3}`, cursor: drop ? "pointer" : "default", background: isSelected ? "rgba(192,192,192,.08)" : "transparent", transition: "background .15s", position: "relative" }}
                    onMouseEnter={e => { if (drop && !isSelected) e.currentTarget.style.background = "rgba(192,192,192,.04)"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    {day && (
                      <>
                        <div style={{ fontSize: 10, fontWeight: isToday ? 900 : 400, color: isToday ? "#000" : isPast ? SD : drop ? "var(--vt-text)" : SD, width: 20, height: 20, background: isToday ? S : "transparent", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>{day.getDate()}</div>
                        {drop && (
                          <div style={{ background: `${drop.tagColor}18`, borderLeft: `2px solid ${drop.tagColor}`, padding: "2px 4px", fontSize: 6, letterSpacing: .5, color: drop.tagColor, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {drop.series}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "12px 20px", borderTop: `.5px solid ${G3}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[[S, "Upcoming"], ["#888", "Coming Soon"], ["#e03", "Sold Out"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 2, background: c }} />
                  <span style={{ fontSize: 7, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedDrop ? (
              <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${selectedDrop.tagColor}` }}>
                <div style={{ padding: "20px", borderBottom: `.5px solid ${G3}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: selectedDrop.tagColor, textTransform: "uppercase", border: `.5px solid ${selectedDrop.tagColor}`, padding: "3px 8px" }}>{selectedDrop.tag}</div>
                    <div style={{ fontSize: 9, color: SD }}>{selectedDrop.price}</div>
                  </div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{selectedDrop.name}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>{selectedDrop.series}</h3>
                  <p style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{selectedDrop.description}</p>
                </div>

                <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Date", selectedDrop.date ? selectedDrop.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"], ["Time", selectedDrop.time || "TBD"], ["Units", selectedDrop.pieces ? `${selectedDrop.pieces}` : "TBD"]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 10, fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {selectedDrop.status === "upcoming" && (
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Countdown</div>
                    <MiniCountdown drop={selectedDrop} />
                    <div style={{ marginTop: 14 }}>
                      {notified[selectedDrop.id] ? (
                        <div style={{ fontSize: 10, color: "#0c6" }}>✓ You're on the drop list.</div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: G2, border: `.5px solid ${G3}`, borderRight: "none", color: "var(--vt-text)", padding: "9px 10px", fontSize: 10, outline: "none", fontFamily: "inherit" }} />
                          <button onClick={() => handleNotify(selectedDrop.id)} style={{ background: S, color: "#000", border: "none", padding: "9px 12px", fontSize: 7, letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>Notify</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedDrop.status === "soldout" && (
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ fontSize: 8, color: "#e03", letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e03" }} />
                      Sold Out — Archive Only
                    </div>
                    <button onClick={() => navigate("/shop")} style={{ ...btnGhost, width: "100%", textAlign: "center" }}>Browse Archive →</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 22, opacity: .15, marginBottom: 10 }}>✦</div>
                <div style={{ fontSize: 11, color: SD }}>Select a drop to view details.</div>
              </div>
            )}


          </div>
        </div>
      </div>

      <div style={{ background: G1, borderTop: `.5px solid ${G3}`, padding: "clamp(32px,5vw,52px) 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: .5, background: G3 }} />
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              <div style={{ width: 5, height: 5, background: "#e03", transform: "rotate(45deg)" }} />
              Past Drops — Sold Out
              <div style={{ width: 5, height: 5, background: "#e03", transform: "rotate(45deg)" }} />
            </div>
            <div style={{ flex: 1, height: .5, background: G3 }} />
          </div>
          <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {PAST_DROPS.map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <span style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", border: `.5px solid ${G3}`, padding: "5px 12px" }}>Sold Out</span>
                </div>
                <ProductCard product={p} img={productImg} wishlisted={wishlist.includes(p.id)} onWishlist={() => {}} onAdd={() => {}} onClick={() => navigate(`/product/${p.id}`)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
        @media(max-width:900px){
          .vigo-drops-layout { grid-template-columns: 1fr !important; }
          .vigo-hero-drop { grid-template-columns: 1fr !important; }
          .vigo-4col { grid-template-columns: repeat(2,1fr) !important; }
          .vigo-corner { display: none !important; }
          .vigo-hero-drop-inner { display: none !important; }
        }
        @media(max-width:480px){
          .vigo-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
    </PullToRefresh>
  );
}

const navBtn = { background: "none", border: ".5px solid var(--vt-border)", color: "#C0C0C0", width: 30, height: 30, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 };
const btnP = { background: "#C0C0C0", color: "#000", border: "none", padding: "12px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid var(--vt-border)", color: "var(--vt-sub)", padding: "10px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };