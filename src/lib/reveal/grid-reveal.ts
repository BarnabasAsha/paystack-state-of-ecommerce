import gsap from "gsap";

const COLUMN_STAGGER = 0.3;

// Cells carry their real grid column via `data-col` rather than relying on
// GSAP's `grid` stagger, which assumes a dense row-major array — the active
// (africa-shape) cells are a filtered subset, so their array index no
// longer matches their actual column.
const byColumn = (_index: number, target: Element) =>
  Number((target as HTMLElement).dataset.col ?? 0) * COLUMN_STAGGER;

/** Base grid: every cell fades/scales in, staggered by column, left to right. */
export function revealGridColumns(cells: Element[], reduced: boolean) {
  if (reduced || cells.length === 0) return null;

  return gsap.from(cells, {
    autoAlpha: 0,
    scale: 0.4,
    duration: 2,
    ease: "power2.out",
    stagger: byColumn,
    immediateRender: true,
  });
}

/** Africa shape: the active cells "draw in" over the base grid, same
 *  left-to-right order but with more scale punch. */
export function revealActiveCells(cells: Element[], reduced: boolean) {
  if (reduced || cells.length === 0) return null;

  return gsap.from(cells, {
    autoAlpha: 0,
    scale: 0,
    duration: 2.5,
    ease: "back.out(2)",
    stagger: byColumn,
    immediateRender: true,
  });
}
