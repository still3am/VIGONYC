import { useState, useEffect, createContext, useContext } from "react";
import { base44 } from "@/api/base44Client";

export const DEFAULTS = {
  hero_headline_1: "STREETS",
  hero_headline_2: "OF NYC",
  hero_sub: "Born in New York City. Built from concrete and culture.",
  banner_text: "SS25 Collection — Now Live",
  banner_dot: "green",
  banner_visible: "true",
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
  store_hours: "Mon – Fri: 10am – 7pm EST\nSat: 11am – 5pm EST\nSun: Closed",
  free_shipping_threshold: "150",
  hero_product_name: "Chrome V Tee — SS25",
  hero_product_units: "100 Units",
  hero_product_label: "Limited",
  crew_line_1: "Manhattan — Design & Creative",
  crew_line_2: "Brooklyn — Photography & Lookbook",
  crew_line_3: "Queens — Operations & Drops",
  about_eyebrow: "✦ Our Story",
  values_eyebrow: "✦ What We Stand For",
  values_title: "Our Values",
  values_title_1: "Quality First",
  values_desc_1: "350gsm+ fabrics, hand-finished details, zero shortcuts. Every piece passes the borough test before it drops.",
  values_title_2: "Limited Always",
  values_desc_2: "We don't restock. We don't mass produce. When it's gone — it's gone. That's the point.",
  values_title_3: "NYC Only",
  values_desc_3: "Designed in New York. Inspired by New York. For the people who actually make New York what it is.",
  about_crew_eyebrow: "✦ The Crew",
  about_crew_title: "Founded in the Five Boroughs",
  editor_hidden_sections: "[]",
  editor_hidden_fields: "[]",
};

export const SettingsOverrideContext = createContext(null);

export function useSiteSettings() {
  const override = useContext(SettingsOverrideContext);
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (override) { setLoading(false); return; }
    base44.entities.SiteSettings.list().catch(() => []).then(rows => {
      const merged = { ...DEFAULTS };
      (rows || []).forEach(r => { if (r.key) merged[r.key] = r.value; });
      setSettings(merged);
      setLoading(false);
    });
  }, [override]);
  const finalSettings = override ? { ...DEFAULTS, ...override } : settings;
  return { settings: finalSettings, loading: override ? false : loading };
}