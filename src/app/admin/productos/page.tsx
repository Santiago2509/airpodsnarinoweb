"use client";

import { useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { Plus, Edit2, Trash2, ShoppingCart } from "lucide-react";
import styles from "./productos.module.css";
import { Product } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

export default function AdminProductos() {
  const { products, addProduct, updateProduct, deleteProduct, addTransaction } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionData, setTransactionData] = useState({
    quantity: 1,
    priceAtTransaction: 0,
    type: "sale" as const,
    notes: ""
  });
  
  const initialFormState = {
    name: "",
    description: "",
    costPrice: 0,
    price: 0,
    imageUrl: "",
    images: [] as string[],
    stock: 0,
    status: "active" as const,
    wholesaleMinQuantity: undefined as number | undefined,
    wholesalePrice: undefined as number | undefined
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // First image becomes the main imageUrl
    const primaryImage = formData.images?.[0] || formData.imageUrl || "";
    const dataToSave = { ...formData, imageUrl: primaryImage };
    if (editingId) {
      updateProduct(editingId, dataToSave);
    } else {
      addProduct(dataToSave);
    }
    closeModal();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      costPrice: product.costPrice || 0,
      price: product.price,
      imageUrl: product.imageUrl,
      images: product.images || (product.imageUrl ? [product.imageUrl] : []),
      stock: product.stock,
      status: product.status,
      wholesaleMinQuantity: product.wholesaleMinQuantity,
      wholesalePrice: product.wholesalePrice
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleOpenTransaction = (product: Product) => {
    setSelectedProduct(product);
    setTransactionData({
      quantity: 1,
      priceAtTransaction: product.price,
      type: "sale",
      notes: ""
    });
    setIsTransactionModalOpen(true);
  };

  // Auto-apply wholesale price when quantity changes
  const handleQuantityChange = (qty: number) => {
    if (!selectedProduct) return;
    const isWholesale = selectedProduct.wholesaleMinQuantity && selectedProduct.wholesalePrice &&
      qty >= selectedProduct.wholesaleMinQuantity;
    setTransactionData(prev => ({
      ...prev,
      quantity: qty,
      priceAtTransaction: isWholesale ? selectedProduct.wholesalePrice! : selectedProduct.price
    }));
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    addTransaction({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      ...transactionData
    });
    
    setIsTransactionModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Productos</h1>
        <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
          <Plus size={20} />
          <span>Subir Producto</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.productCell}>
                  <img 
                    src={product.imageUrl || 'https://placehold.co/60x60/0f172a/38bdf8?text=N/A'} 
                    alt={product.name} 
                    className={styles.productImage}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/60x60/0f172a/38bdf8?text=N/A' }}
                  />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{product.name}</p>
                  </div>
                </td>
                <td>${product.price.toLocaleString("es-CO")}</td>
                <td>
                  <span className={`${styles.stockBadge} ${product.stock < 10 ? styles.stockLow : styles.stockGood}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={styles.statusBadge}>{product.status}</span>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn} onClick={() => handleOpenTransaction(product)} title="Registrar Salida / Venta">
                    <ShoppingCart size={18} />
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleEdit(product)} title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                    onClick={() => deleteProduct(product.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editingId ? "Editar Producto" : "Nuevo Producto"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nombre del Producto</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea 
                  required 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Precio Unidad (Entrada / Costo)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.costPrice || ""}
                    onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Valor Total (Costo × Stock)</label>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4ade80", padding: "0.5rem 0", background: "rgba(2,4,10,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", paddingLeft: "0.75rem", display: "flex", alignItems: "center" }}>
                    ${((formData.costPrice || 0) * formData.stock).toLocaleString("es-CO")}
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Precio Salida (Catálogo Público)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.price || ""}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock Inicial</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Imágenes del Producto (máx. 6)</label>
                <ImageUploader
                  productId={editingId || `new-${Date.now()}`}
                  existingImages={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls, imageUrl: urls[0] || "" })}
                />
              </div>

              {/* PRECIO MAYORISTA - OPCIONAL */}
              <div className={styles.wholesaleSection}>
                <p className={styles.wholesaleTitle}>💼 Precio Mayorista <span>(Opcional)</span></p>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>A partir de (unidades)</label>
                    <input
                      type="number"
                      min="2"
                      placeholder="Ej: 6"
                      value={formData.wholesaleMinQuantity ?? ""}
                      onChange={e => setFormData({...formData, wholesaleMinQuantity: e.target.value ? Number(e.target.value) : undefined})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio por unidad (COP)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ej: 700000"
                      value={formData.wholesalePrice ?? ""}
                      onChange={e => setFormData({...formData, wholesalePrice: e.target.value ? Number(e.target.value) : undefined})}
                    />
                  </div>
                </div>
                {formData.wholesaleMinQuantity && formData.wholesalePrice && (
                  <div className={styles.wholesalePreview}>
                    ✅ Desde <strong>{formData.wholesaleMinQuantity} unidades</strong>, el precio baja a <strong>${formData.wholesalePrice.toLocaleString("es-CO")} c/u</strong>.
                    El total sería <strong>${(formData.wholesalePrice * formData.wholesaleMinQuantity).toLocaleString("es-CO")}</strong> por el mínimo.
                  </div>
                )}
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? "Actualizar" : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isTransactionModalOpen && selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Registrar Movimiento</h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
              Producto: <strong style={{ color: "#fff" }}>{selectedProduct.name}</strong> (Stock: {selectedProduct.stock})
            </p>
            <form onSubmit={handleTransactionSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo de Movimiento</label>
                  <select 
                    value={transactionData.type}
                    onChange={e => setTransactionData({...transactionData, type: e.target.value as any})}
                    style={{ background: "rgba(2, 4, 10, 0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem", borderRadius: "0.5rem", color: "#fff", outline: "none" }}
                  >
                    <option value="sale">Venta</option>
                    <option value="warranty">Garantía (Salida)</option>
                    <option value="return">Devolución (Entrada)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Cantidad</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={transactionData.quantity}
                    onChange={e => handleQuantityChange(Number(e.target.value))}
                  />
                </div>
              </div>
              
              {/* Wholesale badge */}
              {selectedProduct?.wholesaleMinQuantity && selectedProduct?.wholesalePrice &&
                transactionData.quantity >= selectedProduct.wholesaleMinQuantity && (
                <div className={styles.wholesaleBadge}>
                  💼 Precio mayorista aplicado automáticamente
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Precio Unitario (COP) — editable</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  value={transactionData.priceAtTransaction}
                  onChange={e => setTransactionData({...transactionData, priceAtTransaction: Number(e.target.value)})}
                />
                {selectedProduct?.wholesaleMinQuantity && selectedProduct?.wholesalePrice && (
                  <small style={{ color: "#94a3b8", marginTop: "0.3rem" }}>
                    Precio unidad: ${selectedProduct.price.toLocaleString("es-CO")} | Precio mayorista (≥{selectedProduct.wholesaleMinQuantity} u.): ${selectedProduct.wholesalePrice.toLocaleString("es-CO")}
                  </small>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Total de la Transacción</label>
                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#38bdf8", padding: "0.5rem 0", letterSpacing: "-0.02em" }}>
                  ${(transactionData.priceAtTransaction * transactionData.quantity).toLocaleString("es-CO")}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Notas (Opcional)</label>
                <textarea 
                  rows={2}
                  placeholder="Nombre del cliente, razón de garantía, etc."
                  value={transactionData.notes}
                  onChange={e => setTransactionData({...transactionData, notes: e.target.value})}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsTransactionModalOpen(false)} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
