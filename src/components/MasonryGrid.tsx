import React, { useState, useEffect, useMemo } from 'react';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  gap?: number;
  getItemHeight?: (item: T) => number;
}

// Breakpoints matching Tailwind default config
const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
  xl: 1280,
};

// 根据窗口宽度计算列数
const getColumns = () => {
  // SSR 或无 window 环境下默认返回 4 列
  if (typeof window === 'undefined') return 4;
  
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.xl) return 4;
  if (width >= BREAKPOINTS.lg) return 3;
  if (width >= BREAKPOINTS.sm) return 2;
  return 1;
};

const MasonryGrid = <T extends { id: number | string }>({ items, renderItem, getItemHeight }: MasonryGridProps<T>) => {
  // 使用惰性初始化，确保首次渲染就获得正确的列数
  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    // 使用 matchMedia 监听断点变化，比 resize 事件更稳定且性能更好
    // 避免因为滚动条出现/消失导致的宽度微小变化触发 resize
    const queryXl = window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`);
    const queryLg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`);
    const querySm = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);

    const updateColumns = () => {
      if (queryXl.matches) {
        setColumns(4);
      } else if (queryLg.matches) {
        setColumns(3);
      } else if (querySm.matches) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    // Initial check
    updateColumns();

    // Listen for changes
    const handleChange = () => updateColumns();
    
    queryXl.addEventListener('change', handleChange);
    queryLg.addEventListener('change', handleChange);
    querySm.addEventListener('change', handleChange);

    return () => {
      queryXl.removeEventListener('change', handleChange);
      queryLg.removeEventListener('change', handleChange);
      querySm.removeEventListener('change', handleChange);
    };
  }, []);

  // Distribute items into columns using "Shortest Column First" algorithm
  // This effectively balances the column heights and prevents "single column" issues.
  const columnItems = useMemo(() => {
    const cols: T[][] = Array.from({ length: columns }, () => []);
    const colHeights = new Array(columns).fill(0);
    
    // Safety check for items
    if (!Array.isArray(items)) return cols;

    items.forEach((item) => {
      if (!item) return;

      // Find the column with the minimum height
      let minColIndex = 0;
      let minHeight = colHeights[0];

      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          minColIndex = i;
        }
      }

      // Add item to the shortest column
      cols[minColIndex].push(item);
      
      // Update column height
      // Default height is 1 if getItemHeight not provided
      const height = getItemHeight ? getItemHeight(item) : 1;
      colHeights[minColIndex] += height;
    });
    
    return cols;
  }, [items, columns, getItemHeight]);

  return (
    <div className="flex gap-4 items-start w-full">
      {columnItems.map((col, colIndex) => (
        <div 
          key={colIndex} 
          className="flex-1 flex flex-col gap-4 min-w-0"
        >
          {col.map((item, itemIndex) => (
            <React.Fragment key={`${item.id}-${itemIndex}`}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
