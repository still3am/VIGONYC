import { Link } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

const cols = {
  Shop: [["New Arrivals", "/shop"], ["Tops", "/shop?cat=Tops"], ["Bottoms", "/shop?cat=Bottoms"], ["Outerwear", "/shop?cat=Outerwear"], ["Accessories", "/shop?cat=Accessories"], ["Drop Calendar", "/drops"]],
  Info: [["About", "/about"], ["Lookbook", "/lookbook"], ["FAQ", "/faq"]],
  Support: [["Contact", "/contact"], ["Track Order", "/track-order"], ["Size Guide", "/product/1"], ["Wishlist", "/wishlist"]]
};

export default function VigoFooter({ logo }) {
  return (
    <footer style={{ background: G1, borderTop: `.5px solid ${G3}`, marginTop: 0 }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,#888,#E8E8E8,${S},#E8E8E8,#888,transparent)` }} />
      <div className="vigo-footer-grid" style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px 32px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
        {/* Brand col */}
        <div>
          <img src={logo} alt="VIGONYC" style={{ width: 48, height: 48, objectFit: "contain", marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: SD, lineHeight: 1.8, maxWidth: 280, marginBottom: 20 }}>
            Born in NYC. Built for the borough. Every drop is limited — no restocks, no exceptions.
          </p>
          <div style={{ fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase" }}>SS25 Season Live</div>
        </div>
        {/* Link cols */}
        {Object.entries(cols).map(([heading, links]) => (
          <div key={heading}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase", marginBottom: 20, fontWeight: 700 }}>{heading}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(([label, to]) => (
                <Link key={label} to={to} style={{ fontSize: 11, color: SD, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 32px", borderTop: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 9, color: SD }}>© 2025 VIGONYC. All rights reserved.</div>
        <div style={{ fontSize: 9, color: SD, letterSpacing: 2 }}>NEW YORK CITY</div>
      </div>
      <style>{`
        @media(max-width:900px){.vigo-footer-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:480px){.vigo-footer-grid{grid-template-columns:1fr !important;}}
        @media(max-width:900px){footer { display: none !important; }}
      `}</style>
    </footer>);
}