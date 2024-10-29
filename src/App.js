import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Add this import
import { ThemeProvider } from './context/ThemeContext';
import PriceChart from './components/PriceChart';
import LoadingSpinner from './components/LoadingSpinner'; // Import the spinner
import './App.css';

// Add these console logs near the top of your file, after the imports
console.log("Environment Variables:", {
  apiKey: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY,
  nodeEnv: process.env.NODE_ENV
});

// Add this near the top of your file after the imports
console.log('API Key loaded:', process.env.REACT_APP_ALPHA_VANTAGE_API_KEY);

// Add this console log to verify the environment variable is loaded
console.log("Environment Variables:", {
  apiKey: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY,
  nodeEnv: process.env.NODE_ENV
});

// Add this near the top of your file, after the imports
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

// Add these console.log temporarily to verify it's working
console.log('API Key:', API_KEY);
console.log('All env variables:', process.env);

// Add this near the top of your file after the imports
console.log('API Key loaded:', process.env.REACT_APP_ALPHA_VANTAGE_API_KEY);

// Add these utility functions at the top of your file
const buffettScoring = {
  // Value Metrics (30 points total)
  calculateValueScore: (data) => {
    let score = 0;
    // P/E Ratio: < 15 is excellent (10 points)
    if (data.PERatio < 15) score += 10;
    else if (data.PERatio < 20) score += 5;
    
    // Price/Book: < 1.5 is excellent (10 points)
    if (data.PriceToBookRatio < 1.5) score += 10;
    else if (data.PriceToBookRatio < 2.5) score += 5;
    
    // Earnings Growth: > 10% annually (10 points)
    if (data.EPS5YearGrowthRate > 10) score += 10;
    else if (data.EPS5YearGrowthRate > 5) score += 5;
    
    return score;
  },

  // Business Quality (30 points total)
  calculateQualityScore: (data) => {
    let score = 0;
    // ROE: > 15% is excellent (10 points)
    if (data.ReturnOnEquityTTM > 15) score += 10;
    else if (data.ReturnOnEquityTTM > 10) score += 5;
    
    // Profit Margin: > 20% is excellent (10 points)
    if (data.ProfitMargin > 20) score += 10;
    else if (data.ProfitMargin > 10) score += 5;
    
    // Operating Margin: > 15% is excellent (10 points)
    if (data.OperatingMarginTTM > 15) score += 10;
    else if (data.OperatingMarginTTM > 10) score += 5;
    
    return score;
  },

  // Financial Health (20 points total)
  calculateHealthScore: (data) => {
    let score = 0;
    // Debt/Equity: < 0.5 is excellent (10 points)
    if (data.DebtToEquityRatio < 0.5) score += 10;
    else if (data.DebtToEquityRatio < 1) score += 5;
    
    // Cash Generation: > 1 is excellent (10 points)
    if (data.FreeCashFlow > 1) score += 10;
    else if (data.FreeCashFlow > 0.5) score += 5;
    
    // Working Capital Efficiency: > 1 is excellent (10 points)
    if (data.CurrentRatio > 1) score += 10;
    else if (data.CurrentRatio > 0.5) score += 5;
    
    return score;
  },

  // Competitive Advantage (Moat) (20 points total)
  calculateMoatScore: (data) => {
    let score = 0;
    // Gross Profit Margin: Trending up is excellent (10 points)
    if (data.GrossProfitTTM > 0) score += 10;
    else if (data.GrossProfitTTM > -5) score += 5;
    
    // Market Dominance: High Market Cap is excellent (10 points)
    if (data.MarketCapitalization > 1000000000) score += 10;
    else if (data.MarketCapitalization > 500000000) score += 5;
    
    // Revenue Growth: High Growth Rate is excellent (10 points)
    if (data.RevenueGrowthRate > 20) score += 10;
    else if (data.RevenueGrowthRate > 10) score += 5;
    
    return score;
  },
};

