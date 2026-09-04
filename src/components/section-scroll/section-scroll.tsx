"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  SECTION_PASSTHROUGH_EVENT,
  type SectionPassthroughPhase,
} from "@/lib/section-passthrough";

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

      // CommerceTimeline pins itself, which wraps its section in a
      // GSAP-generated pin-spacer and moves it a level deeper — so it's
      // found by containment rather than a direct-child id match.
      const getPassThroughIndex = () => {
        const timelineEl = document.getElementById("timeline");
        return timelineEl
          ? sections.findIndex((s) => s.contains(timelineEl))
          : -1;
      };

      let currentIndex = 0;
      let isLocked = false;
      let isPassingThrough = false;
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
        if (isLocked || isPassingThrough || target === currentIndex) return;

        // Disable the instant we decide to head into the pin, not once we
        // arrive — a real trackpad's momentum keeps feeding wheel events
        // well past when the jump lands, and if Observer is still enabled
        // for that tail, it pages straight through the whole pin.
        if (target === getPassThroughIndex()) {
          isPassingThrough = true;
          observer.disable();
        }

        isLocked = true;
        currentIndex = target;

        const unlock = () => {
          unlockTimeout = setTimeout(() => {
            isLocked = false;
          }, POST_TRANSITION_LOCK_MS);
        };

        gsap.to(window, {
          duration: TRANSITION_DURATION,
          ease: "power2.inOut",
          // autoKill: once Observer is off, real scroll may already be
          // carrying the page past this jump's target — back off rather
          // than fight it. onAutoKill covers unlocking on that path too.
          scrollTo: { y: sections[target], autoKill: true, onAutoKill: unlock },
          onComplete: unlock,
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

      // Loading straight into the pin (e.g. a direct "#timeline" link) —
      // Observer must start disabled, or it'll fight the pin immediately.
      if (currentIndex === getPassThroughIndex()) {
        isPassingThrough = true;
        observer.disable();
      }

      const onKeydown = (event: KeyboardEvent) => {
        if (isPassingThrough) return;

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

        const targetIndex = getPassThroughIndex();
        if (targetIndex === -1) return;

        event.preventDefault();
        goTo(targetIndex);
      };

      wrapper.addEventListener("click", onClick);

      // CommerceTimeline pins itself and scrubs internally — while it's
      // active, native scroll must be the only thing driving it, or it
      // fights Observer's own paging. This is the authoritative signal for
      // when that's the case, dispatched by its own ScrollTrigger.
      const onPassThrough = (event: Event) => {
        const passThroughIndex = getPassThroughIndex();
        if (passThroughIndex === -1) return;
        const phase = (event as CustomEvent<SectionPassthroughPhase>).detail;

        if (phase === "enter" || phase === "enterBack") {
          isPassingThrough = true;
          currentIndex = passThroughIndex;
          observer.disable();
        } else if (phase === "leave") {
          isPassingThrough = false;
          observer.enable();
          goTo(passThroughIndex + 1);
        } else if (phase === "leaveBack") {
          isPassingThrough = false;
          observer.enable();
          goTo(passThroughIndex - 1);
        }
      };

      window.addEventListener(SECTION_PASSTHROUGH_EVENT, onPassThrough);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKeydown);
        wrapper.removeEventListener("click", onClick);
        window.removeEventListener(SECTION_PASSTHROUGH_EVENT, onPassThrough);
        clearTimeout(unlockTimeout);
      };
    },
    { scope: wrapperRef },
  );

  return <div ref={wrapperRef}>{children}</div>;
}
