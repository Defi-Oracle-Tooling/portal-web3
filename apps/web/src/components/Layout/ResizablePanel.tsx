import React, { useCallback, useState } from 'react';
import { useLayout } from '../../providers/LayoutProvider';
import { DraggablePanel, PanelProps } from './DraggablePanel';

interface ResizablePanelProps extends PanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  resizeDirection?: 'horizontal' | 'vertical';
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  id,
  type,
  children,
  className = '',
  defaultSize = 20,
  minSize = 10,
  maxSize = 90,
  resizeDirection = 'horizontal'
}) => {
  const { resizePanel } = useLayout();
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.pageX;
    const startY = e.pageY;
    const startWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0;
    const startHeight = e.currentTarget.parentElement?.getBoundingClientRect().height || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const containerWidth = e.currentTarget?.parentElement?.getBoundingClientRect().width || 0;
      const containerHeight = e.currentTarget?.parentElement?.getBoundingClientRect().height || 0;

      if (resizeDirection === 'horizontal') {
        const deltaX = e.pageX - startX;
        const newWidth = ((startWidth + deltaX) / containerWidth) * 100;
        const clampedWidth = Math.max(minSize, Math.min(maxSize, newWidth));
        resizePanel(type, clampedWidth);
      } else {
        const deltaY = e.pageY - startY;
        const newHeight = ((startHeight + deltaY) / containerHeight) * 100;
        const clampedHeight = Math.max(minSize, Math.min(maxSize, newHeight));
        resizePanel(type, clampedHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [type, resizePanel, minSize, maxSize, resizeDirection, isResizing]);

  return (
    <div className="relative flex">
      <DraggablePanel id={id} type={type} className={className}>
        {children}
      </DraggablePanel>
      <div
        className={`absolute ${
          resizeDirection === 'horizontal' 
            ? 'right-0 top-0 w-1 h-full cursor-col-resize' 
            : 'bottom-0 left-0 h-1 w-full cursor-row-resize'
        } bg-transparent hover:bg-blue-500/50 transition-colors`}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}; 