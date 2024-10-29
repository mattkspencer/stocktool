import React from 'react';
//import './App.css'; // Ensure this import is here to apply styles

const StockResults = ({ stockData }) => {
  if (!stockData || !stockData.ticker) {
    return <p>No stock data available.</p>;
  }

  return (
    <div className="stock-results">
      <h2>Results for {stockData.ticker.toUpperCase()}</h2>
      <p><span className="metric-label">Return on Equity (ROE):</span> <span className="metric-value">{stockData.roe ? stockData.roe : 'N/A'}</span></p>
      <p><span className="metric-label">Profit Margins:</span> <span className="metric-value">{stockData.profitMargins ? stockData.profitMargins : 'N/A'}</span></p>
      {/* Add other stock metrics as needed */}
    </div>
  );
};

export default StockResults;
