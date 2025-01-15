import React from 'react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Layout } from './components/Layout';
import { DragDropContext } from '@hello-pangea/dnd';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { WebSocketProvider } from './providers/WebSocketProvider';

const App: React.FC = () => {
  return (
    <ThirdwebProvider>
      <AuthProvider>
        <WebSocketProvider>
          <ThemeProvider>
            <DragDropContext onDragEnd={(result) => console.log(result)}>
              <Layout />
            </DragDropContext>
          </ThemeProvider>
        </WebSocketProvider>
      </AuthProvider>
    </ThirdwebProvider>
  );
};

export default App; 