// src/api/stripe.js

import Stripe from 'npm:stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

/**
 * Create a payment intent.
 * @param {Object} params - Parameters for creating payment intent.
 * @returns {Promise<Object>} - The payment intent created.
 */
const createPaymentIntent = async (params) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create(params);
        return paymentIntent;
    } catch (error) {
        throw error;
    }
};

/**
 * Confirm a payment intent.
 * @param {string} paymentIntentId - ID of the payment intent to confirm.
 * @param {Object} params - Additional parameters for confirmation.
 * @returns {Promise<Object>} - The confirmed payment intent.
 */
const confirmPaymentIntent = async (paymentIntentId, params = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, params);
        return paymentIntent;
    } catch (error) {
        throw error;
    }
};

export { createPaymentIntent, confirmPaymentIntent };