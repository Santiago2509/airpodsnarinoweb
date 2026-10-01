"use client";

import { MessageCircle } from "lucide-react";
import styles from "./FloatingWhatsApp.module.css";

export default function FloatingWhatsApp() {
  const phoneNumber = "573123456789"; // Reemplazar con el número real de Airpods Nariño
  const message = "Hola Airpods Nariño, estoy interesado en sus audífonos y accesorios Apple. 🍏";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Contactar por WhatsApp"
    >
      <div className={styles.pulseContainer}></div>
      <MessageCircle size={32} className={styles.whatsappIcon} />
    </a>
  );
}
