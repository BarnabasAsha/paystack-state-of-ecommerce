"use client";
import { useEffect, useRef } from "react";
import styles from "./commerce-timeline.module.css";
import { commerceTimelineData, phaseByTheme, trackItems } from "./data";
import { buildGradientStops, PHASE_COLORS } from "./gradient";
import { computeDotOffset } from "./compute-dot-offset";
import {
  boundariesFromEdges,
  computeInViewRuns,
  findClosestToCenter,
  groupBoundsByKey,
  runsToBoundaries,
  widestRun,
} from "@/lib/geometry";
import { centerScrollTo, clamp, progressBetween } from "@/lib/scroll-math";
import { useMirroredSize } from "@/hooks/use-mirrored-size";
import { useCrossfadeText } from "@/hooks/use-crossfade-text";
import { useActiveMarker } from "@/hooks/use-active-marker";
import { useHorizontalScrubPin } from "@/hooks/use-horizontal-scrub-pin";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEventReveals } from "./use-event-reveals";
import type { PhaseTheme } from "./types";
import TimelineEvent from "../timeline-event/timeline-event";
import TimelineDot from "../timeline-dot/timeline-dot";
import ChevronDown from "../chevron-down";

const LCOL_TRANSITION_SIZE = 1.1; // desktop wash
const INVIEW_TRANSITION_SIZE = 10; // dynamic rcol/mobile-lcol blend

const TRAILING_SPACE_RATIO = 0.2;

const DOT_INSET = 14;

const getRect = (el: HTMLElement) => el.getBoundingClientRect();
const getYearKey = (el: HTMLElement) => el.dataset.yearId;
const getThemeKey = (el: HTMLElement) => el.dataset.phaseTheme;

