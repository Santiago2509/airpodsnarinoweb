"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";
import BrandEmblem from "@/components/brand/BrandEmblem";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Hero.module.css";

const NAME_TOP = "AIRPODS".split("");
const NAME_BOTTOM = "NARIÑO".split("");

/**
 * Brand intro: the animated emblem (rebuilt from the intro film) centred,
 * then the company name builds letter by letter beneath it.
 * - Entrance: CSS only, so it plays smoothly while the page is still loading.
 * - Pointer: the emblem tilts toward the mouse on a spring (mouse only).
 * - Scroll: the whole lockup recedes as the next section arrives.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const lockupY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const lockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const lockupOpacity = useTransform(scrollYProgress, [0.2, 0.85], [1, 0]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-12, 12]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [10, -10]), { stiffness: 120, damping: 18 });

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

  const letters = (chars: string[], offset: number) =>
    chars.map((c, i) => (
      <span key={`${c}-${i}`} className={styles.letter} style={{ "--i": i + offset } as React.CSSProperties}>
        {c}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        className={styles.lockup}
        style={reduce ? { y: 0, scale: 1, opacity: 1 } : { y: lockupY, scale: lockupScale, opacity: lockupOpacity }}
      >
        <motion.div
          className={styles.tilt}
          style={reduce ? { rotateX: 0, rotateY: 0 } : { rotateX, rotateY, transformPerspective: 900 }}
        >
          <BrandEmblem className={styles.emblem} />
        </motion.div>

        <h1 className={styles.name} aria-label="Airpods Nariño">
          <span className={styles.nameTop} aria-hidden="true">
            {letters(NAME_TOP, 0)}
          </span>
          <span className={styles.flare} aria-hidden="true" />
          <span className={styles.nameBottom} aria-hidden="true">
            {letters(NAME_BOTTOM, NAME_TOP.length)}
          </span>
        </h1>

        <p className={`${styles.tagline} ${styles.enter}`} style={{ "--d": "1500ms" } as React.CSSProperties}>
          Accesorios Apple con garantía directa en Pasto y todo Nariño
        </p>

        <div className={`${styles.actions} ${styles.enter}`} style={{ "--d": "1600ms" } as React.CSSProperties}>
          <Link href="/catalogo" className="btn btnPrimary">
            Ver catálogo <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/contacto" className="btn btnGhost">
            Contáctanos
          </Link>
        </div>

        <ul className={`${styles.trust} ${styles.enter}`} style={{ "--d": "1750ms" } as React.CSSProperties}>
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
    </section>
  );
}
