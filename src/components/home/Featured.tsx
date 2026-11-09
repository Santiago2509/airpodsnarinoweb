"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";
import styles from "./Featured.module.css";

const ease = [0.23, 1, 0.32, 1] as const;

export default function Featured() {
  const products = useProductStore((s) => s.products);
  const [seed] = useState(() => Math.random());

  const featured = useMemo(() => {
    const available = products.filter((p) => p.status === "active" && p.stock > 0);
    // Stable shuffle per visit
    return available
      .map((p, i) => ({ p, k: Math.sin((i + 1) * 9301 * (seed + 1)) }))
      .sort((a, b) => a.k - b.k)
      .slice(0, 3)
      .map(({ p }) => p);
  }, [products, seed]);

  if (featured.length === 0) return null;

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Lo más buscado</p>
            <h2 id="featured-title" className={styles.title}>
              Elegidos para <span className="gradientText">ti.</span>
            </h2>
          </div>
          <Link href="/catalogo" className={`btn btnGhost ${styles.all}`}>
            Ver todo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <motion.ul
          className={styles.grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {featured.map((product) => (
            <motion.li
              key={product.id}
              className={styles.item}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
            >
              <ProductCard product={product} href={`/catalogo?producto=${product.id}`} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
