const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper functions for odds conversion
function calculateDecimalPayout(betAmount, odds) {
    return betAmount * odds;
}

function calculateAmericanPayout(betAmount, odds) {
    if (odds > 0) {
        return betAmount * (odds / 100) + betAmount;
    } else {
        return betAmount * (100 / Math.abs(odds)) + betAmount;
    }
}

function calculateFractionalPayout(betAmount, odds) {
    const [numerator, denominator] = odds.split('/').map(Number);
    return betAmount * (numerator / denominator) + betAmount;
}

// Endpoint for calculating payouts
app.post('/api/calculate', (req, res) => {
    try {
        const { betAmount, odds, format } = req.body;
        
        // Validate inputs
        if (!betAmount || !odds || !format) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        if (isNaN(betAmount) || betAmount <= 0) {
            return res.status(400).json({ error: 'Bet amount must be a positive number' });
        }

        let payout = 0;
        
        switch (format) {
            case 'decimal':
                const decimalOdds = parseFloat(odds);
                if (isNaN(decimalOdds) || decimalOdds <= 1) {
                    return res.status(400).json({ error: 'Decimal odds must be greater than 1.0' });
                }
                payout = calculateDecimalPayout(betAmount, decimalOdds);
                break;
                
            case 'american':
                const americanOdds = parseInt(odds);
                if (isNaN(americanOdds) || americanOdds === 0 || americanOdds === -100) {
                    return res.status(400).json({ error: 'Invalid American odds format' });
                }
                payout = calculateAmericanPayout(betAmount, americanOdds);
                break;
                
            case 'fractional': 
                if (!odds.includes('/')) {
                    return res.status(400).json({ error: 'Invalid fractional odds format' });
                }
                payout = calculateFractionalPayout(betAmount, odds);
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid odds format specified' });
        }
        
        res.json({ payout });
    } catch (error) {
        console.error('Error calculating payout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});