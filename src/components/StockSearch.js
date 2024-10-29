const StockSearch = () => {
  return (
    <div role="search">
      <label htmlFor="ticker-input">
        Enter Stock Symbol
      </label>
      <input
        id="ticker-input"
        type="text"
        aria-label="Stock ticker symbol"
        aria-describedby="ticker-help"
        aria-invalid={!!error}
      />
      <p id="ticker-help" className="helper-text">
        Enter a valid stock symbol (e.g., AAPL)
      </p>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};
