import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  accent: string;
  subtitle: string;
}

export default function PageHero({ title, accent, subtitle }: PageHeroProps) {
  return (
    <header className={styles.hero}>
      <h1 className={styles.title}>
        {title} <span className={styles.titleAccent}>{accent}</span>
      </h1>
      <div className={styles.flareDivider} aria-hidden="true" />
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}
