/**
 * Strip HTML tags and dangerous characters from user input
 */
export function sanitize(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>]/g, "")    // strip remaining angle brackets
    .trim();
}

/**
 * Sanitize an object's string fields recursively
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string" ? sanitize(v) : v;
  }
  return out;
}