import { MOUNTAIN_PATH } from "./mountainPath";
import styles from "./BrandEmblem.module.css";

interface BrandEmblemProps {
  /** Play the intro */
  animate?: boolean;
  className?: string;
}

/**
 * The Airpods Nariño logo as live SVG, matching the last frame of the brand film.
 *
 * Intro (first visit, ~3s, pure CSS so it runs smoothly while the page loads):
 *   1. the metallic ring draws itself with a glowing tip
 *   2. the closed AirPods case rises into the ring
 *   3. the lid lifts open and light spills out of the case
 *   4. the mountain climbs out of the case
 *   5. the lid settles behind it and a band of blue light sweeps across
 *
 * Geometry: viewBox 0 0 200 200, ring centred at 100,100 (r = 90).
 */
export default function BrandEmblem({ animate = true, className }: BrandEmblemProps) {
  return (
    <div className={`${styles.emblem} ${className ?? ""}`} data-animate={animate ? "" : undefined} aria-hidden="true">
      <span className={styles.streak} />
      <svg className={styles.svg} viewBox="0 0 200 200" role="presentation">
        <defs>
          <linearGradient id="be-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#aab4c2" />
            <stop offset="0.5" stopColor="#f4f7fb" />
            <stop offset="0.75" stopColor="#7c8695" />
            <stop offset="1" stopColor="#e3e8ee" />
          </linearGradient>
          <radialGradient id="be-disc" cx="0.5" cy="0.42" r="0.62">
            <stop offset="0" stopColor="#0f1a30" />
            <stop offset="1" stopColor="#03060d" />
          </radialGradient>
          <linearGradient id="be-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7cb7ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="be-band-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <mask id="be-band-mask">
            <rect x="0" y="92" width="200" height="22" fill="url(#be-band-v)" />
          </mask>
          <linearGradient id="be-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9d8ee" stopOpacity="0.2" />
            <stop offset="0.45" stopColor="#7f97b8" stopOpacity="0.1" />
            <stop offset="1" stopColor="#c9d8ee" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="be-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="0.18" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.85" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="be-lid-cover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9eef6" stopOpacity="0.5" />
            <stop offset="1" stopColor="#9fb1ca" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="be-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ccd5e1" />
          </linearGradient>
          <radialGradient id="be-burst" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.4" stopColor="#9fd3ff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <filter id="be-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <clipPath id="be-inside">
            <circle cx="100" cy="100" r="87" />
          </clipPath>
          {/* The mountain only exists above the case opening, so it climbs out of it */}
          <clipPath id="be-above-case">
            <rect x="0" y="0" width="200" height="75" />
          </clipPath>
        </defs>

        <circle className={styles.disc} cx="100" cy="100" r="93" fill="url(#be-disc)" />

        <g clipPath="url(#be-inside)">
          {/* Band of light behind the glass */}
          <rect
            className={styles.band}
            x="0"
            y="92"
            width="200"
            height="22"
            fill="url(#be-band)"
            mask="url(#be-band-mask)"
          />

          <g className={styles.case}>
            {/* Lid: frame + the earbud wells inside, lifts open */}
            <g className={styles.lid}>
              {/* Inside of the case, with the two earbud wells */}
              <path d="M52 76 V52 a14 14 0 0 1 14 -14 H134 a14 14 0 0 1 14 14 V76 Z" fill="#070c18" />
              <circle cx="66" cy="52" r="8.5" fill="#03060d" stroke="#ffffff" strokeOpacity="0.1" />
              <circle cx="134" cy="52" r="8.5" fill="#03060d" stroke="#ffffff" strokeOpacity="0.1" />
              {/* The lid rim: top and sides only, the mountain covers the rest */}
              <path d="M52 70 V52 a14 14 0 0 1 14 -14 H134 a14 14 0 0 1 14 14 V70" fill="none" stroke="#aeb7c3" strokeWidth="3.4" strokeLinecap="round" />
              <path className={styles.lidCover} d="M52 76 V52 a14 14 0 0 1 14 -14 H134 a14 14 0 0 1 14 14 V76 Z" fill="url(#be-lid-cover)" />
            </g>

            {/* Light spilling out as the lid opens */}
            <ellipse className={styles.burst} cx="100" cy="72" rx="46" ry="16" fill="url(#be-burst)" />

            {/* Mountain climbing out of the case */}
            <g clipPath="url(#be-above-case)">
              <path className={styles.mountain} d={MOUNTAIN_PATH} fill="url(#be-snow)" fillRule="evenodd" />
            </g>

            {/* Body: dark glass with the band showing through */}
            <g className={styles.body}>
              <rect x="51" y="74" width="98" height="90" rx="15" fill="url(#be-glass)" stroke="#ffffff" strokeOpacity="0.42" strokeWidth="1.2" />
              <rect x="51" y="74" width="98" height="90" rx="15" fill="url(#be-sheen)" />
              <line x1="55" y1="74.6" x2="145" y2="74.6" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" />
              <rect x="78" y="74" width="44" height="4" rx="2" fill="#ffffff" fillOpacity="0.22" />
              <circle className={styles.led} cx="100" cy="146" r="2.4" fill="#ffffff" />
            </g>
          </g>
        </g>

        {/* Ring: metallic stroke with a fine inner edge, plus the drawing tip */}
        <circle className={styles.ring} cx="100" cy="100" r="90" fill="none" stroke="url(#be-ring)" strokeWidth="6" strokeLinecap="round" pathLength={100} />
        <circle className={styles.ringEdge} cx="100" cy="100" r="86.6" fill="none" stroke="#000000" strokeOpacity="0.55" strokeWidth="0.8" />
        <circle className={styles.tip} cx="100" cy="100" r="90" fill="none" stroke="#d6eeff" strokeWidth="8" strokeLinecap="round" pathLength={100} filter="url(#be-glow)" />
        <circle className={styles.glint} cx="100" cy="100" r="90" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" pathLength={100} filter="url(#be-glow)" />
      </svg>
    </div>
  );
}
