import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addedIds, setAddedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [allAddedBag, setAllAddedBag] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        base44.entities.WishlistItem.filter({ created_by: user.email }, "-created_date", 200).then(setWishlistItems).catch(() => setWishlistItems([]));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    document.title = "Wishlist — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  const savedItems = wishlistItems;
  const totalValue = savedItems.reduce((s, p) => s + (p.price || 0), 0);

  const handleAdd = (p) => {
    addToCart({ id: p.productId, productId: p.productId, name: p.productName, productName: p.productName, size: selectedSizes[p.productId] || "M", color: "Black", productImage: p.productImage || productImg, price: p.price });
    setAddedIds(prev => [...prev, p.productId]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== p.productId)), 2000);
  };

  const handleAddAll = () => {
    savedItems.forEach(p => handleAdd(p));
    setAllAddedBag(true);
    setTimeout(() => setAllAddedBag(false), 2500);
  };

  return (
    <div style={{ minHeight: "70vh" }}>
      <div style={{ borderBottom: `.5px solid ${G3}`, background: `linear-gradient(180deg,var(--vt-card) 0%,var(--vt-bg) 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)`, opacity: .4 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(192,192,192,.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "clamp(40px,7vw,64px) clamp(16px,4vw,24px) clamp(28px,5vw,48px)", position: "relative", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: .5, background: S, opacity: .5 }} />
              <span style={{ fontSize: 8, letterSpacing: 5, color: S, textTransform: "uppercase" }}>Saved Items</span>
              <div style={{ width: 28, height: .5, background: S, opacity: .5 }} />
            </div>

            <h1 style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 900, letterSpacing: -3, lineHeight: 1, marginBottom: 16 }}>Wishlist</h1>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: savedItems.length > 0 ? 28 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: savedItems.length > 0 ? "#0c6" : G3, animation: savedItems.length > 0 ? "vigo-pulse 2s infinite" : "none" }} />
                <span style={{ fontSize: 10, color: SD }}>{savedItems.length} {savedItems.length === 1 ? "item" : "items"} saved</span>
              </div>
              {savedItems.length > 0 && (
                <>
                  <div style={{ width: 1, height: 12, background: G3 }} />
                  <span style={{ fontSize: 10, color: SD }}>Est. total: <span style={{ color: S, fontWeight: 900 }}>${totalValue.toFixed(2)}</span></span>
                </>
              )}
            </div>

            {savedItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <button onClick={handleAddAll} style={{ background: allAddedBag ? "#0c6" : S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {allAddedBag ? (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> All Added!</>
                  ) : (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Add All to Bag</>
                  )}
                </button>
                <div style={{ fontSize: 8, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>No restocks · Move fast</div>
              </div>
            )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(20px,4vw,32px) clamp(16px,4vw,24px)" }}>
        {savedItems.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `.5px solid ${G3}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: SD, marginBottom: 24 }}>♡</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Nothing saved yet</h2>
            <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, maxWidth: 320, marginBottom: 32 }}>
              Tap the ♡ on any product to save it here. Your picks wait for you.
            </p>
            <button onClick={() => navigate("/shop")} style={{ background: S, color: "#000", border: "none", padding: "14px 36px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              Browse the Shop
            </button>
          </div>
        ) : (
          <div className="vigo-wish-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,3vw,20px)" }}>
            {savedItems.map(p => {
              const pid = p.productId;
              const isAdded = addedIds.includes(pid);
              const isHovered = hoveredId === p.id;
              return (
                <div
                  key={p.id}
                  style={{ background: G1, border: `.5px solid ${isHovered ? S : G3}`, transition: "border-color .2s, transform .2s", transform: isHovered ? "translateY(-3px)" : "none", display: "flex", flexDirection: "column" }}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    style={{ position: "relative", paddingBottom: "90%", background: G2, cursor: "pointer", overflow: "hidden", flexShrink: 0 }}
                    onClick={() => navigate(`/product/${pid}`)}
                  >
                    <img
                       src={p.productImage || productImg}
                       alt={p.productName}
                       loading="lazy"
                       style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 16, transition: "transform .5s", transform: isHovered ? "scale(1.06)" : "scale(1)" }}
                     />

                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(pid); }}
                      title="Remove"
                      style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.55)", border: `.5px solid rgba(192,192,192,.3)`, color: S, fontSize: 16, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
                    >♥</button>
                  </div>

                  <div style={{ padding: "clamp(10px,2vw,16px)", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{p.productName}</div>
                    <button onClick={() => navigate(`/product/${pid}`)} style={{ background: "none", border: "none", color: SD, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", padding: "4px 0", textDecoration: "underline" }}>
                      View Product →
                    </button>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: S }}>${p.price}</span>
                      <button
                        onClick={() => handleAdd(p)}
                        style={{ background: isAdded ? "#0c6" : S, color: "#000", border: "none", padding: "10px 18px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "background .3s", display: "flex", alignItems: "center", gap: 6 }}
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
        )}
      </div>

      <style>{`
        @keyframes vigo-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
        @media(max-width:900px){ .vigo-wish-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:480px){ .vigo-wish-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}