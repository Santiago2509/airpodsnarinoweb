"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes (clicking a link)
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          Airpods<span className={styles.logoAccent}>Nariño</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          <Link href="/catalogo" className={styles.navLink}>Catálogo</Link>
          <Link href="/quienes-somos" className={styles.navLink}>Quiénes somos</Link>
          <Link href="/contacto" className={styles.navLink}>Contacto</Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <Link href="/" className={styles.mobileLink} onClick={closeMenu}>Inicio</Link>
        <Link href="/catalogo" className={styles.mobileLink} onClick={closeMenu}>Catálogo</Link>
        <Link href="/quienes-somos" className={styles.mobileLink} onClick={closeMenu}>Quiénes somos</Link>
        <Link href="/contacto" className={styles.mobileLink} onClick={closeMenu}>Contacto</Link>
      </div>
    </nav>
  );
}
