import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate, useOutletContext } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

export default function VigoLookbook() {
  const { productImg } = useOutletContext();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const { data: shots = [] } = useQuery({
    queryKey: ['lookbookItems'],
    queryFn: async () => {
      try {
        return await base44.entities.LookbookItem.list('-created_date', 100);
      } catch {
        return [];
      }
    },
  });

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "64px 32px 48px", borderBottom: `.5px solid ${G3}` }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ SS25 — Visual Archive</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>Lookbook</h1>
        <p style={{ fontSize: 13, color: SD, maxWidth: 480, lineHeight: 1.8 }}>Streets of New York City. Shot across all five boroughs. The SS25 Chrome Series — in its element.</p>
      </div>

      {/* Editorial grid */}
      <div style={{ padding: "32px 32px 0" }}>
        {/* Hero editorial shot */}
        <div style={{ position: "relative", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, marginBottom: 2, overflow: "hidden", cursor: "pointer" }}
          onClick={() => navigate("/product/1")}
          onMouseEnter={() => setHovered("hero")}
          onMouseLeave={() => setHovered(null)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}` }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}` }} />
            <img src={productImg} alt="SS25 Hero" style={{ height: 340, objectFit: "contain", filter: "drop-shadow(0 0 80px rgba(192,192,192,.2))", transform: hovered === "hero" ? "scale(1.03)" : "scale(1)", transition: "transform .6s" }} />
          </div>
          {/* Hover overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", opacity: hovered === "hero" ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>SS25 Chrome Series</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Chrome V Tee</div>
              <div style={{ fontSize: 20, color: S, fontWeight: 900, marginBottom: 20 }}>$68</div>
              <button style={{ background: S, color: "#000", border: "none", padding: "12px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Shop the Look</button>
            </div>
          </div>
          <div style={{ padding: "20px 28px", borderTop: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>SS25 Editorial — Chrome Series</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, marginTop: 4 }}>VIGONYC × NYC Streets</div>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Full Collection →</div>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="vigo-lookbook-cols" style={{ columns: 3, gap: 2 }}>
          {shots.map((s, i) => (
            <div key={i} style={{ breakInside: "avoid", marginBottom: 2, background: G1, border: `.5px solid ${G3}`, position: "relative", overflow: "hidden", cursor: "pointer" }}
              onClick={() => navigate(`/product/${s.id}`)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <div style={{ paddingBottom: s.tall ? "130%" : "80%", position: "relative" }}>
                <img src={productImg} alt={s.caption} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: s.opacity, padding: 24, transform: hovered === i ? "scale(1.05)" : "scale(1)", transition: "transform .5s" }} />
                {/* Hover reveal */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", opacity: hovered === i ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s.caption}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: S }}>{s.price}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Tap to shop</div>
                </div>
              </div>
              <div style={{ padding: "14px 18px", borderTop: `.5px solid ${G3}` }}>
                <div style={{ fontSize: 11, color: "#ccc" }}>{s.caption}</div>
                <div style={{ fontSize: 9, color: SD, marginTop: 3 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "52px 32px 64px" }}>
        <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "18px 56px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          Shop the Full Collection
        </button>
      </div>

      <style>{`@media(max-width:900px){.vigo-lookbook-cols{columns:2 !important;}} @media(max-width:480px){.vigo-lookbook-cols{columns:1 !important;}}`}</style>
    </div>
  );
}