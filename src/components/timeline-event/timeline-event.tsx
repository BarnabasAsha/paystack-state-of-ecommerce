import type {
  TimelineEvent as TimelineEventData,
  PhaseTheme,
} from "../commerce-timeline/types";
import { VectorVariant, ContentPosition } from "../commerce-timeline/types";
import { VectorA, VectorB, VectorC, VectorE, VectorF } from "../vectors";
import styles from "./timeline-event.module.css";

const resolveVector = (variant: VectorVariant) => {
  switch (variant) {
    case "vector-a":
      return <VectorA />;
    case "vector-b":
      return <VectorB />;
    case "vector-c":
      return <VectorC />;
    case "vector-e":
      return <VectorE />;
    case "vector-f":
      return <VectorF />;
    default: {
      const _exhaustiveCheck: never = variant;
      return _exhaustiveCheck;
    }
  }
};

const contentPositionClassMap: Record<ContentPosition, string> = {
  "top-left": styles.contentTopLeft,
  "upper-left": styles.contentUpperLeft,
  "flush-top-left": styles.contentFlushTopLeft,
  "high-left": styles.contentHighLeft,
  top: styles.contentTop,
  "top-center": styles.contentTopCenter,
  "center-left": styles.contentCenterLeft,
  "lower-left": styles.contentLowerLeft,
  center: styles.contentCenter,
  "bottom-left": styles.contentBottomLeft,
  "bottom-center": styles.contentBottomCenter,
};

const themeClassMap: Record<PhaseTheme, string> = {
  orange: styles.themeOrange,
  red: styles.themeRed,
  green: styles.themeGreen,
};

const pillClassMap: Record<PhaseTheme, string> = {
  orange: styles.pillOrange,
  red: styles.pillRed,
  green: styles.pillGreen,
};

export default function TimelineEvent({
  data,
  theme,
  yearId,
}: {
  data: TimelineEventData;
  theme: PhaseTheme;
  yearId: string;
}) {
  return (
    // Read by CommerceTimeline's scrub logic to find the visible phase/year.
    <div
      className={styles.wrapper}
      data-phase-theme={theme}
      data-year-id={yearId}
    >
      <div className={`${styles.vector} ${themeClassMap[theme]}`}>
        {resolveVector(data.vector)}
      </div>
      <div
        // .content can overflow .wrapper — used to measure real track width.
        data-event-content
        className={`${styles.content} ${
          contentPositionClassMap[data.contentPosition]
        }`}
      >
        <h3 className={`${styles.title} ${pillClassMap[theme]}`}>
          {data.title}
        </h3>
        <div className={styles.description}>
          {data.description.map((line, index) => (
            <span
              key={index}
              className={`${styles.line} ${pillClassMap[theme]}`}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
