"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { measureOverflowAwareWidth } from "@/lib/geometry";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins `triggerRef` and scrubs `trackRef` horizontally across its full
 * (overflow-aware) width. `setup()` runs once before the tween is created
 * and returns the per-tick update handler.
 */
export function useHorizontalScrubPin({
  triggerRef,
  viewportRef,
  trackRef,
  overflowSelector,
  trailingSpaceRatio = 0,
  scrollDistanceRatio = 1,
  setup,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  viewportRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLElement | null>;
  overflowSelector?: string;
  trailingSpaceRatio?: number;
  // >1 stretches the vertical scroll distance needed to cover the track,
  // slowing the horizontal scrub relative to scroll input.
  scrollDistanceRatio?: number;
  setup: () => (() => void) | undefined;
}) {
  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!trigger || !viewport || !track) return;

      const onUpdate = setup();
      if (!onUpdate) return;

      const overflowEls = overflowSelector
        ? Array.from(track.querySelectorAll<HTMLElement>(overflowSelector))
        : [];

      const trackWidth = () =>
        measureOverflowAwareWidth(
          track.getBoundingClientRect(),
          overflowEls.map((el) => el.getBoundingClientRect()),
        );

      const maxX = () => {
        const trailing = viewport.clientWidth * trailingSpaceRatio;
        return Math.max(0, trackWidth() + trailing - viewport.clientWidth);
      };

      const tween = gsap.to(track, {
        x: () => -maxX(),
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: () => `+=${maxX() * scrollDistanceRatio}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate,
        },
      });

      onUpdate();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: triggerRef },
  );
}
