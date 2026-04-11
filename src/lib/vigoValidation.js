// Centralized validation service
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Validate cart items against inventory
export function validateCartInventory(cartItems, products) {
  const errors = [];
  
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      errors.push(`Product ${item.name} no longer available`);
      return;
    }
    if (item.qty > product.stock) {
      errors.push(`Only ${product.stock} ${item.name} left in stock (requested ${item.qty})`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Validate size/color combo availability
export function validateProductVariant(product, size, color) {
  if (!product.sizes?.includes(size)) {
    return { valid: false, error: `Size ${size} not available` };
  }
  if (!product.colors?.includes(color)) {
    return { valid: false, error: `Color ${color} not available` };
  }
  return { valid: true };
}

// Validate order minimum
export function validateOrderMinimum(subtotal, minimumOrder = 0) {
  if (subtotal < minimumOrder) {
    return { valid: false, error: `Minimum order is $${minimumOrder}` };
  }
  return { valid: true };
}

// Validate shipping address
export function validateShippingAddress(address) {
  const required = ["address", "city", "state", "zip"];
  const missing = required.filter((field) => !address[field]?.trim());

  if (missing.length > 0) {
    return { valid: false, error: `Missing fields: ${missing.join(", ")}` };
  }
  return { valid: true };
}

// Validate personal info
export function validatePersonalInfo(info) {
  const required = ["firstName", "lastName", "email", "phone"];
  const missing = required.filter((field) => !info[field]?.trim());

  if (missing.length > 0) {
    return { valid: false, error: `Missing fields: ${missing.join(", ")}` };
  }
  return { valid: true };
}