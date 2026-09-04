import { useLayoutEffect, useRef, useState } from "react";

export function useGridDimensions(cellSize: number, gap: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ columns: 0, rows: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const step = cellSize + gap;
    const measure = (width: number, height: number) =>
      setDims({
        columns: Math.max(1, Math.round((width + gap) / step)),
        rows: Math.max(1, Math.round((height + gap) / step)),
      });

    // Synchronous, ahead of the async ResizeObserver callback below — cuts
    // down the window where the grid renders with zero cells.
    const rect = el.getBoundingClientRect();
    measure(rect.width, rect.height);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      measure(width, height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [cellSize, gap]);

  return { ref, ...dims };
}
