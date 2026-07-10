export const SECTIONS = {
  home: {
    label: "Home",
    desc: "The storefront landing page — hero, banner, stats, brand teaser and ticker.",
    groups: [
      { id: "top_banner", title: "Top Banner", deletable: true, fields: [
        { key: "banner_visible", label: "Show Banner", type: "toggle" },
        { key: "banner_dot", label: "Banner Dot", type: "select", options: [
          { value: "green", label: "Green" }, { value: "red", label: "Red" }, { value: "off", label: "Off" } ] },
      ]},
      { id: "hero", title: "Hero", deletable: false, fields: [
        { key: "hero_headline_1", label: "Headline Line 1", type: "text" },
        { key: "hero_headline_2", label: "Headline Line 2", type: "text" },
        { key: "hero_sub", label: "Hero Subtitle", type: "textarea" },
      ]},
      { id: "hero_product", title: "Hero Product", deletable: true, fields: [
        { key: "hero_product_name", label: "Hero Product Name", type: "text" },
        { key: "hero_product_label", label: "Hero Product Label", type: "text" },
        { key: "hero_product_units", label: "Hero Product Units", type: "text" },
      ]},
      { id: "stats", title: "Stats (KPIs)", deletable: true, fields: [
        { key: "kpi_pieces", label: "Pieces Dropped", type: "text", deletable: true },
        { key: "kpi_community", label: "Community Size", type: "text", deletable: true },
        { key: "kpi_street_ready", label: "Street Ready", type: "text", deletable: true },
        { key: "kpi_rating", label: "Avg Rating", type: "text", deletable: true },
      ]},
      { id: "brand_story", title: "Brand Story Teaser", deletable: true, fields: [
        { key: "about_headline", label: "Headline (also on About)", type: "text" },
        { key: "about_story", label: "Story (also on About)", type: "textarea" },
      ]},
      { id: "ticker", title: "Ticker", deletable: true, fields: [
        { key: "ticker_text", label: "Ticker Items (separate with ✦)", type: "textarea" },
      ]},
    ],
  },
  about: {
    label: "About",
    desc: "The brand story page — story, values, stats and the crew behind VIGONYC.",
    groups: [
      { id: "about_story", title: "Story", deletable: false, fields: [
        { key: "about_eyebrow", label: "Hero Eyebrow", type: "text" },
        { key: "about_headline", label: "Headline (also on Home)", type: "text" },
        { key: "about_story", label: "Story (also on Home)", type: "textarea" },
        { key: "about_mission", label: "Mission Statement", type: "textarea" },
      ]},
      { id: "about_values", title: "Values", deletable: true, fields: [
        { key: "values_eyebrow", label: "Section Eyebrow", type: "text" },
        { key: "values_title", label: "Section Heading", type: "text" },
        { key: "values_title_1", label: "Value 1 Title", type: "text" },
        { key: "values_desc_1", label: "Value 1 Description", type: "textarea" },
        { key: "values_title_2", label: "Value 2 Title", type: "text" },
        { key: "values_desc_2", label: "Value 2 Description", type: "textarea" },
        { key: "values_title_3", label: "Value 3 Title", type: "text" },
        { key: "values_desc_3", label: "Value 3 Description", type: "textarea" },
      ]},
      { id: "about_stats", title: "Stats", deletable: true, fields: [
        { key: "kpi_founded", label: "Founded Year", type: "text", deletable: true },
        { key: "kpi_pieces", label: "Pieces Dropped", type: "text", deletable: true },
        { key: "kpi_community", label: "Community Size", type: "text", deletable: true },
      ]},
      { id: "about_crew", title: "The Crew", deletable: true, fields: [
        { key: "about_crew_eyebrow", label: "Section Eyebrow", type: "text" },
        { key: "about_crew_title", label: "Section Heading", type: "text" },
        { key: "crew_line_1", label: "Line 1 (Borough — Role)", type: "text" },
        { key: "crew_line_2", label: "Line 2 (Borough — Role)", type: "text" },
        { key: "crew_line_3", label: "Line 3 (Borough — Role)", type: "text" },
      ]},
    ],
  },
  contact: {
    label: "Contact",
    desc: "How customers reach you — email, socials, response time and store hours.",
    groups: [
      { id: "contact_info", title: "Contact Info", deletable: false, fields: [
        { key: "contact_email", label: "Email Address", type: "text" },
        { key: "contact_instagram", label: "Instagram Handle", type: "text" },
        { key: "contact_response_time", label: "Response Time", type: "text" },
        { key: "store_hours", label: "Store Hours (one per line)", type: "textarea", rows: 4 },
      ]},
    ],
  },
  global: {
    label: "Global",
    desc: "Store-wide settings — shipping threshold and the site launch mode.",
    groups: [
      { id: "shipping", title: "Shipping", deletable: false, note: "The free-shipping threshold controls the progress bar in the cart drawer.", fields: [
        { key: "free_shipping_threshold", label: "Free Shipping Over ($)", type: "number" },
      ]},
      { id: "site_mode", title: "Site Mode", deletable: false, note: "Turning Coming Soon ON hides the storefront from everyone except admins — use for pre-launch or maintenance.", fields: [
        { key: "coming_soon_active", label: "Coming Soon Mode", type: "toggle" },
      ]},
    ],
  },
};

export const PAGE_FOR_SECTION = { home: "home", about: "about", contact: "contact", global: "home" };

export const SECTION_OF_KEY = (() => {
  const map = {};
  Object.entries(SECTIONS).forEach(([page, def]) => {
    def.groups.forEach(g => g.fields.forEach(f => { map[f.key] = page; }));
  });
  return map;
})();