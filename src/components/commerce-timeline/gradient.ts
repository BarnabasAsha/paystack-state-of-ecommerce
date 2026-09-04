import type { PhaseTheme } from "./types";

// Mirrors globals.css — literal hex since these are used at scroll time, not via CSS.
export const PHASE_COLORS: Record<PhaseTheme, string> = {
  orange: "#ffac00",
  red: "#e9623b",
  green: "#285056",
};

/** Gradient stops from ordered colors + boundary percentages, with a soft transition at each. */
export function buildGradientStops(
  colors: string[],
  boundaries: number[],
  transitionSize = 1.1,
): string {
  if (colors.length === 0) return "";
  if (colors.length === 1) return `${colors[0]} 0%, ${colors[0]} 100%`;

  const stops = [`${colors[0]} 0%`];

  boundaries.forEach((boundary, index) => {
    stops.push(
      `${colors[index]} ${Math.max(0, boundary - transitionSize)}%`,
      `${colors[index + 1]} ${Math.min(100, boundary + transitionSize)}%`,
    );
  });

  stops.push(`${colors.at(-1)} 100%`);

  return stops.join(", ");
}
