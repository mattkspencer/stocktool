import React from 'react';
import PropTypes from 'prop-types';

const StockCard = ({ title, value, previousValue }) => {
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : null;
  const isPositive = change > 0;

  return (
    <div className="stock-card">
      <h4>{title}</h4>
      <div className="stock-value">${value}</div>
      {change && (
        <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

StockCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  previousValue: PropTypes.string,
};

export default StockCard;
