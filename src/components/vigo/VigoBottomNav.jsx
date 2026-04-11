import { NavLink } from "react-router-dom";

const S = "#C0C0C0";

const items = [
  { label: "Home", to: "/", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { label: "Shop", to: "/shop", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )},
  { label: "Drops", to: "/drops", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )},
  { label: "Wishlist", to: "/wishlist", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )},
  { label: "Account", to: "/account", icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function VigoBottomNav() {
  return (
    <>
      <nav className="vigo-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "rgba(0,0,0,.97)", borderTop: ".5px solid #1a1a1a", backdropFilter: "blur(20px)", display: "flex", padding: "6px 0 env(safe-area-inset-bottom)" }}>
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: isActive ? S : "#444", textDecoration: "none", padding: "5px 0",
            fontSize: 8, letterSpacing: 1, textTransform: "uppercase", fontFamily: "inherit",
            transition: "color .2s",
          })}>
            {item.icon}
            {item.label}
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