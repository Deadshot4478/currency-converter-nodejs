// app.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const path = require('path');
const { convertCurrency } = require('./currencyService'); // Import our conversion logic

const app = express();
const PORT = process.env.PORT || 3000; // Use port from environment or default to 3000

// Middleware Setup
app.use(express.urlencoded({ extended: true })); // To parse form data (body-parser is included in Express now)
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Specify where EJS templates are located

// Serve static files (like CSS, JS if you add them later)
app.use(express.static(path.join(__dirname, 'public'))); // Uncomment if you create a 'public' folder for CSS/JS

// Route for the home page (displays the form)
app.get('/', (req, res) => {
    // Render the index.ejs template with no initial results or error
    res.render('index', {
        amount: '',
        fromCurrency: 'USD', // Default values
        toCurrency: 'EUR',   // Default values
        result: null,
        error: null
    });
});

// Route for handling currency conversion POST request
app.post('/convert', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;

    // Basic validation
    if (isNaN(parseFloat(amount)) || !fromCurrency || !toCurrency) {
        return res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: null,
            error: 'Please enter a valid amount and select both currencies.'
        });
    }

    try {
        const convertedAmount = await convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
        res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: `${parseFloat(amount).toFixed(2)} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`,
            error: null
        });
    } catch (error) {
        console.error('Conversion error:', error.message); // Log full error for debugging
        res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: null,
            error: `Failed to convert: ${error.message}` // Display a user-friendly error
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Currency Converter Web App running on http://localhost:${PORT}`);
    console.log('Open your browser and navigate to this URL.');
});