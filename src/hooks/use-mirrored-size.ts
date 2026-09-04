"use client";
import { useEffect, type RefObject } from "react";

/** Keeps a CSS var on `targetRef` in sync with `sourceRef`'s measured size. */
export function useMirroredSize(
  sourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  cssVar: string,
  dimension: "width" | "height",
  isEnabled: () => boolean,
) {
  useEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!source || !target || !isEnabled()) return;

    const update = () => {
      target.style.setProperty(cssVar, `${source.getBoundingClientRect()[dimension]}px`);
    };

    const observer = new ResizeObserver(update);
    observer.observe(source);
    update();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once
  }, []);
}
