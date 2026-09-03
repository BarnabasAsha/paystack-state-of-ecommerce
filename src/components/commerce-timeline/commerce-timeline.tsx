"use client";
import { useEffect, useRef } from "react";
import styles from "./commerce-timeline.module.css";
import { commerceTimelineData } from "./data";
import TimelineEvent from "../timeline-event/timeline-event";
import TimelineDot from "../timeline-dot/timeline-dot";
import ChevronDown from "../chevron-down";

export default function CommerceTimeline() {
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updateGradient = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const timelineRect = timeline.getBoundingClientRect();

      if (timelineRect.height === 0) return;

      const boundaries = phaseRefs.current.slice(0, -1).flatMap((phase) => {
        if (!phase) return [];

        const phaseRect = phase.getBoundingClientRect();

        const percentage =
          ((phaseRect.bottom - timelineRect.top) / timelineRect.height) * 100;

        return [Math.min(100, Math.max(0, percentage))];
      });

      const colors = ["#ffad00", "#e9623b", "#285056"];
      const transitionSize = 1.1;

      const stops = [`${colors[0]} 0%`];

      boundaries.forEach((boundary, index) => {
        stops.push(
          `${colors[index]} ${Math.max(0, boundary - transitionSize)}%`,
          `${colors[index + 1]} ${Math.min(100, boundary + transitionSize)}%`,
        );
      });

      stops.push(`${colors.at(-1)} 100%`);

      timeline.style.backgroundImage = `linear-gradient(
    180deg,
    ${stops.join(", ")}
  )`;
    };

    const observer = new ResizeObserver(updateGradient);

    observer.observe(timeline);
    phaseRefs.current.forEach((phase) => phase && observer.observe(phase));

    updateGradient();

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles["commerce-timeline"]}>
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
                { "--phase-growth": phase.events.length } as React.CSSProperties
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
                {phase.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={
                      styles[
                        "commerce-timeline_container_lcol_wrapper_list_item"
                      ]
                    }
                  >
                    {ev.yearLabel}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles["commerce-timeline_container_rcol"]}>
          <h2 className={styles["commerce-timeline_container_rcol_title"]}>
            The advent of GSM technology and mobile internet.
          </h2>

          <div className={styles["commerce-timeline_container_rcol_track"]}>
            {commerceTimelineData[2].events.map((it) => (
              <TimelineEvent key={it.id} data={it} />
            ))}
          </div>
        </div>

        <button className={styles["commerce-timeline_container_sources"]}>
          <span>Sources</span> <ChevronDown />
        </button>
      </div>
      <TimelineDot />
    </section>
  );
}
