"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Search, Trash2 } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { Transaction, TransactionType } from "@/lib/types";
import { formatPrice } from "@/lib/site";
import { normalize } from "@/lib/categories";
import { downloadCsv } from "@/lib/csv";
import Modal from "@/components/Modal";
import styles from "./ventas.module.css";

const TYPE_LABEL: Record<TransactionType, string> = {
  sale: "Venta",
  warranty: "Garantía",
  return: "Devolución",
};

const formatDate = (isoString: string) =>
  new Date(isoString).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function VentasHistory() {
  const { transactions, deleteTransaction } = useProductStore();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [toDelete, setToDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (q && !normalize(`${tx.productName} ${tx.notes ?? ""}`).includes(q)) return false;
      return true;
    });
  }, [transactions, query, typeFilter]);

  const exportCsv = () => {
    downloadCsv(
      `movimientos-airpods-narino-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Fecha", "Producto", "Tipo", "Cantidad", "Precio unitario", "Total", "Notas"],
      visible.map((tx) => [
        formatDate(tx.date),
        tx.productName,
        TYPE_LABEL[tx.type] ?? tx.type,
        tx.quantity,
        tx.priceAtTransaction,
        tx.totalAmount,
        tx.notes ?? "",
      ])
    );
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTransaction(toDelete);
      toast.success("Movimiento eliminado", { description: "El stock se ajustó de nuevo." });
      setToDelete(null);
    } catch (error) {
      toast.error("No se pudo eliminar", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setDeleting(false);
    }
  };

  const stockNote = (tx: Transaction) =>
    tx.type === "return"
      ? `Se restarán ${tx.quantity} unidades del stock de ${tx.productName}.`
      : `Se devolverán ${tx.quantity} unidades al stock de ${tx.productName}.`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Historial de Movimientos</h1>
        <button type="button" className={`${styles.exportBtn} pressable`} onClick={exportCsv} disabled={visible.length === 0}>
          <Download size={18} aria-hidden="true" /> Descargar Excel
        </button>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={16} aria-hidden="true" />
          <span className="srOnly">Buscar movimientos</span>
          <input
            type="search"
            placeholder="Buscar por producto o nota…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className={styles.chips} role="radiogroup" aria-label="Tipo de movimiento">
          {(["all", "sale", "warranty", "return"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={typeFilter === t}
              className={styles.chip}
              onClick={() => setTypeFilter(t)}
            >
              {t === "all" ? "Todos" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer}>
        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            {transactions.length === 0 ? "Aún no hay movimientos registrados." : "Ningún movimiento coincide con los filtros."}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cant.</th>
                <th>Precio Uni.</th>
                <th>Total</th>
                <th>Notas</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {visible.map((tx) => (
                <tr key={tx.id}>
                  <td className={`${styles.muted} tabular`}>{formatDate(tx.date)}</td>
                  <td className={styles.strong}>{tx.productName}</td>
                  <td>
                    <span className={styles.typeBadge} data-type={tx.type}>
                      {TYPE_LABEL[tx.type] ?? tx.type}
                    </span>
                  </td>
                  <td className={`${styles.strong} tabular`}>
                    {tx.type === "return" ? "+" : "-"}
                    {tx.quantity}
                  </td>
                  <td className="tabular">{formatPrice(tx.priceAtTransaction)}</td>
                  <td className={`${styles.total} tabular`}>{formatPrice(tx.totalAmount)}</td>
                  <td className={styles.notes}>{tx.notes || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => setToDelete(tx)}
                      aria-label={`Eliminar movimiento de ${tx.productName}`}
                      title="Eliminar movimiento"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} labelledBy="tx-delete-title" className={styles.modal}>
        {toDelete && (
          <>
            <h2 id="tx-delete-title">¿Eliminar este movimiento?</h2>
            <p className={styles.modalText}>
              {TYPE_LABEL[toDelete.type]} de <strong>{toDelete.quantity}</strong> × <strong>{toDelete.productName}</strong> del{" "}
              {formatDate(toDelete.date)}. {stockNote(toDelete)}
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={`${styles.cancelBtn} pressable`} onClick={() => setToDelete(null)}>
                Cancelar
              </button>
              <button type="button" className={`${styles.dangerBtn} pressable`} onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
