import type { Rect } from "@/lib/geometry";

export function computeDotOffset({
  rowRect,
  lcolRect,
  scrollLeft,
  isMobile,
  withinProgress,
}: {
  rowRect: Rect;
  lcolRect: Rect;
  scrollLeft: number;
  isMobile: boolean;
  withinProgress: number;
}): number {
  const rowStart = isMobile
    ? rowRect.left - lcolRect.left + scrollLeft
    : rowRect.top - lcolRect.top;
  const rowSize = isMobile
    ? rowRect.right - rowRect.left
    : rowRect.bottom - rowRect.top;

  return rowStart + withinProgress * rowSize;
}
