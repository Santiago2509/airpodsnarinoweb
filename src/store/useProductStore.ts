import { create } from 'zustand';
import { Product, Transaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ProductState {
  products: Product[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'totalAmount'>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  transactions: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to interface
      const formattedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        costPrice: item.cost_price,
        price: item.price,
        imageUrl: item.image_url,
        images: item.images,
        stock: item.stock,
        status: item.status,
        wholesaleMinQuantity: item.wholesale_min_quantity,
        wholesalePrice: item.wholesale_price,
        createdAt: item.created_at
      }));

      set({ products: formattedProducts, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Map database fields to interface
      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        costAtTransaction: item.cost_at_transaction,
        priceAtTransaction: item.price_at_transaction,
        totalAmount: item.total_amount,
        type: item.type,
        notes: item.notes,
        date: item.date
      }));

      set({ transactions: formattedTransactions, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (newProduct) => {
    try {
      const dbProduct = {
        name: newProduct.name,
        description: newProduct.description,
        cost_price: newProduct.costPrice,
        price: newProduct.price,
        image_url: newProduct.imageUrl,
        images: newProduct.images || [],
        stock: newProduct.stock,
        status: newProduct.status,
        wholesale_min_quantity: newProduct.wholesaleMinQuantity,
        wholesale_price: newProduct.wholesalePrice
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) throw error;

      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error.message);
    }
  },

  updateProduct: async (id, updatedFields) => {
    try {
      const dbProduct: any = {};
      if (updatedFields.name !== undefined) dbProduct.name = updatedFields.name;
      if (updatedFields.description !== undefined) dbProduct.description = updatedFields.description;
      if (updatedFields.costPrice !== undefined) dbProduct.cost_price = updatedFields.costPrice;
      if (updatedFields.price !== undefined) dbProduct.price = updatedFields.price;
      if (updatedFields.imageUrl !== undefined) dbProduct.image_url = updatedFields.imageUrl;
      if (updatedFields.images !== undefined) dbProduct.images = updatedFields.images;
      if (updatedFields.stock !== undefined) dbProduct.stock = updatedFields.stock;
      if (updatedFields.status !== undefined) dbProduct.status = updatedFields.status;
      if (updatedFields.wholesaleMinQuantity !== undefined) dbProduct.wholesale_min_quantity = updatedFields.wholesaleMinQuantity;
      if (updatedFields.wholesalePrice !== undefined) dbProduct.wholesale_price = updatedFields.wholesalePrice;

      const { error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error.message);
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const totalAmount = transactionData.priceAtTransaction * transactionData.quantity;

      const currentProduct = get().products.find(p => p.id === transactionData.productId);
      
      const dbTransaction = {
        product_id: transactionData.productId,
        product_name: transactionData.productName,
        quantity: transactionData.quantity,
        cost_at_transaction: currentProduct?.costPrice || 0,
        price_at_transaction: transactionData.priceAtTransaction,
        total_amount: totalAmount,
        type: transactionData.type,
        notes: transactionData.notes
      };

      const { error: txError } = await supabase
        .from('transactions')
        .insert([dbTransaction]);

      if (txError) throw txError;

      // Update product stock if it's a sale
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
          
        if (stockError) throw stockError;
      }

      await get().fetchTransactions();
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
    }
  }
}));
