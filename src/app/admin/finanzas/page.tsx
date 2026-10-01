"use client";

import { useState, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import styles from "./finanzas.module.css";

export default function AdminFinanzas() {
  const { transactions } = useProductStore();
  
  // Filtros
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>("all"); // "all" o "0" a "11"

  // Años disponibles fijos hasta 2030 (o más allá si hay transacciones)
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    
    // Añadir desde el año actual hasta 2030 (o al revés)
    for (let y = 2024; y <= 2030; y++) {
      years.add(y);
    }
    
    // Asegurarse de añadir años de transacciones reales por si acaso
    transactions.forEach(t => years.add(new Date(t.date).getFullYear()));
    
    return Array.from(years).sort((a, b) => b - a); // Ordenar de mayor a menor
  }, [transactions]);

  // Transacciones filtradas por el mes y año seleccionado
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Solo ventas válidas
      if (t.type !== 'sale') return false;

      const date = new Date(t.date);
      const tYear = date.getFullYear().toString();
      const tMonth = date.getMonth().toString();

      if (year !== "all" && tYear !== year) return false;
      if (month !== "all" && tMonth !== month) return false;
      return true;
    });
  }, [transactions, year, month]);

  // Cálculos financieros
  const { totalRevenue, totalCost, totalProfit } = useMemo(() => {
    let rev = 0;
    let cost = 0;
    
    filteredTransactions.forEach(t => {
      rev += t.totalAmount;
      cost += (t.costAtTransaction || 0) * t.quantity;
    });

    return {
      totalRevenue: rev,
      totalCost: cost,
      totalProfit: rev - cost
    };
  }, [filteredTransactions]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("es-CO")}`;
  };

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Auditoría y Ganancias</h1>
        
        <div className={styles.controls}>
          <select 
            value={year} 
            onChange={e => setYear(e.target.value)}
            className={styles.select}
          >
            <option value="all">Todos los años</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            className={styles.select}
          >
            <option value="all">Todos los meses</option>
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Ingresos Brutos (Ventas)</span>
          <span className={styles.cardValue}>{formatCurrency(totalRevenue)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Costo de Mercancía</span>
          <span className={styles.cardValue}>{formatCurrency(totalCost)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Ganancia Neta (Profit)</span>
          <span className={`${styles.cardValue} ${totalProfit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
            {formatCurrency(totalProfit)}
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Ingreso</th>
              <th>Costo</th>
              <th>Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>No hay ventas registradas en este periodo</td>
              </tr>
            ) : (
              filteredTransactions.map(t => {
                const ingreso = t.totalAmount;
                const costo = (t.costAtTransaction || 0) * t.quantity;
                const ganancia = ingreso - costo;
                
                return (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString('es-CO')}</td>
                    <td>{t.productName}</td>
                    <td>{t.quantity}</td>
                    <td>{formatCurrency(ingreso)}</td>
                    <td>{formatCurrency(costo)}</td>
                    <td className={ganancia >= 0 ? styles.profitPositive : styles.profitNegative}>
                      {formatCurrency(ganancia)}
                    </td>
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
