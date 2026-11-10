import { create } from 'zustand';
import { Product, Transaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Columns safe to show on the public site: never cost prices or wholesale data
const PUBLIC_COLUMNS = 'id, name, description, price, image_url, images, stock, status, created_at';
const PUBLIC_COLUMNS_WITH_CATEGORY = `${PUBLIC_COLUMNS}, category`;

/** Shown in the admin when supabase/mejoras-panel.sql has not been run yet */
export const MIGRATION_HINT = 'Corre supabase/mejoras-panel.sql en Supabase para activar esta función.';

interface ProductState {
  products: Product[];
  transactions: Transaction[];
  isLoading: boolean;
  hasLoadedProducts: boolean;
  /** false until the "category" column exists in the database */
  categoriesEnabled: boolean;
  error: string | null;
  /** Public catalog: active products, public columns only */
  fetchProducts: () => Promise<void>;
  /** Admin panel: every product with every column */
  fetchAdminProducts: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  /** Write actions throw on failure; they resolve with a warning string when something was skipped */
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<string | void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<string | void>;
  deleteProduct: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'totalAmount'>) => Promise<void>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
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
  category?: string | null;
  wholesale_min_quantity?: number | null;
  wholesale_price?: number | null;
  created_at: string;
};

type DbError = { code?: string; message?: string } | null;

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
    category: item.category ?? null,
    wholesaleMinQuantity: item.wholesale_min_quantity ?? undefined,
    wholesalePrice: item.wholesale_price ?? undefined,
    createdAt: item.created_at,
  };
}

function toDbProduct(fields: Partial<Product>, withCategory: boolean) {
  const db: Record<string, unknown> = {};
  if (fields.name !== undefined) db.name = fields.name;
  if (fields.description !== undefined) db.description = fields.description;
  if (fields.costPrice !== undefined) db.cost_price = fields.costPrice;
  if (fields.price !== undefined) db.price = fields.price;
  if (fields.imageUrl !== undefined) db.image_url = fields.imageUrl;
  if (fields.images !== undefined) db.images = fields.images;
  if (fields.stock !== undefined) db.stock = fields.stock;
  if (fields.status !== undefined) db.status = fields.status;
  if (withCategory && 'category' in fields) db.category = fields.category || null;
  if ('wholesaleMinQuantity' in fields) db.wholesale_min_quantity = fields.wholesaleMinQuantity ?? null;
  if ('wholesalePrice' in fields) db.wholesale_price = fields.wholesalePrice ?? null;
  return db;
}

function message(error: unknown) {
  return error instanceof Error ? error.message : String((error as { message?: string })?.message ?? error);
}

/** The "category" column does not exist yet */
const isMissingColumn = (e: DbError) =>
  !!e && (e.code === '42703' || e.code === 'PGRST204' || /category/i.test(e.message ?? ''));

/** The SQL function has not been created yet */
const isMissingFunction = (e: DbError) =>
  !!e && (e.code === 'PGRST202' || e.code === '42883' || /could not find the function/i.test(e.message ?? ''));

