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

const StockChart = ({ data }) => {
  if (!data || !data['Time Series (5min)']) return null;

  const timeSeriesData = data['Time Series (5min)'];
  const times = Object.keys(timeSeriesData).slice(0, 20).reverse();
  const prices = times.map(time => timeSeriesData[time]['4. close']);

  const chartData = {
    labels: times.map(time => new Date(time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Stock Price',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price Timeline',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

StockChart.propTypes = {
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

StockChart.defaultProps = {
  data: null,
};

export default StockChart;
