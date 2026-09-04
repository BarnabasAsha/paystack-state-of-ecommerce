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
    // down the window where the grid renders with zero cells. Matches the
    // observer's content-box measurement (padding excluded), or a mismatch
    // between the two would change the cell count a moment later, remounting
    // cells mid-reveal and leaving some of them stuck hidden.
    const style = getComputedStyle(el);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const rect = el.getBoundingClientRect();
    measure(rect.width - paddingX, rect.height - paddingY);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      measure(width, height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [cellSize, gap]);

  return { ref, ...dims };
}
