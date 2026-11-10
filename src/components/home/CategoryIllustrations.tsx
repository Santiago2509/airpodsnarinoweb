import { MOUNTAIN_PATH } from "@/components/brand/mountainPath";
import styles from "./CategoryIllustrations.module.css";

/*
 * Original vector illustrations for the category tiles (no product photos).
 * Colors come from CSS variables set on the tile, so they follow the theme.
 * Each one has a small hover animation defined in the CSS module.
 */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--il-body)" }} />
        <stop offset="1" style={{ stopColor: "var(--il-body-2)" }} />
      </linearGradient>
      <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="0.25" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.8" stopColor="#000000" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.12" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--il-accent)", stopOpacity: 0.55 }} />
        <stop offset="1" style={{ stopColor: "var(--il-accent)", stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

function Shadow({ cx = 100, cy = 182, rx = 52 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse className={styles.shadow} cx={cx} cy={cy} rx={rx} ry="7" />;
}

function Earbud({ x, flip }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} 0) scale(${s} 1)`}>
      <rect x="-3.6" y="62" width="7.2" height="38" rx="3.6" fill="url(#ap-body)" stroke="var(--il-line)" strokeWidth="1" />
      <circle cx="0" cy="60" r="11.5" fill="url(#ap-body)" stroke="var(--il-line)" strokeWidth="1" />
      <ellipse cx="-9" cy="57" rx="5.5" ry="6.5" fill="url(#ap-body)" stroke="var(--il-line)" strokeWidth="1" />
      <circle cx="2.5" cy="56" r="2.2" style={{ fill: "var(--il-ink)" }} opacity="0.45" />
    </g>
  );
}

export function AirPodsIllustration() {
  return (
    <svg className={`${styles.svg} ${styles.airpods}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs id="ap" />
      <circle cx="100" cy="110" r="78" fill="url(#ap-glow)" className={styles.halo} />
      <Shadow rx={58} />
      <g className={styles.buds}>
        <g className={styles.budLeft}>
          <Earbud x={82} />
        </g>
        <g className={styles.budRight}>
          <Earbud x={118} flip />
        </g>
      </g>
      {/* Lid, hinged at the back edge */}
      <g className={styles.lid}>
        <path d="M46 104 V94 a26 26 0 0 1 26 -26 H128 a26 26 0 0 1 26 26 V104 Z" fill="url(#ap-body)" stroke="var(--il-line)" strokeWidth="1.2" />
        <path d="M46 104 V94 a26 26 0 0 1 26 -26 H128 a26 26 0 0 1 26 26 V104 Z" fill="url(#ap-side)" />
      </g>
      <g>
        <path d="M46 104 H154 V150 a28 28 0 0 1 -28 28 H74 a28 28 0 0 1 -28 -28 Z" fill="url(#ap-body)" stroke="var(--il-line)" strokeWidth="1.2" />
        <path d="M46 104 H154 V150 a28 28 0 0 1 -28 28 H74 a28 28 0 0 1 -28 -28 Z" fill="url(#ap-side)" />
        <line x1="47" y1="104.5" x2="153" y2="104.5" stroke="var(--il-line)" strokeWidth="1.4" />
        <circle className={styles.led} cx="100" cy="136" r="2.6" />
      </g>
    </svg>
  );
}

