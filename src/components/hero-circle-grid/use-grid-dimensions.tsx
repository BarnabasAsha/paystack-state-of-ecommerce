import { useEffect, useRef, useState } from "react";

export function useGridDimensions(cellSize: number, gap: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const step = cellSize + gap;
      setDims({
        columns: Math.max(1, Math.round((width + gap) / step)),
        rows: Math.max(1, Math.round((height + gap) / step)),
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [cellSize, gap]);

  return { ref, ...dims };
}
