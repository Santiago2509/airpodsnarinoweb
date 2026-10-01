"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Airpods<span className={styles.logoAccent}>Nariño</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          <Link href="/catalogo" className={styles.navLink}>Catálogo</Link>
          <Link href="/quienes-somos" className={styles.navLink}>Quiénes somos</Link>
          <Link href="/contacto" className={styles.navLink}>Contacto</Link>
        </div>
      </div>
    </nav>
  );
}
