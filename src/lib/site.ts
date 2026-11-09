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
