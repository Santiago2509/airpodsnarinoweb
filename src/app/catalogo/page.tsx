"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useProductStore } from "@/store/useProductStore";
import styles from "./catalogo.module.css";
import { MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import Modal from "@/components/Modal";
import { PLACEHOLDER_IMAGE, formatPrice, whatsappUrl } from "@/lib/site";

const STAGGER_MS = 40;
const STAGGER_MAX_STEPS = 6;

function getProductImages(product: Product) {
  const images = [...(product.images ?? [])];
  if (product.imageUrl && !images.includes(product.imageUrl)) images.unshift(product.imageUrl);
  return images.length > 0 ? images : [PLACEHOLDER_IMAGE];
}

function buyMessage(name: string) {
  return `¡Hola! Estoy interesado en comprar ${name}. ¿Me podrías dar más información?`;
}

const noopSubscribe = () => () => {};

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  if (!e.currentTarget.src.endsWith(PLACEHOLDER_IMAGE)) e.currentTarget.src = PLACEHOLDER_IMAGE;
}

export default function CatalogoPage() {
  const { products, isLoading, hasLoadedProducts } = useProductStore();
  // undefined = untouched, so a link like /catalogo?producto=<id> opens that product
  const [selectedId, setSelectedId] = useState<string | null | undefined>(undefined);
  const productFromUrl = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("producto"),
    () => null
  );
  const activeId = selectedId === undefined ? productFromUrl : selectedId;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const available = useMemo(
    () => products.filter((p) => p.status === "active" && p.stock > 0),
    [products]
  );
  const selectedProduct = available.find((p) => p.id === activeId) ?? null;
  const images = selectedProduct ? getProductImages(selectedProduct) : [];

  const openModal = (product: Product) => {
    setSelectedId(product.id);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedId(null);
    setCurrentImageIndex(0);
    const url = new URL(window.location.href);
    if (url.searchParams.has("producto")) {
      url.searchParams.delete("producto");
      window.history.replaceState(null, "", url);
    }
  };

  const showImage = (index: number) => {
    setCurrentImageIndex((index + images.length) % images.length);
  };

  const loading = isLoading && !hasLoadedProducts;

  return (
    <main className={styles.catalogoContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Nuestro <span className={styles.titleAccent}>Catálogo</span>
        </h1>
        <p className={styles.subtitle}>
          Descubre nuestra selección de productos con la mejor calidad y precio.
        </p>
      </header>

      {loading ? (
        <div className={styles.grid} aria-busy="true" aria-label="Cargando productos">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : available.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay productos disponibles en este momento.</p>
          <a
            href={whatsappUrl("Hola, ¿qué productos tienen disponibles?")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.emptyStateLink} pressable`}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Pregúntanos por WhatsApp
          </a>
        </div>
      ) : (
        <ul className={styles.grid}>
          {available.map((product, index) => (
            <li
              key={product.id}
              className={styles.card}
              style={{ animationDelay: `${Math.min(index, STAGGER_MAX_STEPS) * STAGGER_MS}ms` }}
            >
              <button
                type="button"
                className={styles.cardButton}
                onClick={() => openModal(product)}
              >
                <span className={styles.imageContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                  <img
                    src={product.imageUrl || PLACEHOLDER_IMAGE}
                    alt=""
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className={styles.productImage}
                    onError={fallbackImage}
                  />
                </span>
                <span className={styles.cardText}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productDescription}>{product.description}</span>
                  <span className={styles.priceContainer}>
                    <span className={`${styles.price} tabular`}>{formatPrice(product.price)}</span>
                    <span className={styles.currency}>COP</span>
                  </span>
                </span>
              </button>

              <a
                href={whatsappUrl(buyMessage(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.whatsappButton} pressable`}
              >
                <MessageCircle size={20} aria-hidden="true" />
                <span>Comprar por WhatsApp</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={selectedProduct !== null}
        onClose={closeModal}
        labelledBy="product-modal-title"
        className={styles.modalContent}
      >
        {selectedProduct && (
          <>
            <button type="button" className={`${styles.closeModal} pressable`} onClick={closeModal} aria-label="Cerrar">
              <X size={22} aria-hidden="true" />
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalGallery}>
                <div className={styles.modalMainImageContainer}>
                  {/* Keyed by index: each new photo fades in over the previous one */}
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                  <img
                    key={images[currentImageIndex]}
                    src={images[currentImageIndex]}
                    alt={`${selectedProduct.name}, foto ${currentImageIndex + 1} de ${images.length}`}
                    className={styles.modalMainImage}
                    onError={fallbackImage}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.galleryNav} ${styles.galleryNavLeft}`}
                        onClick={() => showImage(currentImageIndex - 1)}
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft size={22} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className={`${styles.galleryNav} ${styles.galleryNavRight}`}
                        onClick={() => showImage(currentImageIndex + 1)}
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight size={22} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className={styles.modalThumbnails}>
                    {images.map((img, idx) => (
                      <button
                        type="button"
                        key={img}
                        className={styles.thumbnail}
                        data-active={idx === currentImageIndex ? "" : undefined}
                        aria-label={`Ver foto ${idx + 1}`}
                        aria-current={idx === currentImageIndex ? "true" : undefined}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                        <img src={img} alt="" loading="lazy" onError={fallbackImage} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.modalDetails}>
                <h2 id="product-modal-title" className={styles.modalTitle}>{selectedProduct.name}</h2>
                <div className={styles.modalPriceContainer}>
                  <span className={`${styles.modalPrice} tabular`}>{formatPrice(selectedProduct.price)}</span>
                  <span className={styles.currency}>COP</span>
                </div>

                <div className={styles.modalDivider} />

                <div className={styles.modalDescription}>
                  <h3>Descripción</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <a
                  href={whatsappUrl(buyMessage(selectedProduct.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.modalWhatsappButton} pressable`}
                >
                  <MessageCircle size={22} aria-hidden="true" />
                  <span>Comprar por WhatsApp</span>
                </a>
              </div>
            </div>
          </>
        )}
      </Modal>
    </main>
  );
}
