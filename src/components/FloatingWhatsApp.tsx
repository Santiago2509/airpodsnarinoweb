import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import styles from "./FloatingWhatsApp.module.css";

const MESSAGE = "Hola Airpods Nariño, estoy interesado en sus audífonos y accesorios Apple.";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Contactar por WhatsApp"
    >
      <span className={styles.pulse} aria-hidden="true" />
      <MessageCircle size={30} className={styles.whatsappIcon} aria-hidden="true" />
    </a>
  );
}
