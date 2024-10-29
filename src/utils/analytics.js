import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