/** Database errors raised by the SQL functions, in Spanish */
function friendly(e: DbError) {
  const m = e?.message ?? '';
  if (m.includes('STOCK_INSUFICIENTE')) return 'No hay stock suficiente para este movimiento.';
  if (m.includes('PRODUCTO_NO_EXISTE')) return 'Ese producto ya no existe.';
  if (m.includes('CANTIDAD_INVALIDA')) return 'La cantidad debe ser mayor que cero.';
  if (m.includes('MOVIMIENTO_NO_EXISTE')) return 'Ese movimiento ya no existe.';
  return m || 'Error desconocido';
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  transactions: [],
  isLoading: false,
  hasLoadedProducts: false,
  categoriesEnabled: true,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    const query = (columns: string) =>
      supabase.from('products').select(columns).eq('status', 'active').order('created_at', { ascending: false });

    let { data, error } = await query(PUBLIC_COLUMNS_WITH_CATEGORY);
    if (isMissingColumn(error)) {
      set({ categoriesEnabled: false });
      ({ data, error } = await query(PUBLIC_COLUMNS));
    }
    if (error) {
      console.error('Error fetching products:', error.message);
      set({ error: error.message, isLoading: false, hasLoadedProducts: true });
      return;
    }
    set({ products: (data as unknown as ProductRow[]).map(toProduct), isLoading: false, hasLoadedProducts: true });
  },

  fetchAdminProducts: async () => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error.message);
      set({ error: error.message, isLoading: false, hasLoadedProducts: true });
      return;
    }
    const rows = data as ProductRow[];
    // With select('*') the column is present on every row once the migration has run
    const categoriesEnabled = rows.length === 0 ? get().categoriesEnabled : rows.some((r) => 'category' in r);
    set({ products: rows.map(toProduct), isLoading: false, hasLoadedProducts: true, categoriesEnabled });
  },

  fetchTransactions: async () => {
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (error) {
      console.error('Error fetching transactions:', error.message);
      set({ error: error.message });
      return;
    }
    set({
      transactions: data.map((item) => ({
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
      })),
    });
  },

  addProduct: async (newProduct) => {
    const insert = (withCategory: boolean) =>
      supabase.from('products').insert([{ ...toDbProduct(newProduct, withCategory), images: newProduct.images ?? [] }]);

    let warning: string | undefined;
    let { error } = await insert(get().categoriesEnabled);
    if (isMissingColumn(error)) {
      set({ categoriesEnabled: false });
      warning = `Se guardó sin categoría. ${MIGRATION_HINT}`;
      ({ error } = await insert(false));
    }
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
    return warning;
  },

  updateProduct: async (id, fields) => {
    const update = (withCategory: boolean) =>
      supabase.from('products').update(toDbProduct(fields, withCategory)).eq('id', id);

    let warning: string | undefined;
    let { error } = await update(get().categoriesEnabled);
    if (isMissingColumn(error)) {
      set({ categoriesEnabled: false });
      warning = `Se guardó sin categoría. ${MIGRATION_HINT}`;
      ({ error } = await update(false));
    }
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
    return warning;
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await get().fetchAdminProducts();
  },

  addTransaction: async (tx) => {
    const product = get().products.find((p) => p.id === tx.productId);
    if (product && (tx.type === 'sale' || tx.type === 'warranty') && tx.quantity > product.stock) {
      throw new Error(`Solo hay ${product.stock} unidades de ${product.name}.`);
    }

    // Preferred: one database call that saves the movement and the stock together
    const { error: rpcError } = await supabase.rpc('register_transaction', {
      p_product_id: tx.productId,
      p_product_name: tx.productName,
      p_quantity: tx.quantity,
      p_price: tx.priceAtTransaction,
      p_type: tx.type,
      p_notes: tx.notes || null,
    });

    if (rpcError && !isMissingFunction(rpcError)) throw new Error(friendly(rpcError));

    if (rpcError) {
      // Fallback before the migration: two steps
      const { error: txError } = await supabase.from('transactions').insert([
        {
          product_id: tx.productId,
          product_name: tx.productName,
          quantity: tx.quantity,
          cost_at_transaction: product?.costPrice || 0,
          price_at_transaction: tx.priceAtTransaction,
          total_amount: tx.priceAtTransaction * tx.quantity,
          type: tx.type,
          notes: tx.notes,
        },
      ]);
      if (txError) throw new Error(txError.message);

      if (product) {
        const change = tx.type === 'return' ? tx.quantity : -tx.quantity;
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: Math.max(0, product.stock + change) })
          .eq('id', tx.productId);
        if (stockError) throw new Error(stockError.message);
      }
    }

    await Promise.all([get().fetchTransactions(), get().fetchAdminProducts()]);
  },

  deleteTransaction: async (tx) => {
    const { error: rpcError } = await supabase.rpc('delete_transaction', { p_id: tx.id });
    if (rpcError && !isMissingFunction(rpcError)) throw new Error(friendly(rpcError));

    if (rpcError) {
      // Fallback before the migration: two steps
      const { error } = await supabase.from('transactions').delete().eq('id', tx.id);
      if (error) throw new Error(error.message);
      const product = get().products.find((p) => p.id === tx.productId);
      if (product) {
        const change = tx.type === 'return' ? -tx.quantity : tx.quantity;
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: Math.max(0, product.stock + change) })
          .eq('id', tx.productId);
        if (stockError) throw new Error(stockError.message);
      }
    }

    await Promise.all([get().fetchTransactions(), get().fetchAdminProducts()]);
  },
}));

export { message as errorMessage };
