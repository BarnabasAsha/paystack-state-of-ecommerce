import gsap from "gsap";

type SlideRevealOptions = {
  fromY?: number;
  duration?: number;
  ease?: string;
};

/**
 * Generic fade + vertical-slide entrance. Positive `fromY` fades up into
 * place; negative slides down (e.g. a header dropping in from above).
 */
export function slideReveal(
  element: Element | null,
  { fromY = 16, duration = 0.6, ease = "power3.out" }: SlideRevealOptions = {},
  reduced = false,
) {
  if (!element || reduced) return null;

  // immediateRender: this is created up front but plays later in a parent
  // timeline — without it, GSAP wouldn't apply the hidden starting state
  // until its turn, leaving the element flash fully visible until then.
  return gsap.from(element, {
    autoAlpha: 0,
    y: fromY,
    duration,
    ease,
    immediateRender: true,
  });
}
