const LoadingState = () => (
  <div className="loading-container" role="alert" aria-busy="true">
    <div className="loading-spinner" />
    <span className="loading-text">Loading stock data...</span>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="error-container" role="alert">
    <p className="error-message">{error.message}</p>
    <button onClick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
);