export default function CommerceTimeline() {
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null); // lcol
  const sectionRef = useRef<HTMLElement | null>(null);
  const rcolRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const activeYear = useActiveMarker(
    styles["commerce-timeline_container_lcol_wrapper_list_item-active"],
  );

  const setPhaseTitle = useCrossfadeText(titleRef, {
    initialValue: commerceTimelineData[0]?.description,
    restOpacity: 0.3,
  });

  const { prime: primeEventReveals, checkReveals: checkEventReveals } =
    useEventReveals(useReducedMotion());

  useMirroredSize(
    timelineRef,
    sectionRef,
    "--mobile-lcol-height",
    "height",
    () => window.innerWidth < 820,
  );

  // Lets the sticky phase title's box match the viewport width
  useMirroredSize(
    timelineRef,
    sectionRef,
    "--mobile-lcol-width",
    "width",
    () => window.innerWidth < 820,
  );

  useMirroredSize(
    timelineRef,
    sectionRef,
    "--dot-x-offset",
    "width",
    () => window.innerWidth > 820,
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (window.innerWidth <= 820) return;

    const update = () => {
      const timelineRect = timeline.getBoundingClientRect();
      if (timelineRect.height === 0) return;

      const edges = phaseRefs.current
        .slice(0, -1)
        .flatMap((phase) =>
          phase ? [phase.getBoundingClientRect().bottom] : [],
        );

      const boundaries = boundariesFromEdges(
        edges,
        timelineRect.top,
        timelineRect.height,
      );
      const colors = commerceTimelineData.map(
        (phase) => PHASE_COLORS[phase.theme],
      );

      timeline.style.backgroundImage = `linear-gradient(180deg, ${buildGradientStops(
        colors,
        boundaries,
        LCOL_TRANSITION_SIZE,
      )})`;
    };

    const observer = new ResizeObserver(update);
    observer.observe(timeline);
    phaseRefs.current.forEach((phase) => phase && observer.observe(phase));
    update();

    return () => observer.disconnect();
  }, []);

  // Each scrub tick updates the gradient, phase title, and dot position
  // from whatever's currently visible in rcol.
  useHorizontalScrubPin({
    triggerRef: sectionRef,
    viewportRef: rcolRef,
    trackRef,
    overflowSelector: "[data-event-content]",
    trailingSpaceRatio: TRAILING_SPACE_RATIO,
    setup: () => {
      const section = sectionRef.current;
      const rcol = rcolRef.current;
      const track = trackRef.current;
      const lcol = timelineRef.current;
      if (!section || !rcol || !track || !lcol) return;

      const eventEls = Array.from(
        track.querySelectorAll<HTMLElement>("[data-phase-theme]"),
      );
      if (eventEls.length === 0) return;

      primeEventReveals(eventEls);

      // Measured once, before any transform — stays valid since
      // translateX moves track and its children together.
      const trackOrigin = track.getBoundingClientRect();
      const yearBounds = groupBoundsByKey(
        eventEls,
        trackOrigin,
        getRect,
        getYearKey,
      );
      // Map preserves insertion order, which follows DOM/chronological order.
      const firstYearId = yearBounds.keys().next().value ?? null;

      const updateDot = (rawOffset: number) => {
        const isMobile = window.innerWidth < 820;
        const length = isMobile
          ? lcol.scrollWidth
          : lcol.getBoundingClientRect().height;

        const offset = clamp(
          rawOffset,
          DOT_INSET,
          Math.max(DOT_INSET, length - DOT_INSET),
        );

        if (isMobile) {
          const { scrollPosition, visibleOffset } = centerScrollTo(
            offset,
            lcol.scrollWidth,
            lcol.clientWidth,
          );
          lcol.scrollLeft = scrollPosition;
          section.style.setProperty("--dot-y-offset", `${visibleOffset}px`);
        } else {
          section.style.setProperty("--dot-y-offset", `${offset}px`);
        }
      };

      return () => {
        const rcolRect = rcol.getBoundingClientRect();
        const trackRectNow = track.getBoundingClientRect();

        if (rcolRect.top < window.innerHeight && rcolRect.bottom > 0) {
          checkEventReveals(eventEls, rcolRect);
        }

        const atStart = Math.abs(trackRectNow.left - trackOrigin.left) < 1;

        const bestYearId = atStart
          ? firstYearId
          : findClosestToCenter(eventEls, rcolRect, getRect, getYearKey);
        if (bestYearId) activeYear.setActive(bestYearId);

        const currentYearId = activeYear.activeId.current;
        if (currentYearId) {
          const rowEl = activeYear.elements.current.get(currentYearId);
          const bounds = yearBounds.get(currentYearId);

          if (rowEl && bounds) {
            const center =
              rcolRect.left + rcolRect.width / 2 - trackRectNow.left;
            const withinProgress = progressBetween(
              center,
              bounds.left,
              bounds.right,
            );

            updateDot(
              computeDotOffset({
                rowRect: rowEl.getBoundingClientRect(),
                lcolRect: lcol.getBoundingClientRect(),
                scrollLeft: lcol.scrollLeft,
                isMobile: window.innerWidth < 820,
                withinProgress,
              }),
            );
          }
        }

        const runs = computeInViewRuns(
          eventEls,
          rcolRect,
          getRect,
          getThemeKey,
        );
        if (runs.length === 0) return;

        const colors = runs.map((run) => PHASE_COLORS[run.key as PhaseTheme]);
        const boundaries = runsToBoundaries(runs, rcolRect);
        const gradient = `linear-gradient(90deg, ${buildGradientStops(
          colors,
          boundaries,
          INVIEW_TRANSITION_SIZE,
        )})`;

        rcol.style.backgroundImage = gradient;
        if (window.innerWidth < 820) {
          lcol.style.backgroundImage = gradient;
        }

        const dominant = widestRun(runs);
        const dominantPhase =
          dominant && phaseByTheme.get(dominant.key as PhaseTheme);
        if (dominantPhase) setPhaseTitle(dominantPhase.description);
      };
    },
  });

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={styles["commerce-timeline"]}
    >
      <div className={styles["commerce-timeline_container"]}>
        <div
          ref={timelineRef}
          className={styles["commerce-timeline_container_lcol"]}
        >
          {commerceTimelineData.map((phase, index) => (
            <div
              key={phase.id}
              className={styles["commerce-timeline_container_lcol_wrapper"]}
              style={
                { "--phase-growth": phase.years.length } as React.CSSProperties
              }
              ref={(element) => {
                phaseRefs.current[index] = element;
              }}
            >
              <div
                className={
                  styles["commerce-timeline_container_lcol_wrapper_title"]
                }
              >
                <h5>{phase.title}</h5>
              </div>
              <div
                className={
                  styles["commerce-timeline_container_lcol_wrapper_list"]
                }
              >
                {phase.years.map((year) => (
                  <div
                    key={year.id}
                    ref={activeYear.register(year.id)}
                    className={
                      styles[
                        "commerce-timeline_container_lcol_wrapper_list_item"
                      ]
                    }
                  >
                    {year.yearLabel}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          ref={rcolRef}
          className={styles["commerce-timeline_container_rcol"]}
        >
          <h2
            ref={titleRef}
            className={styles["commerce-timeline_container_rcol_title"]}
          >
            {commerceTimelineData[0].description}
          </h2>

          <div
            ref={trackRef}
            className={styles["commerce-timeline_container_rcol_track"]}
          >
            {trackItems.map(({ phase, year, event }) => (
              <TimelineEvent
                key={event.id}
                data={event}
                theme={phase.theme}
                yearId={year.id}
              />
            ))}
          </div>
        </div>
      </div>
      <button className={styles["commerce-timeline_sources"]}>
        <span>Sources</span> <ChevronDown />
      </button>
      <TimelineDot />
    </section>
  );
}
