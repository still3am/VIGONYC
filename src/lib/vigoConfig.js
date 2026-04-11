// Business logic configuration - centralized for easy updates
export const VIGO_CONFIG = {
  shipping: {
    freeThreshold: 150,
    standardCost: 12,
    expressCost: 12,
    overnightCost: 28,
  },
  tax: {
    nyRate: 0.0887,
  },
  promo: {
    defaultCode: "VIGONYC10",
    discountPercent: 10,
  },
  breakpoints: {
    mobile: 480,
    tablet: 600,
    desktop: 900,
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    clampMobile: "clamp(16px, 4vw, 32px)",
    clampPadding: "clamp(20px, 4vw, 32px)",
    clampGap: "clamp(12px, 3vw, 20px)",
  },
  touchTargetMin: 44,
  gridGap: 16,
};

// Date formatting utility
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Currency formatting
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Validate email
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate promo code
export function validatePromoCode(code) {
  return code.toUpperCase() === VIGO_CONFIG.promo.defaultCode;
}

// Calculate shipping cost
export function calculateShipping(subtotal) {
  return subtotal >= VIGO_CONFIG.shipping.freeThreshold ? 0 : VIGO_CONFIG.shipping.standardCost;
}

// Calculate tax
export function calculateTax(subtotal) {
  return Math.round(subtotal * VIGO_CONFIG.tax.nyRate);
}

// Calculate discount
export function calculateDiscount(subtotal, promoApplied) {
  return promoApplied ? Math.round(subtotal * (VIGO_CONFIG.promo.discountPercent / 100)) : 0;
}

// Responsive media query helper
export function getMediaQuery(breakpoint) {
  return `@media(max-width:${VIGO_CONFIG.breakpoints[breakpoint]}px)`;
}