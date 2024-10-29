import { memo } from 'react';

const StockData = memo(({ ticker }) => {
  const { data, loading, error } = useStockData(ticker);

  // Memoize expensive calculations
  const processedData = useMemo(() => {
    if (!data) return null;
    return processStockData(data);
  }, [data]);

  // Memoize handlers
  const handleRefresh = useCallback(() => {
    // refresh logic
  }, [ticker]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <div>
      {/* Render your stock data */}
    </div>
  );
});
