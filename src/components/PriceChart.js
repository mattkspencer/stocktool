import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {
  const { isDarkMode } = useTheme();
  
  if (!data || !data['Time Series (5min)']) return null;

  const timeSeriesData = data['Time Series (5min)'];
  const times = Object.keys(timeSeriesData).slice(0, 50).reverse();
  const prices = times.map(time => parseFloat(timeSeriesData[time]['4. close']));
  
  // Calculate price change
  const startPrice = prices[0];
  const endPrice = prices[prices.length - 1];
  const priceChange = endPrice - startPrice;
  const isPositive = priceChange >= 0;

  const chartData = {
    labels: times.map(time => {
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [{
      label: 'Price',
      data: prices,
      borderColor: isPositive ? 'rgb(22, 199, 132)' : 'rgb(242, 54, 69)',
      backgroundColor: isPositive ? 'rgba(22, 199, 132, 0.1)' : 'rgba(242, 54, 69, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#1f2937',
        bodyColor: isDarkMode ? '#fff' : '#1f2937',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        },
      },
      y: {
        position: 'right',
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className={`chart-section ${isDarkMode ? 'dark' : ''}`}>
      <div className="chart-header">
        <div className="price-info">
          <span className="current-price">${endPrice.toFixed(2)}</span>
          <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} ({(priceChange / startPrice * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

PriceChart.propTypes = {
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

export default PriceChart;
