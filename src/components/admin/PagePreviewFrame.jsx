import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Routes, Route, Outlet } from "react-router-dom";
import { useTheme } from "next-themes";
import { SettingsOverrideContext } from "@/hooks/useSiteSettings";
import VigoNav from "@/components/vigo/VigoNav";
import VigoHome from "@/components/vigo/VigoHome";
import VigoAbout from "@/components/vigo/VigoAbout";
import VigoContact from "@/components/vigo/VigoContact";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
const PRODUCT_IMG = "https://media.base44.com/mnt/user-data/uploads/IMG_8246-removebg-preview.png";
const PAGE_MAP = { home: VigoHome, about: VigoAbout, contact: VigoContact, global: VigoHome };
const DESKTOP_W = 1280;

const PREVIEW_CSS = `
*{box-sizing:border-box;}
*::-webkit-scrollbar{display:none;}
*{-ms-overflow-style:none;scrollbar-width:none;}
html,body{margin:0;padding:0;}
body{background:var(--vt-bg);color:var(--vt-text);font-family:'Helvetica Neue',Arial,sans-serif;overscroll-behavior:none;-webkit-tap-highlight-color:transparent;}
a{color:inherit;text-decoration:none;}
button{font-family:inherit;}
img{display:block;}
.text-center{text-align:center;}
.text-black{color:#000;}
@keyframes vigo-ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.vigo-ticker-track{display:flex;white-space:nowrap;animation:vigo-ticker 30s linear infinite;}
:root{--vt-bg:#f5f5f5;--vt-card:#ebebeb;--vt-border:#d5d5d5;--vt-sub:#888888;--vt-text:#0a0a0a;--vt-nav-scrolled:rgba(248,248,248,0.92);--radius:0.5rem;}
.dark{--vt-bg:#0a0a0a;--vt-card:#111111;--vt-border:#1a1a1a;--vt-sub:#777777;--vt-text:#ffffff;--vt-nav-scrolled:rgba(8,8,8,0.92);}
`;

function PreviewLayout({ ctx }) {
  return <Outlet context={ctx} />;
}

function PreviewTree({ page, settings, ctx }) {
  const PageComp = PAGE_MAP[page] || VigoHome;
  return (
    <SettingsOverrideContext.Provider value={settings}>
      <div style={{ pointerEvents: "none", userSelect: "none" }}>
        <Routes>
          <Route element={<PreviewLayout ctx={ctx} />}>
            <Route path="*" element={<>
              <VigoNav cartCount={0} onCartOpen={() => {}} logo={LOGO} />
              <PageComp />
            </>} />
          </Route>
        </Routes>
      </div>
    </SettingsOverrideContext.Provider>
  );
}

export default function PagePreviewFrame({ page, settings, device = "desktop" }) {
  const { resolvedTheme } = useTheme();
  const iframeRef = useRef(null);
  const wrapRef = useRef(null);
  const [mode, setMode] = useState("loading");
  const [pane, setPane] = useState({ w: 0, h: 0 });
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const ctx = {
    productImg: PRODUCT_IMG, wishlist: [], wishlistItems: [],
    toggleWishlist: () => {}, addToCart: () => {}, setSizeGuideOpen: () => {},
    logo: LOGO, refreshCartCount: () => {}, refreshWishlist: () => {},
  };

  useEffect(() => {
    const update = () => setIsMobileScreen(window.innerWidth <= 1023);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setPane({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) { setMode("fallback"); return; }
    const style = doc.createElement("style");
    style.textContent = PREVIEW_CSS;
    doc.head.appendChild(style);
    doc.documentElement.className = resolvedTheme === "dark" ? "dark" : "";
    setMode("iframe");
  };

  useEffect(() => {
    const t = setTimeout(() => setMode(m => m === "loading" ? "fallback" : m), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) doc.documentElement.className = resolvedTheme === "dark" ? "dark" : "";
  }, [resolvedTheme, mode]);

  if (mode === "fallback") {
    return (
      <div style={{ height: "100%", width: "100%", overflowY: "auto", background: "var(--vt-bg)" }}>
        <PreviewTree page={page} settings={settings} ctx={ctx} />
      </div>
    );
  }

  const { w: paneW, h: paneH } = pane;
  let wrapStyle, iframeStyle;

  if (isMobileScreen) {
    wrapStyle = { position: "relative", height: "100%", width: "100%", overflow: "hidden", background: "var(--vt-bg)" };
    iframeStyle = { width: "100%", height: "100%", border: "none", background: "var(--vt-bg)" };
  } else if (device === "mobile") {
    wrapStyle = { position: "relative", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "var(--vt-card)", padding: 18, overflow: "hidden" };
    iframeStyle = { width: 390, height: paneH || "100%", flexShrink: 0, border: "none", background: "var(--vt-bg)", borderRadius: 22, boxShadow: "0 12px 50px rgba(0,0,0,.45)" };
  } else {
    const scale = paneW > 0 ? Math.min(1, paneW / DESKTOP_W) : 1;
    const ih = paneH > 0 ? Math.round(paneH / scale) : "100%";
    const left = paneW > 0 ? Math.max(0, (paneW - DESKTOP_W * scale) / 2) : 0;
    wrapStyle = { height: "100%", width: "100%", position: "relative", overflow: "hidden", background: "var(--vt-card)" };
    iframeStyle = { position: "absolute", top: 0, left, width: DESKTOP_W, height: ih, border: "none", background: "var(--vt-bg)", transform: `scale(${scale})`, transformOrigin: "top left" };
  }

  return (
    <div ref={wrapRef} style={wrapStyle}>
      <iframe ref={iframeRef} onLoad={handleLoad} title="Live Preview" style={iframeStyle} />
      {mode === "iframe" && iframeRef.current?.contentDocument?.body &&
        createPortal(<PreviewTree page={page} settings={settings} ctx={ctx} />, iframeRef.current.contentDocument.body)}
      {mode === "loading" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vt-card)" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--vt-sub)", textTransform: "uppercase" }}>Loading preview…</div>
        </div>
      )}
    </div>
  );
}