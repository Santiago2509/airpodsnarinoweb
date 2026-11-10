import type { Product } from "./types";

export interface Category {
  id: string;
  label: string;
  /** Used for products that were saved before they had a category */
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { id: "airpods", label: "AirPods", keywords: ["airpods", "audifono", "audífono"] },
  { id: "cargadores", label: "Cargadores", keywords: ["cargador", "magsafe", "adaptador", "carga", "bateria", "batería"] },
  { id: "cables", label: "Cables", keywords: ["cable", "lightning", "usb"] },
  { id: "estuches", label: "Estuches", keywords: ["estuche", "funda", "case", "forro", "protector"] },
  { id: "watch", label: "Apple Watch", keywords: ["watch", "reloj", "correa", "pulso"] },
  { id: "otros", label: "Otros accesorios", keywords: [] },
];

export const categoryLabel = (id?: string | null) => CATEGORIES.find((c) => c.id === id)?.label ?? "Sin categoría";

export function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** A product's category, or the best guess from its name for older products. */
export function productCategory(product: Pick<Product, "category" | "name" | "description">): string | null {
  if (product.category) return product.category;
  const text = normalize(`${product.name} ${product.description ?? ""}`);
  // Most specific first: "Estuche para AirPods" is a case, not AirPods
  const priority = ["estuches", "cables", "cargadores", "watch", "airpods"];
  const guess = priority
    .map((id) => CATEGORIES.find((c) => c.id === id)!)
    .find((c) => c.keywords.some((k) => text.includes(normalize(k))));
  return guess?.id ?? null;
}
