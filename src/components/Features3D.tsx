"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Features3D.module.css";
import { ShieldCheck, Truck, Headphones } from "lucide-react";

// Desktop: 192 frames at 1280×720. Phones: every other frame at 640×360.
const SETS = {
  desktop: { count: 192, width: 1280, height: 720, path: (i: number) => `/3d/desktop/${String(i).padStart(3, "0")}.webp` },
  mobile: { count: 96, width: 640, height: 360, path: (i: number) => `/3d/mobile/${String(i).padStart(3, "0")}.webp` },
};

export default function Features3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const isSmall = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = isSmall ? SETS.mobile : SETS.desktop;
    canvas.width = set.width;
    canvas.height = set.height;

    const frames: (HTMLImageElement | null)[] = new Array(set.count).fill(null);
    let current = -1;
    let ticking = false;
    let started = false;
    let cancelled = false;

    const draw = (index: number) => {
      // Draw the requested frame, or the nearest one that has already loaded
      for (let offset = 0; offset < set.count; offset++) {
        const img = frames[index - offset] ?? frames[index + offset];
        if (img) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          return;
        }
      }
    };

    const frameForScroll = () => {
      if (reduceMotion) return set.count - 1;
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      const fraction = Math.min(1, Math.max(0, -rect.top / scrollable));
      return Math.min(set.count - 1, Math.floor(fraction * set.count));
    };

    const update = () => {
      ticking = false;
      const index = frameForScroll();
      if (index === current) return;
      current = index;
      draw(index);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const load = () => {
      if (started) return;
      started = true;
      // Load the first frame (and the static frame for reduced motion) first
      const order = reduceMotion
        ? [set.count - 1]
        : [0, ...Array.from({ length: set.count - 1 }, (_, i) => i + 1)];

      order.forEach((index) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return;
          frames[index] = img;
          if (index === 0 || reduceMotion) setReady(true);
          // Repaint if this frame is closer to where the user is now
          current = -1;
          onScroll();
        };
        img.src = set.path(index + 1);
      });
    };

    // Start downloading only when the section is about a screen away
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(container);

    if (!reduceMotion) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className={styles.wrapper} ref={containerRef} aria-labelledby="features-title">
      <div className={styles.stickyContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          data-ready={ready ? "" : undefined}
          aria-hidden="true"
        />
      </div>

      <div className={styles.scrollContent}>
        <div className={styles.textBlock}>
          <div className={styles.titleSection}>
            <h2 id="features-title" className={styles.mainTitle}>
              ¿Por qué <span className={styles.textGradient}>elegirnos?</span>
            </h2>
            <p className={styles.subtitle}>Desliza para descubrirlo</p>
          </div>
        </div>

        <div className={`${styles.textBlock} ${styles.alignLeft}`}>
          <div className={styles.card}>
            <div className={styles.iconGlow}><ShieldCheck size={48} aria-hidden="true" /></div>
            <h3>Garantía Asegurada</h3>
            <p>Todos nuestros productos cuentan con garantía directa. Tu inversión está protegida con nosotros.</p>
          </div>
        </div>

        <div className={`${styles.textBlock} ${styles.alignRight}`}>
          <div className={styles.card}>
            <div className={styles.iconGlow}><Truck size={48} aria-hidden="true" /></div>
            <h3>Envíos Rápidos</h3>
            <p>Realizamos envíos seguros y rápidos a todo Nariño para que disfrutes tu música sin esperas.</p>
          </div>
        </div>

        <div className={`${styles.textBlock} ${styles.alignLeft}`}>
          <div className={styles.card}>
            <div className={styles.iconGlow}><Headphones size={48} aria-hidden="true" /></div>
            <h3>Calidad Premium</h3>
            <p>Solo ofrecemos los mejores audífonos del mercado con calidad de sonido excepcional y durabilidad.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
