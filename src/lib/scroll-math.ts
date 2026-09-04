export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** How far `value` is between `start` and `end`, clamped to 0-1. */
export function progressBetween(value: number, start: number, end: number): number {
  if (end <= start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
}

/** Scroll position to center `offset` in a viewport, clamped to the valid range. */
export function centerScrollTo(
  offset: number,
  scrollSize: number,
  viewportSize: number,
): { scrollPosition: number; visibleOffset: number } {
  const maxScroll = Math.max(0, scrollSize - viewportSize);
  const scrollPosition = clamp(offset - viewportSize / 2, 0, maxScroll);
  return { scrollPosition, visibleOffset: offset - scrollPosition };
}
