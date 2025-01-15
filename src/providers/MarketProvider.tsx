import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
// @ts-ignore - Tatum SDK types are not available
import { TatumSDK } from '@tatumio/sdk';

interface MarketData {
  price: string;
  volume: string;
  marketCap: string;
  change24h: string;
}

interface Order {
  id: string;
  type: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  status: 'open' | 'filled' | 'cancelled';
}

interface MarketContextType {
  marketData: MarketData | null;
  orders: Order[];
  fetchMarketData: () => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'status'>) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

interface MarketProviderProps {
  children: ReactNode;
}

export const MarketProvider = ({ children }: MarketProviderProps) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchMarketData = useCallback(async () => {
    try {
      // Mock market data - replace with actual API call
      const data = {
        price: '1234.56',
        volume: '1000000',
        marketCap: '1000000000',
        change24h: '+5.67'
      };
      setMarketData(data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  }, []);

  const placeOrder = useCallback(async (order: Omit<Order, 'id' | 'status'>) => {
    try {
      // Mock order placement - replace with actual API call
      const newOrder: Order = {
        ...order,
        id: Math.random().toString(36).substring(7),
        status: 'open'
      };
      setOrders(prev => [...prev, newOrder]);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      // Mock order cancellation - replace with actual API call
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  }, []);

  return (
    <MarketContext.Provider
      value={{
        marketData,
        orders,
        fetchMarketData,
        placeOrder,
        cancelOrder
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}; 