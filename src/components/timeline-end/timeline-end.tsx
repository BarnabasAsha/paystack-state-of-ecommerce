"use client";
import DoubleChevron from "../double-chevron";
import { useTimelineEndReveal } from "./use-timeline-end-reveal";
import styles from "./timeline-end.module.css";

export default function TimelineEnd() {
  const sectionRef = useTimelineEndReveal();

  return (
    <section ref={sectionRef} className={styles["timeline-end"]}>
      <div className={styles["timeline-end_container"]}>
        <div className={styles["timeline-end_container_content"]}>
          <div
            data-reveal="eyebrow"
            className={styles["timeline-end_container_content_title"]}
          >
            NEXT CHAPTER
          </div>
          <p
            data-reveal="description"
            className={styles["timeline-end_container_content_description"]}
          >
            A look at some of the biggest trends observed from our vantage point
            as one of the largest online payment service providers in
            Africa&apos;s largest market.
          </p>

          <button
            data-reveal="button"
            className={styles["timeline-end_container_content_btn"]}
          >
            <span>Commerce Trends in Africa</span>
            <DoubleChevron />
          </button>
        </div>
      </div>
    </section>
  );
}
