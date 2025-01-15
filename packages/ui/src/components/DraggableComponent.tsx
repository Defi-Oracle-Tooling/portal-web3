import { motion, useMotionValue } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

type DraggableComponentProps = {
  children: any;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  dragConstraints?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  className?: string;
};

export function DraggableComponent({
  children,
  onDragStart,
  onDragEnd,
  dragConstraints,
  className,
}: DraggableComponentProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], first, last }) => {
      if (first && onDragStart) onDragStart();
      if (last && onDragEnd) onDragEnd();
      
      x.set(mx);
      y.set(my);
    },
    onMove: ({ xy: [px, py], target }) => {
      if (!target) return;
      const bounds = (target as HTMLElement).getBoundingClientRect();
      const xPercent = (px - bounds.left) / bounds.width;
      const yPercent = (py - bounds.top) / bounds.height;
      
      rotateX.set((yPercent - 0.5) * 20);
      rotateY.set((xPercent - 0.5) * 20);
    },
  });

  const gestureBindProps = bind();

  return (
    <motion.div
      onPointerDown={gestureBindProps.onPointerDown}
      onPointerMove={gestureBindProps.onPointerMove}
      onPointerUp={gestureBindProps.onPointerUp}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      whileTap={{ cursor: 'grabbing' }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 