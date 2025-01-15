import React, { createContext, useContext, useState, useCallback } from 'react';
import { TatumSDK } from '@tatumio/sdk';

interface MarketData {
  price: string;
  volume: string;
  high24h: string;
  low24h: string;
  change24h: string;
}

interface Order {
  type: 'market' | 'limit' | 'stop-loss';
  side: 'buy' | 'sell';
  amount: string;
  price?: string;
  stopPrice?: string;
}

interface MarketAnalysis {
  support: string[];
  resistance: string[];
  trend: 'bullish' | 'bearish' | 'neutral';
  volume: {
    current: string;
    average: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    bollingerBands: {
      upper: string;
      middle: string;
      lower: string;
    };
  };
}

interface MarketContextType {
  marketData: Record<string, MarketData>;
  orders: Order[];
  fetchMarketData: (symbol?: string) => Promise<void>;
  placeOrder: (type: Order['type'], params: Partial<Order>) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrderBook: (symbol: string) => Promise<any>;
  getTechnicalAnalysis: (symbol: string, timeframe: string) => Promise<MarketAnalysis>;
  getVolumeProfile: (symbol: string, timeframe: string) => Promise<any>;
  getOrderFlowAnalysis: (symbol: string) => Promise<any>;
  getLiquidityAnalysis: (symbol: string) => Promise<any>;
  getMarketDepthAnalysis: (symbol: string) => Promise<any>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [orders, setOrders] = useState<Order[]>([]);

  const tatumSDK = TatumSDK.init({ network: 'ethereum' });

  const fetchMarketData = useCallback(async (symbol?: string) => {
    try {
      const data = await tatumSDK.market.getMarketData(symbol);
      setMarketData(prev => ({
        ...prev,
        [symbol || 'ETH']: data,
      }));
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      throw error;
    }
  }, []);

  const placeOrder = useCallback(async (type: Order['type'], params: Partial<Order>) => {
    try {
      const order = await tatumSDK.trade.placeOrder({
        type,
        ...params,
      });
      setOrders(prev => [...prev, order]);
      return order;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      await tatumSDK.trade.cancelOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }, []);

  const getOrderBook = useCallback(async (symbol: string) => {
    try {
      const orderBook = await tatumSDK.market.getOrderBook(symbol);
      return orderBook;
    } catch (error) {
      console.error('Failed to get order book:', error);
      throw error;
    }
  }, []);

  const getTechnicalAnalysis = useCallback(async (symbol: string, timeframe: string) => {
    try {
      const analysis = await tatumSDK.market.getTechnicalAnalysis(symbol, timeframe);
      return analysis;
    } catch (error) {
      console.error('Failed to get technical analysis:', error);
      throw error;
    }
  }, []);

  const getVolumeProfile = useCallback(async (symbol: string, timeframe: string) => {
    try {
      const profile = await tatumSDK.market.getVolumeProfile(symbol, timeframe);
      return profile;
    } catch (error) {
      console.error('Failed to get volume profile:', error);
      throw error;
    }
  }, []);

  const getOrderFlowAnalysis = useCallback(async (symbol: string) => {
    try {
      const analysis = await tatumSDK.market.getOrderFlowAnalysis(symbol);
      return analysis;
    } catch (error) {
      console.error('Failed to get order flow analysis:', error);
      throw error;
    }
  }, []);

  const getLiquidityAnalysis = useCallback(async (symbol: string) => {
    try {
      const analysis = await tatumSDK.market.getLiquidityAnalysis(symbol);
      return analysis;
    } catch (error) {
      console.error('Failed to get liquidity analysis:', error);
      throw error;
    }
  }, []);

  const getMarketDepthAnalysis = useCallback(async (symbol: string) => {
    try {
      const analysis = await tatumSDK.market.getMarketDepthAnalysis(symbol);
      return analysis;
    } catch (error) {
      console.error('Failed to get market depth analysis:', error);
      throw error;
    }
  }, []);

  return (
    <MarketContext.Provider
      value={{
        marketData,
        orders,
        fetchMarketData,
        placeOrder,
        cancelOrder,
        getOrderBook,
        getTechnicalAnalysis,
        getVolumeProfile,
        getOrderFlowAnalysis,
        getLiquidityAnalysis,
        getMarketDepthAnalysis,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}; 