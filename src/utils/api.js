import { PerformanceMonitor } from './performance';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5,
  timeWindow: 60000, // 1 minute
  requests: []
};

// API call configuration
const API_CONFIG = {
  baseURL: 'https://www.alphavantage.co/query',
  timeout: 10000, // 10 seconds
  maxRetries: 3,
  retryDelay: 1000 // 1 second
};

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

const checkRateLimit = () => {
