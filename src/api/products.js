// src/api/products.js

/**
 * Fetches all products.
 * @returns {Promise<Array>} A promise that resolves to a list of products.
 */
export const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

/**
 * Fetches details of a specific product by ID.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves to the product details.
 */
export const fetchProductDetails = async (productId) => {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch product details for ID ${productId}`);
    }
    return response.json();
};

/**
 * Manages product data (add, update, delete).
 * @param {string} action - The action to perform ('add', 'update', 'delete').
 * @param {Object} productData - The product data to manage.
 * @returns {Promise<Object>} A promise that resolves to the result of the action.
 */
export const manageProductData = async (action, productData) => {
    const response = await fetch(`/api/products`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: action !== 'delete' ? JSON.stringify(productData) : null,
    });
    if (!response.ok) {
        throw new Error(`Failed to ${action} product`);
    }
    return response.json();
};
