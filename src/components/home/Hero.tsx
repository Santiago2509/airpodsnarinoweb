"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";
import BrandEmblem from "@/components/brand/BrandEmblem";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Hero.module.css";

const LINE_1 = ["El", "sonido"];
const LINE_2 = ["que", "te", "mueve."];

/**
 * The intro film rebuilt as a live animated emblem.
 * - Entrance: CSS only (smooth even while the page is still loading).
 * - Pointer: the emblem tilts toward the mouse on a spring (decorative, mouse only).
 * - Scroll: copy and emblem drift apart and fade as the next section arrives.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const emblemScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const emblemOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), { stiffness: 120, damping: 18 });

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  let wordIndex = 0;
  const word = (w: string) => {
    const i = wordIndex++;
    return (
      <span key={`${w}-${i}`} className={styles.wordMask}>
        <span className={styles.word} style={{ "--i": i } as React.CSSProperties}>
          {w}
        </span>
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={`container ${styles.grid}`}>
        <motion.div className={styles.copy} style={reduce ? { y: 0, opacity: 1 } : { y: copyY, opacity: copyOpacity }}>
          <p className={`${styles.badge} ${styles.enter}`} style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Accesorios Apple en Pasto y todo Nariño
          </p>

          <h1 className={styles.title}>
            <span className={styles.line}>{LINE_1.map(word)}</span>
            <span className={`${styles.line} ${styles.lineAccent}`}>{LINE_2.map(word)}</span>
          </h1>

          <p className={`${styles.subtitle} ${styles.enter}`} style={{ "--d": "380ms" } as React.CSSProperties}>
            AirPods, cargadores, cables, estuches y todo lo que necesitas para tu mundo Apple, con
            garantía directa y envíos a todo el departamento.
          </p>

          <div className={`${styles.actions} ${styles.enter}`} style={{ "--d": "460ms" } as React.CSSProperties}>
            <Link href="/catalogo" className="btn btnPrimary">
              Explorar catálogo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/contacto" className="btn btnGhost">
              Hablar con nosotros
            </Link>
          </div>

          <ul className={`${styles.trust} ${styles.enter}`} style={{ "--d": "560ms" } as React.CSSProperties}>
            <li>
              <ShieldCheck size={16} aria-hidden="true" /> Garantía directa
            </li>
            <li>
              <Truck size={16} aria-hidden="true" /> Envíos a todo Nariño
            </li>
            <li>
              <Star size={16} aria-hidden="true" /> +500 clientes
            </li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.visual}
          style={reduce ? { y: 0, scale: 1, opacity: 1 } : { y: emblemY, scale: emblemScale, opacity: emblemOpacity }}
        >
          <motion.div
            className={styles.tilt}
            style={reduce ? { rotateX: 0, rotateY: 0 } : { rotateX, rotateY, transformPerspective: 900 }}
          >
            <BrandEmblem className={styles.emblem} />
          </motion.div>
          <p className={`${styles.wordmark} ${styles.enterLate}`}>
            AIRPODS <span>NARIÑO</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
