import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const DEFAULTS = {
  hero_headline_1: "STREETS",
  hero_headline_2: "OF NYC",
  hero_sub: "Born in New York City. Built from concrete and culture.",
  banner_text: "SS25 Collection — Now Live",
  about_headline: "Born From The Streets",
  about_story: "VIGONYC was founded in 2024 by creatives from all five boroughs — designers, photographers, and artists who grew up in the culture and wanted to dress it right.",
  about_mission: "Every piece we drop carries the DNA of the streets that raised us. Limited production. No compromises. NYC or nothing.",
  kpi_pieces: "500+",
  kpi_community: "12K+",
  kpi_rating: "4.9★",
  kpi_street_ready: "100%",
  kpi_founded: "2024",
  kpi_boroughs: "5",
  ticker_text: "Free shipping over $150 ✦ New drop every friday ✦ VIGONYC SS25 ✦ NYC made — limited units ✦ No restocks. Move fast. ✦ Free returns within 30 days",
  contact_email: "hello@vigonyc.com",
  contact_instagram: "@VIGONYC",
  contact_response_time: "Within 24 hours",
  free_shipping_threshold: "150",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    base44.entities.SiteSettings.list().catch(() => []).then(rows => {
      const merged = { ...DEFAULTS };
      (rows || []).forEach(r => { if (r.key) merged[r.key] = r.value; });
      setSettings(merged);
      setLoading(false);
    });
  }, []);
  return { settings, loading };
}