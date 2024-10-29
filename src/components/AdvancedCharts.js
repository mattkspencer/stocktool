import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createChart } from 'lightweight-charts';

const AdvancedCharts = ({ data }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!data || !data['Time Series (5min)']) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Format data for charts
    const timeSeriesData = data['Time Series (5min)'];
    const chartData = Object.entries(timeSeriesData).map(([time, values]) => ({
      time: new Date(time).getTime() / 1000,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseFloat(values['5. volume']),
    })).reverse();

    // Set chart data
    candlestickSeries.setData(chartData);
    volumeSeries.setData(
      chartData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#26a69a' : '#ef5350',
      }))
    );

    // Fit content
    chart.timeScale().fitContent();

    chartRef.current = chart;

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="advanced-charts">
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

AdvancedCharts.propTypes = {
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

AdvancedCharts.defaultProps = {
  data: null,
};

export default AdvancedCharts;
