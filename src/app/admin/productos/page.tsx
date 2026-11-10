"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MIGRATION_HINT, useProductStore } from "@/store/useProductStore";
import { Plus, Edit2, Trash2, ShoppingCart, Search, AlertTriangle } from "lucide-react";
import styles from "./productos.module.css";
import { Product, TransactionType } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";
import Modal from "@/components/Modal";
import { PLACEHOLDER_IMAGE, formatPrice } from "@/lib/site";
import { CATEGORIES, categoryLabel, normalize, productCategory } from "@/lib/categories";
import { deleteProductImage } from "@/lib/supabase";

const STATUS_LABEL: Record<Product["status"], string> = {
  active: "Activo",
  inactive: "Oculto",
};

const LOW_STOCK = 10;

/** Remove image files from storage; failures are logged, never block the UI */
async function removeImages(urls: string[]) {
  await Promise.all(urls.map((url) => deleteProductImage(url)));
}

const initialFormState = {
  name: "",
  description: "",
  costPrice: 0,
  price: 0,
  imageUrl: "",
  images: [] as string[],
  stock: 0,
  status: "active" as Product["status"],
  category: "" as string,
  wholesaleMinQuantity: undefined as number | undefined,
  wholesalePrice: undefined as number | undefined,
};

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido";
}

