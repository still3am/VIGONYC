import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const S = "#C0C0C0";
const G1 = "var(--vt-bg)";
const G2 = "var(--vt-card)";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function VigoCartDrawer({ open, onClose, onCheckout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!open) return;
    const fetchCart = async () => {
      try {
        setLoading(true);
        const user = await base44.auth.me();
        if (user) {
          const cartItems = await base44.entities.CartItem.filter({ created_by: user.email }, '-created_date', 100);
          setItems(cartItems);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError(true);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [open]);

  useEffect(() => {
    if (items.length > 0 && suggestions.length === 0) {
      base44.entities.Product.filter({ featured: true }, "-created_date", 4)
        .then(data => {
          const filtered = (data || []).filter(p => !items.find(i => i.productId === p.id)).slice(0, 2);
          setSuggestions(filtered);
        }).catch(() => {});
    }
  }, [items.length]);

  const freeShippingThreshold = parseInt(settings.free_shipping_threshold || "150");
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : 12;

  const updateQty = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    await base44.entities.CartItem.update(id, { qty: newQty });
    setItems(items.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const removeFromCart = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await base44.entities.CartItem.delete(id).catch(() => {});
  };

  const handleCheckout = () => {
    onClose();
    if (onCheckout) onCheckout();
    else window.location.href = '/checkout';
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.6)", opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity .25s" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400, width: "min(100vw, 420px)", background: G1, borderLeft: `.5px solid ${G3}`, display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)", boxShadow: open ? "-20px 0 40px rgba(0,0,0,.2)" : "none" }}>
        {/* Header */}
        <div style={{ padding: "clamp(16px,3vw,24px) clamp(16px,4vw,24px)", borderBottom: `.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: G1 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--vt-text)", fontWeight: 700, marginBottom: 2 }}>Your Bag</div>
            <div style={{ fontSize: 9, color: SD, letterSpacing: 1 }}>{items.length} {items.length === 1 ? "item" : "items"}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: SD, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", transition: "color .2s" }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(12px,2vw,20px) clamp(16px,4vw,24px)" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: SD }}>
              <div style={{ fontSize: 12, color: SD }}>Loading...</div>
            </div>
          )}
          {!loading && items.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: SD }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>—</div>
              <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Bag Empty</div>
              <div style={{ fontSize: 9, color: SD, lineHeight: 1.6 }}>Add items to get started</div>
            </div>
          )}
          {!loading && items.length > 0 && items.map(item => (

            <div key={item.id} style={{ background: G2, border: `.5px solid ${G3}`, padding: "clamp(12px,2vw,16px)", marginBottom: 12, display: "flex", gap: 12 }}>
              <div style={{ width: 60, height: 60, background: G1, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `.5px solid ${G3}` }}>
                {item.productImage ? <img src={item.productImage} alt={item.productName} style={{ width: 50, objectFit: "contain" }} /> : <div style={{ fontSize: 10, color: SD }}>No image</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vt-text)", marginBottom: 2 }}>{item.productName}</div>
                    <div style={{ fontSize: 8, color: SD, letterSpacing: 0.5 }}>{item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "color .2s" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: S }}>${item.price * item.qty}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, border: `.5px solid ${G3}` }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", fontSize: 14 }}>−</button>
                    <div style={{ fontSize: 10, color: "var(--vt-text)", width: 24, textAlign: "center", borderLeft: `.5px solid ${G3}`, borderRight: `.5px solid ${G3}` }}>{item.qty}</div>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", fontSize: 14 }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && suggestions.length > 0 && (
            <div style={{ borderTop: `.5px solid ${G3}`, paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>You Might Also Like</div>
              {suggestions.map(p => (
                <div key={p.id} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: G2, flexShrink: 0, border: `.5px solid ${G3}`, overflow: "hidden" }}>
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--vt-text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: S, fontWeight: 900 }}>${p.price}</div>
                  </div>
                  <button onClick={() => { onClose(); window.location.href = `/product/${p.id}`; }} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "5px 10px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>View</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "clamp(16px,3vw,24px) clamp(16px,4vw,24px)", borderTop: `.5px solid ${G3}`, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0, background: G2 }}>
          {subtotal >= freeShippingThreshold && (
            <div style={{ fontSize: 8, letterSpacing: 1, color: "#0c6", textAlign: "center", background: "rgba(0,204,102,.08)", padding: "10px 12px", border: ".5px solid rgba(0,204,102,.25)", fontWeight: 700, textTransform: "uppercase" }}>
              ✓ Free shipping unlocked
            </div>
          )}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: SD, fontWeight: 700 }}>Subtotal</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "var(--vt-text)" }}>${subtotal.toFixed(2)}</span>
            </div>
            {shipping > 0 && <div style={{ fontSize: 8, color: SD, textAlign: "right", marginBottom: 10 }}>Shipping: +${shipping.toFixed(2)}</div>}
            {shipping === 0 && <div style={{ fontSize: 8, color: "#0c6", textAlign: "right", marginBottom: 10, fontWeight: 700 }}>FREE SHIPPING</div>}
          </div>
          <button onClick={handleCheckout} disabled={items.length === 0} style={{ background: items.length === 0 ? "#555" : S, color: items.length === 0 ? "#999" : "#000", border: "none", padding: "clamp(12px,2vw,16px)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: items.length === 0 ? "not-allowed" : "pointer", width: "100%", fontFamily: "inherit" }}>
            Checkout
          </button>
          <button onClick={onClose} style={{ background: "none", border: ".5px solid " + G3, color: SD, padding: "clamp(12px, 2vw, 16px)", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}