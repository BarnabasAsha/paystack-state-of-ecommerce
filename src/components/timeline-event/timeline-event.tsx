import type { TimelineEvent as TimelineEventData } from "../commerce-timeline/types";
import { VectorVariant, ContentPosition } from "../commerce-timeline/types";
import {
  VectorA,
  VectorB,
  VectorC,
  VectorD,
  VectorE,
  VectorF,
} from "../commerce-timeline/vectors";
import styles from "./timeline-event.module.css";

const resolveVector = (variant: VectorVariant) => {
  switch (variant) {
    case "vector-a":
      return <VectorA />;
    case "vector-b":
      return <VectorB />;
    case "vector-c":
      return <VectorC />;
    case "vector-d":
      return <VectorD />;
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
  top: styles.contentTop,
  "top-center": styles.contentTopCenter,
  "center-left": styles.contentCenterLeft,
  center: styles.contentCenter,
  "bottom-left": styles.contentBottomLeft,
  "bottom-center": styles.contentBottomCenter,
};

export default function TimelineEvent({ data }: { data: TimelineEventData }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.vector}>{resolveVector(data.vector)}</div>
      <div
        className={`${styles.content} ${
          contentPositionClassMap[data.contentPosition]
        }`}
      >
        <h3 className={styles.title}>{data.title}</h3>
        <div className={styles.description}>
          {data.description.map((line, index) => (
            <span key={index} className={styles.line}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
