"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Showcase.module.css";

// Frame numbers refer to the full-resolution render (1–192). Phones load every other frame.
const FIRST_FRAME = 15; // the AirPods are already on stage here
const LAST_FRAME = 160;
const desktopPath = (n: number) => `/3d/desktop/${String(n).padStart(3, "0")}.webp`;
const mobilePath = (n: number) => `/3d/mobile/${String(Math.ceil(n / 2)).padStart(3, "0")}.webp`;

// Which product is on stage, by render frame
const PRODUCTS = [
  {
    until: 48,
    kicker: "Audífonos",
    name: "AirPods",
    text: "Se conectan al instante con tu iPhone y su estuche te acompaña todo el día.",
    q: "airpods",
  },
  {
    until: 78,
    kicker: "Reloj",
    name: "Apple Watch",
    text: "Correas, cargadores y accesorios para llevar tu reloj a otro nivel.",
    q: "watch",
  },
  {
    until: 112,
    kicker: "Carga",
    name: "Batería MagSafe",
    text: "Se pega a tu iPhone y lo carga sin cables, donde estés.",
    q: "magsafe",
  },
  {
    until: 145,
    kicker: "Audífonos",
    name: "AirPods Pro",
    text: "Cancelación activa de ruido y audio espacial en un estuche de bolsillo.",
    q: "pro",
  },
  {
    until: Infinity,
    kicker: "Audífonos",
    name: "AirPods Max",
    text: "Diseño over-ear premium con cancelación de ruido para quienes lo quieren todo.",
    q: "max",
  },
];

const productAt = (frame: number) => PRODUCTS.findIndex((p) => frame < p.until);

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const reduce = usePrefersReducedMotion();

  // The stage opens from a rounded card into full screen as it pins
  const { scrollYProgress: enter } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const inset = useTransform(enter, [0.35, 1], [5, 0]);
  const radius = useTransform(enter, [0.35, 1], [36, 0]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% 0% ${i}% round ${r}px ${r}px 0px 0px)`);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    const isSmall = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    canvas.width = isSmall ? 640 : 1280;
    canvas.height = isSmall ? 360 : 720;
    const pathFor = isSmall ? mobilePath : desktopPath;

    const images = new Map<number, HTMLImageElement>();
    let currentFrame = -1;
    let lastProduct = 0;
    let ticking = false;
    let cancelled = false;

    const draw = (frame: number) => {
      // Requested frame, or the nearest one already loaded
      for (let offset = 0; offset <= LAST_FRAME; offset++) {
        const img = images.get(frame - offset) ?? images.get(frame + offset);
        if (img) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          return;
        }
      }
    };

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;

      const frame = Math.round(FIRST_FRAME + p * (LAST_FRAME - FIRST_FRAME));
      const product = productAt(frame);
      if (product !== lastProduct) {
        lastProduct = product;
        setActive(product);
      }

      const shown = reduceMotion ? 129 : frame;
      if (shown === currentFrame) return;
      currentFrame = shown;
      draw(shown);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const load = () => {
      const step = isSmall ? 2 : 1;
      const frames: number[] = [];
      if (reduceMotion) frames.push(129);
      else for (let n = FIRST_FRAME; n <= LAST_FRAME; n += step) frames.push(n);
      frames.forEach((n, i) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return;
          images.set(n, img);
          if (i === 0) setReady(true);
          currentFrame = -1;
          onScroll();
        };
        img.src = pathFor(n);
      });
    };

    // Start downloading about two screens before the section arrives
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "250% 0px" }
    );
    observer.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const product = PRODUCTS[active];

  return (
    <section ref={sectionRef} className={styles.showcase} aria-labelledby="showcase-title">
      <div className={styles.sticky}>
        <motion.div className={styles.stage} style={reduce ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath }}>
          <canvas ref={canvasRef} className={styles.canvas} data-ready={ready ? "" : undefined} aria-hidden="true" />
          <div className={styles.scrim} aria-hidden="true" />

          <div className={styles.top}>
            <h2 id="showcase-title" className={styles.label}>
              Lo que encuentras
            </h2>
            <p className={`${styles.counter} tabular`} aria-hidden="true">
              <span className={styles.counterNow}>{String(active + 1).padStart(2, "0")}</span>
              <span className={styles.counterTotal}>/ {String(PRODUCTS.length).padStart(2, "0")}</span>
            </p>
          </div>

          <ol className={styles.index} aria-label="Productos">
            {PRODUCTS.map((p, i) => (
              <li key={p.name} data-active={i === active ? "" : undefined}>
                <span className={styles.indexBar} aria-hidden="true" />
                {p.name}
              </li>
            ))}
          </ol>

          <div className={styles.copy} aria-live="polite">
            {/* Keyed by product: each one enters fresh while the previous leaves */}
            <div key={product.name} className={styles.copyInner}>
              <p className={styles.kicker}>{product.kicker}</p>
              <p className={styles.name}>{product.name}</p>
              <p className={styles.text}>{product.text}</p>
              <Link href={`/catalogo?q=${product.q}`} className={`btn ${styles.cta}`}>
                Ver en el catálogo <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span ref={progressRef} className={styles.progressFill} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
