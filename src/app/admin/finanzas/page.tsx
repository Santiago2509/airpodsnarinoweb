"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { Transaction } from "@/lib/types";
import { formatPrice } from "@/lib/site";
import { downloadCsv } from "@/lib/csv";
import ProfitChart, { MonthPoint } from "./ProfitChart";
import styles from "./finanzas.module.css";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const unitCost = (t: Transaction) => (t.costAtTransaction || 0) * t.quantity;

/**
 * Profit model:
 *   ventas    → ingreso = total, costo = costo unitario × cantidad
 *   garantías → no hay ingreso; el producto entregado es un costo
 *   devoluciones → se muestran aparte (el producto vuelve al stock)
 */
function summarize(list: Transaction[]) {
  let revenue = 0;
  let cost = 0;
  let warrantyCost = 0;
  let returnsAmount = 0;
  let returnsCount = 0;
  for (const t of list) {
    if (t.type === "sale") {
      revenue += t.totalAmount;
      cost += unitCost(t);
    } else if (t.type === "warranty") {
      warrantyCost += unitCost(t);
    } else if (t.type === "return") {
      returnsAmount += t.totalAmount;
      returnsCount += t.quantity;
    }
  }
  return { revenue, cost, warrantyCost, profit: revenue - cost - warrantyCost, returnsAmount, returnsCount };
}

export default function AdminFinanzas() {
  const { transactions } = useProductStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>("all"); // "all" or "0".."11"

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    for (let y = 2024; y <= currentYear; y++) years.add(y);
    transactions.forEach((t) => years.add(new Date(t.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const inPeriod = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        if (year !== "all" && d.getFullYear().toString() !== year) return false;
        if (month !== "all" && d.getMonth().toString() !== month) return false;
        return true;
      }),
    [transactions, year, month]
  );

  const totals = useMemo(() => summarize(inPeriod), [inPeriod]);
  const rows = useMemo(() => inPeriod.filter((t) => t.type === "sale" || t.type === "warranty"), [inPeriod]);

  // Monthly profit for the chart (whole selected year)
  const monthly: MonthPoint[] = useMemo(() => {
    if (year === "all") return [];
    const byMonth = MONTHS.map(() => [] as Transaction[]);
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear().toString() === year) byMonth[d.getMonth()].push(t);
    });
    return byMonth.map((list, i) => ({ label: MONTHS[i], ...summarize(list) }));
  }, [transactions, year]);

  const periodLabel =
    year === "all" ? "todos-los-años" : month === "all" ? year : `${MONTHS[Number(month)].toLowerCase()}-${year}`;

  const exportCsv = () => {
    downloadCsv(
      `finanzas-airpods-narino-${periodLabel}.csv`,
      ["Fecha", "Producto", "Tipo", "Cantidad", "Ingreso", "Costo", "Ganancia"],
      rows.map((t) => {
        const ingreso = t.type === "sale" ? t.totalAmount : 0;
        const costo = unitCost(t);
        return [
          new Date(t.date).toLocaleDateString("es-CO"),
          t.productName,
          t.type === "sale" ? "Venta" : "Garantía",
          t.quantity,
          ingreso,
          costo,
          ingreso - costo,
        ];
      })
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Auditoría y Ganancias</h1>

        <div className={styles.controls}>
          <select aria-label="Año" value={year} onChange={(e) => setYear(e.target.value)} className={styles.select}>
            <option value="all">Todos los años</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select aria-label="Mes" value={month} onChange={(e) => setMonth(e.target.value)} className={styles.select}>
            <option value="all">Todos los meses</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>

          <button type="button" className={`${styles.exportBtn} pressable`} onClick={exportCsv} disabled={rows.length === 0}>
            <Download size={18} aria-hidden="true" /> Descargar Excel
          </button>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Ingresos (ventas)</span>
          <span className={`${styles.cardValue} tabular`}>{formatPrice(totals.revenue)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Costo de mercancía</span>
          <span className={`${styles.cardValue} tabular`}>{formatPrice(totals.cost)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Costo de garantías</span>
          <span className={`${styles.cardValue} tabular`}>{formatPrice(totals.warrantyCost)}</span>
        </div>
        <div className={`${styles.card} ${styles.cardHighlight}`}>
          <span className={styles.cardTitle}>Ganancia neta</span>
          <span className={`${styles.cardValue} tabular ${totals.profit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
            {formatPrice(totals.profit)}
          </span>
          <span className={styles.cardNote}>Ventas − costo − garantías</span>
        </div>
      </div>

      {totals.returnsCount > 0 && (
        <p className={styles.note}>
          Devoluciones en el periodo: <strong className="tabular">{totals.returnsCount}</strong> unidades (
          <span className="tabular">{formatPrice(totals.returnsAmount)}</span>). No se restan de la ganancia; el producto
          volvió al stock.
        </p>
      )}

      <section className={styles.chartCard} aria-labelledby="chart-title">
        <div className={styles.chartHead}>
          <h2 id="chart-title">Ganancia neta por mes {year !== "all" && <span className="tabular">· {year}</span>}</h2>
        </div>
        {year === "all" ? (
          <p className={styles.chartEmpty}>Elige un año para ver la ganancia mes a mes.</p>
        ) : (
          <ProfitChart data={monthly} highlight={month === "all" ? null : Number(month)} />
        )}
      </section>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cant.</th>
              <th>Ingreso</th>
              <th>Costo</th>
              <th>Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  No hay ventas registradas en este periodo
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const ingreso = t.type === "sale" ? t.totalAmount : 0;
                const costo = unitCost(t);
                const ganancia = ingreso - costo;
                return (
                  <tr key={t.id} className="tabular">
                    <td>{new Date(t.date).toLocaleDateString("es-CO")}</td>
                    <td>{t.productName}</td>
                    <td>
                      <span className={styles.typeBadge} data-type={t.type}>
                        {t.type === "sale" ? "Venta" : "Garantía"}
                      </span>
                    </td>
                    <td>{t.quantity}</td>
                    <td>{formatPrice(ingreso)}</td>
                    <td>{formatPrice(costo)}</td>
                    <td className={ganancia >= 0 ? styles.profitPositive : styles.profitNegative}>{formatPrice(ganancia)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
