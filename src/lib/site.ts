// Datos de contacto de la tienda: un solo lugar para cambiarlos.
export const WHATSAPP_NUMBER = "573177091262";
export const PHONE_DISPLAY = "+57 317 709 1262";
export const EMAIL = "narinoairpods@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/airpods_narino";
export const TIKTOK_URL = "https://www.tiktok.com/@airpods_narino";
export const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

/**
 * Admin login. Disabled on request: /admin is open to anyone with the link.
 * Set to true to require a Supabase login again (and only then run
 * supabase/seguridad.sql, which blocks writes from visitors who are not signed in).
 */
export const ADMIN_LOGIN_REQUIRED = false;
