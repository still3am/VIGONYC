import { Link } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const cols = {
  Shop: [["New Arrivals", "/shop"], ["Tops", "/shop?cat=Tops"], ["Bottoms", "/shop?cat=Bottoms"], ["Outerwear", "/shop?cat=Outerwear"], ["Accessories", "/shop?cat=Accessories"], ["Drop Calendar", "/drops"]],
  Info: [["About", "/about"], ["Lookbook", "/lookbook"], ["Sustainability", "/sustainability"], ["Press", "/press"], ["FAQ", "/faq"]],
  Support: [["Contact", "/contact"], ["Track Order", "/track-order"], ["Shipping & Returns", "/faq"], ["Size Guide", "/product/1"], ["Wishlist", "/wishlist"]]
};

export default function VigoFooter({ logo }) {
  return (
    <footer style={{ background: G1, borderTop: `.5px solid ${G3}`, marginTop: 0 }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,#888,#E8E8E8,${S},#E8E8E8,#888,transparent)` }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 32px 36px" }}>
        <div className="vigo-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
          {/* Brand */}
          















          
          {/* Link columns */}
          {Object.entries(cols).map(([title, links]) =>
          <div key={title}>
              <div style={{ fontSize: 8, letterSpacing: 4, textTransform: "uppercase", color: "#fff", fontWeight: 700, marginBottom: 18 }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(([l, to]) =>
              <Link key={l} to={to} style={{ fontSize: 11, color: SD, textDecoration: "none" }}>{l}</Link>
              )}
              </div>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div style={{ borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}`, padding: "28px 0", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Stay in the Drop</div>
            <div style={{ fontSize: 10, color: SD }}>Get first access to drops, offers, and NYC exclusives.</div>
          </div>
          <div style={{ display: "flex" }}>
            <input placeholder="your@email.com" style={{ background: "#111", border: `.5px solid ${G3}`, borderRight: "none", color: "#fff", padding: "11px 18px", fontSize: 11, outline: "none", width: 240, fontFamily: "inherit" }} />
            <button style={{ background: S, color: "#000", border: "none", padding: "11px 20px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>Subscribe</button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 8, color: "#2a2a2a", letterSpacing: 2 }}>© 2024 VIGONYC LLC. ALL RIGHTS RESERVED.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies", "Accessibility"].map((t) =>
            <span key={t} style={{ fontSize: 8, color: "#2a2a2a", letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>{t}</span>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.vigo-footer-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:480px){.vigo-footer-grid{grid-template-columns:1fr !important;}}
        @media(max-width:900px){footer { display: none !important; }}
      `}</style>
    </footer>);

}