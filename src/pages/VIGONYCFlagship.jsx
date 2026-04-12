import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import VigoNav from "../components/vigo/VigoNav";
import VigoCartDrawer from "../components/vigo/VigoCartDrawer";
import VigoBottomNav from "../components/vigo/VigoBottomNav";
import VigoFooter from "../components/vigo/VigoFooter";
import SizeGuideModal from "../components/vigo/SizeGuideModal";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
export const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";



export default function VIGONYCFlagship() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Derive cartCount from local state — no separate DB call needed
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const TAB_ROOTS = ["/", "/shop", "/drops", "/wishlist", "/account"];
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    const isTabSwitch = TAB_ROOTS.includes(location.pathname) && TAB_ROOTS.includes(prevPath.current) && prevPath.current !== location.pathname;
    if (!isTabSwitch) window.scrollTo(0, 0);
    prevPath.current = location.pathname;
  }, [location.pathname]);

  // Load cart from DB on mount
  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        base44.entities.CartItem.filter({ created_by: user.email }, '-created_date', 100)
          .then(items => setCartItems(items || []))
          .catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const addToCart = async (item) => {
    const user = await base44.auth.me().catch(() => null);
    if (!user) { setCartOpen(true); return; }
    const productId = item.productId || item.id;
    // Optimistic update
    const match = cartItems.find(i => i.productId === productId && i.size === item.size && i.color === item.color);
    if (match) {
      setCartItems(prev => prev.map(i => i.id === match.id ? { ...i, qty: i.qty + 1 } : i));
      base44.entities.CartItem.update(match.id, { qty: match.qty + 1 }).catch(() => {});
    } else {
      const newItem = { productId, productName: item.productName || item.name, price: item.price, qty: 1, size: item.size || null, color: item.color || null, productImage: item.productImage || null };
      const created = await base44.entities.CartItem.create(newItem).catch(() => null);
      if (created) setCartItems(prev => [...prev, created]);
    }
    setCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    const item = cartItems.find(i => i.id === id);
    if (item) base44.entities.CartItem.update(id, { qty: Math.max(1, item.qty + delta) }).catch(() => {});
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    base44.entities.CartItem.delete(id).catch(() => {});
  };

  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCartClose = () => setCartOpen(false);

  const ctx = { addToCart, wishlist, toggleWishlist, setSizeGuideOpen, logo: LOGO, productImg: PRODUCT_IMG };

  return (
    <div style={{ background: "var(--vt-bg)", minHeight: "100vh", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: "var(--vt-text)", overflowX: "hidden" }}>
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }} onFocus={e => e.target.style.left = "16px"}>Skip to main content</a>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <VigoCartDrawer open={cartOpen} onClose={handleCartClose} items={cartItems} updateQty={updateCartQty} removeFromCart={removeFromCart} onCheckout={() => { navigate("/checkout"); handleCartClose(); }} />
      <VigoNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} logo={LOGO} />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22, ease: "easeInOut" }}>
          <Outlet context={ctx} />
        </motion.div>
      </AnimatePresence>
      <VigoFooter logo={LOGO} />
      <VigoBottomNav />
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        button, a, nav, [role="button"] { -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
        p, .vigo-selectable { user-select: text; -webkit-user-select: text; }
        @supports (padding: env(safe-area-inset-bottom)) {
          .vigo-bottom-nav { padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
          .vigo-nav-top { padding-top: env(safe-area-inset-top); }
        }
      `}</style>
    </div>
  );
}