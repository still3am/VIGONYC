const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const cols = {
  Shop: ["New Arrivals","Tops","Bottoms","Outerwear","Headwear","Accessories"],
  Info: ["About","Lookbook","Careers","Press"],
  Support: ["Size Guide","Shipping","Returns","FAQ","Contact"],
};

export default function VigoFooter({ nav, logo }) {
  return (
    <footer style={{ background: G1, borderTop: `.5px solid ${G3}`, marginTop: 0 }}>
      {/* Silver bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,#888,#E8E8E8,${S},#E8E8E8,#888,transparent)` }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "64px 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="vigo-footer-grid">
          {/* Brand */}
          <div>
            <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: 0 }}>
              <img src={logo} alt="VIGONYC" style={{ width: 48, height: 48, objectFit: "contain" }} />
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4, color: "#fff", textTransform: "uppercase" }}>VIGO<span style={{ color: S }}>NYC</span></div>
                <div style={{ fontSize: 7, letterSpacing: 4, color: SD, textTransform: "uppercase", marginTop: 2 }}>New York City</div>
              </div>
            </button>
            <p style={{ fontSize: 12, color: "#555", lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
              Luxury streetwear born from the five boroughs. Built for the ones who move with purpose.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["IG","TW","TK"].map(s => (
                <button key={s} style={{ width: 36, height: 36, background: "none", border: `.5px solid ${G3}`, color: SD, fontSize: 9, letterSpacing: 1, cursor: "pointer" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#fff", fontWeight: 700, marginBottom: 20 }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(l => (
                  <button key={l} onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 11, color: SD, padding: 0 }}>{l}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ borderTop: `.5px solid ${G3}`, borderBottom: `.5px solid ${G3}`, padding: "32px 0", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Stay in the Drop</div>
            <div style={{ fontSize: 11, color: SD }}>Get first access to drops, offers, and NYC exclusives.</div>
          </div>
          <div style={{ display: "flex" }}>
            <input placeholder="your@email.com" style={{ background: "#111", border: `.5px solid ${G3}`, borderRight: "none", color: "#fff", padding: "12px 20px", fontSize: 12, outline: "none", width: 260 }} />
            <button style={{ background: S, color: "#000", border: "none", padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" }}>Subscribe</button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>© 2024 VIGONYC LLC. ALL RIGHTS RESERVED.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy","Terms","Cookies","Accessibility"].map(t => (
              <button key={t} style={{ background: "none", border: "none", fontSize: 9, color: "#333", letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.vigo-footer-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:500px){.vigo-footer-grid{grid-template-columns:1fr !important;}}`}</style>
    </footer>
  );
}