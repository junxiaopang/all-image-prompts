import React, { useState, useEffect, useMemo } from 'react';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  gap?: number; // Gap in pixels, though we'll likely use Tailwind classes for actual spacing
}

// Breakpoints matching Tailwind default config
const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
  xl: 1280,
};

const MasonryGrid = <T extends { id: number | string }>({ items, renderItem }: MasonryGridProps<T>) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.xl) {
        setColumns(4);
      } else if (width >= BREAKPOINTS.lg) {
        setColumns(3);
      } else if (width >= BREAKPOINTS.sm) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute items into columns
  const columnItems = useMemo(() => {
    const cols: T[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      // Simple modulo distribution ensures items fill columns evenly left-to-right
      cols[index % columns].push(item);
    });
    
    return cols;
  }, [items, columns]);

  return (
    <div className="flex gap-4 items-start">
      {columnItems.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4 min-w-0">
          {col.map((item) => (
            <React.Fragment key={item.id}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
