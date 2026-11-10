import { MOUNTAIN_PATH } from "./mountainPath";
import styles from "./BrandEmblem.module.css";

interface BrandEmblemProps {
  /** Play the intro (ring draws, mountain rises, case appears, light sweeps) */
  animate?: boolean;
  className?: string;
}

/**
 * The Airpods Nariño emblem as live SVG, recreating the intro film:
 * 1. a metallic ring draws itself with a glowing tip,
 * 2. the mountain rises into the top of the ring,
 * 3. the AirPods case materializes behind it,
 * 4. a band of blue light sweeps across.
 * Pure CSS animation: it runs off the main thread while the page is still loading.
 */
export default function BrandEmblem({ animate = true, className }: BrandEmblemProps) {
  return (
    <div className={`${styles.emblem} ${className ?? ""}`} data-animate={animate ? "" : undefined} aria-hidden="true">
      <span className={styles.streak} />
      <svg className={styles.svg} viewBox="0 0 200 200" role="presentation">
        <defs>
          <linearGradient id="be-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#a9b3c1" />
            <stop offset="0.55" stopColor="#f4f7fb" />
            <stop offset="0.8" stopColor="#7d8796" />
            <stop offset="1" stopColor="#dfe5ec" />
          </linearGradient>
          <linearGradient id="be-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#9fb4d1" stopOpacity="0.07" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="be-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c9d2de" />
          </linearGradient>
          <radialGradient id="be-disc" cx="0.5" cy="0.38" r="0.65">
            <stop offset="0" stopColor="#0d1830" />
            <stop offset="1" stopColor="#03060d" />
          </radialGradient>
          <filter id="be-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <clipPath id="be-inside">
            <circle cx="100" cy="100" r="86" />
          </clipPath>
        </defs>

        {/* Dark disc: keeps the white mountain legible on the light theme too */}
        <circle className={styles.disc} cx="100" cy="100" r="92" fill="url(#be-disc)" />

        <g clipPath="url(#be-inside)">
          {/* AirPods case: lid + body in dark glass */}
          <g className={styles.case}>
            <rect x="52" y="52" width="96" height="52" rx="16" fill="url(#be-glass)" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.2" />
            <rect x="50" y="102" width="100" height="86" rx="18" fill="url(#be-glass)" stroke="#ffffff" strokeOpacity="0.38" strokeWidth="1.2" />
            <line x1="56" y1="103" x2="144" y2="103" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
            <rect x="88" y="100.5" width="24" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.2" />
            <circle className={styles.led} cx="100" cy="150" r="2.2" fill="#ffffff" />
          </g>

          {/* Mountain, traced from the brand film */}
          <path className={styles.mountain} d={MOUNTAIN_PATH} fill="url(#be-snow)" fillRule="evenodd" />
        </g>

        {/* Ring + its glowing drawing tip */}
        <circle
          className={styles.ring}
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#be-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength={100}
        />
        <circle
          className={styles.tip}
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#cfeaff"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={100}
          filter="url(#be-glow)"
        />
        {/* Idle glint that travels around the ring now and then */}
        <circle
          className={styles.glint}
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength={100}
          filter="url(#be-glow)"
        />
      </svg>
    </div>
  );
}
