import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PullToRefresh from "./PullToRefresh";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";
const TODAY = new Date();

const ALL_DROPS = [
  {
    id: "drop-02", name: "Drop 02 — Mirror Series", series: "Mirror Series", drop: "Drop 02",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 3),
    desc: "Reflective chrome finishes. Heavyweight silhouettes. Only 75 units worldwide. No restocks. No exceptions.",
    tag: "Upcoming", tagColor: S, pieces: 75, status: "upcoming", time: "12:00 PM EST", price: "$68–$245",
  },
  {
    id: "drop-03", name: "Drop 03 — Concrete Series", series: "Concrete Series", drop: "Drop 03",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 10),
    desc: "Raw textures. NYC concrete inspired. Dyed-in-the-wool construction. 50 units only.",
    tag: "Coming Soon", tagColor: "#888", pieces: 50, status: "upcoming", time: "12:00 PM EST", price: "$88–$195",
  },
  {
    id: "drop-04", name: "Drop 04 — Void Series", series: "Void Series", drop: "Drop 04",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 21),
    desc: "All-black. Zero branding. Maximum impact. 40 units only.",
    tag: "Coming Soon", tagColor: "#888", pieces: 40, status: "upcoming", time: "12:00 PM EST", price: "$75–$220",
  },
  {
    id: "drop-01", name: "Drop 01 — Chrome Series", series: "Chrome Series", drop: "Drop 01",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 15),
    desc: "The drop that started it all. Hand-finished chrome hardware. Sold out in 8 minutes.",
    tag: "Sold Out", tagColor: "#e03", pieces: 100, status: "soldout", time: "12:00 PM EST", price: "$68–$245",
  },
];

const PAST_DROPS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", opacity: 1 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
];

