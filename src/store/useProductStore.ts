import { create } from 'zustand';
import { Product, Transaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Columns safe to show on the public site: never cost prices or wholesale data
const PUBLIC_PRODUCT_COLUMNS = 'id, name, description, price, image_url, images, stock, status, created_at';

interface ProductState {
  products: Product[];
  transactions: Transaction[];
  isLoading: boolean;
  hasLoadedProducts: boolean;
  error: string | null;
  /** Public catalog: active products, public columns only */
  fetchProducts: () => Promise<void>;
  /** Admin panel: every product with every column (requires a signed-in admin) */
  fetchAdminProducts: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'totalAmount'>) => Promise<void>;
}

type ProductRow = {
  id: string;
  name: string;
  description: string;
  cost_price?: number | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  stock: number;
  status: Product['status'];
  wholesale_min_quantity?: number | null;
  wholesale_price?: number | null;
  created_at: string;
};

function toProduct(item: ProductRow): Product {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    costPrice: item.cost_price ?? undefined,
    price: item.price,
    imageUrl: item.image_url ?? '',
    images: item.images ?? [],
    stock: item.stock,
    status: item.status,
    wholesaleMinQuantity: item.wholesale_min_quantity ?? undefined,
    wholesalePrice: item.wholesale_price ?? undefined,
    createdAt: item.created_at,
  };
}

function toDbProduct(fields: Partial<Product>) {
  const db: Record<string, unknown> = {};
  if (fields.name !== undefined) db.name = fields.name;
  if (fields.description !== undefined) db.description = fields.description;
  if (fields.costPrice !== undefined) db.cost_price = fields.costPrice;
  if (fields.price !== undefined) db.price = fields.price;
  if (fields.imageUrl !== undefined) db.image_url = fields.imageUrl;
  if (fields.images !== undefined) db.images = fields.images;
  if (fields.stock !== undefined) db.stock = fields.stock;
  if (fields.status !== undefined) db.status = fields.status;
  if ('wholesaleMinQuantity' in fields) db.wholesale_min_quantity = fields.wholesaleMinQuantity ?? null;
  if ('wholesalePrice' in fields) db.wholesale_price = fields.wholesalePrice ?? null;
  return db;
}

function message(error: unknown) {
  return error instanceof Error ? error.message : String((error as { message?: string })?.message ?? error);
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  transactions: [],
  isLoading: false,
  hasLoadedProducts: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: (data as ProductRow[]).map(toProduct), isLoading: false, hasLoadedProducts: true });
    } catch (error) {
      console.error('Error fetching products:', message(error));
      set({ error: message(error), isLoading: false, hasLoadedProducts: true });
    }
  },

  fetchAdminProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: (data as ProductRow[]).map(toProduct), isLoading: false, hasLoadedProducts: true });
    } catch (error) {
      console.error('Error fetching products:', message(error));
      set({ error: message(error), isLoading: false, hasLoadedProducts: true });
    }
  },

  fetchTransactions: async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formatted: Transaction[] = data.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        costAtTransaction: item.cost_at_transaction,
        priceAtTransaction: item.price_at_transaction,
        totalAmount: item.total_amount,
        type: item.type,
        notes: item.notes,
        date: item.date,
      }));

      set({ transactions: formatted });
    } catch (error) {
      console.error('Error fetching transactions:', message(error));
      set({ error: message(error) });
    }
  },

  // The write actions throw on failure so the admin UI can show the error

  addProduct: async (newProduct) => {
    const { error } = await supabase
      .from('products')
      .insert([{ ...toDbProduct(newProduct), images: newProduct.images ?? [] }]);
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
  },

  updateProduct: async (id, updatedFields) => {
    const { error } = await supabase.from('products').update(toDbProduct(updatedFields)).eq('id', id);
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
  },

  addTransaction: async (transactionData) => {
    const totalAmount = transactionData.priceAtTransaction * transactionData.quantity;
    const currentProduct = get().products.find((p) => p.id === transactionData.productId);

    const { error: txError } = await supabase.from('transactions').insert([
      {
        product_id: transactionData.productId,
        product_name: transactionData.productName,
        quantity: transactionData.quantity,
        cost_at_transaction: currentProduct?.costPrice || 0,
        price_at_transaction: transactionData.priceAtTransaction,
        total_amount: totalAmount,
        type: transactionData.type,
        notes: transactionData.notes,
      },
    ]);
    if (txError) throw new Error(txError.message);

    if (currentProduct) {
      let stockChange = 0;
      if (transactionData.type === 'sale' || transactionData.type === 'warranty') {
        stockChange = -transactionData.quantity;
      } else if (transactionData.type === 'return') {
        stockChange = transactionData.quantity;
      }

      const newStock = Math.max(0, currentProduct.stock + stockChange);
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', transactionData.productId);
      if (stockError) throw new Error(stockError.message);
    }

    await Promise.all([get().fetchTransactions(), get().fetchAdminProducts()]);
  },
}));
