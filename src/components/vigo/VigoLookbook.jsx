import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useOutletContext } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";



export default function VigoLookbook() {
  const { productImg } = useOutletContext();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeCollection, setActiveCollection] = useState("All");

  useEffect(() => {
    base44.entities.LookbookEntry.list("sort_order", 100).then(data => setEntries(data || [])).catch(() => {});
    document.title = "Lookbook — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const collections = ["All", ...new Set(entries.map(e => e.collection).filter(Boolean))];
  const displayEntries = activeCollection === "All" ? entries : entries.filter(e => e.collection === activeCollection);
  const heroEntry = displayEntries.find(e => e.featured) || displayEntries[0];
  const gridEntries = displayEntries.filter(e => e !== heroEntry);

  return (
    <div>
      <div style={{ padding: "64px 32px 48px", borderBottom: `.5px solid ${G3}` }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 10 }}>✦ SS25 — Visual Archive</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 16 }}>Lookbook</h1>
        <p style={{ fontSize: 13, color: SD, maxWidth: 480, lineHeight: 1.8 }}>Streets of New York City. Shot across all five boroughs. The SS25 Chrome Series — in its element.</p>
      </div>

      <div style={{ padding: "32px 32px 0" }}>
        {collections.length > 1 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 24 }}>
            {collections.map(c => (
              <button key={c} onClick={() => setActiveCollection(c)} style={{ padding: "8px 18px", background: activeCollection === c ? S : G1, color: activeCollection === c ? "#000" : SD, border: `.5px solid ${activeCollection === c ? S : G3}`, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: activeCollection === c ? 900 : 400, fontFamily: "inherit" }}>{c}</button>
            ))}
          </div>
        )}
        {heroEntry && (
        <div style={{ position: "relative", background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, marginBottom: 2, overflow: "hidden", cursor: "pointer" }}
          onMouseEnter={() => setHovered("hero")}
          onMouseLeave={() => setHovered(null)}>
          <div style={{ position: "relative", minHeight: 400, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}`, zIndex: 2 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}`, zIndex: 2 }} />
            {heroEntry.image_url ? (
              <img src={heroEntry.image_url} alt={heroEntry.title} style={{ width: "100%", height: 400, objectFit: "cover", transform: hovered === "hero" ? "scale(1.03)" : "scale(1)", transition: "transform .6s" }} />
            ) : (
              <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: SD }}>No Image</div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", opacity: hovered === "hero" ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>{heroEntry.collection || "Collection"}</div>
                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>{heroEntry.title}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "20px 28px", borderTop: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{heroEntry.title}</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, marginTop: 4 }}>{heroEntry.subtitle || ""}</div>
            </div>
            {heroEntry.collection && <div style={{ fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>{heroEntry.collection} →</div>}
          </div>
        </div>
        )}

        <div className="vigo-lookbook-cols" style={{ columns: 3, gap: 2 }}>
          {gridEntries.map((e, i) => (
            <div key={e.id} style={{ breakInside: "avoid", marginBottom: 2, background: G1, border: `.5px solid ${G3}`, position: "relative", overflow: "hidden", cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <div style={{ paddingBottom: "100%", position: "relative" }}>
                {e.image_url ? (
                  <img src={e.image_url} alt={e.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: hovered === i ? "scale(1.05)" : "scale(1)", transition: "transform .5s" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: SD }}>No Image</div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", opacity: hovered === i ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.title}</div>
                  {e.collection && <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>{e.collection}</div>}
                </div>
              </div>
              <div style={{ padding: "14px 18px", borderTop: `.5px solid ${G3}` }}>
                <div style={{ fontSize: 11, color: "var(--vt-text)" }}>{e.title}</div>
                <div style={{ fontSize: 9, color: SD, marginTop: 3 }}>{e.subtitle}</div>
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