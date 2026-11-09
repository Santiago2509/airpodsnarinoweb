import styles from "./Marquee.module.css";

const ITEMS = [
  "Garantía directa",
  "AirPods Pro",
  "Envíos a todo Nariño",
  "AirPods 4",
  "Cargadores MagSafe",
  "Asesoría personalizada",
  "Estuches y accesorios",
  "+500 clientes felices",
];

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} className={styles.item}>
          {item}
          <span className={styles.star} aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={styles.marquee} aria-label="Lo que ofrecemos">
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
