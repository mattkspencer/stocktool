export const trackError = (error, context = {}) => {
  console.error('Error occurred:', error);
  
  // Send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: {
        ...context,
        timestamp: new Date().toISOString()
      }
    });
  }
};
