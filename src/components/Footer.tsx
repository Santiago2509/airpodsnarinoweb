import Link from "next/link";
import { Phone, MapPin, Mail, ShieldCheck } from "lucide-react";
import { EMAIL, INSTAGRAM_URL, PHONE_DISPLAY, TIKTOK_URL, whatsappUrl } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brandSection}>
              <p className={styles.brandTitle}>
                Airpods<span className={styles.brandAccent}>Nariño</span>
              </p>
              <p className={styles.brandDescription}>
                La tienda líder en Pasto y todo el departamento de Nariño. Especialistas en audífonos y
                accesorios Apple con calidad premium y garantía directa.
              </p>
              <div className={styles.badge}>
                <ShieldCheck size={18} className={styles.badgeIcon} aria-hidden="true" />
                <span>Garantía Directa Comprobada</span>
              </div>
            </div>

            <nav className={styles.linksSection} aria-label="Enlaces del sitio">
              <h2 className={styles.sectionTitle}>Explorar</h2>
              <ul className={styles.linkList}>
                <li><Link href="/">Inicio</Link></li>
                <li><Link href="/catalogo">Catálogo de Productos</Link></li>
                <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </nav>

            <div className={styles.contactSection}>
              <h2 className={styles.sectionTitle}>Contacto</h2>
              <ul className={styles.contactList}>
                <li>
                  <MapPin size={18} className={styles.contactIcon} aria-hidden="true" />
                  <span>Pasto, Nariño — Colombia</span>
                </li>
                <li>
                  <Phone size={18} className={styles.contactIcon} aria-hidden="true" />
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="tabular">
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <Mail size={18} className={styles.contactIcon} aria-hidden="true" />
                  <a href={`mailto:${EMAIL}`} className={styles.email}>{EMAIL}</a>
                </li>
              </ul>
            </div>

            <div className={styles.socialSection}>
              <h2 className={styles.sectionTitle}>Síguenos</h2>
              <div className={styles.socialIcons}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.wordmark} aria-hidden="true">
        AIRPODS<span>NARIÑO</span>
      </p>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              &copy; {currentYear} Airpods Nariño. Todos los derechos reservados.
            </p>
            <p className={styles.seoText}>
              Venta de accesorios Apple, AirPods Pro, cargadores y estuches en San Juan de Pasto.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
