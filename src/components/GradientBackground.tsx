"use client";
import styles from "./GradientBackground.module.css";

export default function GradientBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
    </div>
  );
}
