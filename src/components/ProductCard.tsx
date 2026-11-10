"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE, formatPrice } from "@/lib/site";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  /** Link target (home) or click handler (catalog opens a modal) */
  href?: string;
  onSelect?: () => void;
  eager?: boolean;
  soldOut?: boolean;
  children?: React.ReactNode;
}

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  if (!e.currentTarget.src.endsWith(PLACEHOLDER_IMAGE)) e.currentTarget.src = PLACEHOLDER_IMAGE;
}

/** A light follows the pointer across the card (set on the card itself, mouse only). */
function trackPointer(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function ProductCard({ product, href, onSelect, eager, soldOut, children }: ProductCardProps) {
  const body = (
    <>
      <span className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
        <img
          src={product.imageUrl || PLACEHOLDER_IMAGE}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={styles.image}
          onError={fallbackImage}
        />
        <span className={styles.open} aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
        {soldOut && <span className={styles.soldOut}>Agotado</span>}
      </span>
      <span className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        {product.description && <span className={styles.description}>{product.description}</span>}
        <span className={styles.priceRow}>
          <span className={`${styles.price} tabular`}>{formatPrice(product.price)}</span>
          <span className={styles.currency}>COP</span>
        </span>
      </span>
    </>
  );

  return (
    <article className={styles.card} data-sold-out={soldOut ? "" : undefined} onPointerMove={trackPointer}>
      <span className={styles.spotlight} aria-hidden="true" />
      {href ? (
        <Link href={href} className={styles.hit}>
          {body}
        </Link>
      ) : (
        <button type="button" className={styles.hit} onClick={onSelect}>
          {body}
        </button>
      )}
      {children && <div className={styles.footer}>{children}</div>}
    </article>
  );
}
