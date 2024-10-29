import React from 'react';
import PropTypes from 'prop-types';

const calculateSMA = (data, period) => {
  const prices = Object.values(data['Time Series (5min)'])
    .map(values => parseFloat(values['4. close']))
    .reverse();

  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma[sma.length - 1].toFixed(2);
};

const calculateRSI = (data, period = 14) => {
  const prices = Object.values(data['Time Series (5min)'])
    .map(values => parseFloat(values['4. close']))
    .reverse();

  let gains = [];
  let losses = [];

  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    gains.push(difference > 0 ? difference : 0);
    losses.push(difference < 0 ? Math.abs(difference) : 0);
  }

  const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi.toFixed(2);
};

const TechnicalIndicators = ({ data }) => {
  if (!data || !data['Time Series (5min)']) return null;

  const sma20 = calculateSMA(data, 20);
  const rsi = calculateRSI(data);

  return (
    <div className="technical-indicators">
      <h3>Technical Indicators</h3>
      <div className="indicators-grid">
        <div className="indicator-card">
          <h4>SMA (20)</h4>
          <div className="indicator-value">${sma20}</div>
        </div>
        <div className="indicator-card">
          <h4>RSI (14)</h4>
          <div className="indicator-value">{rsi}</div>
        </div>
      </div>
    </div>
  );
};

TechnicalIndicators.propTypes = {
  data: PropTypes.shape({
    'Time Series (5min)': PropTypes.objectOf(
      PropTypes.shape({
        '1. open': PropTypes.string.isRequired,
        '2. high': PropTypes.string.isRequired,
        '3. low': PropTypes.string.isRequired,
        '4. close': PropTypes.string.isRequired,
        '5. volume': PropTypes.string.isRequired,
      })
    ),
  }),
};

TechnicalIndicators.defaultProps = {
  data: null,
};

export default TechnicalIndicators;
