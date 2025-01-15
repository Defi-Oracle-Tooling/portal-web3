import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { wsService } from '../services/websocket';

interface WebSocketContextType {
  emit: (event: string, data: any) => void;
  subscribe: <T>(event: string, callback: (data: T) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  return (
    <WebSocketContext.Provider value={{
      emit: wsService.emit.bind(wsService),
      subscribe: wsService.subscribe.bind(wsService),
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 