export default function AdminProductos() {
  const { products, addProduct, updateProduct, deleteProduct, addTransaction, categoriesEnabled } = useProductStore();

  // ---------- Table filters ----------
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Product["status"]>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const visibleProducts = useMemo(() => {
    const q = normalize(query.trim());
    return products.filter((p) => {
      if (q && !normalize(`${p.name} ${p.description}`).includes(q)) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && productCategory(p) !== categoryFilter) return false;
      if (lowStockOnly && p.stock >= LOW_STOCK) return false;
      return true;
    });
  }, [products, query, statusFilter, categoryFilter, lowStockOnly]);
  const lowStockCount = products.filter((p) => p.stock < LOW_STOCK).length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Folder for a new product's photos: created once per form, not on every render
  const [uploadFolder, setUploadFolder] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  // Photos the product had when the form opened, and photos uploaded during this edit
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [uploadedThisSession, setUploadedThisSession] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transactionData, setTransactionData] = useState({
    quantity: 1,
    priceAtTransaction: 0,
    type: "sale" as TransactionType,
    notes: "",
  });

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const openNewProduct = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setOriginalImages([]);
    setUploadedThisSession([]);
    setUploadFolder(`new-${crypto.randomUUID()}`);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
    setEditingId(product.id);
    setUploadFolder(product.id);
    setOriginalImages(images);
    setUploadedThisSession([]);
    setFormData({
      name: product.name,
      description: product.description,
      costPrice: product.costPrice || 0,
      price: product.price,
      imageUrl: product.imageUrl,
      images,
      stock: product.stock,
      status: product.status,
      category: productCategory(product) ?? "",
      wholesaleMinQuantity: product.wholesaleMinQuantity,
      wholesalePrice: product.wholesalePrice,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setOriginalImages([]);
    setUploadedThisSession([]);
  };

  // Cancel: photos uploaded during this edit were never saved, so remove them
  const closeModal = () => {
    if (uploadedThisSession.length) removeImages(uploadedThisSession);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryImage = formData.images[0] || formData.imageUrl || "";
    const dataToSave = { ...formData, imageUrl: primaryImage };

    setSaving(true);
    try {
      const warning = editingId ? await updateProduct(editingId, dataToSave) : await addProduct(dataToSave);
      toast.success(editingId ? "Producto actualizado" : "Producto guardado", warning ? { description: warning } : undefined);
      // Photos removed in the form are deleted from storage once the product is saved
      const kept = new Set(dataToSave.images);
      const removed = [...originalImages, ...uploadedThisSession].filter((url) => !kept.has(url));
      if (removed.length) removeImages(removed);
      resetForm();
    } catch (error) {
      toast.error("No se pudo guardar el producto", { description: errorText(error) });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenTransaction = (product: Product) => {
    setSelectedProduct(product);
    setTransactionData({ quantity: 1, priceAtTransaction: product.price, type: "sale", notes: "" });
  };

  // Auto-apply wholesale price when quantity changes
  const handleQuantityChange = (qty: number) => {
    if (!selectedProduct) return;
    const isWholesale =
      selectedProduct.wholesaleMinQuantity &&
      selectedProduct.wholesalePrice &&
      qty >= selectedProduct.wholesaleMinQuantity;
    setTransactionData((prev) => ({
      ...prev,
      quantity: qty,
      priceAtTransaction: isWholesale ? selectedProduct.wholesalePrice! : selectedProduct.price,
    }));
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSaving(true);
    try {
      await addTransaction({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        ...transactionData,
      });
      toast.success("Movimiento registrado");
      setSelectedProduct(null);
    } catch (error) {
      toast.error("No se pudo registrar el movimiento", { description: errorText(error) });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const product = productToDelete;
    setSaving(true);
    try {
      await deleteProduct(product.id);
      removeImages(product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : []);
      toast.success(`"${product.name}" eliminado`);
      setProductToDelete(null);
    } catch (error) {
      toast.error("No se pudo eliminar", { description: errorText(error) });
    } finally {
      setSaving(false);
    }
  };

  // Sales and warranties cannot take out more units than there are
  const exceedsStock =
    !!selectedProduct &&
    (transactionData.type === "sale" || transactionData.type === "warranty") &&
    transactionData.quantity > selectedProduct.stock;

  const isWholesaleApplied =
    !!selectedProduct?.wholesaleMinQuantity &&
    !!selectedProduct?.wholesalePrice &&
    transactionData.quantity >= selectedProduct.wholesaleMinQuantity;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Productos</h1>
        <button type="button" onClick={openNewProduct} className={`${styles.addButton} pressable`}>
          <Plus size={20} aria-hidden="true" />
          <span>Subir Producto</span>
        </button>
      </div>

      {!categoriesEnabled && (
        <p className={styles.notice}>
          <AlertTriangle size={16} aria-hidden="true" /> Las categorías aún no están activas. {MIGRATION_HINT}
        </p>
      )}

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={16} aria-hidden="true" />
          <span className="srOnly">Buscar productos</span>
          <input
            type="search"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className={styles.select}
          aria-label="Filtrar por estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Ocultos</option>
        </select>
        <select
          className={styles.select}
          aria-label="Filtrar por categoría"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.chip}
          aria-pressed={lowStockOnly}
          onClick={() => setLowStockOnly((v) => !v)}
        >
          Stock bajo <span className="tabular">({lowStockCount})</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  {products.length === 0 ? "Todavía no hay productos." : "Ningún producto coincide con los filtros."}
                </td>
              </tr>
            )}
            {visibleProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
                    <img
                      src={product.imageUrl || PLACEHOLDER_IMAGE}
                      alt=""
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <p className={styles.productName}>{product.name}</p>
                  </div>
                </td>
                <td className={styles.muted}>
                  {categoryLabel(productCategory(product))}
                  {!product.category && productCategory(product) && <span className={styles.guess}> (auto)</span>}
                </td>
                <td className="tabular">{formatPrice(product.price)}</td>
                <td>
                  <span className={`${styles.stockBadge} ${product.stock === 0 ? styles.stockOut : product.stock < LOW_STOCK ? styles.stockLow : styles.stockGood} tabular`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={styles.statusBadge} data-status={product.status}>
                    {STATUS_LABEL[product.status]}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => handleOpenTransaction(product)}
                      title="Registrar salida o venta"
                      aria-label={`Registrar movimiento de ${product.name}`}
                    >
                      <ShoppingCart size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => handleEdit(product)}
                      title="Editar"
                      aria-label={`Editar ${product.name}`}
                    >
                      <Edit2 size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setProductToDelete(product)}
                      title="Eliminar"
                      aria-label={`Eliminar ${product.name}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Create / edit ---------- */}
      <Modal open={isModalOpen} onClose={closeModal} labelledBy="product-form-title" className={styles.modal}>
        <h2 id="product-form-title">{editingId ? "Editar Producto" : "Nuevo Producto"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="p-name">Nombre del Producto</label>
            <input
              id="p-name"
              type="text"
              required
              maxLength={120}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="p-description">Descripción</label>
            <textarea
              id="p-description"
              required
              rows={3}
              maxLength={2000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="p-cost">Precio Unidad (Entrada / Costo)</label>
              <input
                id="p-cost"
                type="number"
                inputMode="numeric"
                required
                min="0"
                value={formData.costPrice || ""}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              />
            </div>
            <div className={styles.formGroup}>
              <span className={styles.fakeLabel}>Valor Total (Costo × Stock)</span>
              <div className={`${styles.readonlyValue} ${styles.readonlyPositive} tabular`}>
                {formatPrice((formData.costPrice || 0) * formData.stock)}
              </div>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="p-price">Precio Salida (Catálogo Público)</label>
              <input
                id="p-price"
                type="number"
                inputMode="numeric"
                required
                min="0"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="p-stock">Stock</label>
              <input
                id="p-stock"
                type="number"
                inputMode="numeric"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="p-status">Estado</label>
            <select
              id="p-status"
              className={styles.select}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Product["status"] })}
            >
              <option value="active">Activo (visible en el catálogo)</option>
              <option value="inactive">Oculto</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="p-category">Categoría</label>
            <select
              id="p-category"
              className={styles.select}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={!categoriesEnabled}
            >
              <option value="">Sin categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            {!categoriesEnabled && <small className={styles.fieldHint}>{MIGRATION_HINT}</small>}
          </div>
          <div className={styles.formGroup}>
            <span className={styles.fakeLabel}>Imágenes del Producto (máx. 6)</span>
            <ImageUploader
              productId={uploadFolder}
              existingImages={formData.images}
              onChange={(urls) => {
                setFormData((prev) => ({ ...prev, images: urls, imageUrl: urls[0] || "" }));
                setUploadedThisSession((prev) => [
                  ...prev,
                  ...urls.filter((u) => !originalImages.includes(u) && !prev.includes(u)),
                ]);
              }}
            />
          </div>

          <div className={styles.wholesaleSection}>
            <p className={styles.wholesaleTitle}>
              Precio Mayorista <span>(Opcional)</span>
            </p>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="p-wmin">A partir de (unidades)</label>
                <input
                  id="p-wmin"
                  type="number"
                  inputMode="numeric"
                  min="2"
                  placeholder="Ej: 6"
                  value={formData.wholesaleMinQuantity ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, wholesaleMinQuantity: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="p-wprice">Precio por unidad (COP)</label>
                <input
                  id="p-wprice"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="Ej: 700000"
                  value={formData.wholesalePrice ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, wholesalePrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
            </div>
            {formData.wholesaleMinQuantity && formData.wholesalePrice ? (
              <div className={styles.wholesalePreview}>
                Desde <strong>{formData.wholesaleMinQuantity} unidades</strong>, el precio baja a{" "}
                <strong>{formatPrice(formData.wholesalePrice)} c/u</strong>. El total sería{" "}
                <strong>{formatPrice(formData.wholesalePrice * formData.wholesaleMinQuantity)}</strong> por el mínimo.
              </div>
            ) : null}
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={closeModal} className={`${styles.cancelBtn} pressable`}>
              Cancelar
            </button>
            <button type="submit" className={`${styles.submitBtn} pressable`} disabled={saving}>
              {saving ? "Guardando…" : editingId ? "Actualizar" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------- Register a movement ---------- */}
      <Modal
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        labelledBy="tx-form-title"
        className={styles.modal}
      >
        {selectedProduct && (
          <>
            <h2 id="tx-form-title">Registrar Movimiento</h2>
            <p className={styles.modalSubtitle}>
              Producto: <strong>{selectedProduct.name}</strong> (Stock: <span className="tabular">{selectedProduct.stock}</span>)
            </p>
            <form onSubmit={handleTransactionSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tx-type">Tipo de Movimiento</label>
                  <select
                    id="tx-type"
                    className={styles.select}
                    value={transactionData.type}
                    onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value as TransactionType })}
                  >
                    <option value="sale">Venta</option>
                    <option value="warranty">Garantía (Salida)</option>
                    <option value="return">Devolución (Entrada)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tx-qty">Cantidad</label>
                  <input
                    id="tx-qty"
                    type="number"
                    inputMode="numeric"
                    required
                    min="1"
                    max={transactionData.type === "return" ? undefined : selectedProduct.stock}
                    aria-invalid={exceedsStock}
                    value={transactionData.quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  />
                </div>
              </div>

              {exceedsStock && (
                <div className={styles.stockError} role="alert">
                  <AlertTriangle size={16} aria-hidden="true" />
                  Solo hay {selectedProduct.stock} unidades en stock.
                </div>
              )}

              {isWholesaleApplied && (
                <div className={styles.wholesaleBadge}>Precio mayorista aplicado automáticamente</div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="tx-price">Precio Unitario (COP) — editable</label>
                <input
                  id="tx-price"
                  type="number"
                  inputMode="numeric"
                  required
                  min="0"
                  value={transactionData.priceAtTransaction}
                  onChange={(e) => setTransactionData({ ...transactionData, priceAtTransaction: Number(e.target.value) })}
                />
                {selectedProduct.wholesaleMinQuantity && selectedProduct.wholesalePrice ? (
                  <small className={styles.fieldHint}>
                    Precio unidad: {formatPrice(selectedProduct.price)} | Precio mayorista (≥
                    {selectedProduct.wholesaleMinQuantity} u.): {formatPrice(selectedProduct.wholesalePrice)}
                  </small>
                ) : null}
              </div>

              <div className={styles.formGroup}>
                <span className={styles.fakeLabel}>Total de la Transacción</span>
                <div className={`${styles.totalValue} tabular`}>
                  {formatPrice(transactionData.priceAtTransaction * transactionData.quantity)}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tx-notes">Notas (Opcional)</label>
                <textarea
                  id="tx-notes"
                  rows={2}
                  placeholder="Nombre del cliente, razón de garantía, etc."
                  value={transactionData.notes}
                  onChange={(e) => setTransactionData({ ...transactionData, notes: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setSelectedProduct(null)} className={`${styles.cancelBtn} pressable`}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.submitBtn} pressable`} disabled={saving || exceedsStock}>
                  {saving ? "Guardando…" : "Confirmar Registro"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

      {/* ---------- Delete confirmation ---------- */}
      <Modal
        open={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        labelledBy="delete-title"
        className={`${styles.modal} ${styles.confirmModal}`}
      >
        {productToDelete && (
          <>
            <h2 id="delete-title">¿Eliminar este producto?</h2>
            <p className={styles.modalSubtitle}>
              <strong>{productToDelete.name}</strong> se borrará del catálogo y del panel. Esta acción no se puede deshacer.
            </p>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setProductToDelete(null)} className={`${styles.cancelBtn} pressable`}>
                Cancelar
              </button>
              <button type="button" onClick={confirmDelete} className={`${styles.dangerBtn} pressable`} disabled={saving}>
                {saving ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
