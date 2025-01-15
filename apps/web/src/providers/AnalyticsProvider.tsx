import React, { createContext, useContext, useState, useCallback } from 'react';
import { TatumSDK } from '@tatumio/sdk';

interface AnalyticsData {
  timestamp: string;
  type: 'trade' | 'market' | 'blockchain' | 'user';
  data: Record<string, any>;
}

interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  data: AnalyticsData[];
}

interface AnalyticsContextType {
  reports: AnalyticsReport[];
  currentReport: AnalyticsReport | null;
  generateReport: (type: string, timeframe: string) => Promise<AnalyticsReport>;
  exportData: (format: 'csv' | 'json' | 'pdf') => Promise<string>;
  analyzeTransaction: (txHash: string) => Promise<any>;
  getProfitLoss: (timeframe: string) => Promise<{ profit: string; loss: string }>;
  getPortfolioMetrics: () => Promise<any>;
  getMarketSentiment: () => Promise<'bullish' | 'bearish' | 'neutral'>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [currentReport, setCurrentReport] = useState<AnalyticsReport | null>(null);

  const tatumSDK = TatumSDK.init({ network: 'ethereum' });

  const generateReport = useCallback(async (type: string, timeframe: string): Promise<AnalyticsReport> => {
    try {
      // Fetch data based on type and timeframe
      const data = await tatumSDK.analytics.generateReport(type, timeframe);
      
      const report: AnalyticsReport = {
        id: `${type}-${Date.now()}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
        description: `Analysis for ${timeframe}`,
        createdAt: new Date().toISOString(),
        data: data.map(item => ({
          timestamp: item.timestamp,
          type: item.type,
          data: item.data,
        })),
      };

      setReports(prev => [...prev, report]);
      setCurrentReport(report);
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }, []);

  const exportData = useCallback(async (format: 'csv' | 'json' | 'pdf'): Promise<string> => {
    try {
      if (!currentReport) throw new Error('No report selected');
      
      const exportedData = await tatumSDK.analytics.exportData(currentReport.data, format);
      return exportedData;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }, [currentReport]);

  const analyzeTransaction = useCallback(async (txHash: string) => {
    try {
      const analysis = await tatumSDK.analytics.analyzeTransaction(txHash);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze transaction:', error);
      throw error;
    }
  }, []);

  const getProfitLoss = useCallback(async (timeframe: string) => {
    try {
      const { profit, loss } = await tatumSDK.analytics.getProfitLoss(timeframe);
      return { profit, loss };
    } catch (error) {
      console.error('Failed to get profit/loss:', error);
      throw error;
    }
  }, []);

  const getPortfolioMetrics = useCallback(async () => {
    try {
      const metrics = await tatumSDK.analytics.getPortfolioMetrics();
      return metrics;
    } catch (error) {
      console.error('Failed to get portfolio metrics:', error);
      throw error;
    }
  }, []);

  const getMarketSentiment = useCallback(async () => {
    try {
      const sentiment = await tatumSDK.analytics.getMarketSentiment();
      return sentiment;
    } catch (error) {
      console.error('Failed to get market sentiment:', error);
      throw error;
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        reports,
        currentReport,
        generateReport,
        exportData,
        analyzeTransaction,
        getProfitLoss,
        getPortfolioMetrics,
        getMarketSentiment,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}; 