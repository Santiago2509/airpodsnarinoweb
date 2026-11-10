"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { MessageCircle, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/lib/types";
import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import { PLACEHOLDER_IMAGE, formatPrice, whatsappUrl } from "@/lib/site";
import styles from "./catalogo.module.css";

type Sort = "recent" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "recent", label: "Novedades" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
];

const ease = [0.23, 1, 0.32, 1] as const;
const noopSubscribe = () => () => {};

function getProductImages(product: Product) {
  const images = [...(product.images ?? [])];
  if (product.imageUrl && !images.includes(product.imageUrl)) images.unshift(product.imageUrl);
  return images.length > 0 ? images : [PLACEHOLDER_IMAGE];
}

function buyMessage(name: string) {
  return `¡Hola! Estoy interesado en comprar ${name}. ¿Me podrías dar más información?`;
}

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  if (!e.currentTarget.src.endsWith(PLACEHOLDER_IMAGE)) e.currentTarget.src = PLACEHOLDER_IMAGE;
}

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function CatalogoPage() {
  const { products, isLoading, hasLoadedProducts } = useProductStore();
  // A category link like /catalogo?q=cargador arrives with the search applied
  const urlQuery = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("q") ?? "",
    () => ""
  );
  const [typedQuery, setTypedQuery] = useState<string | undefined>(undefined);
  const query = typedQuery ?? urlQuery;
  const setQuery = setTypedQuery;
  const [sort, setSort] = useState<Sort>("recent");

  // undefined = untouched, so a link like /catalogo?producto=<id> opens that product
  const [selectedId, setSelectedId] = useState<string | null | undefined>(undefined);
  const productFromUrl = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("producto"),
    () => null
  );
  const activeId = selectedId === undefined ? productFromUrl : selectedId;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const available = useMemo(() => products.filter((p) => p.status === "active" && p.stock > 0), [products]);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    const list = q
      ? available.filter((p) => normalize(`${p.name} ${p.description}`).includes(q))
      : [...available];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [available, query, sort]);

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

  const showImage = (index: number) => setCurrentImageIndex((index + images.length) % images.length);
  const loading = isLoading && !hasLoadedProducts;
  const countLabel = new Intl.PluralRules("es-CO").select(visible.length) === "one" ? "producto" : "productos";

  return (
    <main className={styles.page}>
      <header className={`container ${styles.header}`}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Catálogo
        </motion.p>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
        >
          Encuentra tu <span className="gradientText">sonido.</span>
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
        >
          Audífonos y accesorios Apple con garantía directa. Toca un producto para ver sus fotos y
          compra en un clic por WhatsApp.
        </motion.p>
      </header>

      <div className={`container ${styles.toolbarWrap}`}>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <span className="srOnly">Buscar productos</span>
            <input
              type="search"
              placeholder="Buscar AirPods, cargadores…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
              autoComplete="off"
            />
          </label>
          <div className={styles.sorts} role="radiogroup" aria-label="Ordenar">
            {SORTS.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={sort === s.value}
                className={styles.sortChip}
                onClick={() => setSort(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {!loading && available.length > 0 && (
          <p className={styles.count} aria-live="polite">
            <span className="tabular">{visible.length}</span> {countLabel}
          </p>
        )}
      </div>

      <div className="container">
        {loading ? (
          <div className={styles.grid} aria-busy="true" aria-label="Cargando productos">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {available.length === 0 ? "Pronto tendremos productos aquí." : `No encontramos “${query}”.`}
            </p>
            <p className={styles.emptyText}>Escríbenos y te contamos qué tenemos disponible hoy.</p>
            <a
              href={whatsappUrl("Hola, ¿qué productos tienen disponibles?")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnWhatsapp"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Preguntar por WhatsApp
            </a>
          </div>
        ) : (
          <ul className={styles.grid}>
            {visible.map((product, index) => (
              <li
                key={product.id}
                className={styles.item}
                style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
              >
                <ProductCard product={product} onSelect={() => openModal(product)} eager={index < 6}>
                  <a
                    href={whatsappUrl(buyMessage(product.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btnWhatsapp ${styles.buy}`}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Comprar por WhatsApp
                  </a>
                </ProductCard>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={selectedProduct !== null} onClose={closeModal} labelledBy="product-modal-title" className={styles.modal}>
        {selectedProduct && (
          <>
            <button type="button" className={`${styles.close} pressable`} onClick={closeModal} aria-label="Cerrar">
              <X size={20} aria-hidden="true" />
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.gallery}>
                <div className={styles.mainImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                  <img
                    key={images[currentImageIndex]}
                    src={images[currentImageIndex]}
                    alt={`${selectedProduct.name}, foto ${currentImageIndex + 1} de ${images.length}`}
                    className={styles.mainImg}
                    onError={fallbackImage}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.nav} ${styles.navLeft}`}
                        onClick={() => showImage(currentImageIndex - 1)}
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft size={20} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className={`${styles.nav} ${styles.navRight}`}
                        onClick={() => showImage(currentImageIndex + 1)}
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className={styles.thumbs}>
                    {images.map((img, idx) => (
                      <button
                        type="button"
                        key={img}
                        className={styles.thumb}
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

              <div className={styles.details}>
                <p className="eyebrow">Disponible</p>
                <h2 id="product-modal-title" className={styles.modalTitle}>{selectedProduct.name}</h2>
                <p className={styles.modalPrice}>
                  <span className="tabular">{formatPrice(selectedProduct.price)}</span>
                  <span className={styles.currency}>COP</span>
                </p>
                <div className={styles.divider} />
                <p className={styles.description}>{selectedProduct.description}</p>
                <ul className={styles.perks}>
                  <li>Garantía directa</li>
                  <li>Envío a todo Nariño</li>
                  <li>Asesoría por WhatsApp</li>
                </ul>
                <a
                  href={whatsappUrl(buyMessage(selectedProduct.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btnWhatsapp ${styles.modalBuy}`}
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  Comprar por WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </Modal>
    </main>
  );
}
