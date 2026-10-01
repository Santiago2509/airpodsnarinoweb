"use client";

import { useState, useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import styles from "./dashboard.module.css";
import { Package, TrendingUp, AlertCircle, DollarSign, Activity, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { products, transactions } = useProductStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const totalRevenue = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, t) => acc + t.totalAmount, 0);

  const today = new Date().toDateString();
  const todaysRevenue = transactions
    .filter(t => t.type === 'sale' && new Date(t.date).toDateString() === today)
    .reduce((acc, t) => acc + t.totalAmount, 0);
    
  const todaysSalesCount = transactions
    .filter(t => t.type === 'sale' && new Date(t.date).toDateString() === today)
    .length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentMonthName = monthNames[currentMonth];

  const thisMonthRevenue = transactions
    .filter(t => {
      if (t.type !== 'sale') return false;
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Resumen del Negocio</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(2, 4, 10, 0.4)', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Clock size={20} style={{ color: '#38bdf8' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-orbitron)' }}>
              {currentTime ? currentTime.toLocaleTimeString('es-CO') : '--:--:--'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {currentTime ? currentTime.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '...'}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)", borderLeft: "4px solid #38bdf8" }}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(56, 189, 248, 0.1)" }}>
            <DollarSign className={styles.statIcon} style={{ color: "#38bdf8" }} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Ingresos Totales</p>
            <p className={styles.statValue}>${totalRevenue.toLocaleString("es-CO")}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}>
            <TrendingUp className={styles.statIcon} style={{ color: "#a855f7" }} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Ingresos de {currentMonthName}</p>
            <p className={styles.statValue}>${thisMonthRevenue.toLocaleString("es-CO")}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
            <Activity className={styles.statIcon} style={{ color: "#4ade80" }} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Ventas de Hoy</p>
            <p className={styles.statValue}>${todaysRevenue.toLocaleString("es-CO")} <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "normal" }}>({todaysSalesCount} ventas)</span></p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Package className={styles.statIcon} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Productos</p>
            <p className={styles.statValue}>{totalProducts}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(34, 211, 238, 0.1)" }}>
            <TrendingUp className={styles.statIcon} style={{ color: "#22d3ee" }} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Unidades en Stock</p>
            <p className={styles.statValue}>{totalStock}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            <AlertCircle className={styles.statIcon} style={{ color: "#ef4444" }} size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Stock Bajo</p>
            <p className={styles.statValue}>{lowStockProducts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