// Add this component for the score display
const BuffettScoreCard = ({ data }) => {
  const valueScore = buffettScoring.calculateValueScore(data);
  const qualityScore = buffettScoring.calculateQualityScore(data);
  const healthScore = buffettScoring.calculateHealthScore(data);
  const moatScore = buffettScoring.calculateMoatScore(data);
  const totalScore = valueScore + qualityScore + healthScore + moatScore;

  return (
    <div className="card score-card">
      <h2>Buffett Analysis Score</h2>
      <div className="score-overview">
        <div className="total-score">
          <span className="score-label">Total Score</span>
          <span className={`score-value ${totalScore >= 70 ? 'excellent' : totalScore >= 50 ? 'good' : 'poor'}`}>
            {totalScore}/100
          </span>
        </div>
      </div>
      <div className="score-details">
        <div className="score-item">
          <span className="score-category">Value</span>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${(valueScore/30) * 100}%` }}></div>
          </div>
          <span className="score-number">{valueScore}/30</span>
        </div>
        <div className="score-item">
          <span className="score-category">Business Quality</span>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${(qualityScore/30) * 100}%` }}></div>
          </div>
          <span className="score-number">{qualityScore}/30</span>
        </div>
        <div className="score-item">
          <span className="score-category">Financial Health</span>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${(healthScore/20) * 100}%` }}></div>
          </div>
          <span className="score-number">{healthScore}/20</span>
        </div>
        <div className="score-item">
          <span className="score-category">Competitive Advantage</span>
          <div className="score-bar-container">
            <div className="score-bar" style={{ width: `${(moatScore/20) * 100}%` }}></div>
          </div>
          <span className="score-number">{moatScore}/20</span>
        </div>
      </div>
      <div className="score-interpretation">
        <p className="interpretation-text">
          {totalScore >= 70 ? '✨ Strong Buffett Match' :
           totalScore >= 50 ? '🤔 Potential Opportunity' :
           '⚠️ Requires Caution'}
        </p>
      </div>
    </div>
  );
};

// Add PropTypes validation for the BuffettScoreCard component
BuffettScoreCard.propTypes = {
  data: PropTypes.shape({
    PERatio: PropTypes.string,
    PriceToBookRatio: PropTypes.string,
    EPS5YearGrowthRate: PropTypes.string,
    ReturnOnEquityTTM: PropTypes.string,
    ProfitMargin: PropTypes.string,
    OperatingMarginTTM: PropTypes.string,
    DebtToEquityRatio: PropTypes.string,
    CurrentRatio: PropTypes.string,
    GrossProfitTTM: PropTypes.string,
    MarketCapitalization: PropTypes.string
  }).isRequired
};

// Add these utility functions at the top of your file
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const cacheKey = (symbol) => `stock_data_${symbol}`;

const getCachedData = (symbol) => {
  try {
    const cached = localStorage.getItem(cacheKey(symbol));
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(cacheKey(symbol));
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};

const setCachedData = (symbol, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey(symbol), JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache error:', error);
  }
};

function App() {
  const [data, setData] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedData = getCachedData(symbol);
      if (cachedData) {
        console.log('Using cached data for', symbol);
        setData(cachedData);
        setLoading(false);
        return;
      }

      console.log('Fetching fresh data for', symbol);
      const response = await fetch(
        `https://www.alphavantage.co/query?` +
        `function=GLOBAL_QUOTE` +
        `&symbol=${symbol.toUpperCase()}` +
        `&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Check for API errors
      if (result.Note || result.Information) {
        throw new Error(result.Note || result.Information);
      }

      // Cache the successful response
      setCachedData(symbol, result);
      setData(result);

      // Add cache indicator to UI
      console.log('Data cached for', symbol);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="header">
          <h1>Stock Market Dashboard</h1>
          <p className="header-subtitle">Real-time stock market data and analysis</p>
        </header>
        
        <main className="main-content">
          {/* Search Section */}
          <section className="search-section">
            <div className="search-container">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    className="search-input"
                    disabled={loading}
                  />
                  <button type="submit" className="search-button" disabled={loading}>
                    {loading ? (
                      <span className="loading-spinner">Loading...</span>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {loading && <LoadingSpinner />} {/* Show spinner when loading */}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {/* Stock Data Display */}
          <section className="data-section">
            {loading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Fetching stock data...</p>
              </div>
            ) : data ? (
              <div className="data-grid">
                {/* Quick Overview Card */}
                <div className="card overview-card">
                  <h2>Stock Overview</h2>
                  <div className="stock-info">
                    <h3>{symbol}</h3>
                    <p className="price">${data['Global Quote']?.['05. price']}</p>
                    <p className={`change ${parseFloat(data['Global Quote']?.['09. change']) >= 0 ? 'positive' : 'negative'}`}>
                      {data['Global Quote']?.['09. change']}
                    </p>
                  </div>
                </div>

                {/* Chart Card */}
                <div className="card chart-card">
                  <h2>Price Chart</h2>
                  <div className="chart-container">
                    <PriceChart data={data} />
                  </div>
                </div>

                {/* Details Card */}
                <div className="card details-card">
                  <h2>Trading Details</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span>Open</span>
                      <span>{data['Global Quote']?.['02. open']}</span>
                    </div>
                    <div className="detail-item">
                      <span>High</span>
                      <span>{data['Global Quote']?.['03. high']}</span>
                    </div>
                    <div className="detail-item">
                      <span>Low</span>
                      <span>{data['Global Quote']?.['04. low']}</span>
                    </div>
                    <div className="detail-item">
                      <span>Volume</span>
                      <span>{data['Global Quote']?.['06. volume']}</span>
                    </div>
                  </div>
                </div>

                {/* Fundamental Value Card */}
                <div className="card value-card">
                  <h2>Value Metrics</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="metric-label">P/E Ratio</span>
                      <span className="metric-value">{data['Overview']?.['PERatio']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Book Value</span>
                      <span className="metric-value">{data['Overview']?.['BookValue']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Profit Margin</span>
                      <span className="metric-value">{data['Overview']?.['ProfitMargin']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Return on Equity</span>
                      <span className="metric-value">{data['Overview']?.['ReturnOnEquityTTM']}</span>
                    </div>
                  </div>
                </div>

                {/* Business Strength Card */}
                <div className="card strength-card">
                  <h2>Business Strength</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="metric-label">Debt/Equity Ratio</span>
                      <span className="metric-value">{data['Overview']?.['DebtToEquityRatio']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Operating Margin</span>
                      <span className="metric-value">{data['Overview']?.['OperatingMarginTTM']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Free Cash Flow</span>
                      <span className="metric-value">{data['Overview']?.['FreeCashFlow']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Dividend Yield</span>
                      <span className="metric-value">{data['Overview']?.['DividendYield']}</span>
                    </div>
                  </div>
                </div>

                {/* Growth & Moat Card */}
                <div className="card moat-card">
                  <h2>Competitive Advantage</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="metric-label">Gross Margin</span>
                      <span className="metric-value">{data['Overview']?.['GrossProfitTTM']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Revenue Growth</span>
                      <span className="metric-value">{data['Overview']?.['RevenueGrowth']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Market Share</span>
                      <span className="metric-value">{data['Overview']?.['MarketCapitalization']}</span>
                    </div>
                    <div className="detail-item">
                      <span className="metric-label">Industry Position</span>
                      <span className="metric-value">{data['Overview']?.['Industry']}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Metrics */}
                {data && !loading && (
                  <>
                    <div className="data-grid">
                      {/* 1. Value and Price Metrics */}
                      <div className="card value-card">
                        <h2>Value Analysis</h2>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Price to Earnings: Lower suggests better value">
                              P/E Ratio
                            </span>
                            <span className="metric-value">{data.PERatio}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Price relative to book value: <1.5 is attractive">
                              Price/Book Ratio
                            </span>
                            <span className="metric-value">{data.PriceToBookRatio}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Earnings yield: Higher is better">
                              Earnings Per Share
                            </span>
                            <span className="metric-value">{data.EPS}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Intrinsic value indicator">
                              Book Value Per Share
                            </span>
                            <span className="metric-value">{data.BookValue}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Business Quality Metrics */}
                      <div className="card quality-card">
                        <h2>Business Quality</h2>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Net profit margin: Higher indicates better efficiency">
                              Profit Margin
                            </span>
                            <span className="metric-value">{data.ProfitMargin}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Return on Equity: >15% is excellent">
                              Return on Equity
                            </span>
                            <span className="metric-value">{data.ReturnOnEquityTTM}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Consistent earnings growth">
                              5Y Earnings Growth
                            </span>
                            <span className="metric-value">{data.EPS5YearGrowthRate}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Operating efficiency">
                              Operating Margin
                            </span>
                            <span className="metric-value">{data.OperatingMarginTTM}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Financial Health Metrics */}
                      <div className="card health-card">
                        <h2>Financial Health</h2>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Debt to Equity: <0.5 is preferred">
                              Debt/Equity Ratio
                            </span>
                            <span className="metric-value">{data.DebtToEquityRatio}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Cash generation ability">
                              Free Cash Flow
                            </span>
                            <span className="metric-value">{data.FreeCashFlow}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Working capital efficiency">
                              Current Ratio
                            </span>
                            <span className="metric-value">{data.CurrentRatio}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Dividend sustainability">
                              Payout Ratio
                            </span>
                            <span className="metric-value">{data.PayoutRatio}</span>
                          </div>
                        </div>
                      </div>

                      {/* 4. Competitive Advantage (Moat) */}
                      <div className="card moat-card">
                        <h2>Competitive Advantage</h2>
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Gross profit margin trend">
                              Gross Margin
                            </span>
                            <span className="metric-value">{data.GrossProfitTTM}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Market dominance">
                              Market Cap
                            </span>
                            <span className="metric-value">{data.MarketCapitalization}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Revenue growth rate">
                              Revenue Growth
                            </span>
                            <span className="metric-value">{data.RevenueGrowthRate}</span>
                          </div>
                          <div className="detail-item">
                            <span className="metric-label" data-tooltip="Industry position">
                              Sector
                            </span>
                            <span className="metric-value">{data.Sector}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <BuffettScoreCard data={data} />
                  </>
                )}

                {/* Empty State */}
                <div className="empty-state">
                  <h2>Enter a stock symbol to get started</h2>
                  <p>Try searching for AAPL, GOOGL, or MSFT</p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <h2>Enter a stock symbol to get started</h2>
                <p>Try searching for AAPL, GOOGL, or MSFT</p>
              </div>
            )}
          </section>

          {/* Ticker Tape */}
          <section className="ticker-tape">
            <div className="ticker-wrap">
              <div className="ticker">
                {/* Example ticker items - you can fetch real-time data for these */}
                <div className="ticker-item">
                  AAPL <span className="positive">+1.2%</span>
                </div>
                <div className="ticker-item">
                  GOOGL <span className="negative">-0.8%</span>
                </div>
                <div className="ticker-item">
                  MSFT <span className="positive">+2.1%</span>
                </div>
                <div className="ticker-item">
                  TSLA <span className="positive">+3.4%</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Data provided by Alpha Vantage</p>
          <p>© 2024 Stock Market Dashboard</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
