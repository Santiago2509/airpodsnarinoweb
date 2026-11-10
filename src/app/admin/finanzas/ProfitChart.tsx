"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/site";
import styles from "./ProfitChart.module.css";

export interface MonthPoint {
  label: string;
  revenue: number;
  cost: number;
  warrantyCost: number;
  profit: number;
}

interface ProfitChartProps {
  data: MonthPoint[];
  /** Selected month (0–11), drawn at full strength while the others recede */
  highlight: number | null;
}

/** Compact money for axis ticks: $1,2 M · $350 mil */
function compact(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000).toLocaleString("es-CO")} mil`;
  return `${sign}$${abs.toLocaleString("es-CO")}`;
}

/** Rounded step so the axis reads in whole numbers */
function niceStep(max: number) {
  const raw = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

// Geometry in SVG units; the SVG scales to its container
const W = 720;
const H = 260;
const PAD = { top: 16, right: 12, bottom: 30, left: 64 };
const BAR_MAX = 24;

/**
 * One series (net profit), one axis, columns from a single baseline.
 * Positive months rise, losing months hang below the zero line.
 * Each month's band is the hover/focus target and opens a tooltip.
 */
export default function ProfitChart({ data, highlight }: ProfitChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const values = data.map((d) => d.profit);
  const top = Math.max(0, ...values);
  const bottom = Math.min(0, ...values);
  const step = niceStep(Math.max(top - bottom, 1));
  const yMax = top > 0 ? Math.ceil(top / step) * step : 0;
  const yMin = bottom < 0 ? Math.floor(bottom / step) * step : 0;
  const span = yMax - yMin || step;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  const barW = Math.min(BAR_MAX, band * 0.55);
  const y = (v: number) => PAD.top + ((yMax - v) / span) * plotH;
  const zero = y(0);

  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-6; v += step) ticks.push(v);

  const hasData = data.some((d) => d.revenue || d.cost || d.warrantyCost);
  const shown = active ?? null;

  if (!hasData) {
    return <p className={styles.empty}>Todavía no hay movimientos en este año.</p>;
  }

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ganancia neta por mes">
        {/* Recessive grid + axis labels */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={t === 0 ? styles.zero : styles.grid} />
            <text x={PAD.left - 10} y={y(t)} className={styles.tick} textAnchor="end" dominantBaseline="middle">
              {compact(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = PAD.left + band * i + band / 2;
          const v = d.profit;
          const yTop = Math.min(y(v), zero);
          const h = Math.max(Math.abs(y(v) - zero), v === 0 ? 0 : 2);
          const r = Math.min(4, h);
          const dim = (highlight !== null && highlight !== i) || (active !== null && active !== i);
          // 4px rounded data end, square at the baseline
          const path =
            v >= 0
              ? `M${x - barW / 2} ${zero} V${yTop + r} q0 -${r} ${r} -${r} H${x + barW / 2 - r} q${r} 0 ${r} ${r} V${zero} Z`
              : `M${x - barW / 2} ${zero} V${zero + h - r} q0 ${r} ${r} ${r} H${x + barW / 2 - r} q${r} 0 ${r} -${r} V${zero} Z`;
          return (
            <g key={d.label}>
              {h > 0 && <path d={path} className={styles.bar} data-dim={dim ? "" : undefined} />}
              <text x={x} y={H - 10} className={styles.month} textAnchor="middle">
                {d.label.slice(0, 3)}
              </text>
              {/* Whole band is the hit target */}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={plotH}
                className={styles.hit}
                tabIndex={0}
                aria-label={`${d.label}: ganancia ${formatPrice(d.profit)}, ingresos ${formatPrice(d.revenue)}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>

      {shown !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${((PAD.left + band * shown + band / 2) / W) * 100}%` }}
          role="status"
        >
          <p className={styles.tipTitle}>{data[shown].label}</p>
          <dl className="tabular">
            <div><dt>Ingresos</dt><dd>{formatPrice(data[shown].revenue)}</dd></div>
            <div><dt>Costo</dt><dd>{formatPrice(data[shown].cost)}</dd></div>
            <div><dt>Garantías</dt><dd>{formatPrice(data[shown].warrantyCost)}</dd></div>
            <div className={styles.tipTotal}><dt>Ganancia</dt><dd>{formatPrice(data[shown].profit)}</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}