export function ChargerIllustration() {
  return (
    <svg className={`${styles.svg} ${styles.charger}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs id="ch" />
      <Shadow cy={176} rx={48} />
      {/* Cable from the puck to a USB-C plug */}
      <path d="M100 132 C100 168 150 150 158 176" fill="none" stroke="var(--il-line)" strokeWidth="9" strokeLinecap="round" opacity="0.6" />
      <path className={styles.cable} d="M100 132 C100 168 150 150 158 176" fill="none" stroke="url(#ch-body)" strokeWidth="7" strokeLinecap="round" />
      <rect x="150" y="172" width="18" height="22" rx="4" fill="url(#ch-body)" stroke="var(--il-line)" strokeWidth="1" transform="rotate(-24 159 183)" />
      {/* MagSafe puck */}
      <circle cx="100" cy="88" r="50" fill="url(#ch-body)" stroke="var(--il-line)" strokeWidth="1.2" />
      <circle cx="100" cy="88" r="50" fill="url(#ch-side)" />
      <circle cx="100" cy="88" r="34" fill="none" stroke="var(--il-line)" strokeWidth="1" />
      <circle className={styles.ring} cx="100" cy="88" r="34" fill="none" strokeWidth="4" pathLength={100} />
      <circle cx="100" cy="88" r="14" fill="none" stroke="var(--il-line)" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function CableIllustration() {
  const coil = "M34 150 C34 110 82 118 98 96 C116 70 172 78 166 112 C160 146 108 146 104 118 C100 90 140 58 168 44";
  return (
    <svg className={`${styles.svg} ${styles.cableIl}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs id="cb" />
      <Shadow cy={178} rx={60} />
      <path d={coil} fill="none" stroke="var(--il-line)" strokeWidth="11" strokeLinecap="round" opacity="0.7" />
      <path d={coil} fill="none" stroke="url(#cb-body)" strokeWidth="8" strokeLinecap="round" />
      <path className={styles.spark} d={coil} fill="none" strokeWidth="3" strokeLinecap="round" pathLength={100} />
      {/* USB-C plugs on both ends */}
      <g transform="rotate(-8 34 162)">
        <rect x="26" y="150" width="16" height="22" rx="4" fill="url(#cb-body)" stroke="var(--il-line)" strokeWidth="1" />
        <rect x="29.5" y="170" width="9" height="9" rx="2.5" style={{ fill: "var(--il-metal)" }} />
      </g>
      <g transform="rotate(52 168 44)">
        <rect x="160" y="26" width="16" height="22" rx="4" fill="url(#cb-body)" stroke="var(--il-line)" strokeWidth="1" />
        <rect x="163.5" y="19" width="9" height="9" rx="2.5" style={{ fill: "var(--il-metal)" }} />
      </g>
    </svg>
  );
}

export function CaseIllustration() {
  return (
    <svg className={`${styles.svg} ${styles.caseIl}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="cs-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--il-accent-light)" }} />
          <stop offset="1" style={{ stopColor: "var(--il-accent)" }} />
        </linearGradient>
        <linearGradient id="cs-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <Shadow cy={182} rx={44} />
      {/* Swings from the carabiner */}
      <g className={styles.swing}>
        <path d="M74 38 a14 14 0 1 1 0 28 a14 14 0 1 1 0 -28" fill="none" style={{ stroke: "var(--il-metal)" }} strokeWidth="5" />
        <rect x="70" y="60" width="9" height="16" rx="3" fill="url(#cs-body)" />
        <rect x="56" y="70" width="88" height="106" rx="30" fill="url(#cs-body)" />
        <rect x="56" y="70" width="88" height="106" rx="30" fill="url(#cs-side)" />
        <line x1="58" y1="104" x2="142" y2="104" stroke="#000000" strokeOpacity="0.18" strokeWidth="1.6" />
        <circle cx="100" cy="140" r="3" fill="#ffffff" fillOpacity="0.6" />
      </g>
    </svg>
  );
}

export function WatchIllustration() {
  return (
    <svg className={`${styles.svg} ${styles.watch}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs id="wt" />
      <Shadow cy={184} rx={40} />
      {/* Band */}
      <rect x="74" y="14" width="52" height="64" rx="16" style={{ fill: "var(--il-band)" }} />
      <rect x="74" y="122" width="52" height="66" rx="16" style={{ fill: "var(--il-band)" }} />
      {/* Case and crown */}
      <rect x="140" y="82" width="8" height="18" rx="3" style={{ fill: "var(--il-metal)" }} />
      <rect x="58" y="52" width="84" height="98" rx="26" style={{ fill: "var(--il-metal)" }} />
      <rect x="63" y="57" width="74" height="88" rx="22" style={{ fill: "var(--il-screen)" }} />
      {/* Activity rings */}
      <g transform="rotate(-90 100 101)">
        <circle cx="100" cy="101" r="26" fill="none" stroke="#ff375f" strokeOpacity="0.22" strokeWidth="6" />
        <circle className={`${styles.activity} ${styles.a1}`} cx="100" cy="101" r="26" fill="none" stroke="#ff375f" strokeWidth="6" strokeLinecap="round" pathLength={100} />
        <circle cx="100" cy="101" r="18" fill="none" stroke="#a6ff00" strokeOpacity="0.22" strokeWidth="6" />
        <circle className={`${styles.activity} ${styles.a2}`} cx="100" cy="101" r="18" fill="none" stroke="#a6ff00" strokeWidth="6" strokeLinecap="round" pathLength={100} />
        <circle cx="100" cy="101" r="10" fill="none" stroke="#00e5ff" strokeOpacity="0.22" strokeWidth="6" />
        <circle className={`${styles.activity} ${styles.a3}`} cx="100" cy="101" r="10" fill="none" stroke="#00e5ff" strokeWidth="6" strokeLinecap="round" pathLength={100} />
      </g>
    </svg>
  );
}

export function BagIllustration() {
  return (
    <svg className={`${styles.svg} ${styles.bag}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs id="bg" />
      <Shadow cy={182} rx={54} />
      <g className={styles.hop}>
        <path d="M78 66 V56 a22 22 0 0 1 44 0 V66" fill="none" style={{ stroke: "var(--il-dark)" }} strokeWidth="6" strokeLinecap="round" />
        <path d="M50 64 H150 L158 172 a8 8 0 0 1 -8 8 H50 a8 8 0 0 1 -8 -8 Z" fill="url(#bg-body)" stroke="var(--il-line)" strokeWidth="1.2" />
        <path d="M50 64 H150 L158 172 a8 8 0 0 1 -8 8 H50 a8 8 0 0 1 -8 -8 Z" fill="url(#bg-side)" />
        {/* The brand mountain on the bag */}
        <g transform="translate(100 128) scale(0.62) translate(-98 -48)">
          <path d={MOUNTAIN_PATH} style={{ fill: "var(--il-ink)" }} fillRule="evenodd" />
        </g>
      </g>
    </svg>
  );
}
