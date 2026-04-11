import { NavLink } from "react-router-dom";

const S = "#C0C0C0";

const items = [
  { label: "Home", to: "/", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: "Shop", to: "/shop", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { label: "Lookbook", to: "/lookbook", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { label: "Account", to: "/account", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function VigoBottomNav() {
  return (
    <>
      <nav className="vigo-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "rgba(0,0,0,.95)", borderTop: ".5px solid #1a1a1a", backdropFilter: "blur(16px)", display: "flex", padding: "8px 0" }}>
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: isActive ? S : "#555", textDecoration: "none", padding: "4px 0",
            fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontFamily: "inherit",
          })}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <style>{`
        @media (min-width: 900px) { .vigo-bottom-nav { display: none !important; } }
        @media (max-width: 899px) { body { padding-bottom: 72px; } }
      `}</style>
    </>
  );
}