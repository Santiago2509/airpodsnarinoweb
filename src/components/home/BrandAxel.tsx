"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Headphones, BatteryCharging, ShieldCheck, Truck, Cable } from "lucide-react";
import NumberTicker from "./NumberTicker";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./BrandAxel.module.css";

const CHIPS = [
  { icon: Headphones, label: "AirPods", sub: "Pro, 4 y Max", pos: styles.chip1, at: 0.22, depth: -90 },
  { icon: BatteryCharging, label: "Cargadores", sub: "MagSafe y USB-C", pos: styles.chip2, at: 0.27, depth: -40 },
  { icon: ShieldCheck, label: "Garantía directa", sub: "Respaldo real", pos: styles.chip3, at: 0.32, depth: -120 },
  { icon: Cable, label: "Cables y estuches", sub: "Para todo tu Apple", pos: styles.chip4, at: 0.37, depth: -60 },
  { icon: Truck, label: "Envíos", sub: "A todo Nariño", pos: styles.chip5, at: 0.42, depth: -100 },
];

function Chip({
  chip,
  progress,
  reduce,
}: {
  chip: (typeof CHIPS)[number];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const Icon = chip.icon;
  const opacity = useTransform(progress, [chip.at, chip.at + 0.08], [0, 1]);
  const scale = useTransform(progress, [chip.at, chip.at + 0.08], [0.85, 1]);
  // Each chip drifts at its own speed: foreground chips move more (depth)
  const y = useTransform(progress, [0, 1], [-chip.depth, chip.depth]);
  return (
    <motion.div className={`${styles.chip} ${chip.pos}`} style={reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity, scale, y }}>
      <span className={styles.chipIcon}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className={styles.chipText}>
        <span className={styles.chipLabel}>{chip.label}</span>
        <span className={styles.chipSub}>{chip.sub}</span>
      </span>
    </motion.div>
  );
}

export default function BrandAxel() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const row1X = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const axelY = useTransform(scrollYProgress, [0.08, 0.42], ["22%", "0%"]);
  const axelScale = useTransform(scrollYProgress, [0.08, 0.42], [0.9, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const copyOpacity = useTransform(scrollYProgress, [0.16, 0.32], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.16, 0.32], [40, 0]);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="axel-title">
      <div className={styles.sticky}>
        {/* Giant moving type behind everything */}
        <div className={styles.bgType} aria-hidden="true">
          <motion.p className={styles.row} style={{ x: reduce ? "0%" : row1X }}>
            AXEL · AIRPODS NARIÑO · AXEL · AIRPODS NARIÑO ·
          </motion.p>
          <motion.p className={`${styles.row} ${styles.rowOutline}`} style={{ x: reduce ? "-15%" : row2X }}>
            ACCESORIOS APPLE · GARANTÍA · ACCESORIOS APPLE · GARANTÍA ·
          </motion.p>
        </div>

        <div className={`container ${styles.layout}`}>
          <motion.div className={styles.copy} style={reduce ? { opacity: 1, y: 0 } : { opacity: copyOpacity, y: copyY }}>
            <p className="eyebrow">Hola, mucho gusto</p>
            <h2 id="axel-title" className={styles.title}>
              Soy <span className="gradientText">Axel.</span>
            </h2>
            <p className={styles.text}>
              Soy la imagen de Airpods Nariño. Somos una tienda joven y del sur que lleva lo mejor del mundo
              Apple a Pasto y a todo el departamento, con garantía directa y atención cercana. Escríbenos y
              te ayudo a encontrar lo que buscas.
            </p>
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Clientes felices</dt>
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
                <dt>En Nariño</dt>
                <dd>
                  <NumberTicker value={1} prefix="#" duration={0.8} />
                </dd>
              </div>
            </dl>
          </motion.div>

          <div className={styles.stage}>
            <motion.div className={styles.glow} style={{ opacity: reduce ? 1 : glowOpacity }} aria-hidden="true" />
            <motion.div className={styles.axel} style={reduce ? { y: "0%", scale: 1 } : { y: axelY, scale: axelScale }}>
              <Image
                src="/axel-cutout.webp"
                alt="Axel, la imagen de Airpods Nariño, rodeado de cajas de AirPods"
                fill
                sizes="(max-width: 900px) 90vw, 46vw"
                className={styles.axelImg}
              />
            </motion.div>
            {CHIPS.map((chip) => (
              <Chip key={chip.label} chip={chip} progress={scrollYProgress} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
