import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
// @ts-ignore - Tatum SDK types are not available
import { TatumSDK } from '@tatumio/sdk';

interface AnalyticsContextType {
  reports: any[];
  generateReport: (data: any[]) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const [reports, setReports] = useState<any[]>([]);

  const generateReport = useCallback((data: any[]) => {
    const report = {
      timestamp: new Date().toISOString(),
      data: data.map(item => ({
        ...item,
        analyzed: true
      }))
    };

    setReports((prev: any[]) => [...prev, report]);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ reports, generateReport }}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 