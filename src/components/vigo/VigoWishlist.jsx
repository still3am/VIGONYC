import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const ALL_PRODUCTS = [
  { id: 1, name: "Chrome V Tee", cat: "Tops", price: 68, tag: "new", sizes: ["S","M","L","XL"], collection: "Chrome Series" },
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms", price: 145, tag: "drop", sizes: ["S","M","L"], collection: "Archive" },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops", price: 128, tag: "new", sizes: ["M","L","XL"], collection: "Chrome Series" },
  { id: 4, name: "5-Panel Cap", cat: "Headwear", price: 52, tag: "ltd", sizes: ["One Size"], collection: "Essentials" },
  { id: 5, name: "V Jogger", cat: "Bottoms", price: 95, tag: "new", sizes: ["S","M","L","XL"], collection: "Essentials" },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd", sizes: ["S","M","L"], collection: "Chrome Series" },
];

const TAG_STYLES = {
  new:  { background: "#E8E8E8", color: "#000" },
  drop: { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
  ltd:  { background: "transparent", border: ".5px solid #C0C0C0", color: "#C0C0C0" },
  hot:  { background: "#e03", color: "#fff" },
};
const TAG_LABELS = { new: "New", drop: "Drop", ltd: "Lmt", hot: "Hot" };

export default function VigoWishlist() {
  const { wishlist, toggleWishlist, addToCart, productImg } = useOutletContext();
  const navigate = useNavigate();
  const [addedIds, setAddedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [allAddedBag, setAllAddedBag] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  const savedItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));
  const totalValue = savedItems.reduce((s, p) => s + p.price, 0);

  const handleAdd = (p) => {
    addToCart({ id: p.id, name: p.name, meta: `Size: ${selectedSizes[p.id] || "M"} · Color: Black`, price: p.price });
    setAddedIds(prev => [...prev, p.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== p.id)), 2000);
  };

  const handleAddAll = () => {
    savedItems.forEach(p => handleAdd(p));
    setAllAddedBag(true);
    setTimeout(() => setAllAddedBag(false), 2500);
  };

  return (
    <div style={{ minHeight: "70vh" }}>
      {/* Header strip */}
      <div style={{ borderBottom: `.5px solid ${G3}`, background: "linear-gradient(180deg,#0d0d0d 0%,#0a0a0a 100%)", position: "relative", overflow: "hidden" }}>
        {/* Chrome accent line */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)`, opacity: .4 }} />
        {/* Subtle grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px,5vw,48px) clamp(16px,4vw,24px) clamp(20px,4vw,32px)", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            {/* Left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 4, height: 4, background: S, transform: "rotate(45deg)" }} />
                <span style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>Saved Items</span>
                <div style={{ width: 4, height: 4, background: S, transform: "rotate(45deg)" }} />
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,56px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>Wishlist</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: savedItems.length > 0 ? "#0c6" : "#333" }} />
                  <span style={{ fontSize: 10, color: SD }}>{savedItems.length} {savedItems.length === 1 ? "item" : "items"} saved</span>
                </div>
                {savedItems.length > 0 && (
                  <div style={{ width: 1, height: 12, background: G3 }} />
                )}
                {savedItems.length > 0 && (
                  <span style={{ fontSize: 10, color: SD }}>Total value: <span style={{ color: S, fontWeight: 900 }}>${totalValue}</span></span>
                )}
              </div>
            </div>

            {/* Right */}
            {savedItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <button onClick={handleAddAll} style={{
                  background: allAddedBag ? "#0c6" : S,
                  color: "#000", border: "none",
                  padding: "14px 28px", fontSize: 9, letterSpacing: 3,
                  textTransform: "uppercase", fontWeight: 900, cursor: "pointer",
                  fontFamily: "inherit", transition: "background .3s",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {allAddedBag ? (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> All Added!</>
                  ) : (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Add All to Bag</>
                  )}
                </button>
                <div style={{ fontSize: 8, color: "#333", letterSpacing: 1 }}>No restocks guaranteed</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(20px,4vw,32px) clamp(16px,4vw,24px)" }}>

        {/* Empty state */}
        {savedItems.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#2a2a2a", marginBottom: 24 }}>♡</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Nothing saved yet</h2>
            <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, maxWidth: 320, marginBottom: 32 }}>
              Tap the ♡ on any product to save it here. Your picks wait for you.
            </p>
            <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Browse the Shop
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="vigo-wish-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,3vw,20px)" }}>
              {savedItems.map(p => {
                const isAdded = addedIds.includes(p.id);
                const isHovered = hoveredId === p.id;
                return (
                  <div
                    key={p.id}
                    style={{ background: G1, border: `.5px solid ${isHovered ? S : G3}`, transition: "border-color .2s, transform .2s", transform: isHovered ? "translateY(-3px)" : "none", display: "flex", flexDirection: "column" }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Image */}
                    <div
                      style={{ position: "relative", paddingBottom: "90%", background: "#0d0d0d", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      <img
                        src={productImg}
                        alt={p.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 16, transition: "transform .5s", transform: isHovered ? "scale(1.06)" : "scale(1)" }}
                      />

                      {/* Tag */}
                      {p.tag && (
                        <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 9px", fontSize: 7, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", ...TAG_STYLES[p.tag] }}>
                          {TAG_LABELS[p.tag]}
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }}
                        title="Remove"
                        style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.75)", border: `.5px solid rgba(192,192,192,.3)`, color: S, fontSize: 16, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", transition: "background .2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(192,192,192,.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,.75)"}
                      >♥</button>

                      {/* Collection badge */}
                      <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 7, letterSpacing: 2, color: "#444", textTransform: "uppercase", background: "rgba(0,0,0,.6)", padding: "3px 8px", backdropFilter: "blur(4px)" }}>
                        {p.collection}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "clamp(10px,2vw,16px)", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 8, color: SD, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>{p.cat}</div>

                      {/* Size selector */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 7, letterSpacing: 2, color: "#444", textTransform: "uppercase", marginBottom: 6 }}>Size</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {p.sizes.map(sz => (
                            <button
                              key={sz}
                              onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: sz }))}
                              style={{
                                padding: "4px 8px",
                                border: `.5px solid ${selectedSizes[p.id] === sz ? S : G3}`,
                                background: selectedSizes[p.id] === sz ? S : "transparent",
                                color: selectedSizes[p.id] === sz ? "#000" : SD,
                                fontSize: 8, cursor: "pointer", fontFamily: "inherit",
                                transition: "all .15s",
                              }}
                            >{sz}</button>
                          ))}
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: S }}>${p.price}</span>
                        <button
                          onClick={() => handleAdd(p)}
                          style={{
                            background: isAdded ? "#0c6" : S,
                            color: "#000", border: "none",
                            padding: "10px 18px", fontSize: 8, letterSpacing: 2,
                            textTransform: "uppercase", fontWeight: 900,
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "background .3s",
                            display: "flex", alignItems: "center", gap: 6,
                          }}
                        >
                          {isAdded ? (
                            <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Added!</>
                          ) : (
                            <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Add to Bag</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div style={{ marginTop: 40, borderTop: `.5px solid ${G3}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 11, color: SD }}>
                {savedItems.length} saved · Total <span style={{ color: S, fontWeight: 700 }}>${totalValue}</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => navigate("/shop")} style={btnGhost}>Continue Shopping</button>
                <button onClick={handleAddAll} style={{ background: allAddedBag ? "#0c6" : S, color: "#000", border: "none", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s" }}>
                  {allAddedBag ? "✓ All Added!" : "Add All to Bag"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media(max-width:900px){ .vigo-wish-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:480px){ .vigo-wish-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}

const btnGhost = { background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 24px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };