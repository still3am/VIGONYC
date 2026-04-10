import { useState } from "react";
import VigoNav from "../components/vigo/VigoNav";
import VigoCartDrawer from "../components/vigo/VigoCartDrawer";
import VigoHome from "../components/vigo/VigoHome";
import VigoShop from "../components/vigo/VigoShop";
import VigoProduct from "../components/vigo/VigoProduct";
import VigoLookbook from "../components/vigo/VigoLookbook";
import VigoAbout from "../components/vigo/VigoAbout";
import VigoCheckout from "../components/vigo/VigoCheckout";
import VigoFooter from "../components/vigo/VigoFooter";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";

export { LOGO, PRODUCT_IMG };

export default function VIGONYCFlagship() {
  const [page, setPage] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Chrome V Tee", meta: "Size: M · Color: Black", price: 68, qty: 1 },
    { id: 2, name: "Silver Label Hoodie", meta: "Size: L · Color: Silver", price: 128, qty: 1 },
    { id: 3, name: "5-Panel Cap", meta: "Size: One Size · Color: Black", price: 52, qty: 1 },
  ]);

  const nav = (p) => { setPage(p); window.scrollTo(0, 0); };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#fff", overflowX: "hidden" }}>
      <VigoCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        updateQty={updateQty}
        onCheckout={() => { nav("checkout"); setCartOpen(false); }}
        productImg={PRODUCT_IMG}
      />
      <VigoNav page={page} nav={nav} cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} logo={LOGO} />
      {page === "home" && <VigoHome nav={nav} productImg={PRODUCT_IMG} />}
      {page === "shop" && <VigoShop nav={nav} productImg={PRODUCT_IMG} />}
      {page === "product" && <VigoProduct nav={nav} productImg={PRODUCT_IMG} />}
      {page === "lookbook" && <VigoLookbook nav={nav} productImg={PRODUCT_IMG} />}
      {page === "about" && <VigoAbout nav={nav} logo={LOGO} />}
      {page === "checkout" && <VigoCheckout nav={nav} items={cartItems} subtotal={subtotal} productImg={PRODUCT_IMG} />}
      <VigoFooter nav={nav} logo={LOGO} />
    </div>
  );
}