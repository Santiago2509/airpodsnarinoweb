"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import Features3D from "@/components/Features3D";

export default function Home() {
  const { products } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (products.length > 0) {
      const activeProducts = products.filter(p => p.status === 'active' && p.stock > 0);
      const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
    }
  }, [products]);

  // Force video autoplay on iOS (autoPlay HTML attr is often blocked)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay blocked by browser policy — ignore silently
      });
    }
  }, []);

  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 5) {
      video.pause();
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline 
          loop
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          className={styles.videoBackground}
        >
          <source src="/inicio.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay}></div>

        <div className={styles.logoTextWrapper}>
          <h1 className={`${styles.title} animate-fade-in-up`}>
            <span className={styles.titleMain}>AIRPODS</span>
            <div className={styles.flareDivider}></div>
            <span className={`${styles.titleAccent} animate-glow delay-200`}>NARIÑO</span>
          </h1>
        </div>

        <div className={`${styles.bottomContent} animate-fade-in-up delay-300`}>
          <div className={styles.ctaContainer}>
            <Link href="/catalogo">
              <button className={styles.primaryButton}>
                Ver Catálogo
              </button>
            </Link>
            <Link href="#contacto">
              <button className={styles.secondaryButton}>
                Contáctanos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección Axel: Diseño Interactivo Premium */}
      <section className={styles.axelSection}>
        <div className={styles.axelGlowBackground}></div>
        
        <div className={styles.axelImageCol}>
          <img src="/axel.png" alt="Axel - Airpods Nariño" className={styles.axelImage} />
        </div>
        
        <div className={styles.axelTextCol}>
          <div className={`${styles.axelBadgeModern} animate-fade-in-up delay-100`}>
            <span className={styles.badgeDot}></span>
            Pasto, Nariño — Colombia
          </div>

          <h2 className={`${styles.axelTitleModern} animate-fade-in-up delay-200`}>
            El estándar <br />
            <span className={styles.textGradient}>Premium.</span>
          </h2>

          <p className={`${styles.axelDescriptionModern} animate-fade-in-up delay-300`}>
            Descubre el verdadero sonido. Audífonos y accesorios Apple con la más alta calidad, 
            respaldados por una <strong>garantía directa real</strong> en toda la región.
          </p>

          <div className={`${styles.axelStatsGrid} animate-fade-in-up delay-400`}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>+500</span>
              <span className={styles.statLabel}>Clientes Satisfechos</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Garantía Real</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>#1</span>
              <span className={styles.statLabel}>En todo Nariño</span>
            </div>
          </div>
        </div>
      </section>

      {/* Características / Por qué elegirnos con Animación 3D */}
      <Features3D />

      {/* Productos Destacados */}
      <section className={`${styles.section} animate-fade-in-up delay-300`}>
        <h2 className={styles.sectionTitle}>Productos <span className={styles.textGradient}>Destacados</span></h2>
        <div className={styles.featuredGridModern}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.featuredCardModern}>
              <div className={styles.featuredImageWrapperModern}>
                <img 
                  src={product.imageUrl || '/placeholder-product.png'} 
                  alt={product.name} 
                  className={styles.featuredImageModern} 
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/0f172a/38bdf8?text=Airpods+Nariño' }}
                />
                <div className={styles.featuredOverlay}>
                  <Link href="/catalogo">
                    <button className={styles.buyButton}>Ver detalles</button>
                  </Link>
                </div>
              </div>
              <div className={styles.featuredContentModern}>
                <h3 className={styles.featuredNameModern}>{product.name}</h3>
                <span className={styles.featuredPriceModern}>${product.price.toLocaleString("es-CO")}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.viewAllContainer}>
          <Link href="/catalogo">
            <button className={styles.viewAllButton}>
              Ver todo el catálogo <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className={`${styles.ctaFinalSection} animate-fade-in-up delay-400`}>
        <div className={styles.ctaFinalContent}>
          <h2 className={styles.ctaFinalTitle}>¿Listo para elevar tu experiencia de sonido?</h2>
          <p className={styles.ctaFinalText}>Descubre por qué somos la tienda de accesorios Apple con mejor reputación en todo el departamento de Nariño.</p>
          <div className={styles.ctaFinalButtons}>
            <Link href="/catalogo">
              <button className={styles.primaryButton}>Explorar Productos</button>
            </Link>
            <a href="https://wa.me/573123456789" target="_blank" rel="noopener noreferrer">
              <button className={styles.secondaryButton}>Contáctanos ahora</button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
