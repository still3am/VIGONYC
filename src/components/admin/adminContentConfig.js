export const SECTIONS = {
  home: {
    label: "Home",
    groups: [
      { title: "Top Banner", fields: [
        { key: "banner_visible", label: "Show Banner", type: "toggle" },
        { key: "banner_dot", label: "Banner Dot", type: "select", options: [
          { value: "green", label: "Green" }, { value: "red", label: "Red" }, { value: "off", label: "Off" } ] },
      ]},
      { title: "Hero", fields: [
        { key: "hero_headline_1", label: "Headline Line 1", type: "text" },
        { key: "hero_headline_2", label: "Headline Line 2", type: "text" },
        { key: "hero_sub", label: "Hero Subtitle", type: "textarea" },
        { key: "hero_product_name", label: "Hero Product Name", type: "text" },
        { key: "hero_product_label", label: "Hero Product Label", type: "text" },
        { key: "hero_product_units", label: "Hero Product Units", type: "text" },
      ]},
      { title: "Stats (KPIs)", fields: [
        { key: "kpi_pieces", label: "Pieces Dropped", type: "text" },
        { key: "kpi_community", label: "Community Size", type: "text" },
        { key: "kpi_street_ready", label: "Street Ready", type: "text" },
        { key: "kpi_rating", label: "Avg Rating", type: "text" },
      ]},
      { title: "Brand Story Teaser", fields: [
        { key: "about_headline", label: "Headline (also on About)", type: "text" },
        { key: "about_story", label: "Story (also on About)", type: "textarea" },
      ]},
      { title: "Ticker", fields: [
        { key: "ticker_text", label: "Ticker Items (separate with ✦)", type: "textarea" },
      ]},
    ],
  },
  about: {
    label: "About",
    groups: [
      { title: "Story", fields: [
        { key: "about_headline", label: "Headline (also on Home)", type: "text" },
        { key: "about_story", label: "Story (also on Home)", type: "textarea" },
        { key: "about_mission", label: "Mission Statement", type: "textarea" },
      ]},
      { title: "Stats", fields: [
        { key: "kpi_founded", label: "Founded Year", type: "text" },
        { key: "kpi_pieces", label: "Pieces Dropped", type: "text" },
        { key: "kpi_community", label: "Community Size", type: "text" },
      ]},
      { title: "The Crew", fields: [
        { key: "crew_line_1", label: "Line 1 (Borough — Role)", type: "text" },
        { key: "crew_line_2", label: "Line 2 (Borough — Role)", type: "text" },
        { key: "crew_line_3", label: "Line 3 (Borough — Role)", type: "text" },
      ]},
    ],
  },
  contact: {
    label: "Contact",
    groups: [
      { title: "Contact Info", fields: [
        { key: "contact_email", label: "Email Address", type: "text" },
        { key: "contact_instagram", label: "Instagram Handle", type: "text" },
        { key: "contact_response_time", label: "Response Time", type: "text" },
      ]},
    ],
  },
  global: {
    label: "Global",
    groups: [
      { title: "Shipping", note: "The free-shipping threshold controls the progress bar in the cart drawer.", fields: [
        { key: "free_shipping_threshold", label: "Free Shipping Over ($)", type: "number" },
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