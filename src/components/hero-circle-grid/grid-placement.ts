import type { Breakpoint } from "./use-breakpoint";
import { SHAPE_COLUMNS, SHAPE_ROWS } from "./africa-shape";

export type Alignment = "start" | "center" | "end";

export type ShapePlacement = {
  offsetX?: number;
  offsetY?: number;
  alignX?: Alignment;
  alignY?: Alignment;
  insetX?: number;
  insetY?: number;
};

export const placementByBreakpoint: Record<Breakpoint, ShapePlacement> = {
  desktop: { alignX: "end", alignY: "center", insetX: 3 },
  tablet: { alignX: "end", alignY: "end", insetX: 1, insetY: 1 },
  mobile: { alignX: "end", alignY: "end", insetX: 1, insetY: 1 },
};

export function computeActiveCells(
  shapeCells: Array<[number, number]>,
  columns: number,
  rows: number,
  placement: ShapePlacement,
): Set<string> {
  const {
    alignX = "end",
    alignY = "center",
    insetX = 0,
    insetY = 0,
  } = placement;

  const offsetX =
    placement.offsetX ??
    (alignX === "start"
      ? insetX
      : alignX === "end"
        ? columns - SHAPE_COLUMNS - insetX
        : Math.round((columns - SHAPE_COLUMNS) / 2));

  const offsetY =
    placement.offsetY ??
    (alignY === "start"
      ? insetY
      : alignY === "end"
        ? rows - SHAPE_ROWS - insetY
        : Math.round((rows - SHAPE_ROWS) / 2));

  const active = new Set<string>();
  for (const [localCol, localRow] of shapeCells) {
    const col = offsetX + localCol;
    const row = offsetY + localRow;
    if (col >= 0 && col < columns && row >= 0 && row < rows) {
      active.add(`${row}-${col}`);
    }
  }
  return active;
}
