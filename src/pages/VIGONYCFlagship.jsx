import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import VigoNav from "../components/vigo/VigoNav";
import VigoCartDrawer from "../components/vigo/VigoCartDrawer";
import VigoBottomNav from "../components/vigo/VigoBottomNav";
import VigoFooter from "../components/vigo/VigoFooter";
import SizeGuideModal from "../components/vigo/SizeGuideModal";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
export const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";

const INITIAL_CART = [
  { id: 1, name: "Chrome V Tee", meta: "Size: M · Color: Black", price: 68, qty: 1 },
  { id: 2, name: "Silver Label Hoodie", meta: "Size: L · Color: Silver", price: 128, qty: 1 },
  { id: 3, name: "5-Panel Cap", meta: "Size: One Size · Color: Black", price: 52, qty: 1 },
];

export default function VIGONYCFlagship() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const ctx = { cartItems, addToCart, updateQty, removeFromCart, subtotal, wishlist, toggleWishlist, setSizeGuideOpen, logo: LOGO, productImg: PRODUCT_IMG };

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Helvetica Neue',Arial,sans-serif", color: "#fff", overflowX: "hidden" }}>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <VigoCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} subtotal={subtotal} updateQty={updateQty} removeFromCart={removeFromCart} onCheckout={() => { navigate("/checkout"); setCartOpen(false); }} productImg={PRODUCT_IMG} />
      <VigoNav cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} logo={LOGO} />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22, ease: "easeInOut" }}>
          <Outlet context={ctx} />
        </motion.div>
      </AnimatePresence>
      <VigoFooter logo={LOGO} />
      <VigoBottomNav />
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        button, a { -webkit-touch-callout: none; user-select: none; }
        @supports (padding: env(safe-area-inset-bottom)) {
          .vigo-bottom-nav { padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
          .vigo-nav-top { padding-top: env(safe-area-inset-top); }
        }
      `}</style>
    </div>
  );
}