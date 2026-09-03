import styles from "./timeline-dot.module.css";
import { clsx } from "clsx";

export default function TimelineDot() {
  return (
    <div className={styles["timeline-dot"]}>
      <div
        className={clsx(
          styles["timeline-dot_one"],
          styles["timeline-dot_flex"],
        )}
      >
        <div
          className={clsx(
            styles["timeline-dot_two"],
            styles["timeline-dot_flex"],
          )}
        >
          <div
            className={clsx(
              styles["timeline-dot_three"],
              styles["timeline-dot_flex"],
            )}
          >
            <div
              className={clsx(
                styles["timeline-dot_four"],
                styles["timeline-dot_flex"],
              )}
            >
              <div className={clsx(styles["timeline-dot_five"])}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
