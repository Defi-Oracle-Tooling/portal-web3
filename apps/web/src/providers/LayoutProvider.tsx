import { createContext, useContext, useState, useCallback, useMemo, type FC, type ReactNode } from 'react';

interface PanelPositions {
  leftPanel: number;
  rightPanel: number;
  bottomPanel: number;
}

const defaultPanelPositions: PanelPositions = {
  leftPanel: 250,
  rightPanel: 250,
  bottomPanel: 250,
};

interface LayoutContextType {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  panelPositions: PanelPositions;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  updatePanelPosition: (panel: keyof PanelPositions, position: number) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: FC<LayoutProviderProps> = ({ children }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState<boolean>(true);
  const [panelPositions, setPanelPositions] = useState<PanelPositions>(defaultPanelPositions);

  const toggleLeftPanel = useCallback(() => {
    setLeftPanelOpen(prev => !prev);
  }, []);

  const toggleRightPanel = useCallback(() => {
    setRightPanelOpen(prev => !prev);
  }, []);

  const toggleBottomPanel = useCallback(() => {
    setBottomPanelOpen(prev => !prev);
  }, []);

  const updatePanelPosition = useCallback((panel: keyof PanelPositions, position: number) => {
    setPanelPositions(prev => ({
      ...prev,
      [panel]: position,
    }));
  }, []);

  const value = useMemo(
    () => ({
      leftPanelOpen,
      rightPanelOpen,
      bottomPanelOpen,
      panelPositions,
      toggleLeftPanel,
      toggleRightPanel,
      toggleBottomPanel,
      updatePanelPosition,
    }),
    [
      leftPanelOpen,
      rightPanelOpen,
      bottomPanelOpen,
      panelPositions,
      toggleLeftPanel,
      toggleRightPanel,
      toggleBottomPanel,
      updatePanelPosition,
    ]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}; 