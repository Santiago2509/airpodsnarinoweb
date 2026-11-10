import styles from "./GradientBackground.module.css";

/**
 * Ambient page background, the same language as the final call to action:
 * a slowly rotating glow and faint sound-wave rings, behind everything.
 */
export default function GradientBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.spin} />
      <div className={styles.grid} />
      <div className={styles.rings}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
