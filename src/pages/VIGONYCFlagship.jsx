import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import VigoNav from "../components/vigo/VigoNav";
import VigoCartDrawer from "../components/vigo/VigoCartDrawer";
import VigoBottomNav from "../components/vigo/VigoBottomNav";
import VigoFooter from "../components/vigo/VigoFooter";
import SizeGuideModal from "../components/vigo/SizeGuideModal";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
export const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";



export default function VIGONYCFlagship() {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  const TAB_ROOTS = ["/", "/shop", "/drops", "/wishlist", "/account"];
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    const isTabSwitch = TAB_ROOTS.includes(location.pathname) && TAB_ROOTS.includes(prevPath.current) && prevPath.current !== location.pathname;
    if (!isTabSwitch) window.scrollTo(0, 0);
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const refreshWishlist = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const items = await base44.entities.WishlistItem.filter({ created_by: user.email }, '-created_date', 200);
        setWishlistItems(items || []);
        setWishlist((items || []).map(i => i.productId));
      }
    } catch (err) {}
  };

  const refreshCartCount = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const items = await base44.entities.CartItem.filter({ created_by: user.email }, '-created_date', 100);
        setCartCount(items.length);
      }
    } catch (err) {}
  };

  useEffect(() => { refreshCartCount(); refreshWishlist(); }, []);

  const addToCart = async (item) => {
    try {
      const user = await base44.auth.me();
      if (user) {
        // Optimistic update
        setCartCount(prev => prev + 1);
        setCartOpen(true);

        const productId = item.productId || item.id;
        const existing = await base44.entities.CartItem.filter({ created_by: user.email, productId }, '-created_date', 10);
        const match = existing.find(i => i.size === item.size && i.color === item.color);
        if (match) {
          await base44.entities.CartItem.update(match.id, { qty: match.qty + 1 });
        } else {
          await base44.entities.CartItem.create({
            productId,
            productName: item.productName || item.name,
            price: item.price,
            qty: 1,
            size: item.size || null,
            color: item.color || null,
            productImage: item.productImage || null,
          });
        }
        await refreshCartCount();
      }
    } catch (err) {
      setCartCount(prev => Math.max(0, prev - 1));
    }
  };

  const toggleWishlist = async (id, productData) => {
    if (wishlist.includes(id)) {
      // Optimistic removal
      setWishlist(prev => prev.filter(x => x !== id));
      const record = wishlistItems.find(i => i.productId === id);
      if (record) {
        try {
          await base44.entities.WishlistItem.delete(record.id);
          setWishlistItems(prev => prev.filter(i => i.productId !== id));
        } catch {
          setWishlist(prev => [...prev, id]);
        }
      }
    } else {
      // Optimistic addition
      setWishlist(prev => [...prev, id]);
      try {
        const created = await base44.entities.WishlistItem.create({
          productId: id,
          productName: productData?.name || productData?.productName || "",
          productImage: productData?.images?.[0] || productData?.productImage || "",
          price: productData?.price || 0,
        });
        setWishlistItems(prev => [...prev, created]);
      } catch (e) {
        setWishlist(prev => prev.filter(x => x !== id));
      }
    }
  };

  const handleCartClose = () => {
    setCartOpen(false);
    refreshCartCount();
  };

  const ctx = { addToCart, wishlist, toggleWishlist, setSizeGuideOpen, logo: LOGO, productImg: PRODUCT_IMG };

  return (
    <div style={{ background: "var(--vt-bg)", minHeight: "100vh", fontFamily: "'Helvetica Neue',Arial,sans-serif", color: "var(--vt-text)", overflowX: "hidden" }}>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <VigoCartDrawer open={cartOpen} onClose={handleCartClose} onCheckout={() => { navigate("/checkout"); handleCartClose(); }} />
      <VigoNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} logo={LOGO} />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.3 }}>
          <Outlet context={ctx} />
        </motion.div>
      </AnimatePresence>
      <VigoFooter logo={LOGO} />
      <VigoBottomNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: "calc(80px + env(safe-area-inset-bottom,0px))", right: 20, zIndex: 250, width: 44, height: 44, background: "var(--vt-card)", border: ".5px solid var(--vt-border)", color: "var(--vt-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 20px rgba(0,0,0,.3)" }} title="Back to top">↑</button>
      )}
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