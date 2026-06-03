import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const SD = "rgba(200,200,200,0.55)";

const iconStroke = (active) => active ? "rgba(255,255,255,0.95)" : "rgba(200,200,200,0.6)";
const iconStrokeSm = (active) => active ? "rgba(255,255,255,0.95)" : "rgba(200,200,200,0.7)";

const PRIMARY = [
  { label: "Home", to: "/",
    renderIcon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(220,220,220,0.9)" : "none"} stroke={iconStroke(active)} strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: "Shop", to: "/shop",
    renderIcon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label: "Drops", to: "/drops",
    renderIcon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: "Account", to: "/account",
    renderIcon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

const MORE_ITEMS = [
  { label: "Live", to: "/live",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M5.64 5.64a9 9 0 0 0 0 12.72M18.36 5.64a9 9 0 0 1 0 12.72M8.46 8.46a5 5 0 0 0 0 7.07M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> },
  { label: "The Vault", to: "/referral",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M12 10v0M7 9h1M16 9h1"/></svg> },
  { label: "Lookbook", to: "/lookbook",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  { label: "Wishlist", to: "/wishlist",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "rgba(220,220,220,0.9)" : "none"} stroke={iconStrokeSm(active)} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label: "About", to: "/about",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { label: "Contact", to: "/contact",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: "Search", to: "/search",
    renderIcon: (active) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconStrokeSm(active)} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
];

export default function VigoBottomNav({ cartCount = 0, onCartOpen, cartOpen = false }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [cartPressing, setCartPressing] = useState(false);

  if (cartOpen) return null;

  const toggleMore = () => {
    setPressing(true);
    setTimeout(() => setPressing(false), 200);
    setMoreOpen(o => !o);
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 400,
            animation: "vbn-fade-in 0.2s ease",
          }}
          className="vigo-bottom-nav"
        />
      )}

      {/* More grid panel — slides up from above the nav */}
      <div className="vigo-bottom-nav" style={{
        position: "fixed",
        bottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
        right: 16,
        zIndex: 500,
        transform: moreOpen ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)",
        transformOrigin: "bottom right",
        opacity: moreOpen ? 1 : 0,
        pointerEvents: moreOpen ? "auto" : "none",
        transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
      }}>
        <div style={{
          background: "rgba(30,30,32,0.78)",
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          borderRadius: 22,
          border: "0.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
          padding: "12px 10px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
          minWidth: 220,
        }}>
          {MORE_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              style={({ isActive }) => ({
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "14px 8px",
                background: isActive
                  ? "rgba(192,192,192,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: `0.5px solid ${isActive ? "rgba(192,192,192,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16,
                textDecoration: "none",
                fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase",
                color: isActive ? "rgba(255,255,255,0.95)" : "rgba(200,200,200,0.7)",
                fontFamily: "inherit", fontWeight: isActive ? 700 : 400,
                textAlign: "center", lineHeight: 1.4,
                WebkitTapHighlightColor: "transparent",
                transition: "all .15s",
              })}
            >
              {({ isActive }) => (
                <>
                  {item.renderIcon(isActive)}
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main nav bar — Liquid Glass */}
      <nav className="vigo-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 450,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "transparent",
        pointerEvents: "none",
      }}>
        {/* Glass pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          margin: "0 0 12px 0",
          padding: "6px 10px",
          background: "rgba(30,30,32,0.65)",
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          borderRadius: 32,
          border: "0.5px solid rgba(255,255,255,0.14)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
          pointerEvents: "auto",
        }}>
          {PRIMARY.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                width: 58,
                height: 52,
                borderRadius: 24,
                background: isActive
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
                border: isActive
                  ? "0.5px solid rgba(255,255,255,0.18)"
                  : "0.5px solid transparent",
                boxShadow: isActive
                  ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.25)"
                  : "none",
                textDecoration: "none",
                fontSize: 8,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: isActive ? "rgba(255,255,255,0.95)" : "rgba(190,190,190,0.6)",
                fontFamily: "inherit",
                fontWeight: isActive ? 700 : 400,
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                WebkitTapHighlightColor: "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }}>
                    {item.renderIcon(isActive)}
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* + / × More button */}
          <button
            onClick={toggleMore}
            style={{
              width: 52,
              height: 52,
              borderRadius: 24,
              background: moreOpen
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.22)",
              boxShadow: moreOpen
                ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 12px rgba(0,0,0,0.3)"
                : "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transform: pressing ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.2s",
              flexShrink: 0,
            }}
            aria-label={moreOpen ? "Close" : "More"}
          >
            {/* Animated + to × */}
            <div style={{
              position: "relative",
              width: 18,
              height: 18,
            }}>
              {/* Horizontal bar */}
              <div style={{
                position: "absolute",
                top: "50%", left: 0, right: 0,
                height: 1.5,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 2,
                transform: `translateY(-50%) rotate(${moreOpen ? 45 : 0}deg)`,
                transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }} />
              {/* Vertical bar */}
              <div style={{
                position: "absolute",
                left: "50%", top: 0, bottom: 0,
                width: 1.5,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 2,
                transform: `translateX(-50%) rotate(${moreOpen ? 45 : 0}deg)`,
                transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }} />
            </div>
          </button>
        </div>
      </nav>

      <style>{`
        @media (min-width: 900px) { .vigo-bottom-nav { display: none !important; } }
        @media (max-width: 899px) { body { padding-bottom: calc(76px + env(safe-area-inset-bottom)); } }
        @keyframes vbn-fade-in { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}