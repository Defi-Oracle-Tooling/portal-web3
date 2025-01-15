// @ts-expect-error React type definitions not being resolved correctly
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

// Constants
const PANEL_DEFAULTS = {
  LEFT_WIDTH: 250,
  RIGHT_WIDTH: 300,
  BOTTOM_HEIGHT: 200,
} as const;

// Types
interface PanelDimensions {
  readonly width: number;
  readonly height: number;
  readonly isCollapsed: boolean;
}

interface LayoutState {
  readonly leftPanelOpen: boolean;
  readonly rightPanelOpen: boolean;
  readonly bottomPanelOpen: boolean;
  readonly panelPositions: {
    readonly leftWidth: number;
    readonly rightWidth: number;
    readonly bottomHeight: number;
  };
}

interface LayoutContextType extends LayoutState {
  readonly toggleLeftPanel: () => void;
  readonly toggleRightPanel: () => void;
  readonly toggleBottomPanel: () => void;
  readonly updatePanelPosition: (position: Partial<LayoutState['panelPositions']>) => void;
}

// Context
const LayoutContext = createContext<LayoutContextType | null>(null);

// Provider Component
export const LayoutProvider = ({ children }: PropsWithChildren): JSX.Element => {
  // State
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState<boolean>(true);
  const [panelPositions, setPanelPositions] = useState<LayoutState['panelPositions']>({
    leftWidth: PANEL_DEFAULTS.LEFT_WIDTH,
    rightWidth: PANEL_DEFAULTS.RIGHT_WIDTH,
    bottomHeight: PANEL_DEFAULTS.BOTTOM_HEIGHT,
  });

  // Handlers
  const toggleLeftPanel = useCallback((): void => {
    setLeftPanelOpen((prev: boolean): boolean => !prev);
  }, []);

  const toggleRightPanel = useCallback((): void => {
    setRightPanelOpen((prev: boolean): boolean => !prev);
  }, []);

  const toggleBottomPanel = useCallback((): void => {
    setBottomPanelOpen((prev: boolean): boolean => !prev);
  }, []);

  const updatePanelPosition = useCallback((position: Partial<LayoutState['panelPositions']>): void => {
    setPanelPositions((prev: LayoutState['panelPositions']): LayoutState['panelPositions'] => ({
      ...prev,
      ...position,
    }));
  }, []);

  // Context value
  const value = useMemo(
    (): LayoutContextType => ({
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

// Hook
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 