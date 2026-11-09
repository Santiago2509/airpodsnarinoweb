"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import NumberTicker from "./NumberTicker";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Story.module.css";

const ease = [0.23, 1, 0.32, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const lead = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const support = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Story() {
  const imageRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  // The photo window opens as it rises into view, and the photo settles inside it
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% ${v}% ${v}% ${v}% round 28px)`);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <section className={styles.story} aria-labelledby="story-title">
      <div className={`container ${styles.grid}`}>
        <motion.div
          ref={imageRef}
          className={styles.imageWindow}
          style={reduce ? undefined : { clipPath }}
        >
          <motion.div className={styles.imageInner} style={reduce ? undefined : { scale: imageScale }}>
            <Image
              src="/axel.webp"
              alt="Axel, de Airpods Nariño"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </motion.div>
          <div className={styles.imageBadge}>
            <span className={styles.liveDot} aria-hidden="true" />
            Pasto, Nariño — Colombia
          </div>
        </motion.div>

        <motion.div
          className={styles.copy}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
        >
          <motion.p className="eyebrow" variants={support}>
            Nuestra historia
          </motion.p>
          <motion.h2 id="story-title" className={styles.title} variants={lead}>
            El estándar <span className="gradientText">premium</span> del sur.
          </motion.h2>
          <motion.p className={styles.text} variants={support}>
            Nacimos en Pasto con una idea simple: que comprar tecnología Apple sea seguro, cercano y con
            respaldo real. Hoy somos la tienda de referencia en Nariño para audífonos y accesorios.
          </motion.p>

          <motion.dl className={styles.stats} variants={support}>
            <div className={styles.stat}>
              <dt>Clientes satisfechos</dt>
              <dd>
                <NumberTicker value={500} prefix="+" />
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>Garantía real</dt>
              <dd>
                <NumberTicker value={100} suffix="%" />
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>En todo Nariño</dt>
              <dd>
                <NumberTicker value={1} prefix="#" duration={0.8} />
              </dd>
            </div>
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
