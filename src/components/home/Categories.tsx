"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  AirPodsIllustration,
  BagIllustration,
  CableIllustration,
  CaseIllustration,
  ChargerIllustration,
  WatchIllustration,
} from "./CategoryIllustrations";
import styles from "./Categories.module.css";

const ease = [0.23, 1, 0.32, 1] as const;

// Each tile opens the catalog with a search already applied
const CATEGORIES = [
  { art: AirPodsIllustration, title: "AirPods", text: "Pro, 4, Max y más", q: "airpods", size: "large" },
  { art: ChargerIllustration, title: "Cargadores", text: "MagSafe, USB-C, carga rápida", q: "cargador", size: "" },
  { art: CableIllustration, title: "Cables", text: "Lightning y USB-C", q: "cable", size: "" },
  { art: CaseIllustration, title: "Estuches", text: "Protección con estilo", q: "estuche", size: "" },
  { art: WatchIllustration, title: "Apple Watch", text: "Correas y accesorios", q: "watch", size: "" },
  { art: BagIllustration, title: "Todo el catálogo", text: "Mira todo lo disponible hoy", q: "", size: "wide" },
];

export default function Categories() {
  const gridRef = useRef<HTMLUListElement>(null);
  // Plays the illustrations' "first look" (the AirPods case opens) once
  const inView = useInView(gridRef, { once: true, margin: "-120px" });

  return (
    <section className={styles.section} aria-labelledby="categories-title">
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">Categorías</p>
          <h2 id="categories-title" className={styles.title}>
            Todo para tu mundo <span className="gradientText">Apple.</span>
          </h2>
          <p className={styles.subtitle}>Accesorios y audífonos seleccionados para iPhone, AirPods y Apple Watch.</p>
        </div>

        <motion.ul
          ref={gridRef}
          data-inview={inView ? "" : undefined}
          className={styles.grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {CATEGORIES.map(({ art: Art, title, text, q, size }) => (
            <motion.li
              key={title}
              className={`${styles.cell} ${size === "large" ? styles.large : ""} ${size === "wide" ? styles.wide : ""}`}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
            >
              <Link href={q ? `/catalogo?q=${q}` : "/catalogo"} className={styles.tile}>
                <span className={styles.art}>
                  <Art />
                </span>
                <span className={styles.tileText}>
                  <span className={styles.tileTitle}>{title}</span>
                  <span className={styles.tileSub}>{text}</span>
                </span>
                <ArrowUpRight size={20} className={styles.arrow} aria-hidden="true" />
                {size === "large" && <span className={styles.ring} aria-hidden="true" />}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
