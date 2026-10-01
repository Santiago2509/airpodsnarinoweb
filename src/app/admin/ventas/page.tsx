"use client";

import { useProductStore } from "@/store/useProductStore";
import styles from "./ventas.module.css";

export default function VentasHistory() {
  const { transactions } = useProductStore();

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "sale": return styles.typeSale;
      case "warranty": return styles.typeWarranty;
      case "return": return styles.typeReturn;
      default: return "";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sale": return "Venta";
      case "warranty": return "Garantía";
      case "return": return "Devolución";
      default: return type;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Historial de Movimientos</h1>

      <div className={styles.tableContainer}>
        {transactions.length === 0 ? (
          <div className={styles.emptyState}>
            Aún no hay movimientos registrados.
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
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: "#94a3b8" }}>{formatDate(tx.date)}</td>
                  <td style={{ fontWeight: 600 }}>{tx.productName}</td>
                  <td>
                    <span className={`${styles.typeBadge} ${getTypeStyle(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {tx.type === 'return' ? '+' : '-'}{tx.quantity}
                  </td>
                  <td>${tx.priceAtTransaction.toLocaleString("es-CO")}</td>
                  <td style={{ color: "#38bdf8", fontWeight: "bold" }}>
                    ${tx.totalAmount.toLocaleString("es-CO")}
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{tx.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
