import { useState } from 'react';

const useStockCache = () => {
  const [cache, setCache] = useState({});

  const getCachedData = (ticker) => {
    const cachedItem = cache[ticker];
    if (cachedItem && Date.now() - cachedItem.timestamp < 300000) { // 5 minutes
      return cachedItem.data;
    }
    return null;
  };

  const setCachedData = (ticker, data) => {
    setCache(prev => ({
      ...prev,
      [ticker]: {
        data,
        timestamp: Date.now()
      }
    }));
  };

  return { getCachedData, setCachedData };
};

export default useStockCache;
