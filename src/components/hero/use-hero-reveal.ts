"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { revealGridColumns, revealActiveCells } from "@/lib/reveal/grid-reveal";
import { slideReveal } from "@/lib/reveal/slide-reveal";
import { splitTextReveal } from "@/lib/reveal/split-text-reveal";
import type { SplitText } from "gsap/SplitText";

/**
 * Orchestrates the hero's on-load sequence: grid columns → africa shape
 * drawing in over it → header sliding down → title/description splitting
 * in → CTA fading up. Children are found via plain `data-*` attributes
 * rather than reaching into their CSS Modules, so this stays decoupled
 * from their internals.
 */
export function useHeroReveal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const cells = Array.from(
        root.querySelectorAll<HTMLElement>("[data-grid-cell]"),
      );
      const activeCells = cells.filter((cell) => cell.dataset.active === "true");
      // Excluded from the base grid tween below — animating the same
      // elements' opacity/scale on two overlapping tweens fights, and the
      // dedicated "draw in" pass ends up invisible.
      const baseCells = cells.filter((cell) => cell.dataset.active !== "true");
      const header = root.querySelector<HTMLElement>('[data-reveal="header"]');
      const title = root.querySelector<HTMLElement>('[data-reveal="title"]');
      const description = root.querySelector<HTMLElement>(
        '[data-reveal="description"]',
      );
      const cta = root.querySelector<HTMLElement>('[data-reveal="cta"]');

      // Split-text reveals build their tween lazily, inside the timeline
      // callbacks below, so — unlike the tweens above — there's nothing to
      // mark immediateRender on; hide their targets up front instead, or
      // they'd flash fully visible until their turn comes.
      if (!reduced) gsap.set([title, description].filter(Boolean), { autoAlpha: 0 });

      const splits: SplitText[] = [];
      const revealSplit = (element: HTMLElement | null, variant: "title" | "paragraph") => {
        if (!element) return;
        if (!reduced) gsap.set(element, { autoAlpha: 1 });
        const split = splitTextReveal(element, variant, reduced);
        if (split) splits.push(split);
      };

      const tl = gsap.timeline();
      const grid = revealGridColumns(baseCells, reduced);
      const africa = revealActiveCells(activeCells, reduced);
      const headerTween = slideReveal(header, { fromY: -16 }, reduced);
      const ctaTween = slideReveal(cta, { fromY: 16 }, reduced);

      if (grid) tl.add(grid);
      if (africa) tl.add(africa, "<0.3");
      if (headerTween) tl.add(headerTween);
      tl.call(() => revealSplit(title, "title"));
      tl.call(() => revealSplit(description, "paragraph"), [], "<0.2");
      if (ctaTween) tl.add(ctaTween, "<0.1");

      return () => splits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return rootRef;
}
