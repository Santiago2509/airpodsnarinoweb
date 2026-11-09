import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
}

export default function PageHero({ eyebrow, title, accent, subtitle }: PageHeroProps) {
  return (
    <header className={`container ${styles.hero}`}>
      <p className={`eyebrow ${styles.enter}`} style={{ "--d": "0ms" } as React.CSSProperties}>
        {eyebrow}
      </p>
      <h1 className={`${styles.title} ${styles.enter}`} style={{ "--d": "60ms" } as React.CSSProperties}>
        {title} <span className="gradientText">{accent}</span>
      </h1>
      <p className={`${styles.subtitle} ${styles.enter}`} style={{ "--d": "140ms" } as React.CSSProperties}>
        {subtitle}
      </p>
    </header>
  );
}
