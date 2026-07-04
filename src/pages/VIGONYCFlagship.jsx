import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
        const items = await base44.entities.WishlistItem.list('-created_date', 200);
        setWishlistItems(items || []);
        setWishlist((items || []).map(i => i.productId));
      }
    } catch (err) {}
  };

  const refreshCartCount = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const items = await base44.entities.CartItem.list('-created_date', 100);
        setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
      }
    } catch (err) {}
  };

  // Listen for optimistic cart updates from addToCart to avoid full refetches
  useEffect(() => {
    const handler = (e) => setCartCount(c => c + (e.detail?.delta || 1));
    const clearHandler = () => setCartCount(0);
    window.addEventListener("vigo:cart-update", handler);
    window.addEventListener("vigo:cart-cleared", clearHandler);
    return () => {
      window.removeEventListener("vigo:cart-update", handler);
      window.removeEventListener("vigo:cart-cleared", clearHandler);
    };
  }, []);

  useEffect(() => { refreshCartCount(); refreshWishlist(); }, []);

  // Auto-apply referral code from ?ref= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref) return;
    base44.auth.me().then(user => {
      if (!user) return;
      // Check if this referral code belongs to another user
      base44.entities.UserLoyalty.filter({ referralCode: ref }, "-created_date", 1)
        .then(async (records) => {
          const referrer = records?.[0];
          if (!referrer || referrer.userEmail === user.email) return;
          // Check if current user already has a referredBy set
          const myLoyalty = await base44.entities.UserLoyalty.filter({ userEmail: user.email }, "-created_date", 1).catch(() => []);
          const myRecord = myLoyalty?.[0];
          if (myRecord && myRecord.referredBy) return; // Already referred
          // Set referredBy on current user's loyalty record
          if (myRecord) {
            await base44.entities.UserLoyalty.update(myRecord.id, { referredBy: ref }).catch(() => {});
          }
          // Award 50 points to referrer
          const newPoints = (referrer.points || 0) + 50;
          const newTotal = (referrer.totalEarned || 0) + 50;
          const newReferrals = (referrer.totalReferrals || 0) + 1;
          const tier = newTotal >= 10000 ? "Obsidian" : newTotal >= 3000 ? "Chrome" : "Silver";
          await base44.entities.UserLoyalty.update(referrer.id, {
            points: newPoints,
            totalEarned: newTotal,
            totalReferrals: newReferrals,
            tier,
          }).catch(() => {});
          import("sonner").then(({ toast }) => toast.success("Referral code applied! Referrer earned 50 points"));
        }).catch(() => {});
    }).catch(() => {});
  }, []);

  const addToCart = async (item) => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const productId = item.productId || item.id;
        const itemQty = item.qty || 1;
        const existing = await base44.entities.CartItem.filter({ productId }, '-created_date', 10);
        const match = existing.find(i => i.size === item.size && i.color === item.color);
        if (match) {
          await base44.entities.CartItem.update(match.id, { qty: match.qty + itemQty });
        } else {
          await base44.entities.CartItem.create({
            productId,
            productName: item.productName || item.name,
            price: item.price,
            qty: itemQty,
            size: item.size || null,
            color: item.color || null,
            productImage: item.productImage || null,
          });
        }
        // Optimistic update
        window.dispatchEvent(new CustomEvent("vigo:cart-update", { detail: { delta: itemQty } }));
      }
    } catch (err) {}
    setCartOpen(true);
  };

  const toggleWishlist = async (id, productData) => {
    if (wishlist.includes(id)) {
      const record = wishlistItems.find(i => i.productId === id);
      if (record) {
        await base44.entities.WishlistItem.delete(record.id).catch(() => {});
        setWishlistItems(prev => prev.filter(i => i.productId !== id));
      }
      setWishlist(prev => prev.filter(x => x !== id));
    } else {
      try {
        const created = await base44.entities.WishlistItem.create({
          productId: id,
          productName: productData?.name || productData?.productName || "",
          productImage: productData?.images?.[0] || productData?.productImage || "",
          price: productData?.price || 0,
        });
        setWishlistItems(prev => [...prev, created]);
      } catch (e) {}
      setWishlist(prev => [...prev, id]);
    }
  };

  const handleCartClose = () => {
    setCartOpen(false);
    // Refresh exact count from DB after cart interactions (qty changes/removes)
    refreshCartCount();
  };

  // Size guide open from footer
  useEffect(() => {
    const handler = () => setSizeGuideOpen(true);
    window.addEventListener("vigo:open-size-guide", handler);
    return () => window.removeEventListener("vigo:open-size-guide", handler);
  }, []);

  const isLivePage = location.pathname === "/live";
  const isCheckoutPage = location.pathname === "/checkout";
  const ctx = { addToCart, wishlist, toggleWishlist, setSizeGuideOpen, logo: LOGO, productImg: PRODUCT_IMG, refreshCartCount };

  return (
    <div style={{ background: "var(--vt-bg)", minHeight: "100vh", fontFamily: "'Helvetica Neue',Arial,sans-serif", color: "var(--vt-text)", overflowX: "hidden" }}>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <VigoCartDrawer open={cartOpen} onClose={handleCartClose} onCheckout={() => { navigate("/checkout"); handleCartClose(); }} />
      {!isLivePage && <VigoNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} logo={LOGO} />}
      <main>
        <Outlet context={ctx} />
      </main>
      {!isLivePage && !isCheckoutPage && <VigoFooter logo={LOGO} />}
      {!isLivePage && !isCheckoutPage && <VigoBottomNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} cartOpen={cartOpen} />}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: "calc(80px + env(safe-area-inset-bottom,0px))", right: 20, zIndex: 390, width: 44, height: 44, background: "var(--vt-card)", border: ".5px solid var(--vt-border)", color: "var(--vt-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 20px rgba(0,0,0,.3)" }} title="Back to top">↑</button>
      )}
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        button, a, nav, [role="button"] { -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
        p, .vigo-selectable { user-select: text; -webkit-user-select: text; }
        *:focus-visible { outline: 1.5px solid #C0C0C0; outline-offset: 2px; }
        @supports (padding: env(safe-area-inset-bottom)) {
          .vigo-bottom-nav { padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
          .vigo-nav-top { padding-top: env(safe-area-inset-top); }
        }
      `}</style>
    </div>
  );
}