const DAYS = ["S","M","T","W","T","F","S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function HeroCountdown({ drop }) {
  const t = useCountdown(drop.date);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {[["Days", t.d], ["Hours", t.h], ["Mins", t.m], ["Secs", t.s]].map(([l, v], i, arr) => (
        <div key={l} style={{ textAlign: "center", padding: "clamp(14px,3vw,22px) clamp(16px,3vw,28px)", borderRight: i < arr.length - 1 ? `.5px solid rgba(192,192,192,.12)` : "none" }}>
          <div style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: -2, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginTop: 6 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function MiniCountdown({ drop }) {
  const t = useCountdown(drop.date);
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {[["D", t.d], ["H", t.h], ["M", t.m], ["S", t.s]].map(([l, v]) => (
        <div key={l} style={{ textAlign: "center", background: G2, border: `.5px solid ${G3}`, padding: "8px 10px", minWidth: 44 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 3 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function VigoDrops() {
  const { productImg, wishlist, toggleWishlist } = useOutletContext();
  const navigate = useNavigate();
  const [notified, setNotified] = useState({});
  const [email, setEmail] = useState("");
  const [viewDate, setViewDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDrop, setSelectedDrop] = useState(ALL_DROPS[0]);

  const nextDrop = ALL_DROPS.find(d => d.status === "upcoming");
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dropOnDay = day => day ? ALL_DROPS.find(dr => isSameDay(dr.date, day)) : null;
  const handleNotify = id => { if (email.trim()) setNotified(p => ({ ...p, [id]: true })); };
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => new Promise(res => setTimeout(() => { setRefreshKey(k => k + 1); res(); }, 800)), []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div>
      {/* ── HERO ── */}
      {nextDrop && (
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `.5px solid ${G3}`, background: "linear-gradient(135deg,#000 0%,#0a0a0a 60%,#050505 100%)" }}>
          <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(192,192,192,.06) 0%,transparent 65%)", pointerEvents: "none" }} />
          {/* Corner brackets — hidden on small screens */}
          <div className="vigo-corner tl" style={{ position: "absolute", top: 20, left: 20, width: 24, height: 24, borderTop: "1.5px solid rgba(192,192,192,.25)", borderLeft: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner tr" style={{ position: "absolute", top: 20, right: 20, width: 24, height: 24, borderTop: "1.5px solid rgba(192,192,192,.25)", borderRight: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner bl" style={{ position: "absolute", bottom: 20, left: 20, width: 24, height: 24, borderBottom: "1.5px solid rgba(192,192,192,.25)", borderLeft: "1.5px solid rgba(192,192,192,.25)" }} />
          <div className="vigo-corner br" style={{ position: "absolute", bottom: 20, right: 20, width: 24, height: 24, borderBottom: "1.5px solid rgba(192,192,192,.25)", borderRight: "1.5px solid rgba(192,192,192,.25)" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,6vw,72px) 20px" }}>
            <div className="vigo-hero-drop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>

              {/* Left */}
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,192,192,.06)", border: ".5px solid rgba(192,192,192,.15)", padding: "6px 14px", marginBottom: 20 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c6", animation: "vigo-pulse 1.5s infinite" }} />
                  <span style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>
                    Next Drop · {nextDrop.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h1 style={{ fontSize: "clamp(28px,5vw,64px)", fontWeight: 900, letterSpacing: -3, lineHeight: .88, marginBottom: 16 }}>
                  {nextDrop.drop}<br /><span style={{ color: S }}>{nextDrop.series}</span>
                </h1>
                <p style={{ fontSize: "clamp(11px,1.5vw,13px)", color: SD, lineHeight: 1.9, maxWidth: 380, marginBottom: 24 }}>{nextDrop.desc}</p>

                {/* Meta pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                  {[`${nextDrop.pieces} Units`, nextDrop.date.toLocaleDateString("en-US", { month: "long", day: "numeric" }), nextDrop.time, nextDrop.price].map(m => (
                    <div key={m} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: G2, border: `.5px solid ${G3}`, padding: "5px 10px" }}>
                      <div style={{ width: 4, height: 4, background: S, transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 8, color: SD, letterSpacing: 1, whiteSpace: "nowrap" }}>{m}</span>
                    </div>
                  ))}
                </div>

                {notified[nextDrop.id] ? (
                  <div style={{ fontSize: 12, color: "#0c6", padding: "10px 0" }}>✓ You're on the list — we'll notify you.</div>
                ) : (
                  <div style={{ display: "flex", maxWidth: 380 }}>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: "#111", border: ".5px solid #333", borderRight: "none", color: "#fff", padding: "12px 16px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => handleNotify(nextDrop.id)} style={btnP}>Notify Me</button>
                  </div>
                )}
              </div>

              {/* Right — Countdown */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
                <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 14 }}>Drops In</div>
                <div style={{ background: "#050505", border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, width: "100%", marginBottom: 16 }}>
                  <HeroCountdown drop={nextDrop} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom,${S},transparent)`, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 9, color: SD, letterSpacing: 1, lineHeight: 1.7 }}>
                    <div style={{ color: "#aaa" }}>{nextDrop.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                    <div>{nextDrop.time} · No restocks. No exceptions.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CALENDAR + PANEL ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,52px) 20px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>✦ Schedule</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, letterSpacing: -2 }}>Drop Calendar</h2>
        </div>

        <div className="vigo-drops-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

          {/* Calendar */}
          <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `.5px solid ${G3}` }}>
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={navBtn}>←</button>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
                {MONTHS[month]} <span style={{ color: S }}>{year}</span>
              </div>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={navBtn}>→</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#060606", borderBottom: `.5px solid ${G3}` }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ padding: "8px 4px", textAlign: "center", fontSize: 8, letterSpacing: 1, color: "#333" }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {cells.map((day, i) => {
                const drop = dropOnDay(day);
                const isToday = day && isSameDay(day, TODAY);
                const isSelected = selectedDrop && drop && selectedDrop.id === drop.id;
                const isPast = day && day < TODAY && !isToday;
                return (
                  <div
                    key={i}
                    onClick={() => { if (drop) { setSelectedDrop(drop); setViewDate(new Date(drop.date.getFullYear(), drop.date.getMonth(), 1)); } }}
                    style={{
                      minHeight: "clamp(52px,8vw,72px)",
                      padding: "8px 6px 6px",
                      borderRight: (i + 1) % 7 !== 0 ? `.5px solid ${G3}` : "none",
                      borderBottom: `.5px solid ${G3}`,
                      cursor: drop ? "pointer" : "default",
                      background: isSelected ? "rgba(192,192,192,.08)" : "transparent",
                      transition: "background .15s",
                      position: "relative",
                    }}
                    onMouseEnter={e => { if (drop && !isSelected) e.currentTarget.style.background = "rgba(192,192,192,.04)"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    {day && (
                      <>
                        <div style={{
                          fontSize: 10, fontWeight: isToday ? 900 : 400,
                          color: isToday ? "#000" : isPast ? "#2a2a2a" : drop ? "#fff" : "#3a3a3a",
                          width: 20, height: 20,
                          background: isToday ? S : "transparent",
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 4,
                        }}>{day.getDate()}</div>
                        {drop && (
                          <div style={{
                            background: `${drop.tagColor}18`,
                            borderLeft: `2px solid ${drop.tagColor}`,
                            padding: "2px 4px",
                            fontSize: 6,
                            letterSpacing: .5,
                            color: drop.tagColor,
                            lineHeight: 1.4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {drop.series}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ padding: "12px 20px", borderTop: `.5px solid ${G3}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[[S, "Upcoming"], ["#888", "Coming Soon"], ["#e03", "Sold Out"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 2, background: c }} />
                  <span style={{ fontSize: 7, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedDrop ? (
              <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${selectedDrop.tagColor}` }}>
                <div style={{ padding: "20px", borderBottom: `.5px solid ${G3}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: selectedDrop.tagColor, textTransform: "uppercase", border: `.5px solid ${selectedDrop.tagColor}`, padding: "3px 8px" }}>{selectedDrop.tag}</div>
                    <div style={{ fontSize: 9, color: SD }}>{selectedDrop.price}</div>
                  </div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{selectedDrop.drop}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>{selectedDrop.series}</h3>
                  <p style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{selectedDrop.desc}</p>
                </div>

                {/* Meta */}
                <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Date", selectedDrop.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })], ["Time", selectedDrop.time], ["Units", `${selectedDrop.pieces}`]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{v}</div>
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
                          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: "#111", border: ".5px solid #333", borderRight: "none", color: "#fff", padding: "9px 10px", fontSize: 10, outline: "none", fontFamily: "inherit" }} />
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

            {/* All Drops List */}
            <div style={{ background: G1, border: `.5px solid ${G3}` }}>
              <div style={{ padding: "10px 16px", borderBottom: `.5px solid ${G3}`, fontSize: 7, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>All Drops</div>
              {ALL_DROPS.map(dr => (
                <div
                  key={dr.id}
                  onClick={() => { setSelectedDrop(dr); setViewDate(new Date(dr.date.getFullYear(), dr.date.getMonth(), 1)); }}
                  style={{ padding: "12px 16px", borderBottom: `.5px solid ${G3}`, cursor: "pointer", background: selectedDrop?.id === dr.id ? "rgba(192,192,192,.05)" : "transparent", transition: "background .15s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => { if (selectedDrop?.id !== dr.id) e.currentTarget.style.background = "rgba(192,192,192,.03)"; }}
                  onMouseLeave={e => { if (selectedDrop?.id !== dr.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{dr.series}</div>
                    <div style={{ fontSize: 8, color: SD }}>{dr.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: dr.tagColor }} />
                    <span style={{ fontSize: 7, color: dr.tagColor, letterSpacing: 1, textTransform: "uppercase" }}>{dr.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ARCHIVE ── */}
      <div style={{ background: G1, borderTop: `.5px solid ${G3}`, padding: "clamp(32px,5vw,52px) 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: .5, background: G3 }} />
            <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              <div style={{ width: 5, height: 5, background: "#e03", transform: "rotate(45deg)" }} />
              Drop 01 — Sold Out
              <div style={{ width: 5, height: 5, background: "#e03", transform: "rotate(45deg)" }} />
            </div>
            <div style={{ flex: 1, height: .5, background: G3 }} />
          </div>
          <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {PAST_DROPS.map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <span style={{ fontSize: 8, letterSpacing: 3, color: "#555", textTransform: "uppercase", border: ".5px solid #2a2a2a", padding: "5px 12px" }}>Sold Out</span>
                </div>
                <ProductCard product={p} img={productImg}
                  wishlisted={wishlist.includes(p.id)}
                  onWishlist={() => {}}
                  onAdd={() => {}}
                  onClick={() => navigate(`/product/${p.id}`)} />
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
        }
        @media(max-width:480px){
          .vigo-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
    </PullToRefresh>
  );
}

const navBtn = { background: "none", border: `.5px solid ${G3}`, color: S, width: 30, height: 30, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 };
const btnP = { background: S, color: "#000", border: "none", padding: "12px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" };
const btnGhost = { background: "none", border: `.5px solid ${G3}`, color: SD, padding: "10px 18px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };