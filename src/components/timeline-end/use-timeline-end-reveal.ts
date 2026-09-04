"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { splitTextReveal } from "@/lib/reveal/split-text-reveal";
import { slideReveal } from "@/lib/reveal/slide-reveal";
import type { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);

export function useTimelineEndReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      const eyebrow = section.querySelector<HTMLElement>(
        '[data-reveal="eyebrow"]',
      );
      const description = section.querySelector<HTMLElement>(
        '[data-reveal="description"]',
      );
      const button = section.querySelector<HTMLElement>(
        '[data-reveal="button"]',
      );

      gsap.set([eyebrow, description].filter(Boolean), { autoAlpha: 0 });

      const buttonTween = slideReveal(button, { fromY: 20 }, reduced);
      buttonTween?.pause(0);

      const splits: SplitText[] = [];
      const revealSplit = (
        element: HTMLElement | null,
        variant: "title" | "paragraph",
      ) => {
        if (!element) return;
        gsap.set(element, { autoAlpha: 1 });
        const split = splitTextReveal(element, variant, reduced);
        if (split) splits.push(split);
      };

      const play = () => {
        const tl = gsap.timeline();
        tl.call(() => revealSplit(eyebrow, "paragraph"));
        tl.call(() => revealSplit(description, "paragraph"), [], "<0.3");
        tl.call(() => buttonTween?.play(), [], "<0.5");
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 10%",
        once: true,
        onEnter: play,
      });

      return () => {
        trigger.kill();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return sectionRef;
}
