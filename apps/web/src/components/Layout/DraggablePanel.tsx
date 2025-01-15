import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useLayout } from '../../providers/LayoutProvider';

export interface PanelProps {
  id: string;
  type: 'left' | 'right' | 'bottom' | 'main';
  children: React.ReactNode;
  className?: string;
}

export const DraggablePanel: React.FC<PanelProps> = ({ id, type, children, className = '' }) => {
  const { layoutMode } = useLayout();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PANEL',
    item: { id, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => type !== 'main', // Main panel cannot be dragged
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PANEL',
    drop: (item: { id: string; type: string }) => {
      // Handle panel position swap here
      if (item.id !== id) {
        // TODO: Implement panel swap logic in LayoutProvider
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    canDrop: (item) => item.id !== id && type !== 'main', // Prevent dropping on self or main panel
  }));

  const baseClasses = 'relative rounded-lg overflow-hidden shadow-lg';
  const dragClasses = isDragging ? 'opacity-50' : '';
  const dropClasses = isOver ? 'border-2 border-blue-500' : '';
  
  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`${baseClasses} ${dragClasses} ${dropClasses} ${className}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 cursor-move">
        <div className="flex items-center h-full px-2 text-xs text-gray-400">
          {type.charAt(0).toUpperCase() + type.slice(1)} Panel
        </div>
      </div>
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}; 