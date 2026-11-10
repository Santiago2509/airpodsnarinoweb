"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";
import styles from "./dashboard.module.css";
import { Package, TrendingUp, AlertCircle, DollarSign, Activity, Clock, Boxes } from "lucide-react";
import { formatPrice } from "@/lib/site";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Only the clock re-renders every second, not the whole dashboard
function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clock}>
      <Clock size={20} className={styles.clockIcon} aria-hidden="true" />
      <div className={styles.clockText}>
        <span className={`${styles.clockTime} tabular`}>{now ? now.toLocaleTimeString("es-CO") : "--:--:--"}</span>
        <span className={styles.clockDate}>
          {now
            ? now.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
            : "..."}
        </span>
      </div>

    </div>
  );
}

interface StatProps {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  tone: "sky" | "violet" | "green" | "blue" | "cyan" | "red";
  highlight?: boolean;
}

function Stat({ label, value, icon: Icon, tone, highlight }: StatProps) {
  return (
    <div className={styles.statCard} data-tone={tone} data-highlight={highlight ? "" : undefined}>
      <div className={styles.statIconWrapper}>
        <Icon className={styles.statIcon} size={24} aria-hidden="true" />
      </div>
      <div className={styles.statInfo}>
        <p className={styles.statLabel}>{label}</p>
        <p className={`${styles.statValue} tabular`}>{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { products, transactions } = useProductStore();

  const now = new Date();
  const today = now.toDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const sales = transactions.filter((t) => t.type === "sale");
  const totalRevenue = sales.reduce((acc, t) => acc + t.totalAmount, 0);
  const todaysSales = sales.filter((t) => new Date(t.date).toDateString() === today);
  const todaysRevenue = todaysSales.reduce((acc, t) => acc + t.totalAmount, 0);
  const thisMonthRevenue = sales
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + t.totalAmount, 0);

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStock = products.filter((p) => p.status === "active" && p.stock < 10).sort((a, b) => a.stock - b.stock);
  const lowStockProducts = lowStock.length;
  const salesCountLabel = new Intl.PluralRules("es-CO").select(todaysSales.length) === "one" ? "venta" : "ventas";

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Resumen del Negocio</h1>
        <LiveClock />
      </div>

      <div className={styles.statsGrid}>
        <Stat label="Ingresos Totales" value={formatPrice(totalRevenue)} icon={DollarSign} tone="sky" highlight />
        <Stat label={`Ingresos de ${MONTH_NAMES[currentMonth]}`} value={formatPrice(thisMonthRevenue)} icon={TrendingUp} tone="violet" />
        <Stat
          label="Ventas de Hoy"
          value={
            <>
              {formatPrice(todaysRevenue)}{" "}
              <span className={styles.statSub}>
                ({todaysSales.length} {salesCountLabel})
              </span>
            </>
          }
          icon={Activity}
          tone="green"
        />
        <Stat label="Total Productos" value={products.length} icon={Package} tone="blue" />
        <Stat label="Unidades en Stock" value={totalStock} icon={Boxes} tone="cyan" />
        <Stat label="Stock Bajo" value={lowStockProducts} icon={AlertCircle} tone="red" />
      </div>

      <section className={styles.panel} aria-labelledby="restock-title">
        <div className={styles.panelHead}>
          <h2 id="restock-title">Para reponer</h2>
          <Link href="/admin/productos" className={styles.panelLink}>
            Ver productos
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className={styles.panelEmpty}>Todo tiene buen stock.</p>
        ) : (
          <ul className={styles.restock}>
            {lowStock.slice(0, 8).map((p) => (
              <li key={p.id}>
                <span className={styles.restockName}>{p.name}</span>
                <span className={`${styles.restockStock} tabular`} data-out={p.stock === 0 ? "" : undefined}>
                  {p.stock === 0 ? "Agotado" : `${p.stock} ${p.stock === 1 ? "unidad" : "unidades"}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
