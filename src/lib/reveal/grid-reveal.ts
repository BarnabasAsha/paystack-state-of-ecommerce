import gsap from "gsap";

const COLUMN_STAGGER = 0.015;
const ROW_STAGGER = 0.08;

// Cells carry their real grid column/row via `data-col`/`data-row` rather
// than relying on GSAP's `grid` stagger, which assumes a dense row-major
// array — the active (africa-shape) cells are a filtered subset, so their
// array index no longer matches their actual position.
const byColumn = (_index: number, target: Element) =>
  Number((target as HTMLElement).dataset.col ?? 0) * COLUMN_STAGGER;

const byRow = (_index: number, target: Element) =>
  Number((target as HTMLElement).dataset.row ?? 0) * ROW_STAGGER;

/** Base grid: every cell fades/scales in, staggered by column, left to right. */
export function revealGridColumns(cells: Element[], reduced: boolean) {
  if (reduced || cells.length === 0) return null;

  return gsap.from(cells, {
    autoAlpha: 0,
    scale: 0.4,
    duration: 0.5,
    ease: "power2.out",
    stagger: byColumn,
    immediateRender: true,
  });
}

/** Africa shape: the active cells "draw in" over the base grid, top to bottom. */
export function revealActiveCells(cells: Element[], reduced: boolean) {
  if (reduced || cells.length === 0) return null;

  return gsap.from(cells, {
    autoAlpha: 0,
    scale: 0,
    duration: 0.6,
    ease: "back.out(2)",
    stagger: byRow,
    immediateRender: true,
  });
}
