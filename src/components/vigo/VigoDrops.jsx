import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductCard from "./ProductCard";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const UPCOMING_DROPS = [
  {
    id: "drop-02",
    name: "Drop 02 — Mirror Series",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    desc: "Reflective chrome finishes. Heavyweight silhouettes. Only 75 units worldwide.",
    tag: "Upcoming",
    tagColor: S,
    pieces: 75,
  },
  {
    id: "drop-03",
    name: "Drop 03 — Concrete Series",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    desc: "Raw textures. NYC concrete inspired. Dyed-in-the-wool construction. 50 units.",
    tag: "Coming Soon",
    tagColor: "#555",
    pieces: 50,
  },
];

const PAST_DROPS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", opacity: 1 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
];

function Countdown({ targetDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {[["Days", time.d], ["Hours", time.h], ["Mins", time.m], ["Secs", time.s]].map(([l, v]) => (
        <div key={l} style={{ textAlign: "center", minWidth: 64 }}>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {String(v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginTop: 6 }}>{l}</div>
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

  const handleNotify = (dropId) => {
    if (email.trim()) setNotified(p => ({ ...p, [dropId]: true }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "72px 32px 52px", borderBottom: `.5px solid ${G3}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(192,192,192,.04) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>✦ Limited Drops</div>
        <h1 style={{ fontSize: "clamp(48px,7vw,96px)", fontWeight: 900, letterSpacing: -3, lineHeight: .88, marginBottom: 20 }}>
          The Drop<br /><span style={{ color: S }}>Calendar</span>
        </h1>
        <p style={{ fontSize: 13, color: SD, maxWidth: 480, lineHeight: 1.9 }}>
          Every VIGONYC drop is limited. No restocks, no exceptions. Get on the list or get left out.
        </p>
      </div>

      {/* Upcoming drops */}
      <div style={{ padding: "52px 32px", display: "flex", flexDirection: "column", gap: 2 }}>
        {UPCOMING_DROPS.map((drop, i) => (
          <div key={drop.id} style={{ background: G1, border: `.5px solid ${G3}`, borderTop: i === 0 ? `2px solid ${S}` : `.5px solid ${G3}`, overflow: "hidden" }}>
            <div className="vigo-drop-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {/* Left */}
              <div style={{ padding: "52px 48px", borderRight: `.5px solid ${G3}` }}>
                <div style={{ display: "inline-block", padding: "4px 12px", border: `.5px solid ${drop.tagColor}`, color: drop.tagColor, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>{drop.tag}</div>
                <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>{drop.name}</h2>
                <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 32 }}>{drop.desc}</p>
                <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Only {drop.pieces} units</div>
                <div style={{ width: "100%", height: 3, background: G3, marginBottom: 32, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.random() * 40 + 10}%`, background: `linear-gradient(90deg, ${S}, transparent)` }} />
                </div>
                {/* Email notify */}
                {notified[drop.id] ? (
                  <div style={{ fontSize: 11, color: "#0c6", padding: "12px 0" }}>✓ You're on the list for this drop.</div>
                ) : (
                  <div style={{ display: "flex", gap: 0 }}>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, background: "#111", border: `.5px solid #333`, borderRight: "none", color: "#fff", padding: "12px 16px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => handleNotify(drop.id)} style={{ background: S, color: "#000", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                      Notify Me
                    </button>
                  </div>
                )}
              </div>
              {/* Right: countdown */}
              <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 24 }}>Drops In</div>
                <Countdown targetDate={drop.date} />
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: `.5px solid ${G3}`, fontSize: 9, color: SD, letterSpacing: 1 }}>
                  {drop.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} — 12:00 PM EST
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Silver divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 32px", margin: "0 0 40px" }}>
        <div style={{ flex: 1, height: .5, background: G3 }} />
        <div style={{ width: 7, height: 7, background: S, transform: "rotate(45deg)" }} />
        <span style={{ fontSize: 9, letterSpacing: 4, color: SD, textTransform: "uppercase" }}>Drop 01 — Sold Out</span>
        <div style={{ width: 7, height: 7, background: S, transform: "rotate(45deg)" }} />
        <div style={{ flex: 1, height: .5, background: G3 }} />
      </div>

      {/* Past drop grid */}
      <div style={{ padding: "0 32px 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1 }}>Drop 01 — Chrome Series</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#e03", textTransform: "uppercase", marginTop: 6 }}>Sold Out — Archive Only</div>
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
        @media(max-width:900px){.vigo-drop-row{grid-template-columns:1fr !important;} .vigo-4col{grid-template-columns:repeat(2,1fr) !important;}}
        @media(max-width:480px){.vigo-4col{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}