
const axios = require('axios');

// API key is now loaded from environment variables
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

/**
 * Fetches the exchange rates for a given base currency.
 * @param {string} baseCurrency 
 * @returns {object} 
 */
async function getExchangeRates(baseCurrency) {
    if (!API_KEY) {
        throw new Error("API key is not configured. Please set EXCHANGE_RATE_API_KEY in your .env file.");
    }
    try {
        const response = await axios.get(`${BASE_URL}${baseCurrency.toUpperCase()}`);
        if (response.data && response.data.result === 'success') {
            return response.data.conversion_rates;
        } else {
            const errorType = response.data.error_type || 'Unknown API Error';
            throw new Error(`Failed to fetch exchange rates: ${errorType}. Check your API key and currency codes.`);
        }
    } catch (error) {
        if (error.response) {
            console.error(`API Error - Status: ${error.response.status}, Data:`, error.response.data);
            throw new Error(`Could not fetch exchange rates from API. Status: ${error.response.status}. Message: ${error.response.data.error_type || 'Server responded with an error.'}`);
        } else if (error.request) {
            console.error('Network Error:', error.message);
            throw new Error('No response received from the currency exchange API. Check your internet connection.');
        } else {
            console.error('Error during API request setup:', error.message);
            throw new Error(`An unexpected error occurred: ${error.message}`);
        }
    }
}

/**
 * Converts an amount from one currency to another.
 * @param {number} amount - The amount to convert.
 * @param {string} fromCurrency - The 3-letter code of the source currency.
 * @param {string} toCurrency - The 3-letter code of the target currency.
 * @rewturns {number} - The converted amount.
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        return amount; // No conversion needed if currencies are the same
    }

    try {
        const rates = await getExchangeRates(fromCurrency);

        if (!rates[toCurrency.toUpperCase()]) {
            throw new Error(`Currency code '${toCurrency.toUpperCase()}' not found.`);
        }

        const convertedAmount = amount * rates[toCurrency.toUpperCase()];
        return convertedAmount;

    } catch (error) {
        // Re-throw with a more specific message if desired, or just re-throw
        throw new Error(`Conversion failed: ${error.message}`);
    }
}

// Export the functions for use in other files
module.exports = {
    convertCurrency,
    getExchangeRates // Exporting for potential future use or testing, not strictly needed for this app
};