import { useState, useEffect } from "react";

const S = "#C0C0C0";
const SD = "#777";

export default function VigoNav({ page, nav, cartCount, onCartOpen, logo }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
  { label: "Home", page: "home" },
  { label: "Shop", page: "shop" },
  { label: "Lookbook", page: "lookbook" },
  { label: "About", page: "about" }];


  return (
    <>
      {/* Silver top bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* Ticker */}
      <div style={{ background: "#0a0a0a", borderBottom: ".5px solid #1a1a1a", overflow: "hidden", height: 32, display: "flex", alignItems: "center" }}>
        <div style={{
          display: "flex", gap: 0, whiteSpace: "nowrap",
          animation: "ticker 28s linear infinite"
        }}>
          {[...Array(2)].map((_, ri) =>
          <span key={ri} style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
              {["Free shipping over $150", "New drop every friday", "VIGONYC SS25", "NYC made — limited units", "No restocks. Move fast.", "Free returns within 30 days"].map((t, i) =>
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
                  <span style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>{t}</span>
                  <span style={{ color: S, fontSize: 8 }}>✦</span>
                </span>
            )}
            </span>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchOpen &&
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "12px 24px", display: "flex", gap: 12, alignItems: "center" }}>
          <input autoFocus placeholder="Search for products, styles, drops..." style={{ flex: 1, background: "#111", border: ".5px solid #333", color: "#fff", padding: "10px 16px", fontSize: 13, outline: "none" }} />
          <button style={btnS}>Search</button>
          <button style={btnGhost} onClick={() => setSearchOpen(false)}>Cancel</button>
        </div>
      }

      {/* Main nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(0,0,0,0.97)" : "#000",
        borderBottom: ".5px solid #1a1a1a",
        transition: "background .3s"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logo} alt="VIGONYC" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div style={{ lineHeight: 1 }}>
              
              
            </div>
          </button>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="vigo-desktop-nav">
            {links.map((l) =>
            <button key={l.page} onClick={() => nav(l.page)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              color: page === l.page ? "#fff" : SD,
              borderBottom: page === l.page ? `1px solid ${S}` : "1px solid transparent",
              paddingBottom: 2, transition: "color .2s"
            }}>{l.label}</button>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => setSearchOpen(true)} style={{ ...iconBtn }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <button style={{ ...iconBtn }} onClick={onCartOpen}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: S, color: "#000", fontSize: 8, fontWeight: 900, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ ...iconBtn }} className="vigo-mobile-menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen &&
        <div style={{ background: "#0a0a0a", borderTop: ".5px solid #1a1a1a", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            {links.map((l) =>
          <button key={l.page} onClick={() => {nav(l.page);setMobileOpen(false);}} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: SD }}>{l.label}</button>
          )}
          </div>
        }
      </nav>

      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (min-width: 768px) { .vigo-mobile-menu { display: none !important; } }
        @media (max-width: 767px) { .vigo-desktop-nav { display: none !important; } }
      `}</style>
    </>);

}

const iconBtn = { background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 };
const btnS = { background: "#C0C0C0", color: "#000", border: "none", padding: "8px 20px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" };
const btnGhost = { background: "none", border: ".5px solid #333", color: "#777", padding: "8px 20px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" };