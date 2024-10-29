import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StockData from '../components/StockData';

describe('StockData Component', () => {
  test('displays loading state initially', () => {
    render(<StockData ticker="AAPL" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/loading/i);
  });

  test('handles successful data fetch', async () => {
    render(<StockData ticker="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText(/stock data/i)).toBeInTheDocument();
    });
  });

  test('handles error states', async () => {
    // Mock failed API call
    render(<StockData ticker="INVALID" />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
    });
  });
});
