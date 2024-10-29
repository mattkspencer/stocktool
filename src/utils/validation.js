export const validateTickerSymbol = (ticker) => {
  if (!ticker) {
    throw new Error('Ticker symbol is required');
  }
  
  // Remove whitespace and convert to uppercase
  const sanitizedTicker = ticker.trim().toUpperCase();
  
  // Check format (letters only, 1-5 characters)
  if (!/^[A-Z]{1,5}$/.test(sanitizedTicker)) {
    throw new Error('Invalid ticker symbol format');
  }
  
  return sanitizedTicker;
};
