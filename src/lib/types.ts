export interface Product {
  id: string;
  name: string;
  description: string;
  costPrice?: number;     // Precio de entrada (costo por unidad)
  price: number;          // Precio de salida (catálogo público)
  imageUrl: string;       // Imagen principal (primera del array)
  images?: string[];      // Hasta 6 imágenes (URLs de Supabase Storage)
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
  wholesaleMinQuantity?: number;
  wholesalePrice?: number;
}

export type TransactionType = "sale" | "warranty" | "return";

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  costAtTransaction?: number; // Costo unitario en el momento de la venta
  priceAtTransaction: number;
  totalAmount: number;
  type: TransactionType;
  date: string;
  notes?: string;
}
