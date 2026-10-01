"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./test3d.module.css";
import Link from "next/link";

export default function Test3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const frameCount = 192;

  // Pre-load images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Aseguramos el formato 00001.png a 00192.png
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

  // Manejar el scroll
  useEffect(() => {
    if (loading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;

    // Pintar el primer frame
    const render = (index: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    };

    render(0);

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScrollTop = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(scrollFraction * frameCount))
      );
      
      // Request animation frame for smooth rendering
      requestAnimationFrame(() => render(frameIndex));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, images]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <Link href="/" className={styles.backButton}>
        ← Volver
      </Link>

      <div className={styles.fixedContainer}>
        {loading ? (
          <div className={styles.loader}>Cargando Animación 3D...</div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={1920} 
            height={1080} 
            className={styles.canvas} 
          />
        )}
      </div>
      
      {/* Scroll padding content to allow scrolling without text */}
      <div className={styles.scrollContent} style={{ height: "300vh" }}>
      </div>
    </div>
  );
}
