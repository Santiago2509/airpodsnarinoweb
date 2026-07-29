import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        {/* Decorative Background Elements */}
        <div className={styles.glowBackground}></div>
        <div className={`${styles.floatingElement1} animate-float`}></div>
        <div className={`${styles.floatingElement2} animate-float delay-300`}></div>

        <div className={styles.content}>
          <h1 className={`${styles.title} animate-fade-in-up`}>
            AIRPODS <span className={`${styles.titleAccent} animate-glow delay-200`}>NARIÑO</span>
          </h1>
          
          <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>
            Experiencia de sonido premium con los mejores precios del mercado. 
            Descubre la diferencia de escuchar con calidad.
          </p>
          
          <div className={`${styles.ctaContainer} animate-fade-in-up delay-400`}>
            <Link href="#catalogo">
              <button className={styles.primaryButton}>
                Ver Catálogo
              </button>
            </Link>
            <Link href="#contacto">
              <button className={styles.secondaryButton}>
                Contáctanos
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
