import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

const S = "#C0C0C0";
const SD = "#777";
const G3 = "#1a1a1a";

const links = [
{ label: "Home", to: "/" },
{ label: "Shop", to: "/shop" },
{ label: "Drops", to: "/drops" },
{ label: "Lookbook", to: "/lookbook" },
{ label: "About", to: "/about" }];


export default function VigoNav({ cartCount, onCartOpen, logo }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [logoTaps, setLogoTaps] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isRoot = location.pathname === "/" || location.pathname === "/shop" || location.pathname === "/drops" || location.pathname === "/wishlist" || location.pathname === "/account" || location.pathname === "/lookbook" || location.pathname === "/about";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {navigate(`/shop?q=${encodeURIComponent(query)}`);setSearchOpen(false);setQuery("");}
  };

  const handleLogoClick = () => {
    const newTaps = logoTaps + 1;
    setLogoTaps(newTaps);
    if (newTaps === 5) {
      navigate("/admin");
      setLogoTaps(0);
    } else {
      setTimeout(() => setLogoTaps(0), 3000);
    }
  };

  return (
    <>
      {/* Top silver accent bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#888,#E8E8E8,#C0C0C0,#E8E8E8,#888,transparent)" }} />

      {/* Ticker */}
      <div style={{ background: "#0a0a0a", borderBottom: `.5px solid ${G3}`, overflow: "hidden", height: 30, display: "flex", alignItems: "center" }}>
        <div className="vigo-ticker-track">
          {[...Array(2)].map((_, ri) =>
          <span key={ri} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
              {["Free shipping over $150", "New drop every friday", "VIGONYC SS25", "NYC made — limited units", "No restocks. Move fast.", "Free returns within 30 days"].map((t, i) =>
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24, padding: "0 12px" }}>
                  <span style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", whiteSpace: "nowrap" }}>{t}</span>
                  <span style={{ color: S, fontSize: 8 }}>✦</span>
                </span>
            )}
            </span>
          )}
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen &&
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, background: "#0a0a0a", borderBottom: `1px solid ${G3}`, padding: "16px 24px", display: "flex", gap: 12, alignItems: "center" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", flex: 1, gap: 12 }}>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, styles, drops..." style={{ flex: 1, background: "#111", border: `.5px solid #333`, color: "#fff", padding: "12px 18px", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button type="submit" style={btnS}>Search</button>
          </form>
          <button onClick={() => setSearchOpen(false)} style={btnGhost}>Cancel</button>
        </div>
      }

      {/* Main nav */}
      <nav className="vigo-nav-top" style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(0,0,0,.97)" : "#000", borderBottom: `.5px solid ${G3}`, transition: "background .3s", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
             {/* Back button (mobile child screens) or Logo */}
             {!isRoot ? (
               <button onClick={() => navigate(-1)} className="vigo-back-btn" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "inherit", padding: "4px 0" }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                 Back
               </button>
             ) : (
             <div className="vigo-nav-logo" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", cursor: "pointer" }} onClick={handleLogoClick}>
               <img src={logo} alt="VIGONYC" className="vigo-nav-logo-img" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <div style={{ lineHeight: 1 }}>
              <div className="vigo-nav-wordmark" style={{ fontSize: 17, fontWeight: 900, letterSpacing: 4, color: "#fff", textTransform: "uppercase" }}>VIGO<span style={{ color: S }}>NYC</span></div>
              <style>{`.vigo-nav-wordmark { display: block; } @media(max-width:768px){ .vigo-nav-wordmark { display: none !important; } }`}</style>
              <style>{`.vigo-nav-subtitle { display: block; } @media(max-width:768px){ .vigo-nav-subtitle { display: none !important; } }`}</style>
            </div>
            </div>
            )}
            <button style={{ ...iconBtn, position: "relative" }} onClick={onCartOpen} title="Cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {cartCount > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: S, color: "#000", fontSize: 8, fontWeight: 900, borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
            </div>

          {/* Desktop links */}
          <div className="vigo-desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {links.map((l) =>
            <NavLink key={l.to} to={l.to} end={l.to === "/"} style={({ isActive }) => ({
              textDecoration: "none", fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
              color: isActive ? "#fff" : SD,
              borderBottom: isActive ? `1px solid ${S}` : "1px solid transparent",
              paddingBottom: 3, transition: "color .2s"
            })}>{l.label}</NavLink>
            )}
          </div>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSearchOpen(true)} className="vigo-icon-desktop" style={iconBtn} title="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <Link to="/wishlist" className="vigo-icon-desktop" style={{ ...iconBtn, textDecoration: "none" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </Link>
            <Link to="/account" className="vigo-icon-desktop" style={{ ...iconBtn, textDecoration: "none" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen &&
        <div style={{ background: "#0a0a0a", borderTop: `.5px solid ${G3}`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            {links.map((l) =>
          <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} style={({ isActive }) => ({ textDecoration: "none", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: isActive ? "#fff" : SD })}>{l.label}</NavLink>
          )}
          </div>
        }
      </nav>

      <style>{`
        @keyframes vigo-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .vigo-ticker-track { display: flex; white-space: nowrap; animation: vigo-ticker 30s linear infinite; }
        @media (min-width: 900px) { .vigo-mobile-menu-btn { display: none !important; } }
        @media (max-width: 899px) { .vigo-desktop-nav { display: none !important; } .vigo-icon-desktop { display: none !important; } }
        @media (max-width: 899px) { .vigo-nav-logo { position: absolute; left: 50%; transform: translateX(-50%); } .vigo-nav-logo-img { width: 60px !important; height: 60px !important; } }
      `}</style>
    </>);

}

const iconBtn = { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, position: "relative" };
const btnS = { background: "#C0C0C0", color: "#000", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { background: "none", border: ".5px solid #333", color: "#777", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };