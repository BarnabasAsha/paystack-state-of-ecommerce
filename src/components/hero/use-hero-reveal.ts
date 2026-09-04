"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { revealGridColumns, revealActiveCells } from "@/lib/reveal/grid-reveal";
import { slideReveal } from "@/lib/reveal/slide-reveal";
import { splitTextReveal } from "@/lib/reveal/split-text-reveal";
import type { SplitText } from "gsap/SplitText";

export function useHeroReveal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const header = root.querySelector<HTMLElement>('[data-reveal="header"]');
      const title = root.querySelector<HTMLElement>('[data-reveal="title"]');
      const description = root.querySelector<HTMLElement>(
        '[data-reveal="description"]',
      );
      const cta = root.querySelector<HTMLElement>('[data-reveal="cta"]');

      if (!reduced)
        gsap.set([title, description].filter(Boolean), { autoAlpha: 0 });

      const splits: SplitText[] = [];
      const revealSplit = (
        element: HTMLElement | null,
        variant: "title" | "paragraph",
      ) => {
        if (!element) return;
        if (!reduced) gsap.set(element, { autoAlpha: 1 });
        const split = splitTextReveal(element, variant, reduced);
        if (split) splits.push(split);
      };

      const headerTween = slideReveal(header, { fromY: -16 }, reduced);
      const ctaTween = slideReveal(cta, { fromY: 16 }, reduced);

      const tl = gsap.timeline();
      if (headerTween) tl.add(headerTween);
      tl.call(() => revealSplit(title, "title"));
      tl.call(() => revealSplit(description, "paragraph"), [], "<0.2");
      if (ctaTween) tl.add(ctaTween, "<0.1");

      // The grid renders zero cells on its first pass — it only knows its
      // real size once its own ResizeObserver fires, a moment after this
      // effect already ran. Wait for real cells to exist rather than
      // racing that.
      const revealGrid = () => {
        const cells = Array.from(
          root.querySelectorAll<HTMLElement>("[data-grid-cell]"),
        );
        if (cells.length === 0) return false;

        const activeCells = cells.filter((cell) => cell.dataset.active === "true");
        const baseCells = cells.filter((cell) => cell.dataset.active !== "true");

        const grid = revealGridColumns(baseCells, reduced);
        // Built eagerly, alongside grid, so its own immediateRender hides
        // it before the base reveal ever runs (otherwise active cells —
        // excluded from that base reveal — would sit fully visible for
        // its whole duration, then snap hidden right as their own turn
        // starts). Paused immediately so it doesn't also autoplay early;
        // .call() below resumes it once grid actually finishes.
        const africa = revealActiveCells(activeCells, reduced);
        africa?.pause(0);

        if (grid || africa) {
          const gridTl = gsap.timeline();
          if (grid) gridTl.add(grid);
          if (africa) gridTl.call(() => africa.play());
        }
        return true;
      };

      let observer: MutationObserver | undefined;
      if (!revealGrid()) {
        observer = new MutationObserver(() => {
          if (revealGrid()) observer?.disconnect();
        });
        observer.observe(root, { childList: true, subtree: true });
      }

      return () => {
        observer?.disconnect();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return rootRef;
}
