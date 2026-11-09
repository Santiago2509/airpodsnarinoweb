import { Metadata } from "next";
import { MessageCircle, MapPin, Mail, ArrowUpRight, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { EMAIL, INSTAGRAM_URL, PHONE_DISPLAY, TIKTOK_URL, whatsappUrl } from "@/lib/site";
import styles from "./contacto.module.css";

export const metadata: Metadata = {
  title: "Contacto | Airpods Nariño",
  description:
    "Contáctanos vía WhatsApp para adquirir tus AirPods en Pasto y todo Nariño. Síguenos en Instagram y TikTok para conocer nuestras ofertas.",
};

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export default function Contacto() {
  return (
    <main className={styles.main}>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu"
        accent="próximo sonido."
        subtitle="Escríbenos directamente o síguenos en redes. Respondemos rápido y te asesoramos sin compromiso."
      />

      <div className={`container ${styles.bento}`}>
        <Reveal className={styles.whatsappCell}>
          <a
            href={whatsappUrl("Hola Airpods Nariño, quiero más información.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            <span className={styles.whatsappIcon}>
              <MessageCircle size={30} aria-hidden="true" />
            </span>
            <span className={styles.whatsappText}>
              <span className={styles.cardKicker}>La forma más rápida</span>
              <span className={styles.whatsappTitle}>Escríbenos por WhatsApp</span>
              <span className={`${styles.whatsappPhone} tabular`}>{PHONE_DISPLAY}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowUpRight size={22} />
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.06}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <span className={`${styles.cardIcon} ${styles.instagram}`}>
              <InstagramIcon />
            </span>
            <span className={styles.cardKicker}>Instagram</span>
            <span className={styles.cardTitle}>@airpods_narino</span>
            <ArrowUpRight size={20} className={styles.cardArrow} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <span className={`${styles.cardIcon} ${styles.tiktok}`}>
              <TikTokIcon />
            </span>
            <span className={styles.cardKicker}>TikTok</span>
            <span className={styles.cardTitle}>@airpods_narino</span>
            <ArrowUpRight size={20} className={styles.cardArrow} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.06}>
          <a href={`mailto:${EMAIL}`} className={styles.card}>
            <span className={styles.cardIcon}>
              <Mail size={22} aria-hidden="true" />
            </span>
            <span className={styles.cardKicker}>Correo</span>
            <span className={`${styles.cardTitle} ${styles.email}`}>{EMAIL}</span>
            <ArrowUpRight size={20} className={styles.cardArrow} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={`${styles.card} ${styles.static}`}>
            <span className={styles.cardIcon}>
              <MapPin size={22} aria-hidden="true" />
            </span>
            <span className={styles.cardKicker}>Ubicación</span>
            <span className={styles.cardTitle}>Pasto, Nariño</span>
            <span className={styles.cardNote}>Envíos a todo el departamento</span>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className={`${styles.card} ${styles.static}`}>
            <span className={styles.cardIcon}>
              <Clock size={22} aria-hidden="true" />
            </span>
            <span className={styles.cardKicker}>Respuesta</span>
            <span className={styles.cardTitle}>Rápida por WhatsApp</span>
            <span className={styles.cardNote}>Te asesoramos antes de comprar</span>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
