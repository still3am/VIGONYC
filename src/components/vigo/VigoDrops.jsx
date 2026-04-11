import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const TODAY = new Date();

const ALL_DROPS = [
  {
    id: "drop-02",
    name: "Drop 02 — Mirror Series",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 3),
    desc: "Reflective chrome finishes. Heavyweight silhouettes. Only 75 units worldwide.",
    tag: "Upcoming",
    tagColor: S,
    pieces: 75,
    status: "upcoming",
  },
  {
    id: "drop-03",
    name: "Drop 03 — Concrete Series",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 10),
    desc: "Raw textures. NYC concrete inspired. Dyed-in-the-wool construction. 50 units.",
    tag: "Coming Soon",
    tagColor: "#555",
    pieces: 50,
    status: "upcoming",
  },
  {
    id: "drop-04",
    name: "Drop 04 — Void Series",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 21),
    desc: "All-black. Zero branding. Maximum impact. 40 units only.",
    tag: "Coming Soon",
    tagColor: "#555",
    pieces: 40,
    status: "upcoming",
  },
  {
    id: "drop-01",
    name: "Drop 01 — Chrome Series",
    date: new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 15),
    desc: "The drop that started it all. Hand-finished chrome hardware. Sold out in 8 minutes.",
    tag: "Sold Out",
    tagColor: "#e03",
    pieces: 100,
    status: "soldout",
  },
];

