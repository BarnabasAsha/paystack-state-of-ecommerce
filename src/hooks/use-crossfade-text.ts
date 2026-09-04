"use client";
import { useCallback, useRef, type RefObject } from "react";
import gsap from "gsap";

/** Returns a setter that fades `elementRef`'s text out/in on change, skipping repeats. */
export function useCrossfadeText(
  elementRef: RefObject<HTMLElement | null>,
  {
    initialValue,
    restOpacity = 1,
    duration = 0.25,
  }: { initialValue?: string; restOpacity?: number; duration?: number } = {},
) {
  const currentRef = useRef(initialValue);

  return useCallback(
    (value: string) => {
      const el = elementRef.current;
      if (!el || value === currentRef.current) return;
      currentRef.current = value;

      gsap.to(el, {
        opacity: 0,
        duration,
        onComplete: () => {
          el.textContent = value;
          gsap.to(el, { opacity: restOpacity, duration });
        },
      });
    },
    [elementRef, restOpacity, duration],
  );
}
