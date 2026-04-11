import { useState, useEffect } from "react";

// TODO: Fetch these settings from Base44 settings entity or admin config
const DEFAULTS = {
  heroBadge: "",
  heroHeadline: "",
  heroCopy: "",
  heroCtaPrimary: "",
  heroCtaSecondary: "",
  announcementText: "",
  bannerItems: [],
  chromeBannerTitle: "",
  chromeBannerDesc: "",
  brandStory: "",
  instagramHandle: "",
  twitterHandle: "",
  tiktokHandle: "",
  emailContact: "",
  pressEmail: "",
  phoneContact: "",
  accentColor: "#C0C0C0",
  footerTagline: "",
  products: [], // TODO: Fetch from Base44 Product entity
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