import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export type SplitTextVariant = "title" | "paragraph";

export function splitTextReveal(
  element: HTMLElement | null,
  variant: SplitTextVariant,
  reduced: boolean,
): SplitText | null {
  if (!element || reduced) return null;

  return variant === "title"
    ? new SplitText(element, {
        type: "words, chars",
        autoSplit: true,
        mask: "chars",
        charsClass: "char",
        onSplit: (self) =>
          gsap.from(self.chars, {
            duration: 1,
            yPercent: -120,
            scale: 1.2,
            stagger: 0.01,
            ease: "expo.out",
          }),
      })
    : new SplitText(element, {
        type: "lines, words",
        autoSplit: true,
        mask: "lines",
        linesClass: "line",
        onSplit: (self) =>
          gsap.from(self.lines, {
            duration: 0.9,
            yPercent: 105,
            stagger: 0.04,
            ease: "expo.out",
          }),
      });
}