const PAST_DROPS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", opacity: 1 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
];

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function Countdown({ targetDate }) {
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

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[["D", time.d], ["H", time.h], ["M", time.m], ["S", time.s]].map(([l, v]) => (
        <div key={l} style={{ textAlign: "center", minWidth: 52, background: G2, border: `.5px solid ${G3}`, padding: "12px 8px" }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
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
  const [selectedDrop, setSelectedDrop] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dropOnDay = (day) => day ? ALL_DROPS.find(dr => isSameDay(dr.date, day)) : null;

  const handleNotify = (dropId) => { if (email.trim()) setNotified(p => ({ ...p, [dropId]: true })); };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div style={{ padding: "32px 16px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ Limited Drops</div>
        <h1 style={{ fontSize: "clamp(36px,6vw,80px)", fontWeight: 900, letterSpacing: -3, lineHeight: .88, marginBottom: 12 }}>
          The Drop<br /><span style={{ color: S }}>Calendar</span>
        </h1>
        <p style={{ fontSize: 12, color: SD, maxWidth: 420, lineHeight: 1.9 }}>
          Every VIGONYC drop is limited. No restocks, no exceptions.
        </p>
      </div>

      <div className="vigo-drops-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Calendar */}
        <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `.5px solid ${G3}` }}>
            <button onClick={prevMonth} style={navBtn}>←</button>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
              {MONTHS[month]} <span style={{ color: S }}>{year}</span>
            </div>
            <button onClick={nextMonth} style={navBtn}>→</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: `.5px solid ${G3}` }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: "10px 4px", textAlign: "center", fontSize: 7, letterSpacing: 2, color: SD }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {cells.map((day, i) => {
              const drop = dropOnDay(day);
              const isToday = day && isSameDay(day, TODAY);
              const isSelected = selectedDrop && drop && selectedDrop.id === drop.id;
              return (
                <div
                  key={i}
                  onClick={() => drop && setSelectedDrop(drop)}
                  style={{
                    minHeight: 64,
                    padding: "8px 6px",
                    borderRight: (i + 1) % 7 !== 0 ? `.5px solid ${G3}` : "none",
                    borderBottom: `.5px solid ${G3}`,
                    cursor: drop ? "pointer" : "default",
                    background: isSelected ? "rgba(192,192,192,.07)" : drop ? "rgba(192,192,192,.02)" : "transparent",
                    transition: "background .15s",
                    position: "relative",
                  }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontSize: 11, fontWeight: isToday ? 900 : 400,
                        color: isToday ? S : drop ? "#fff" : SD,
                        marginBottom: 4,
                      }}>{day.getDate()}</div>
                      {drop && (
                        <div style={{
                          fontSize: 7, letterSpacing: 1, lineHeight: 1.3,
                          color: drop.tagColor,
                          textTransform: "uppercase",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                          ✦ {drop.name.split("—")[1]?.trim() || drop.name}
                        </div>
                      )}
                      {isToday && <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: S }} />}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ padding: "14px 24px", borderTop: `.5px solid ${G3}`, display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[[S, "Upcoming"], ["#555", "Coming Soon"], ["#e03", "Sold Out"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, background: c, transform: "rotate(45deg)" }} />
                <span style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drop Detail Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selectedDrop ? (
            <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${selectedDrop.tagColor}`, padding: "28px 24px" }}>
              <div style={{ display: "inline-block", padding: "3px 10px", border: `.5px solid ${selectedDrop.tagColor}`, color: selectedDrop.tagColor, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>{selectedDrop.tag}</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1, marginBottom: 10, lineHeight: 1.1 }}>{selectedDrop.name}</h2>
              <p style={{ fontSize: 11, color: SD, lineHeight: 1.9, marginBottom: 20 }}>{selectedDrop.desc}</p>
              <div style={{ fontSize: 9, color: SD, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                {selectedDrop.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
              <div style={{ fontSize: 9, color: SD, letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>Only {selectedDrop.pieces} units</div>

              {selectedDrop.status === "upcoming" && (
                <>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 12 }}>Drops In</div>
                  <Countdown targetDate={selectedDrop.date} />
                  <div style={{ marginTop: 20 }}>
                    {notified[selectedDrop.id] ? (
                      <div style={{ fontSize: 11, color: "#0c6", padding: "10px 0" }}>✓ You're on the list.</div>
                    ) : (
                      <div style={{ display: "flex", gap: 0 }}>
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, minWidth: 0, background: "#111", border: `.5px solid #333`, borderRight: "none", color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
                        <button onClick={() => handleNotify(selectedDrop.id)} style={{ background: S, color: "#000", border: "none", padding: "10px 14px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>Notify Me</button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {selectedDrop.status === "soldout" && (
                <div style={{ fontSize: 10, color: "#e03", letterSpacing: 2, textTransform: "uppercase", marginTop: 8 }}>● Sold Out — Archive Only</div>
              )}
            </div>
          ) : (
            <div style={{ background: G1, border: `.5px solid ${G3}`, padding: "36px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12, opacity: .2 }}>✦</div>
              <div style={{ fontSize: 11, color: SD }}>Select a drop date on the calendar to view details.</div>
            </div>
          )}

          {/* Upcoming list */}
          <div style={{ background: G1, border: `.5px solid ${G3}` }}>
            <div style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>All Drops</div>
            {ALL_DROPS.map(dr => (
              <div key={dr.id} onClick={() => { setSelectedDrop(dr); setViewDate(new Date(dr.date.getFullYear(), dr.date.getMonth(), 1)); }}
                style={{ padding: "14px 20px", borderBottom: `.5px solid ${G3}`, cursor: "pointer", background: selectedDrop?.id === dr.id ? "rgba(192,192,192,.05)" : "transparent", transition: "background .15s", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(192,192,192,.05)"}
                onMouseLeave={e => e.currentTarget.style.background = selectedDrop?.id === dr.id ? "rgba(192,192,192,.05)" : "transparent"}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{dr.name}</div>
                  <div style={{ fontSize: 9, color: SD }}>{dr.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
                <div style={{ fontSize: 7, letterSpacing: 1, color: dr.tagColor, textTransform: "uppercase", flexShrink: 0 }}>● {dr.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past drop archive */}
      <div style={{ marginTop: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: .5, background: G3 }} />
          <div style={{ width: 7, height: 7, background: S, transform: "rotate(45deg)" }} />
          <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>Drop 01 — Sold Out</span>
          <div style={{ width: 7, height: 7, background: S, transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: .5, background: G3 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1 }}>Drop 01 — Chrome Series</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#e03", textTransform: "uppercase", marginTop: 4 }}>Sold Out — Archive Only</div>
        </div>
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {PAST_DROPS.map(p => (
            <div key={p.id} style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: 9, letterSpacing: 4, color: "#777", textTransform: "uppercase", border: ".5px solid #333", padding: "6px 14px" }}>Sold Out</span>
              </div>
              <ProductCard product={p} img={productImg}
                wishlisted={wishlist.includes(p.id)}
                onWishlist={() => toggleWishlist(p.id)}
                onAdd={() => {}}
                onClick={() => navigate(`/product/${p.id}`)} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .vigo-drops-layout { grid-template-columns: 1fr !important; }
          .vigo-4col { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .vigo-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const navBtn = { background: "none", border: `.5px solid #1a1a1a`, color: "#C0C0C0", width: 34, height: 34, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" };