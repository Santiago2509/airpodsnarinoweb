import { Metadata } from "next";
import styles from "./quienes-somos.module.css";
import { ShieldCheck, Zap, Headphones, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Quiénes Somos | Airpods Nariño - Tu tienda Apple de confianza",
  description: "Conoce Airpods Nariño, la tienda líder de accesorios y audífonos Apple en Nariño, Colombia. Ofrecemos calidad, garantía directa y la mejor experiencia de sonido para ti.",
  keywords: "Airpods Nariño, Quiénes somos, tienda Apple Pasto, accesorios Apple Colombia, garantía Apple Nariño",
};

export default function QuienesSomos() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Acerca de <span className={styles.titleAccent}>Airpods Nariño</span>
        </h1>
        <div className={styles.flareDivider}></div>
        <p className={styles.subtitle}>
          Tu conexión directa con el sonido de calidad superior
        </p>
      </div>

      <div className={styles.contentContainer}>
        <section className={styles.textSection}>
          <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
          <p>
            En <strong>Airpods Nariño</strong> nacimos con una misión clara: acercar la tecnología de vanguardia y el sonido premium a todos los habitantes del departamento de Nariño y Colombia. Sabemos que un buen par de audífonos no solo sirve para escuchar música, sino que transforma tu forma de comunicarte, trabajar y vivir cada día.
          </p>
          <p>
            Comenzamos como una pequeña iniciativa en Pasto, buscando ofrecer alternativas seguras, confiables y con respaldo real en un mercado lleno de incertidumbres. Hoy, nos hemos consolidado como la tienda de referencia para adquirir accesorios Apple con total tranquilidad.
          </p>
        </section>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <ShieldCheck className={styles.icon} size={40} />
            <h3>Garantía Real</h3>
            <p>Respaldo directo y soporte para proteger tu inversión. Si algo sale mal, estamos aquí para solucionarlo.</p>
          </div>
          <div className={styles.featureCard}>
            <Zap className={styles.icon} size={40} />
            <h3>Atención Rápida</h3>
            <p>Entregas ágiles y un servicio al cliente que prioriza tu tiempo y tus necesidades.</p>
          </div>
          <div className={styles.featureCard}>
            <Headphones className={styles.icon} size={40} />
            <h3>Calidad Premium</h3>
            <p>Solo trabajamos con los mejores estándares del mercado para asegurar que tu experiencia auditiva sea inigualable.</p>
          </div>
          <div className={styles.featureCard}>
            <MapPin className={styles.icon} size={40} />
            <h3>Talento Local</h3>
            <p>Somos una empresa 100% nariñense, comprometida con el desarrollo comercial y tecnológico de nuestra región.</p>
          </div>
        </div>

        <section className={styles.textSection}>
          <h2 className={styles.sectionTitle}>Nuestro Compromiso (SEO)</h2>
          <p>
            Al elegir <strong>Airpods Nariño</strong>, no solo estás comprando audífonos Apple en Pasto o el resto del país; estás invirtiendo en un ecosistema de confianza. Nos aseguramos de brindarte asesoría personalizada para que encuentres los AirPods ideales, ya sea para hacer deporte, realizar videollamadas con cancelación de ruido, o disfrutar del audio espacial inmersivo.
          </p>
          <p>
            Únete a los más de 500 clientes satisfechos que ya disfrutan de la verdadera libertad inalámbrica con nosotros.
          </p>
        </section>
      </div>
    </main>
  );
}
