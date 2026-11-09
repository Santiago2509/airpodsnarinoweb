"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LayoutGrid, MessageCircle, PackageCheck } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./HowToBuy.module.css";

const STEPS = [
  { icon: LayoutGrid, title: "Elige", text: "Explora el catálogo y encuentra tus audífonos o accesorios ideales." },
  { icon: MessageCircle, title: "Escríbenos", text: "Un clic y hablas con nosotros por WhatsApp. Te asesoramos sin compromiso." },
  { icon: PackageCheck, title: "Recíbelo", text: "Entregamos en Pasto y enviamos a todo Nariño, con garantía directa." },
];

export default function HowToBuy() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  // The connecting line draws itself as the steps scroll through the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="how-title">
      <div className="container">
        <p className="eyebrow">Así de fácil</p>
        <h2 id="how-title" className={styles.title}>
          Comprar es <span className="gradientText">simple.</span>
        </h2>

        <div className={styles.stepsWrap}>
          <div className={`${styles.line} ${styles.lineH}`} aria-hidden="true">
            <motion.span className={styles.lineFill} style={{ scaleX: reduce ? 1 : lineScale }} />
          </div>
          <div className={`${styles.line} ${styles.lineV}`} aria-hidden="true">
            <motion.span className={styles.lineFill} style={{ scaleY: reduce ? 1 : lineScale }} />
          </div>
          <ol className={styles.steps}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={styles.step}>
                <span className={styles.number}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className={styles.stepIndex}>Paso {i + 1}</span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepText}>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
