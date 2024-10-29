import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { fetchStockData } from '../utils/api';

jest.mock('../utils/api');

describe('App Component', () => {
  beforeEach(() => {
    fetchStockData.mockClear();
  });

  test('renders stock data form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter stock ticker/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(/get stock data/i);
  });

  test('handles stock data fetch successfully', async () => {
    const mockData = {
      'Time Series (5min)': {
        '2024-01-01 12:00:00': {
          '1. open': '100.00',
          '2. high': '101.00',
          '3. low': '99.00',
          '4. close': '100.50',
          '5. volume': '1000000'
        }
      }
    };

    fetchStockData.mockResolvedValueOnce(mockData);

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter stock ticker/i), {
      target: { value: 'AAPL' },
    });
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Latest Data for AAPL')).toBeInTheDocument();
    });
  });

  test('handles errors appropriately', async () => {
    fetchStockData.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter stock ticker/i), {
      target: { value: 'INVALID' },
    });
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
