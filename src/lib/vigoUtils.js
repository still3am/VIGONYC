// Central export for all Vigo utilities
export * from "./vigoColors";
export * from "./vigoConfig";
export * from "./vigoValidation";
export * from "./vigoResponsive";
export { buttonStyles, formStyles, getGridColumns, gridStyles } from "./vigoStyles";

// Common patterns
export const iconSize = 18;
export const iconSizeSmall = 14;
export const iconSizeLarge = 24;

// Empty state icons
export const emptyStateIcons = {
  noOrders: "📦",
  noMessages: "💬",
  noProducts: "🛍️",
  noResults: "∅",
  error: "⚠️",
  success: "✓",
};