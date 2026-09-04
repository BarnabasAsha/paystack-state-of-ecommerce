// DOMRect-compatible — pass getBoundingClientRect() results straight in.
export type Rect = { left: number; right: number; top: number; bottom: number };

export type Run = { key: string; left: number; right: number };

/** Overlap width along the horizontal axis, 0 if none. */
export function overlapWidth(a: Rect, b: Rect): number {
  return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
}

/** Key with the most total overlap width against `viewport`. */
export function findDominantByOverlap<T>(
  items: T[],
  viewport: Rect,
  getRect: (item: T) => Rect,
  getKey: (item: T) => string | undefined,
): string | null {
  const totals = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    const width = overlapWidth(getRect(item), viewport);
    if (width <= 0) continue;
    totals.set(key, (totals.get(key) ?? 0) + width);
  }

  let bestKey: string | null = null;
  let bestWidth = 0;
  totals.forEach((width, key) => {
    if (width > bestWidth) {
      bestWidth = width;
      bestKey = key;
    }
  });

  return bestKey;
}

/**
 * Key of the item whose center is closest to `viewport`'s center. Unlike
 * `findDominantByOverlap`, this stays stable when several items are fully
 * (and equally) visible at once — overlap width ties in that case, but
 * center distance doesn't.
 */
export function findClosestToCenter<T>(
  items: T[],
  viewport: Rect,
  getRect: (item: T) => Rect,
  getKey: (item: T) => string | undefined,
): string | null {
  const viewportCenter = (viewport.left + viewport.right) / 2;
  let bestKey: string | null = null;
  let bestDistance = Infinity;

  for (const item of items) {
    const rect = getRect(item);
    if (overlapWidth(rect, viewport) <= 0) continue;

    const key = getKey(item);
    if (!key) continue;

    const distance = Math.abs((rect.left + rect.right) / 2 - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  }

  return bestKey;
}

/** Items currently overlapping `viewport`, merged into ordered same-key runs. */
export function computeInViewRuns<T>(
  items: T[],
  viewport: Rect,
  getRect: (item: T) => Rect,
  getKey: (item: T) => string | undefined,
): Run[] {
  const runs: Run[] = [];

  for (const item of items) {
    const rect = getRect(item);
    if (overlapWidth(rect, viewport) <= 0) continue;

    const key = getKey(item);
    if (!key) continue;

    const last = runs[runs.length - 1];
    if (last && last.key === key) {
      last.left = Math.min(last.left, rect.left);
      last.right = Math.max(last.right, rect.right);
    } else {
      runs.push({ key, left: rect.left, right: rect.right });
    }
  }

  return runs;
}

/** Percentage (0-100) boundary between each adjacent run, along `viewport`. */
export function runsToBoundaries(runs: Run[], viewport: Rect): number[] {
  const viewportWidth = viewport.right - viewport.left;
  if (viewportWidth <= 0) return [];

  return runs.slice(0, -1).map((run, index) => {
    const next = runs[index + 1];
    const boundaryPx = (run.right + next.left) / 2;
    const percentage = ((boundaryPx - viewport.left) / viewportWidth) * 100;
    return Math.min(100, Math.max(0, percentage));
  });
}

export function widestRun(runs: Run[]): Run | null {
  if (runs.length === 0) return null;
  return runs.reduce((widest, run) =>
    run.right - run.left > widest.right - widest.left ? run : widest,
  );
}

/** Min/max bounds per key, relative to `origin`. Order-independent. */
export function groupBoundsByKey<T>(
  items: T[],
  origin: Rect,
  getRect: (item: T) => Rect,
  getKey: (item: T) => string | undefined,
): Map<string, { left: number; right: number }> {
  const bounds = new Map<string, { left: number; right: number }>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;

    const rect = getRect(item);
    const left = rect.left - origin.left;
    const right = rect.right - origin.left;
    const existing = bounds.get(key);

    if (existing) {
      existing.left = Math.min(existing.left, left);
      existing.right = Math.max(existing.right, right);
    } else {
      bounds.set(key, { left, right });
    }
  }

  return bounds;
}

/** `base`'s width, extended to cover any of `overflowRects` sticking out past it. */
export function measureOverflowAwareWidth(base: Rect, overflowRects: Rect[]): number {
  const maxRight = overflowRects.reduce((max, r) => Math.max(max, r.right), base.right);
  return Math.max(base.right - base.left, maxRight - base.left);
}

/** Raw edge positions (e.g. an element's bottom) as percentages along a container. */
export function boundariesFromEdges(
  edges: number[],
  containerStart: number,
  containerLength: number,
): number[] {
  if (containerLength <= 0) return [];
  return edges.map((edge) => {
    const percentage = ((edge - containerStart) / containerLength) * 100;
    return Math.min(100, Math.max(0, percentage));
  });
}
