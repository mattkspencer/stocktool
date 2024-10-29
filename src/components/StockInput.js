import React, { useState } from 'react';

const StockInput = ({ onSubmit }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(ticker);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter stock ticker"
      />
      <button type="submit">Analyze</button>
    </form>
  );
};

export default StockInput;
