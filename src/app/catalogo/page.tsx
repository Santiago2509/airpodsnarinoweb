"use client";

import { useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import styles from "./catalogo.module.css";
import { MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function CatalogoPage() {
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWhatsApp = (productName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const phoneNumber = "573177091262"; 
    const message = `¡Hola! Estoy interesado en comprar los ${productName}. ¿Me podrías dar más información?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const getProductImages = (product: Product) => {
    const images = [];
    if (product.imageUrl) images.push(product.imageUrl);
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    }
    // Fallback if no images
    if (images.length === 0) images.push('/placeholder-product.png');
    return images;
  };

  const nextImage = (e: React.MouseEvent, imagesLength: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesLength);
  };

  const prevImage = (e: React.MouseEvent, imagesLength: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  return (
    <main className={styles.catalogoContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Nuestro <span className={styles.titleAccent}>Catálogo</span>
        </h1>
        <p className={styles.subtitle}>
          Descubre nuestra selección de productos con la mejor calidad y precio.
        </p>
      </div>

      <div className={styles.grid}>
        {products.filter(p => p.status === 'active' && p.stock > 0).map((product, index) => (
          <div 
            key={product.id} 
            className={styles.card}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => openModal(product)}
          >
            <div className={styles.imageContainer}>
              <img 
                src={product.imageUrl || '/placeholder-product.png'} 
                alt={product.name} 
                className={styles.productImage}
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/0f172a/38bdf8?text=Airpods+Nariño' }}
              />
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  ${product.price.toLocaleString("es-CO")}
                </span>
                <span className={styles.currency}>COP</span>
              </div>
              
              <button 
                className={styles.whatsappButton}
                onClick={(e) => handleWhatsApp(product.name, e)}
              >
                <MessageCircle size={20} />
                <span>Comprar por WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalGallery}>
                {(() => {
                  const images = getProductImages(selectedProduct);
                  return (
                    <>
                      <div className={styles.modalMainImageContainer}>
                        <img 
                          src={images[currentImageIndex]} 
                          alt={selectedProduct.name} 
                          className={styles.modalMainImage}
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/0f172a/38bdf8?text=Airpods+Nariño' }}
                        />
                        {images.length > 1 && (
                          <>
                            <button className={styles.galleryNavLeft} onClick={(e) => prevImage(e, images.length)}>
                              <ChevronLeft size={24} />
                            </button>
                            <button className={styles.galleryNavRight} onClick={(e) => nextImage(e, images.length)}>
                              <ChevronRight size={24} />
                            </button>
                          </>
                        )}
                      </div>
                      {images.length > 1 && (
                        <div className={styles.modalThumbnails}>
                          {images.map((img, idx) => (
                            <div 
                              key={idx} 
                              className={`${styles.thumbnail} ${idx === currentImageIndex ? styles.thumbnailActive : ''}`}
                              onClick={() => setCurrentImageIndex(idx)}
                            >
                              <img src={img} alt={`Thumb ${idx}`} onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/0f172a/38bdf8?text=Airpods' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className={styles.modalDetails}>
                <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>
                <div className={styles.modalPriceContainer}>
                  <span className={styles.modalPrice}>
                    ${selectedProduct.price.toLocaleString("es-CO")}
                  </span>
                  <span className={styles.currency}>COP</span>
                </div>
                
                <div className={styles.modalDivider}></div>
                
                <div className={styles.modalDescription}>
                  <h3>Descripción</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className={styles.modalDivider}></div>

                <button 
                  className={styles.modalWhatsappButton}
                  onClick={() => handleWhatsApp(selectedProduct.name)}
                >
                  <MessageCircle size={24} />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
