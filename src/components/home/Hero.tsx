"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Hero.module.css";

const LINE_1 = ["El", "sonido"];
const LINE_2 = ["que", "te", "mueve."];

/**
 * Scroll story: the headline lifts away while the product film grows
 * from a floating card into a full-screen stage.
 * Entrance is CSS (runs off the main thread while the page loads);
 * the scroll link is Motion on the outer wrappers only.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const copyOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const copyScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);
  const START_SCALE = 0.6;
  // Where the stage starts: measured so it always peeks just below the buttons
  const startY = useMotionValue(0);
  const [placed, setPlaced] = useState(false);
  const stageScale = useTransform(scrollYProgress, [0, 0.65], [START_SCALE, 1]);
  const stageY = useTransform(() => {
    const t = Math.min(1, scrollYProgress.get() / 0.65);
    const eased = 1 - Math.pow(1 - t, 2);
    return startY.get() * (1 - eased);
  });

  useEffect(() => {
    const measure = () => {
      const copy = copyRef.current;
      if (!copy) return;
      const h = window.innerHeight;
      const copyBottom = copy.offsetTop + copy.offsetHeight;
      // Top edge of the scaled stage = h/2 - (h * START_SCALE)/2 + y
      const y = copyBottom + 32 - (h / 2) * (1 - START_SCALE);
      startY.set(Math.max(h * 0.2, y));
      setPlaced(true);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [startY]);
  const stageRadius = useTransform(scrollYProgress, [0, 0.65], [40, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.62, 0.8], [24, 0]);

  // iOS often ignores the autoPlay attribute; start it from code.
  // With "reduce motion", jump straight to the final frame instead of playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showLastFrame = () => {
        video.currentTime = Math.max(0, video.duration - 0.05);
      };
      if (video.readyState >= 1) showLastFrame();
      else video.addEventListener("loadedmetadata", showLastFrame, { once: true });
      return;
    }
    video.play().catch(() => {});
  }, []);

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
    <section ref={sectionRef} className={styles.hero} data-reduce={reduce ? "" : undefined}>
      <div className={styles.sticky}>
        <motion.div
          ref={copyRef}
          className={styles.copy}
          style={reduce ? undefined : { opacity: copyOpacity, y: copyY, scale: copyScale }}
        >
          <p className={`${styles.badge} ${styles.enter}`} style={{ "--d": "0ms" } as React.CSSProperties}>
            <ShieldCheck size={15} aria-hidden="true" />
            Garantía directa en todo Nariño
          </p>

          <h1 className={styles.title}>
            <span className={styles.line}>{LINE_1.map(word)}</span>
            <span className={`${styles.line} ${styles.lineAccent}`}>{LINE_2.map(word)}</span>
          </h1>

          <p className={`${styles.subtitle} ${styles.enter}`} style={{ "--d": "380ms" } as React.CSSProperties}>
            AirPods y accesorios Apple con respaldo real, asesoría personalizada y envíos desde Pasto a
            todo el departamento.
          </p>

          <div className={`${styles.actions} ${styles.enter}`} style={{ "--d": "460ms" } as React.CSSProperties}>
            <Link href="/catalogo" className="btn btnPrimary">
              Explorar catálogo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/contacto" className="btn btnGhost">
              Hablar con nosotros
            </Link>
          </div>
        </motion.div>

        <motion.div
          className={styles.stageWrap}
          data-placed={placed || reduce ? "" : undefined}
          style={reduce ? undefined : { scale: stageScale, y: stageY, borderRadius: stageRadius }}
        >
          <div className={`${styles.stage} ${styles.enterStage}`}>
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className={styles.video}
              aria-hidden="true"
            >
              <source src="/inicio.mp4" type="video/mp4" />
            </video>
            <div className={styles.stageShade} aria-hidden="true" />
            <motion.p
              className={styles.caption}
              style={reduce ? undefined : { opacity: captionOpacity, y: captionY }}
            >
              <span className={styles.captionKicker}>Airpods Nariño</span>
              Tecnología Apple, con alma del sur.
            </motion.p>
          </div>
        </motion.div>

        <div className={`${styles.scrollHint} ${styles.enter}`} style={{ "--d": "900ms" } as React.CSSProperties} aria-hidden="true">
          <span className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
