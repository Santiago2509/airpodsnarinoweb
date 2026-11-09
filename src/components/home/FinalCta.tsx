"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.rings} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className={styles.kicker}>Airpods Nariño</p>
          <h2 id="cta-title" className={styles.title}>
            ¿Listo para escuchar la diferencia?
          </h2>
          <p className={styles.text}>
            Escríbenos y te ayudamos a elegir. Respondemos rápido y enviamos a todo Nariño.
          </p>
          <div className={styles.actions}>
            <a
              href={whatsappUrl("Hola Airpods Nariño, quiero más información.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnWhatsapp"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Escribir por WhatsApp
            </a>
            <Link href="/catalogo" className={`btn ${styles.secondary}`}>
              Ver catálogo <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
