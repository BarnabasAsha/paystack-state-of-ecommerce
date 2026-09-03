"use client";
import { useMemo } from "react";
import { useGridDimensions } from "./use-grid-dimensions";
import { useBreakpoint, type Breakpoint } from "./use-breakpoint";
import { africaShapeCells } from "./africa-shape";
import { computeActiveCells, placementByBreakpoint } from "./grid-placement";
import styles from "./hero-circle-grid.module.css";

const cellConfigByBreakpoint: Record<
  Breakpoint,
  { cellSize: number; gap: number }
> = {
  desktop: { cellSize: 16, gap: 32 },
  tablet: { cellSize: 12, gap: 24 },
  mobile: { cellSize: 8, gap: 14 },
};

const FAINT_COLUMN_RATIO = 0.3;

export default function HeroCircleGrid() {
  const breakpoint = useBreakpoint();
  const { cellSize, gap } = cellConfigByBreakpoint[breakpoint];
  const { ref, columns, rows } = useGridDimensions(cellSize, gap);

  const activeSet = useMemo(
    () =>
      computeActiveCells(
        africaShapeCells,
        columns,
        rows,
        placementByBreakpoint[breakpoint],
      ),
    [columns, rows, breakpoint],
  );

  const cellCount = rows * columns;
  const faintColumnThreshold = Math.ceil(columns * FAINT_COLUMN_RATIO);

  return (
    <div ref={ref} className={styles["hero-grid_wrapper"]}>
      <div
        className={styles["hero-grid_wrapper_grid"]}
        style={
          {
            "--columns": columns,
            "--cell-size": `${cellSize}px`,
            "--gap": `${gap}px`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: cellCount }).map((_, index) => {
          const row = Math.floor(index / columns);
          const col = index % columns;
          const active = activeSet.has(`${row}-${col}`);
          const isFaintColumn = col < faintColumnThreshold;

          return (
            <div
              key={index}
              className={`${styles["hero-grid_wrapper_grid_circle"]} ${
                active
                  ? styles["hero-grid_wrapper_grid_circle-active"]
                  : isFaintColumn
                    ? styles["hero-grid_wrapper_grid_circle-faint"]
                    : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
