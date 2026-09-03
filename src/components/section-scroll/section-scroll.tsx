"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

const TRANSITION_DURATION = 0.9;

const POST_TRANSITION_LOCK_MS = 250;
const TIMELINE_ANCHOR_SELECTOR = 'a[href="#timeline"]';

type SectionScrollProps = {
  children: ReactNode;
};

export default function SectionScroll({ children }: SectionScrollProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const sections = Array.from(wrapper.children) as HTMLElement[];
      if (sections.length === 0) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let currentIndex = 0;
      let isLocked = false;
      let unlockTimeout: ReturnType<typeof setTimeout> | undefined;

      // In case the page loads already scrolled (e.g. a direct "#timeline"
      // link, or a restored scroll position), sync to the nearest section.
      sections.forEach((section, index) => {
        if (
          Math.abs(section.getBoundingClientRect().top) <
          window.innerHeight / 2
        ) {
          currentIndex = index;
        }
      });

      const goTo = (index: number) => {
        const target = Math.max(0, Math.min(sections.length - 1, index));
        if (isLocked || target === currentIndex) return;

        isLocked = true;
        currentIndex = target;

        gsap.to(window, {
          duration: prefersReducedMotion ? 0 : TRANSITION_DURATION,
          ease: "power2.inOut",
          scrollTo: { y: sections[target], autoKill: false },
          onComplete: () => {
            unlockTimeout = setTimeout(() => {
              isLocked = false;
            }, POST_TRANSITION_LOCK_MS);
          },
        });
      };

      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        preventDefault: true,
        ignore: "a, button, input, select, textarea",
        onDown: () => goTo(currentIndex + 1),
        onUp: () => goTo(currentIndex - 1),
      });

      const onKeydown = (event: KeyboardEvent) => {
        switch (event.key) {
          case "ArrowDown":
          case "PageDown":
            event.preventDefault();
            goTo(currentIndex + 1);
            break;
          case "ArrowUp":
          case "PageUp":
            event.preventDefault();
            goTo(currentIndex - 1);
            break;
          case "Home":
            event.preventDefault();
            goTo(0);
            break;
          case "End":
            event.preventDefault();
            goTo(sections.length - 1);
            break;
          default:
            break;
        }
      };

      window.addEventListener("keydown", onKeydown);

      // The Hero CTA and Header nav both link to "#timeline" natively.
      // Intercept those clicks so they animate through the pager instead
      // of causing a native (un-animated, unsynced) anchor jump.
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement)?.closest?.(
          TIMELINE_ANCHOR_SELECTOR,
        );
        if (!anchor) return;

        const targetIndex = sections.findIndex(
          (section) => section.id === "timeline",
        );
        if (targetIndex === -1) return;

        event.preventDefault();
        goTo(targetIndex);
      };

      wrapper.addEventListener("click", onClick);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKeydown);
        wrapper.removeEventListener("click", onClick);
        clearTimeout(unlockTimeout);
      };
    },
    { scope: wrapperRef },
  );

  return <div ref={wrapperRef}>{children}</div>;
}
