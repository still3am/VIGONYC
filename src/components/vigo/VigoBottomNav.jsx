import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const SD = "var(--vt-sub)";
const G3 = "var(--vt-border)";

const HomeIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill={active ? S : "none"} stroke={active ? S : SD} strokeWidth="1.5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>;

const ShopIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>;

const DropsIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>;

const AccountIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>;

const VaultIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>;

const LookbookIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>;

const WishlistIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill={active ? S : "none"} stroke={active ? S : SD} strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>;

const AboutIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>;

const ContactIcon = (active) =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : SD} strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>;

const MoreIcon = () =>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5">
    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
  </svg>;

const CloseIcon = () =>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SD} strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>;


// Primary 4 tabs shown in nav bar
const PRIMARY = [
{ label: "Home", to: "/", icon: HomeIcon },
{ label: "Shop", to: "/shop", icon: ShopIcon },
{ label: "Drops", to: "/drops", icon: DropsIcon },
{ label: "Account", to: "/account", icon: AccountIcon }];


// Additional pages shown in "More" panel
const MORE_ITEMS = [
{ label: "The Vault", to: "/referral", icon: VaultIcon },
{ label: "Lookbook", to: "/lookbook", icon: LookbookIcon },
{ label: "Wishlist", to: "/wishlist", icon: WishlistIcon },
{ label: "About", to: "/about", icon: AboutIcon },
{ label: "Contact", to: "/contact", icon: ContactIcon }];


export default function VigoBottomNav({ cartCount = 0, onCartOpen }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="vigo-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: "var(--vt-nav-scrolled)",
        borderTop: ".5px solid var(--vt-border)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        height: 72,
        padding: "0 0 env(safe-area-inset-bottom)"
      }}>
        {PRIMARY.map((item) =>
        <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          color: isActive ? S : SD,
          textDecoration: "none",
          padding: "10px 0 8px",
          fontSize: 9,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "inherit",
          fontWeight: isActive ? 700 : 400,
          transition: "color .2s",
          position: "relative",
          WebkitTapHighlightColor: "transparent"
        })}>
            {({ isActive }) =>
          <>
                <div style={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              width: isActive ? 28 : 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${S}, transparent)`,
              borderRadius: "0 0 2px 2px",
              transition: "width .3s cubic-bezier(.34,1.56,.64,1)"
            }} />
                <div style={{ transform: isActive ? "scale(1.1)" : "scale(1)", transition: "transform .2s" }}>
                  {item.icon(isActive)}
                </div>
                <span className="hidden">{item.label}</span>
              </>
          }
          </NavLink>
        )}

        {/* More button */}
        <button onClick={() => setMoreOpen(true)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 5, background: "none", border: "none",
          padding: "10px 0 8px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase",
          fontFamily: "inherit", color: SD, cursor: "pointer",
          WebkitTapHighlightColor: "transparent"
        }}>
          <MoreIcon />
          <span>More</span>
        </button>
      </nav>

      {/* More overlay */}
      {moreOpen &&
      <>
          <div
          onClick={() => setMoreOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400 }}
          className="vigo-bottom-nav" />
        
          <div className="vigo-bottom-nav" style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
          background: "var(--vt-nav-scrolled)",
          borderTop: `2px solid ${S}`,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 12px)"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 10px" }}>
              <div style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase" }}>More</div>
              <button onClick={() => setMoreOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <CloseIcon />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", padding: "0 8px 16px", gap: 4 }}>
              {MORE_ITEMS.map((item) =>
            <NavLink key={item.to} to={item.to} onClick={() => setMoreOpen(false)} style={({ isActive }) => ({
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              padding: "14px 6px",
              background: isActive ? "rgba(192,192,192,0.07)" : "rgba(255,255,255,0.02)",
              border: `0.5px solid ${isActive ? S : G3}`,
              textDecoration: "none",
              fontSize: 8, letterSpacing: 1, textTransform: "uppercase",
              color: isActive ? S : SD,
              fontFamily: "inherit", fontWeight: isActive ? 700 : 400,
              textAlign: "center", lineHeight: 1.3,
              WebkitTapHighlightColor: "transparent",
              transition: "all .15s"
            })}>
                  {({ isActive }) =>
              <>
                      {item.icon(isActive)}
                      <span>{item.label}</span>
                    </>
              }
                </NavLink>
            )}
            </div>
          </div>
        </>
      }

      <style>{`
        @media (min-width: 900px) { .vigo-bottom-nav { display: none !important; } }
        @media (max-width: 899px) { body { padding-bottom: calc(72px + env(safe-area-inset-bottom)); } }
      `}</style>
    </>);

}