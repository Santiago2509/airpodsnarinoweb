import { createClient } from '@supabase/supabase-js';

// ⚠️ CONFIGURAR ESTAS VARIABLES EN .env.local
// NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Nombre del bucket en Supabase Storage
export const BUCKET_NAME = 'product-images';

/**
 * Sube un archivo de imagen a Supabase Storage.
 * @param file - El archivo a subir
 * @param productId - ID del producto (para organizar por carpeta)
 * @returns La URL pública de la imagen subida, o null si hay error
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Elimina una imagen de Supabase Storage por su URL pública.
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  // Extraer el path relativo desde la URL pública
  const path = publicUrl.split(`${BUCKET_NAME}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error.message);
  }
}
