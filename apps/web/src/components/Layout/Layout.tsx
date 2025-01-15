import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { LeftPanel } from '../LeftPanel';
import { RightPanel } from '../RightPanel';
import { BottomPanel } from '../BottomPanel';
import { MainContent } from '../MainContent';
import { CommandPalette } from '../CommandPalette';

export const Layout: React.FC = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <PanelGroup direction="horizontal">
        {isLeftPanelOpen && (
          <>
            <Panel defaultSize={20} minSize={15}>
              <LeftPanel />
            </Panel>
            <PanelResizeHandle />
          </>
        )}

        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <MainContent />
            </Panel>
            
            {isBottomPanelOpen && (
              <>
                <PanelResizeHandle />
                <Panel defaultSize={30}>
                  <BottomPanel />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>

        {isRightPanelOpen && (
          <>
            <PanelResizeHandle />
            <Panel defaultSize={20}>
              <RightPanel />
            </Panel>
          </>
        )}
      </PanelGroup>

      <Footer />
      <CommandPalette />
    </div>
  );
}; 