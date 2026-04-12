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
      {/* Social + copyright bar */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 32px", borderTop: `.5px solid ${G3}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Social icons */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {/* Facebook */}
          <a href="https://www.facebook.com/people/V%C3%ADgo/61555413295731/" target="_blank" rel="noopener noreferrer" style={{ color: SD, transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = S} onMouseLeave={e => e.currentTarget.style.color = SD}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          {/* Instagram */}
          <a href="https://www.instagram.com/vigonyc/" target="_blank" rel="noopener noreferrer" style={{ color: SD, transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = S} onMouseLeave={e => e.currentTarget.style.color = SD}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          {/* TikTok */}
          <a href="https://www.tiktok.com/@vigonyc" target="_blank" rel="noopener noreferrer" style={{ color: SD, transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = S} onMouseLeave={e => e.currentTarget.style.color = SD}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
          </a>
          {/* YouTube */}
          <a href="https://www.youtube.com/channel/UC9QB8BN86KVYa_s2Gu05FyQ" target="_blank" rel="noopener noreferrer" style={{ color: SD, transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = S} onMouseLeave={e => e.currentTarget.style.color = SD}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--vt-bg)"/></svg>
          </a>
        </div>
        {/* Copyright */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 9, color: SD }}>© 2026 VIGONYC. All rights reserved.</div>
          <div style={{ fontSize: 9, color: SD, letterSpacing: 2 }}>POWERED BY BYSMITH LLC</div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.vigo-footer-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:480px){.vigo-footer-grid{grid-template-columns:1fr !important;}}
        @media(max-width:900px){footer { display: none !important; }}
      `}</style>
    </footer>);
}