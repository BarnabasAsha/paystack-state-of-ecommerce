"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { splitTextReveal } from "@/lib/reveal/split-text-reveal";
import { overlapWidth, type Rect } from "@/lib/geometry";
import type { SplitText } from "gsap/SplitText";

const BATCH_STAGGER = 0.15;

export function useEventReveals(reduced: boolean) {
  const revealed = useRef<Set<HTMLElement>>(new Set());
  const splits = useRef<SplitText[]>([]);

  useEffect(() => {
    return () => splits.current.forEach((split) => split.revert());
  }, []);

  const prime = (eventEls: HTMLElement[]) => {
    if (reduced) return;

    const vectors = eventEls
      .map((el) => el.querySelector("[data-reveal-vector]"))
      .filter((el): el is Element => el !== null);
    gsap.set(vectors, { scaleY: 0, transformOrigin: "bottom" });

    const textEls = eventEls
      .flatMap((el) => [
        el.querySelector("[data-reveal-title]"),
        ...Array.from(el.querySelectorAll("[data-reveal-line]")),
      ])
      .filter((el): el is Element => el !== null);
    gsap.set(textEls, { autoAlpha: 0, y: 10 });
  };

  const revealOne = (el: HTMLElement) => {
    const vector = el.querySelector<HTMLElement>("[data-reveal-vector]");
    if (vector) {
      gsap.to(vector, { scaleY: 1, duration: 0.7, ease: "power3.out" });
    }

    const title = el.querySelector<HTMLElement>("[data-reveal-title]");
    if (title) {
      gsap.set(title, { autoAlpha: 1, y: 0 });
      const split = splitTextReveal(title, "paragraph", reduced);
      if (split) splits.current.push(split);
    }

    const lines = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-line]"));
    if (lines.length > 0) {
      gsap.to(lines, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
      });
    }
  };

  const checkReveals = (eventEls: HTMLElement[], viewport: Rect) => {
    if (reduced) return;

    const newlyVisible: HTMLElement[] = [];
    for (const el of eventEls) {
      if (revealed.current.has(el)) continue;
      if (overlapWidth(el.getBoundingClientRect(), viewport) <= 0) continue;
      revealed.current.add(el);
      newlyVisible.push(el);
    }

    newlyVisible.forEach((el, index) => {
      gsap.delayedCall(index * BATCH_STAGGER, () => revealOne(el));
    });
  };

  return { prime, checkReveals };
}
