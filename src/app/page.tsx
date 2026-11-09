"use client";

import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { ArrowRight } from "lucide-react";
import Features3D from "@/components/Features3D";
import { PLACEHOLDER_IMAGE, formatPrice, whatsappUrl } from "@/lib/site";

export default function Home() {
  const { products } = useProductStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [seed] = useState(() => Math.random());

  const featuredProducts = useMemo(() => {
    const available = products.filter((p) => p.status === "active" && p.stock > 0);
    // Stable shuffle per visit, so the cards don't reshuffle on every render
    return available
      .map((p, i) => ({ p, k: Math.sin((i + 1) * 9301 * (seed + 1)) }))
      .sort((a, b) => a.k - b.k)
      .slice(0, 3)
      .map(({ p }) => p);
  }, [products, seed]);

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

    video.play().catch(() => {
      // Autoplay blocked by browser policy — the first frame stays visible
    });
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className={styles.videoBackground}
          aria-hidden="true"
        >
          <source src="/inicio.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} aria-hidden="true" />

        <div className={styles.heroTitle}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>AIRPODS</span>
            <span className={styles.flareDivider} aria-hidden="true" />
            <span className={styles.titleAccent}>NARIÑO</span>
          </h1>
        </div>

        <div className={styles.heroActions}>
          <Link href="/catalogo" className={`${styles.primaryButton} pressable`}>
            Ver Catálogo
          </Link>
          <Link href="/contacto" className={`${styles.secondaryButton} pressable`}>
            Contáctanos
          </Link>
        </div>
      </section>

      <section className={styles.axelSection}>
        <div className={styles.axelGlowBackground} aria-hidden="true" />

        <div className={styles.axelImageCol}>
          <Image
            src="/axel.webp"
            alt="Axel, de Airpods Nariño"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className={styles.axelImage}
          />
        </div>

        <div className={styles.axelTextCol}>
          <div className={styles.axelBadgeModern}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Pasto, Nariño — Colombia
          </div>

          <h2 className={styles.axelTitleModern}>
            El estándar <br />
            <span className={styles.textGradient}>Premium.</span>
          </h2>

          <p className={styles.axelDescriptionModern}>
            Descubre el verdadero sonido. Audífonos y accesorios Apple con la más alta calidad,
            respaldados por una <strong>garantía directa real</strong> en toda la región.
          </p>

          <dl className={styles.axelStatsGrid}>
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>Clientes Satisfechos</dt>
              <dd className={styles.statNum}>+500</dd>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>Garantía Real</dt>
              <dd className={styles.statNum}>100%</dd>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <dt className={styles.statLabel}>En todo Nariño</dt>
              <dd className={styles.statNum}>#1</dd>
            </div>
          </dl>
        </div>
      </section>

      <Features3D />

      {featuredProducts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Productos <span className={styles.textGradient}>Destacados</span>
          </h2>
          <div className={styles.featuredGridModern}>
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/catalogo?producto=${product.id}`}
                className={`${styles.featuredCardModern} pressable`}
              >
                <div className={styles.featuredImageWrapperModern}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                  <img
                    src={product.imageUrl || PLACEHOLDER_IMAGE}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={styles.featuredImageModern}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className={styles.featuredContentModern}>
                  <h3 className={styles.featuredNameModern}>{product.name}</h3>
                  <span className={`${styles.featuredPriceModern} tabular`}>{formatPrice(product.price)}</span>
                  <span className={styles.featuredLink}>
                    Ver detalles <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.viewAllContainer}>
            <Link href="/catalogo" className={`${styles.viewAllButton} pressable`}>
              Ver todo el catálogo <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <section className={styles.ctaFinalSection}>
        <div className={styles.ctaFinalContent}>
          <h2 className={styles.ctaFinalTitle}>¿Listo para elevar tu experiencia de sonido?</h2>
          <p className={styles.ctaFinalText}>
            Descubre por qué somos la tienda de accesorios Apple con mejor reputación en todo el
            departamento de Nariño.
          </p>
          <div className={styles.ctaFinalButtons}>
            <Link href="/catalogo" className={`${styles.primaryButton} pressable`}>
              Explorar Productos
            </Link>
            <a
              href={whatsappUrl("Hola Airpods Nariño, quiero más información.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.secondaryButton} pressable`}
            >
              Contáctanos ahora
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
