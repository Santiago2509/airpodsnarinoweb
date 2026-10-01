"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Features3D.module.css";
import { ShieldCheck, Truck, Headphones } from "lucide-react";

export default function Features3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const frameCount = 192;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(5, "0");
      img.src = `/3d/${frameNum}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setLoading(false);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    if (loading || images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const render = (index: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    };
    render(0);

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollableDistance = container.scrollHeight - windowHeight;
      const scrolled = -rect.top;
      
      let scrollFraction = 0;
      if (scrolled > 0 && scrollableDistance > 0) {
         scrollFraction = scrolled / scrollableDistance;
      }
      if (scrolled < 0) scrollFraction = 0;
      if (scrolled > scrollableDistance) scrollFraction = 1;

      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(scrollFraction * frameCount))
      );
      
      requestAnimationFrame(() => render(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Llamar una vez para setear estado inicial
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, images]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.stickyContainer}>
        {loading ? (
           <div className={styles.loader}>Cargando experiencia 3D...</div>
        ) : (
           <canvas ref={canvasRef} width={1920} height={1080} className={styles.canvas} />
        )}
      </div>

      <div className={styles.scrollContent}>
        <div className={styles.textBlock}>
           <div className={styles.titleSection}>
             <h2 className={styles.mainTitle}>¿Por qué <span className={styles.textGradient}>elegirnos?</span></h2>
             <p className={styles.subtitle}>Desliza para descubrirlo</p>
           </div>
        </div>

         <div className={`${styles.textBlock} ${styles.alignLeft}`}>
            <div className={styles.card}>
              <div className={styles.iconGlow}><ShieldCheck size={48} /></div>
              <h2>Garantía Asegurada</h2>
              <p>Todos nuestros productos cuentan con garantía directa. Tu inversión está protegida con nosotros.</p>
            </div>
         </div>
         
         <div className={`${styles.textBlock} ${styles.alignRight}`}>
            <div className={styles.card}>
              <div className={styles.iconGlow}><Truck size={48} /></div>
              <h2>Envíos Rápidos</h2>
              <p>Realizamos envíos seguros y rápidos a todo Nariño para que disfrutes tu música sin esperas.</p>
            </div>
         </div>
         
         <div className={`${styles.textBlock} ${styles.alignLeft}`}>
            <div className={styles.card}>
              <div className={styles.iconGlow}><Headphones size={48} /></div>
              <h2>Calidad Premium</h2>
              <p>Solo ofrecemos los mejores audífonos del mercado con calidad de sonido excepcional y durabilidad.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
