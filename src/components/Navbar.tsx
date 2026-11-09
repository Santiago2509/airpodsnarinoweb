"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/quienes-somos", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu remembers the page it was opened on, so navigating closes it
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const menuOpen = openOnPath === pathname;
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Slide away while reading down, come back as soon as the user scrolls up
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 240);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOnPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={styles.header}
      data-hidden={hidden && !menuOpen ? "" : undefined}
      data-scrolled={scrolled || menuOpen ? "" : undefined}
    >
      <nav className={styles.pill} aria-label="Principal">
        <Link href="/" className={styles.logo} onClick={() => setOpenOnPath(null)}>
          <span className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M2 19 9.5 6l3.5 6 2-3 7 10z" fill="currentColor" />
            </svg>
          </span>
          <span>
            Airpods<span className={styles.logoAccent}>Nariño</span>
          </span>
        </Link>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <Link href="/catalogo" className={`${styles.cta} pressable`}>
            Comprar
          </Link>
          <button
            type="button"
            className={styles.burger}
            data-open={menuOpen ? "" : undefined}
            onClick={() => setOpenOnPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.burgerBox} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={styles.menu} data-open={menuOpen ? "" : undefined} inert={!menuOpen}>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.menuLink}
            onClick={() => setOpenOnPath(null)}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/catalogo" className={`btn btnAccent ${styles.menuCta}`} onClick={() => setOpenOnPath(null)}>
          Ver catálogo
        </Link>
      </div>
    </header>
  );
}
