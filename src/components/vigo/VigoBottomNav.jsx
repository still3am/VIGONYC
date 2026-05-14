import { useState } from "react";
import { NavLink } from "react-router-dom";

const S = "#C0C0C0";
const SD = "rgba(255,255,255,0.45)";

const HomeIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,255,255,0.95)" : "none"} stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"} strokeWidth="1.5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ShopIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"} strokeWidth="1.5">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const DropsIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"} strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const AccountIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"} strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const VaultIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"} strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const LookbookIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"} strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const WishlistIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(255,255,255,0.9)" : "none"} stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"} strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const AboutIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"} strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ContactIcon = (active) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"} strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const MoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
  </svg>
);

const PRIMARY = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Shop", to: "/shop", icon: ShopIcon },
  { label: "Drops", to: "/drops", icon: DropsIcon },
  { label: "Account", to: "/account", icon: AccountIcon },
];

const MORE_ITEMS = [
  { label: "The Vault", to: "/referral", icon: VaultIcon },
  { label: "Lookbook", to: "/lookbook", icon: LookbookIcon },
  { label: "Wishlist", to: "/wishlist", icon: WishlistIcon },
  { label: "About", to: "/about", icon: AboutIcon },
  { label: "Contact", to: "/contact", icon: ContactIcon },
];

export default function VigoBottomNav({ cartCount = 0, onCartOpen }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Liquid Glass Nav Bar */}
      <nav className="vigo-bottom-nav" style={{
        position: "fixed",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "10px 10px",
        borderRadius: 32,
        background: "rgba(30,30,30,0.55)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        border: "0.5px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(255,255,255,0.15), inset 0 -0.5px 0 rgba(0,0,0,0.3)",
      }}>
        {PRIMARY.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: 56,
            height: 52,
            borderRadius: 22,
            background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
            boxShadow: isActive ? "inset 0 0.5px 0 rgba(255,255,255,0.2), inset 0 -0.5px 0 rgba(0,0,0,0.15)" : "none",
            textDecoration: "none",
            color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
            fontSize: 8,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontFamily: "inherit",
            fontWeight: isActive ? 700 : 400,
            transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
            WebkitTapHighlightColor: "transparent",
          })}>
            {({ isActive }) => (
              <>
                <div style={{ transform: isActive ? "scale(1.08)" : "scale(1)", transition: "transform .2s" }}>
                  {item.icon(isActive)}
                </div>
                <span style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div style={{ width: "0.5px", height: 28, background: "rgba(255,255,255,0.15)", margin: "0 2px", flexShrink: 0 }} />

        {/* More button */}
        <button onClick={() => setMoreOpen(true)} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          width: 56,
          height: 52,
          borderRadius: 22,
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          fontSize: 8,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          fontFamily: "inherit",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          transition: "background .2s",
        }}>
          <MoreIcon />
          <span>More</span>
        </button>
      </nav>

      {/* More overlay — Apple-style grid panel */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMoreOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 400,
              animation: "lgFadeIn 0.2s ease",
            }}
            className="vigo-bottom-nav"
          />

          {/* Panel */}
          <div className="vigo-bottom-nav" style={{
            position: "fixed",
            bottom: "calc(100px + env(safe-area-inset-bottom))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "rgba(28,28,30,0.72)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "0.5px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 0.5px 0 rgba(255,255,255,0.15)",
            padding: "16px 14px 14px",
            width: "min(320px, calc(100vw - 32px))",
            animation: "lgSlideUp 0.25s cubic-bezier(.34,1.56,.64,1)",
          }}>
            {/* Label */}
            <div style={{ fontSize: 8, letterSpacing: 3, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", textAlign: "center", marginBottom: 14 }}>More</div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {MORE_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} onClick={() => setMoreOpen(false)} style={({ isActive }) => ({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "16px 8px",
                  borderRadius: 18,
                  background: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.12)",
                  textDecoration: "none",
                  color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                  fontSize: 9,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                  fontWeight: isActive ? 700 : 400,
                  textAlign: "center",
                  lineHeight: 1.3,
                  WebkitTapHighlightColor: "transparent",
                  transition: "all .15s",
                })}>
                  {({ isActive }) => (
                    <>
                      {item.icon(isActive)}
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Close button — floating */}
          <button
            onClick={() => setMoreOpen(false)}
            className="vigo-bottom-nav"
            style={{
              position: "fixed",
              bottom: "calc(100px + env(safe-area-inset-bottom))",
              right: "max(16px, calc(50vw - 176px))",
              zIndex: 501,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(60,60,65,0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "lgSlideUp 0.25s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </>
      )}

      <style>{`
        @media (min-width: 900px) { .vigo-bottom-nav { display: none !important; } }
        @media (max-width: 899px) { body { padding-bottom: calc(88px + env(safe-area-inset-bottom)); } }
        @keyframes lgFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lgSlideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95) } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1) } }
      `}</style>
    </>
  );
}