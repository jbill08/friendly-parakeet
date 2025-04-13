import React, { useState } from 'react';
import './App.css';

function App() {
  const [betAmount, setBetAmount] = useState('');
  const [odds, setOdds] = useState('');
  const [oddsFormat, setOddsFormat] = useState('decimal'); // decimal, american, fractional
  const [calculatedPayout, setCalculatedPayout] = useState(null);
  const [error, setError] = useState('');

  const calculatePayout = async () => {
    if (!betAmount || !odds) {
        setError('Please enter both bet amount and odds');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          betAmount: parseFloat(betAmount),
          odds: odds,
          format: oddsFormat
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCalculatedPayout(data.payout);
        setError('');
      } else {
        setError(data.error || 'Error calculating payout');
      }
    } catch (err) {
        setError('Failed to connect to the server');
    }
  };

  return (
    <div className="app-container">
      <h1>Odds Calculator</h1>
      <div className="calculator-form">
        <div className="input-group">
          <label>Bet Amount:</label>
          <input 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(e.target.value)} 
            placeholder="Enter bet amount"
          />
        </div>
        
        <div className="input-group">
          <label>Odds Format:</label>
          <select value={oddsFormat} onChange={(e) => setOddsFormat(e.target.value)}>
            <option value="decimal">Decimal (e.g., 2.50)</option>
            <option value="american">American (e.g., +150, -200)</option>
            <option value="fractional">Fractional (e.g., 3/2, 1/2)</option>
          </select>
        </div>
        
        <div className="input-group">
          <label>Odds:</label>
          <input 
            type="text" 
            value={odds} 
            onChange={(e) => setOdds(e.target.value)} 
            placeholder={oddsFormat === 'decimal' ? '2.50' : 
                        oddsFormat === 'american' ? '+150 or -200' : '3/2 or 1/2'}
          />
        </div>
        
        <button onClick={calculatePayout}>Calculate Payout</button>
        
        {error && <div className="error">{error}</div>}
        
        {calculatedPayout !== null && (
          <div className="result">
            <h2>Potential Payout: ${calculatedPayout.toFixed(2)}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;