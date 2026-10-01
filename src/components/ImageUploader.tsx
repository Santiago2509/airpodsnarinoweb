"use client";

import { useState, useRef } from "react";
import { uploadProductImage } from "@/lib/supabase";
import styles from "./ImageUploader.module.css";

const MAX_IMAGES = 6;

interface ImageUploaderProps {
  productId: string;
  existingImages?: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ productId, existingImages = [], onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setError(`Máximo ${MAX_IMAGES} imágenes por producto.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen.");
        continue;
      }
      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Cada imagen debe pesar máximo 5MB.");
        continue;
      }

      const url = await uploadProductImage(file, productId);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    const newImages = [...images, ...uploadedUrls];
    setImages(newImages);
    onChange(newImages);
    setUploading(false);

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {images.map((url, idx) => (
          <div key={idx} className={styles.imageCard}>
            <img src={url} alt={`Imagen ${idx + 1}`} className={styles.image} />
            {idx === 0 && <span className={styles.mainBadge}>Principal</span>}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeImage(idx)}
              title="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className={styles.addCard}>
            {uploading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <span className={styles.addIcon}>+</span>
                <span className={styles.addText}>
                  {images.length === 0 ? "Subir imágenes" : `Agregar (${images.length}/${MAX_IMAGES})`}
                </span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.hint}>
        Máximo {MAX_IMAGES} imágenes • JPG, PNG, WebP • 5MB por imagen.<br />
        La primera imagen será la principal en el catálogo.
      </p>
    </div>
  );
}
