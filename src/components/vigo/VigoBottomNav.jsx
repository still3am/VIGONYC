import { NavLink } from "react-router-dom";

const S = "#C0C0C0";

const items = [
  { label: "Home", to: "/", icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? S : "none"} stroke={active ? S : "var(--vt-sub)"} strokeWidth="1.5">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { label: "Shop", to: "/shop", icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : "var(--vt-sub)"} strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )},
  { label: "Drops", to: "/drops", icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : "var(--vt-sub)"} strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )},
  { label: "Account", to: "/account", icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? S : "var(--vt-sub)"} strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function VigoBottomNav({ cartCount = 0, onCartOpen }) {
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
        padding: "0 0 env(safe-area-inset-bottom)",
      }}>

        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            color: isActive ? S : "var(--vt-sub)",
            textDecoration: "none",
            padding: "10px 0 8px",
            fontSize: 9,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: "inherit",
            fontWeight: isActive ? 700 : 400,
            transition: "color .2s",
            position: "relative",
            WebkitTapHighlightColor: "transparent",
          })}>
            {({ isActive }) => (
              <>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isActive ? 28 : 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${S}, transparent)`,
                  borderRadius: "0 0 2px 2px",
                  transition: "width .3s cubic-bezier(.34,1.56,.64,1)",
                }} />
                <div style={{ transform: isActive ? "scale(1.1)" : "scale(1)", transition: "transform .2s" }}>
                  {item.icon(isActive)}
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <style>{`
        @media (min-width: 900px) { .vigo-bottom-nav { display: none !important; } }
        @media (max-width: 899px) { body { padding-bottom: calc(72px + env(safe-area-inset-bottom)); } }
      `}</style>
    </>
  );
}