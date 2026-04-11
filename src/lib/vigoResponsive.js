import { VIGO_CONFIG } from "./vigoConfig";

// Consistent media queries for the app
export const BREAKPOINTS = VIGO_CONFIG.breakpoints;

export const mediaQueries = {
  mobile: `@media(max-width:${BREAKPOINTS.mobile}px)`,
  tablet: `@media(max-width:${BREAKPOINTS.tablet}px)`,
  desktop: `@media(max-width:${BREAKPOINTS.desktop}px)`,
};

// Generate responsive grid layouts
export function createResponsiveGrid(columns = { desktop: 3, tablet: 2, mobile: 1 }) {
  return `
    ${mediaQueries.desktop} {
      grid-template-columns: repeat(${columns.tablet}, 1fr) !important;
    }
    ${mediaQueries.mobile} {
      grid-template-columns: repeat(${columns.mobile}, 1fr) !important;
    }
  `;
}

// Responsive padding helper
export const responsivePadding = "clamp(20px, 4vw, 32px)";
export const responsiveGap = "clamp(12px, 3vw, 20px)";

// Touch-friendly spacing
export const touchTargetSize = 44;

// Common responsive styles
export const responsiveStyles = {
  twoColToOne: `
    @media(max-width:${BREAKPOINTS.desktop}px) {
      .grid-2col { grid-template-columns: 1fr !important; }
    }
  `,
  fourColToTwo: `
    @media(max-width:${BREAKPOINTS.desktop}px) {
      .grid-4col { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media(max-width:${BREAKPOINTS.mobile}px) {
      .grid-4col { grid-template-columns: 1fr !important; }
    }
  `,
  hideOnMobile: `
    @media(max-width:${BREAKPOINTS.tablet}px) {
      .hide-on-mobile { display: none !important; }
    }
  `,
  showOnMobileOnly: `
    @media(min-width:${BREAKPOINTS.desktop + 1}px) {
      .show-on-mobile-only { display: none !important; }
    }
  `,
};