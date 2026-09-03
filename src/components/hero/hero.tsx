import Header from "../header/header";
import HeroCircleGrid from "../hero-circle-grid/hero-circle-grid";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Header />
      <section className={styles["hero_section"]}>
        <div className={styles["hero_section_container"]}>
          <div className={styles["hero_section_container_content"]}>
            <h1 className={styles["hero_section_container_content_title"]}>
              <span
                className={
                  styles["hero_section_container_content_title-accent"]
                }
              >
                State of
              </span>
              <span
                className={styles["hero_section_container_content_title-main"]}
              >
                Ecommerce
              </span>
              <span
                className={styles["hero_section_container_content_title-main"]}
              >
                in Africa
              </span>
            </h1>
            <p className={styles["hero_section_container_content_description"]}>
              A comprehensive review of the ground truth of ecommerce and the
              biggest ecommerce related trends. Compiled by Paystack
            </p>
            <a
              href="#timeline"
              className={styles["hero_section_container_content_cta"]}
            >
              Explore the Report
            </a>
          </div>
        </div>
      </section>
      <HeroCircleGrid />
    </div>
  );
}
