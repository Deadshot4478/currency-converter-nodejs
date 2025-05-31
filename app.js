
require('dotenv').config(); 

const express = require('express');
const path = require('path');
const { convertCurrency } = require('./currencyService'); 

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 


app.use(express.static(path.join(__dirname, 'public'))); 

// Route for the home page (displays the form)
app.get('/', (req, res) => {
    // Render the index.ejs template with no initial results or error
    res.render('index', {
        amount: '',
        fromCurrency: 'INR', // Default values
        toCurrency: 'USD',   // Default values
        result: null,
        error: null,
        themeClass: 'dark-mode' // Default theme class
    });
});

// Route for handling currency conversion POST request
app.post('/convert', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
     const currentThemeClass = 'light-mode';

    // Basic validation
    if (isNaN(parseFloat(amount)) || !fromCurrency || !toCurrency) {
        return res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: null,
            error: 'Please enter a valid amount and select both currencies.',
            themeClass: currentThemeClass
        });
    }

    try {
        const convertedAmount = await convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
        res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: `${parseFloat(amount).toFixed(2)} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`,
            error: null,
            themeClass: currentThemeClass
        });
    } catch (error) {
        console.error('Conversion error:', error.message); // Log full error for debugging
        res.render('index', {
            amount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            result: null,
            error: `Failed to convert: ${error.message}`,
            themeClass: currentThemeClass // Display a user-friendly error
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Currency Converter Web App running on http://localhost:${PORT}`);
    console.log('Open your browser and navigate to this URL.');
});