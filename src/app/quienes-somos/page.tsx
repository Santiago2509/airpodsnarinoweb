import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, Headphones, MapPin, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import styles from "./quienes-somos.module.css";

export const metadata: Metadata = {
  title: "Quiénes Somos | Airpods Nariño - Tu tienda Apple de confianza",
  description:
    "Conoce Airpods Nariño, la tienda líder de accesorios y audífonos Apple en Nariño, Colombia. Calidad, garantía directa y la mejor experiencia de sonido.",
  keywords: "Airpods Nariño, Quiénes somos, tienda Apple Pasto, accesorios Apple Colombia, garantía Apple Nariño",
};

const VALUES = [
  { icon: ShieldCheck, title: "Garantía real", text: "Respaldo directo para proteger tu inversión. Si algo sale mal, estamos aquí para solucionarlo." },
  { icon: Zap, title: "Atención rápida", text: "Entregas ágiles y un servicio que prioriza tu tiempo y tus necesidades." },
  { icon: Headphones, title: "Calidad premium", text: "Trabajamos con los mejores estándares para que tu experiencia auditiva sea inigualable." },
  { icon: MapPin, title: "Talento local", text: "Somos una empresa 100% nariñense, comprometida con el desarrollo de nuestra región." },
];

export default function QuienesSomos() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="Nosotros"
        title="Hechos en"
        accent="Nariño."
        subtitle="Tu conexión directa con el sonido de calidad superior, desde Pasto para todo el sur de Colombia."
      />

      <section className="container">
        <Reveal className={styles.storyGrid}>
          <div className={styles.storyLabel}>
            <p className="eyebrow">Nuestra historia</p>
          </div>
          <div className={styles.storyText}>
            <p className={styles.lead}>
              En <strong>Airpods Nariño</strong> nacimos con una misión clara: acercar la tecnología de
              vanguardia y el sonido premium a todos los habitantes de Nariño y Colombia.
            </p>
            <p>
              Sabemos que un buen par de audífonos no solo sirve para escuchar música: transforma tu forma de
              comunicarte, trabajar y vivir cada día. Comenzamos como una pequeña iniciativa en Pasto, buscando
              ofrecer alternativas seguras, confiables y con respaldo real en un mercado lleno de
              incertidumbres.
            </p>
            <p>
              Hoy nos hemos consolidado como la tienda de referencia para adquirir accesorios Apple con total
              tranquilidad.
            </p>
          </div>
        </Reveal>
      </section>

      <section className={`container ${styles.valuesSection}`} aria-labelledby="values-title">
        <h2 id="values-title" className={styles.sectionTitle}>
          Lo que nos <span className="gradientText">define.</span>
        </h2>
        <div className={styles.values}>
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} className={styles.valueCard} delay={i * 0.06}>
              <span className={styles.valueIcon}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container">
        <Reveal className={styles.commitment}>
          <p className="eyebrow">Nuestro compromiso</p>
          <p className={styles.commitmentText}>
            Al elegirnos no solo compras audífonos Apple: inviertes en un ecosistema de confianza, con asesoría
            personalizada para encontrar los AirPods ideales para el deporte, las videollamadas o el audio
            espacial.
          </p>
          <p className={styles.commitmentNote}>
            Únete a los más de 500 clientes que ya disfrutan de la verdadera libertad inalámbrica.
          </p>
          <Link href="/catalogo" className="btn btnPrimary">
            Ver catálogo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
