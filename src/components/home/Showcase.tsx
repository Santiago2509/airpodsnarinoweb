"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";
import styles from "./Showcase.module.css";

// Desktop: frames 3–156 at 1280×720. Phones: every other frame at 640×360.
// The first and last frames of the render are an empty stage, so they are skipped.
const SETS = {
  desktop: { first: 3, last: 156, width: 1280, height: 720, path: (i: number) => `/3d/desktop/${String(i).padStart(3, "0")}.webp` },
  mobile: { first: 2, last: 78, width: 640, height: 360, path: (i: number) => `/3d/mobile/${String(i).padStart(3, "0")}.webp` },
};

const STEPS = [
  {
    icon: Sparkles,
    kicker: "Por qué elegirnos",
    title: "Todo lo que necesitas, en un solo lugar.",
    text: "AirPods, cargadores y accesorios Apple seleccionados uno a uno para que suenen y funcionen como deben.",
  },
  {
    icon: ShieldCheck,
    kicker: "Garantía asegurada",
    title: "Tu compra está protegida.",
    text: "Todos nuestros productos cuentan con garantía directa. Si algo falla, lo resolvemos contigo.",
  },
  {
    icon: Truck,
    kicker: "Envíos rápidos",
    title: "De Pasto a todo Nariño.",
    text: "Envíos seguros y rápidos a todo el departamento para que disfrutes tu música sin esperas.",
  },
  {
    icon: Headphones,
    kicker: "Calidad premium",
    title: "Sonido que se siente.",
    text: "Solo ofrecemos audífonos con calidad de sonido excepcional y durabilidad comprobada.",
  },
];

export default function Showcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    const isSmall = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = isSmall ? SETS.mobile : SETS.desktop;
    canvas.width = set.width;
    canvas.height = set.height;
    const count = set.last - set.first + 1;

    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
    let current = -1;
    let ticking = false;
    let started = false;
    let cancelled = false;
    let lastStep = 0;

    const draw = (index: number) => {
      // Draw the requested frame, or the nearest one that has already loaded
      for (let offset = 0; offset < count; offset++) {
        const img = frames[index - offset] ?? frames[index + offset];
        if (img) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          return;
        }
      }
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const update = () => {
      ticking = false;
      const p = progress();

      // Progress bar and caption step are written without re-rendering every frame
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      const nextStep = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (nextStep !== lastStep) {
        lastStep = nextStep;
        setStep(nextStep);
      }

      const index = reduceMotion ? Math.floor(count * 0.6) : Math.min(count - 1, Math.floor(p * count));
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
      const order = reduceMotion ? [Math.floor(count * 0.6)] : Array.from({ length: count }, (_, i) => i);
      order.forEach((index) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return;
          frames[index] = img;
          if (index === 0 || reduceMotion) setReady(true);
          current = -1;
          onScroll();
        };
        img.src = set.path(set.first + index);
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

  return (
    <section ref={sectionRef} className={styles.showcase} aria-labelledby="showcase-title">
      <h2 id="showcase-title" className="srOnly">Por qué elegir Airpods Nariño</h2>
      <div className={styles.sticky}>
        <div className={styles.layout}>
          <div className={styles.captions}>
            {STEPS.map(({ icon: Icon, kicker, title, text }, i) => (
              <div
                key={kicker}
                className={styles.caption}
                data-active={i === step ? "" : undefined}
                data-past={i < step ? "" : undefined}
                aria-hidden={i !== step}
              >
                <span className={styles.icon}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <p className="eyebrow">{kicker}</p>
                <h3 className={styles.captionTitle}>{title}</h3>
                <p className={styles.captionText}>{text}</p>
              </div>
            ))}

            <div className={styles.dots} aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.kicker} className={styles.dot} data-active={i === step ? "" : undefined} />
              ))}
            </div>
          </div>

          <div className={styles.stage}>
            <canvas ref={canvasRef} className={styles.canvas} data-ready={ready ? "" : undefined} aria-hidden="true" />
            <div className={styles.stageGlow} aria-hidden="true" />
            <div className={styles.progress} aria-hidden="true">
              <span ref={progressRef} className={styles.progressFill} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
