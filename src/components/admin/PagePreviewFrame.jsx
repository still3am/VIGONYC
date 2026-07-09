import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import { SettingsOverrideContext } from "@/hooks/useSiteSettings";
import VigoNav from "@/components/vigo/VigoNav";
import VigoHome from "@/components/vigo/VigoHome";
import VigoAbout from "@/components/vigo/VigoAbout";
import VigoContact from "@/components/vigo/VigoContact";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";

const PAGE_MAP = { home: VigoHome, about: VigoAbout, contact: VigoContact, global: VigoHome };

function PreviewLayout({ ctx }) {
  return <Outlet context={ctx} />;
}

export default function PagePreviewFrame({ page, settings }) {
  const PageComp = PAGE_MAP[page] || VigoHome;
  const ctx = {
    productImg: PRODUCT_IMG, wishlist: [], wishlistItems: [],
    toggleWishlist: () => {}, addToCart: () => {}, setSizeGuideOpen: () => {},
    logo: LOGO, refreshCartCount: () => {}, refreshWishlist: () => {},
  };
  return (
    <SettingsOverrideContext.Provider value={settings}>
      <div style={{ pointerEvents: "none", userSelect: "none" }}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<PreviewLayout ctx={ctx} />}>
              <Route path="*" element={<>
                <VigoNav cartCount={0} onCartOpen={() => {}} logo={LOGO} />
                <PageComp />
              </>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </div>
    </SettingsOverrideContext.Provider>
  );
}