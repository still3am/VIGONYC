import { useState, useEffect } from "react";

const DEFAULTS = {
  heroBadge: "SS25 Collection — Now Live",
  heroHeadline: "STREETS\nOF NYC",
  heroCopy: "Born in New York City. Built from concrete and culture. Worn by the ones who make the city move.",
  heroCtaPrimary: "Shop the Drop",
  heroCtaSecondary: "View Lookbook",
  announcementText: "Drop 02 — Mirror Series launching soon",
  bannerItems: ["Free shipping over $150", "New drop every friday", "VIGONYC SS25", "NYC made — limited units", "No restocks. Move fast.", "Free returns within 30 days"],
  chromeBannerTitle: "SS25 Chrome Series",
  chromeBannerDesc: "Hand-finished chrome hardware. NYC exclusive. Only 100 units. No restocks, no exceptions.",
  brandStory: "VIGONYC is more than clothing — it's a declaration. Every thread carries the energy of the streets that built us.",
  instagramHandle: "@vigonyc",
  twitterHandle: "@vigonyc",
  tiktokHandle: "@vigonyc",
  emailContact: "hello@vigonyc.com",
  pressEmail: "press@vigonyc.com",
  phoneContact: "+1 (212) 000-0000",
  accentColor: "#C0C0C0",
  footerTagline: "Luxury streetwear born from the five boroughs. Built for the ones who move with purpose.",
  products: [
    { id: 1, name: "Chrome V Tee", cat: "Tops / Essential", price: 68, tag: "new", visible: true, opacity: 1, sizes: ["XS","S","M","L","XL"], colors: ["Black","White"], collection: "Essentials" },
    { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", visible: true, opacity: 1, sizes: ["28","30","32","34","36"], colors: ["Black","Graphite"], collection: "Chrome Series" },
    { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", visible: true, opacity: 1, sizes: ["XS","S","M","L","XL","XXL"], colors: ["Black","Silver","White"], collection: "Chrome Series" },
    { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", visible: true, opacity: 1, sizes: ["One Size"], colors: ["Black","White","Silver"], collection: "Essentials" },
    { id: 5, name: "V Jogger", cat: "Bottoms / Comfort", price: 95, tag: "new", visible: true, opacity: 1, sizes: ["XS","S","M","L","XL"], colors: ["Black","Graphite"], collection: "Essentials" },
    { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd", visible: true, opacity: 1, sizes: ["S","M","L","XL","XXL"], colors: ["Black","Silver"], collection: "Chrome Series" },
    { id: 7, name: "NYC Tote", cat: "Accessories", price: 38, tag: null, visible: true, opacity: 1, sizes: ["One Size"], colors: ["Black","White"], collection: "Essentials" },
    { id: 8, name: "VIGO Socks 3-Pack", cat: "Accessories", price: 28, tag: "new", visible: true, opacity: 1, sizes: ["One Size"], colors: ["Black","White","Silver"], collection: "Essentials" },
  ],
};

const STORAGE_KEY = "vigo_site_settings";

export function useVigoSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateProduct = (id, field, value) => {
    setSettings(prev => {
      const products = prev.products.map(p => p.id === id ? { ...p, [field]: field === "price" ? Number(value) : value } : p);
      const next = { ...prev, products };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULTS);
  };

  return { settings, updateSetting, updateProduct, resetAll, DEFAULTS };
}

export function getSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}