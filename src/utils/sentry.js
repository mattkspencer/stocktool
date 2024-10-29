import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV
  });
};

export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    scope.setExtras(context);
    Sentry.captureException(error);
  });
};
