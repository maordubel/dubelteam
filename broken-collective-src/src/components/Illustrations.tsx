/**
 * Original risograph-style illustrations, drawn as SVG so they inherit the theme tokens
 * (two inks — ink + sea — on paper, one red thread). No raster images, no stock art.
 */
import type { ReactNode } from 'react'

const C = {
  paper: 'var(--art-paper)',
  deep: 'var(--art-deep)',
  ink: 'var(--art-ink)',
  soft: 'var(--art-soft)',
  sea: 'var(--art-sea)',
  red: 'var(--art-red)',
  redSoft: 'var(--art-red-soft)',
}

function Defs({ p }: { p: string }) {
  return (
    <defs>
      <pattern id={`${p}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="3.5" cy="3.5" r="1.5" fill={C.sea} />
      </pattern>
      <pattern id={`${p}-dots-ink`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.1" fill={C.ink} />
      </pattern>
      <pattern id={`${p}-dots-red`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.4" fill={C.red} />
      </pattern>
      <pattern id={`${p}-lines`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
        <line x1="0" y1="0" x2="0" y2="8" stroke={C.sea} strokeWidth="2.2" />
      </pattern>
    </defs>
  )
}

type ArtProps = { className?: string; title?: string }

function Svg({ viewBox, className, title, children }: ArtProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={`art-plate ${className ?? ''}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

/* ───────────────────────── Cover: three shards, one sea, one thread ───────────────────────── */

export function CoverArt({ className, title }: ArtProps) {
  const p = 'cv'
  const s1 = '18,40 200,20 192,742 12,726'
  const s2 = '212,22 392,36 398,738 204,744'
  const s3 = '408,38 586,22 592,724 404,740'
  return (
    <Svg viewBox="0 0 600 760" className={className} title={title}>
      <Defs p={p} />
      <clipPath id={`${p}-c1`}><polygon points={s1} /></clipPath>
      <clipPath id={`${p}-c2`}><polygon points={s2} /></clipPath>
      <clipPath id={`${p}-c3`}><polygon points={s3} /></clipPath>

      {/* shard 1 — Alex: the terrace, a flare over the sea */}
      <g clipPath={`url(#${p}-c1)`}>
        <rect width="600" height="760" fill={C.deep} />
        <rect y="430" width="600" height="96" fill={`url(#${p}-dots)`} />
        <rect y="430" width="600" height="3" fill={C.sea} />
        <g fill={C.red}>
          <circle cx="92" cy="300" r="70" opacity="0.92" />
          <circle cx="150" cy="230" r="58" opacity="0.85" />
          <circle cx="70" cy="190" r="46" opacity="0.8" />
          <circle cx="128" cy="140" r="36" opacity="0.7" />
          <circle cx="96" cy="96" r="24" opacity="0.6" />
        </g>
        <rect x="40" y="90" width="140" height="270" fill={`url(#${p}-dots-red)`} opacity="0.5" />
        <g fill={C.ink}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i}>
              <circle cx={10 + i * 30} cy={628 + (i % 2) * 10} r="15" />
              <rect x={-4 + i * 30} y={638 + (i % 2) * 10} width="28" height="140" rx="8" />
            </g>
          ))}
          <rect x="92" y="380" width="8" height="240" rx="3" transform="rotate(-7 96 620)" />
          <rect x="38" y="540" width="7" height="90" rx="3" transform="rotate(14 41 628)" />
          <rect x="160" y="548" width="7" height="86" rx="3" transform="rotate(-16 163 630)" />
          <rect x="124" y="566" width="7" height="72" rx="3" transform="rotate(6 127 636)" />
        </g>
        <path d="M86 384 l18 -3 l-6 -26 z" fill={C.red} />
      </g>

      {/* shard 2 — Natalie: a window, a phone glowing in the dark */}
      <g clipPath={`url(#${p}-c2)`}>
        <rect x="200" width="200" height="760" fill={C.ink} />
        <rect x="226" y="88" width="150" height="330" fill={C.deep} />
        <rect x="226" y="300" width="150" height="70" fill={`url(#${p}-dots)`} />
        <rect x="226" y="300" width="150" height="3" fill={C.sea} />
        <circle cx="330" cy="170" r="22" fill={C.paper} />
        <g stroke={C.ink} strokeWidth="8">
          <line x1="301" y1="88" x2="301" y2="418" />
          <line x1="226" y1="250" x2="376" y2="250" />
        </g>
        <rect x="222" y="84" width="158" height="338" fill="none" stroke={C.soft} strokeWidth="6" />
        <g transform="rotate(-12 300 600)">
          <rect x="262" y="520" width="78" height="150" rx="12" fill={C.soft} />
          <rect x="270" y="532" width="62" height="122" rx="6" fill={C.paper} />
          <rect x="280" y="548" width="40" height="5" fill={C.ink} opacity="0.5" />
          <rect x="280" y="560" width="30" height="5" fill={C.ink} opacity="0.35" />
          <path d="M292 612 c0 -10 16 -10 16 0 c0 -10 16 -10 16 0 c0 12 -16 20 -16 24 c0 -4 -16 -12 -16 -24z" fill={C.red} />
        </g>
        <g fill={C.paper} opacity="0.16">
          <polygon points="300,600 200,480 200,760" />
          <polygon points="300,600 400,470 400,760" />
        </g>
      </g>

      {/* shard 3 — Mehran: rooftops of Shati, a red kite */}
      <g clipPath={`url(#${p}-c3)`}>
        <rect x="400" width="200" height="760" fill={C.deep} />
        <rect x="400" y="430" width="200" height="96" fill={`url(#${p}-dots)`} />
        <rect x="400" y="430" width="200" height="3" fill={C.sea} />
        <path d="M520 120 l34 40 l-34 52 l-34 -52 z" fill={C.red} />
        <path d="M520 212 C 500 300, 560 330, 470 470" stroke={C.red} strokeWidth="2" fill="none" />
        <g fill={C.ink}>
          <rect x="396" y="540" width="70" height="230" />
          <rect x="462" y="500" width="62" height="270" />
          <rect x="520" y="560" width="90" height="210" />
          <rect x="474" y="474" width="28" height="26" rx="4" />
          <rect x="540" y="536" width="22" height="24" rx="3" />
        </g>
        <ellipse cx="432" cy="526" rx="18" ry="9" fill="none" stroke={C.ink} strokeWidth="5" transform="rotate(-30 432 526)" />
        <g fill={`url(#${p}-dots-ink)`}>
          <rect x="406" y="580" width="16" height="20" fill={C.deep} />
          <rect x="476" y="560" width="14" height="18" fill={C.deep} />
          <rect x="540" y="610" width="16" height="20" fill={C.red} />
        </g>
        <path d="M466 520 Q 492 532 520 522" stroke={C.soft} strokeWidth="2" fill="none" />
      </g>

      {/* shard edges */}
      <g fill="none" stroke={C.ink} strokeWidth="2.5">
        <polygon points={s1} />
        <polygon points={s2} />
        <polygon points={s3} />
      </g>

      {/* the red thread — through the cracks and across the shared sea */}
      <path
        className="thread-draw"
        style={{ ['--len' as string]: 1100 }}
        d="M202 0 L197 140 L207 262 L199 384 L252 452 L302 476 L352 498 L402 518 L397 640 L405 760"
        fill="none"
        stroke={C.red}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  )
}

/* ───────────────────────── Chapter plates ───────────────────────── */

function Plate({ p, children, className, title }: ArtProps & { p: string; children: ReactNode }) {
  return (
    <Svg viewBox="0 0 400 480" className={className} title={title}>
      <Defs p={p} />
      <clipPath id={`${p}-clip`}><polygon points="6,10 396,2 392,476 2,468" /></clipPath>
      <g clipPath={`url(#${p}-clip)`}>{children}</g>
      <polygon points="6,10 396,2 392,476 2,468" fill="none" stroke={C.ink} strokeWidth="3" />
    </Svg>
  )
}

/** Ch.1 — the terrace in Netanya, flares and raised arms, framed like a TV broadcast */
export function TerraceArt(props: ArtProps) {
  const p = 'tr'
  const heads = Array.from({ length: 12 }, (_, i) => i)
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.deep} />
      <g fill={`url(#${p}-lines)`}>
        <polygon points="0,150 400,110 400,200 0,250" />
        <polygon points="0,270 400,220 400,300 0,360" opacity="0.7" />
      </g>
      <g fill={C.red}>
        <circle cx="120" cy="250" r="78" opacity="0.92" />
        <circle cx="190" cy="170" r="64" opacity="0.85" />
        <circle cx="96" cy="140" r="50" opacity="0.8" />
        <circle cx="290" cy="230" r="60" opacity="0.88" />
        <circle cx="330" cy="150" r="42" opacity="0.7" />
        <circle cx="160" cy="80" r="32" opacity="0.6" />
      </g>
      <rect x="40" y="60" width="330" height="260" fill={`url(#${p}-dots-red)`} opacity="0.45" />
      <g fill={C.ink}>
        {heads.map((i) => (
          <g key={i}>
            <circle cx={18 + i * 34} cy={392 + (i % 3) * 8} r="17" />
            <rect x={10 + i * 34} y={404 + (i % 3) * 8} width="18" height="90" />
          </g>
        ))}
        <rect x="118" y="300" width="8" height="110" transform="rotate(-10 122 400)" />
        <rect x="280" y="300" width="8" height="110" transform="rotate(12 284 400)" />
        <rect x="56" y="340" width="7" height="60" transform="rotate(16 60 400)" />
        <rect x="214" y="330" width="7" height="72" transform="rotate(-6 218 400)" />
        <rect x="344" y="344" width="7" height="58" transform="rotate(-20 348 400)" />
      </g>
      <path d="M112 300 l16 -3 l-5 -22 z M274 302 l16 2 l-1 -22 z" fill={C.red} />
      <rect x="20" y="22" width="360" height="436" rx="18" fill="none" stroke={C.ink} strokeWidth="10" opacity="0.9" />
      <circle cx="350" cy="50" r="7" fill={C.red} />
    </Plate>
  )
}

/** Ch.2 — tea, lemon and old books; the sea through the window */
export function TeaArt(props: ArtProps) {
  const p = 'te'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.deep} />
      <rect x="40" y="40" width="320" height="220" fill={C.paper} />
      <rect x="40" y="170" width="320" height="90" fill={`url(#${p}-dots)`} />
      <rect x="40" y="170" width="320" height="3" fill={C.sea} />
      <path d="M282 72 l22 26 l-22 34 l-22 -34 z" fill={C.red} />
      <path d="M282 132 C 270 170, 300 190, 260 230" stroke={C.red} strokeWidth="2" fill="none" />
      <g stroke={C.ink} strokeWidth="9" fill="none">
        <rect x="40" y="40" width="320" height="220" />
        <line x1="200" y1="40" x2="200" y2="260" />
      </g>
      <rect y="320" width="400" height="160" fill={C.ink} />
      <rect y="316" width="400" height="8" fill={C.soft} />
      {/* books */}
      <g>
        <rect x="40" y="276" width="150" height="22" fill={C.sea} transform="rotate(-3 115 287)" />
        <rect x="48" y="252" width="132" height="22" fill={`url(#${p}-dots-ink)`} stroke={C.ink} strokeWidth="2" transform="rotate(2 114 263)" />
        <rect x="34" y="298" width="168" height="22" fill={C.paper} stroke={C.ink} strokeWidth="2" />
        <g stroke={C.ink} strokeWidth="1.5">
          <line x1="44" y1="305" x2="196" y2="305" />
          <line x1="44" y1="311" x2="196" y2="311" />
        </g>
      </g>
      {/* tea glass */}
      <path d="M248 214 L320 214 Q 316 260 300 276 Q 316 300 310 320 L258 320 Q 252 300 268 276 Q 252 260 248 214 Z" fill={C.paper} stroke={C.ink} strokeWidth="4" />
      <path d="M254 236 L314 236 Q 311 262 298 276 Q 312 298 307 314 L261 314 Q 256 298 270 276 Q 257 262 254 236 Z" fill={C.red} opacity="0.85" />
      <path d="M254 236 L314 236 Q 311 262 298 276 Q 312 298 307 314 L261 314 Q 256 298 270 276 Q 257 262 254 236 Z" fill={`url(#${p}-dots-ink)`} opacity="0.35" />
      {/* lemon slice */}
      <g transform="translate(330 214)">
        <circle r="24" fill={C.paper} stroke={C.ink} strokeWidth="4" />
        <g stroke={C.ink} strokeWidth="2">
          <line x1="-18" y1="0" x2="18" y2="0" />
          <line x1="0" y1="-18" x2="0" y2="18" />
          <line x1="-13" y1="-13" x2="13" y2="13" />
          <line x1="-13" y1="13" x2="13" y2="-13" />
        </g>
      </g>
      <path d="M268 200 q -10 -20 4 -36 q 12 -14 0 -30" stroke={C.soft} strokeWidth="3" fill="none" />
      <path d="M296 200 q -10 -20 4 -36" stroke={C.soft} strokeWidth="3" fill="none" />
    </Plate>
  )
}

/** Ch.3 — down the stairs to the bar: a lamp, a bead curtain, a crooner on the wall */
export function BarArt(props: ArtProps) {
  const p = 'br'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      <polygon points="250,96 330,96 400,420 180,420" fill={C.redSoft} opacity="0.55" />
      <polygon points="250,96 330,96 400,420 180,420" fill={`url(#${p}-dots-red)`} opacity="0.5" />
      <line x1="290" y1="0" x2="290" y2="70" stroke={C.soft} strokeWidth="4" />
      <path d="M256 100 L272 66 L308 66 L324 100 Z" fill={C.red} />
      {/* stairs going down */}
      <g fill={C.soft}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={0} y={180 + i * 44} width={150 - i * 22} height={44} opacity={1 - i * 0.12} />
        ))}
      </g>
      <g stroke={C.ink} strokeWidth="3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="0" y1={180 + i * 44} x2={150 - i * 22} y2={180 + i * 44} />
        ))}
      </g>
      {/* framed crooner */}
      <g transform="translate(176 150)">
        <rect width="72" height="92" fill={C.deep} stroke={C.paper} strokeWidth="4" />
        <circle cx="36" cy="44" r="18" fill={C.ink} />
        <path d="M18 36 q18 -24 36 0" fill={C.ink} />
        <rect x="24" y="40" width="24" height="6" rx="3" fill={C.paper} />
        <path d="M14 92 q22 -30 44 0" fill={C.ink} />
      </g>
      {/* bead curtain */}
      <g fill={C.paper}>
        {[350, 362, 374, 386].map((x) =>
          Array.from({ length: 22 }, (_, j) => (
            <circle key={`${x}-${j}`} cx={x + (j % 2) * 2} cy={14 + j * 20} r="3.4" opacity={0.85 - (x - 350) * 0.01} />
          )),
        )}
      </g>
      {/* keypad by the door */}
      <g transform="translate(40 120)">
        <rect width="44" height="54" rx="4" fill={C.deep} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={6 + c * 12} y={8 + r * 14} width="8" height="9" rx="1" fill={r === 1 && c === 1 ? C.red : C.ink} />),
        )}
      </g>
      <rect y="420" width="400" height="60" fill={C.sea} />
      <rect y="420" width="400" height="60" fill={`url(#${p}-dots-ink)`} opacity="0.5" />
    </Plate>
  )
}

/** Ch.4 — Halloween, cobwebs and a skull, cut through by police lights */
export function RaidArt(props: ArtProps) {
  const p = 'rd'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      <polygon points="200,-10 -40,480 120,480" fill={C.red} opacity="0.85" />
      <polygon points="200,-10 280,480 440,480" fill={C.sea} opacity="0.85" />
      <polygon points="200,-10 -40,480 120,480" fill={`url(#${p}-dots-ink)`} opacity="0.4" />
      <polygon points="200,-10 280,480 440,480" fill={`url(#${p}-dots-ink)`} opacity="0.4" />
      {/* cobweb in the corner */}
      <g stroke={C.paper} strokeWidth="1.6" fill="none" opacity="0.85">
        <path d="M0 0 L140 0 M0 0 L0 140 M0 0 L120 70 M0 0 L70 120 M0 0 L110 110" />
        <path d="M30 0 Q 26 18 21 21 Q 18 26 0 30" />
        <path d="M70 0 Q 62 36 52 52 Q 36 62 0 70" />
        <path d="M110 0 Q 98 56 84 84 Q 56 98 0 110" />
      </g>
      {/* skull */}
      <g transform="translate(200 290)">
        <path d="M-62 -10 a62 62 0 1 1 124 0 v34 q0 14 -14 16 v20 h-96 v-20 q-14 -2 -14 -16 z" fill={C.paper} />
        <ellipse cx="-24" cy="2" rx="17" ry="20" fill={C.ink} />
        <ellipse cx="24" cy="2" rx="17" ry="20" fill={C.ink} />
        <path d="M0 26 l-9 18 h18 z" fill={C.ink} />
        <g stroke={C.ink} strokeWidth="4">
          <line x1="-30" y1="60" x2="-30" y2="44" />
          <line x1="-10" y1="60" x2="-10" y2="44" />
          <line x1="10" y1="60" x2="10" y2="44" />
          <line x1="30" y1="60" x2="30" y2="44" />
        </g>
      </g>
      {/* candle */}
      <rect x="318" y="372" width="26" height="80" fill={C.paper} />
      <path d="M331 346 q12 14 0 26 q-12 -12 0 -26z" fill={C.red} />
      <rect y="452" width="400" height="28" fill={C.soft} />
    </Plate>
  )
}

/* ───────────────────────── Season 2021 plates ───────────────────────── */

/** 2021·1 — isolation: rain on the window, a positive test on the sill */
export function IsolationArt(props: ArtProps) {
  const p = 'is'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.soft} />
      <rect x="50" y="40" width="300" height="300" fill={C.deep} />
      <rect x="50" y="40" width="300" height="300" fill={`url(#${p}-lines)`} opacity="0.55" />
      <g stroke={C.sea} strokeWidth="3" strokeLinecap="round">
        {[[90, 70, 30], [150, 120, 40], [230, 60, 26], [300, 150, 34], [120, 220, 30], [260, 240, 40], [320, 70, 22], [190, 280, 28]].map(([x, y, l]) => (
          <line key={`${x}-${y}`} x1={x} y1={y} x2={x - 6} y2={y + l} />
        ))}
      </g>
      <g stroke={C.ink} strokeWidth="10" fill="none">
        <rect x="50" y="40" width="300" height="300" />
        <line x1="200" y1="40" x2="200" y2="340" />
        <line x1="50" y1="190" x2="350" y2="190" />
      </g>
      <rect x="20" y="340" width="360" height="22" fill={C.ink} />
      <rect y="362" width="400" height="118" fill={C.ink} />
      {/* test cassette */}
      <g transform="translate(70 300) rotate(-8)">
        <rect width="120" height="36" rx="8" fill={C.paper} stroke={C.ink} strokeWidth="3" />
        <rect x="40" y="10" width="44" height="16" rx="2" fill={C.deep} />
        <rect x="52" y="10" width="4" height="16" fill={C.red} />
        <rect x="68" y="10" width="4" height="16" fill={C.red} />
        <circle cx="20" cy="18" r="7" fill={C.deep} stroke={C.ink} strokeWidth="2" />
      </g>
      {/* mask hanging on the handle */}
      <path d="M262 300 q22 -12 44 0 v20 q-22 14 -44 0 z" fill={C.paper} stroke={C.ink} strokeWidth="3" />
      <path d="M262 304 q-14 -16 4 -26 M306 304 q14 -16 -4 -26" stroke={C.paper} strokeWidth="3" fill="none" />
    </Plate>
  )
}

/** 2021·2 — Bloomfield's floodlights, and a stolen flare glowing on a fishing boat */
export function NightMatchArt(props: ArtProps) {
  const p = 'nm'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      {/* floodlight tower */}
      <rect x="282" y="40" width="10" height="250" fill={C.soft} />
      <g fill={C.paper}>
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={250 + c * 20} y={20 + r * 16} width="16" height="12" />))}
      </g>
      <polygon points="250,40 330,40 400,300 140,300" fill={C.paper} opacity="0.1" />
      {/* the stadium wall */}
      <path d="M0 250 L400 230 L400 300 L0 320 Z" fill={C.soft} />
      <g fill={C.ink}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={14 + i * 40} y={262 - i * 2} width="22" height="30" />
        ))}
      </g>
      {/* sea */}
      <rect y="320" width="400" height="160" fill={C.sea} />
      <rect y="320" width="400" height="160" fill={`url(#${p}-dots-ink)`} opacity="0.35" />
      {/* boat */}
      <path d="M70 410 L250 410 L224 446 L96 446 Z" fill={C.deep} stroke={C.ink} strokeWidth="3" />
      <rect x="150" y="330" width="5" height="80" fill={C.deep} />
      <path d="M155 336 L210 396 L155 396 Z" fill={C.paper} opacity="0.85" />
      {/* the flare */}
      <circle cx="110" cy="392" r="46" fill={C.red} opacity="0.35" />
      <circle cx="110" cy="392" r="22" fill={C.red} opacity="0.7" />
      <rect x="106" y="384" width="8" height="28" fill={C.red} />
      <path d="M110 384 q-10 -18 2 -32 q6 14 8 4 q8 16 -10 28z" fill={C.redSoft} />
    </Plate>
  )
}

/** 2021·3 — eleven nights: rooftops under trails of light, a bear in a window */
export function SkyArt(props: ArtProps) {
  const p = 'sk'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      <g fill="none" strokeLinecap="round">
        <path d="M-20 300 Q 120 40 300 120" stroke={C.sea} strokeWidth="3" />
        <path d="M40 320 Q 170 80 360 60" stroke={C.sea} strokeWidth="2" opacity="0.7" />
        <path d="M120 330 Q 220 150 420 170" stroke={C.paper} strokeWidth="2" opacity="0.5" />
        <path d="M-10 200 Q 90 90 200 70" stroke={C.redSoft} strokeWidth="2" opacity="0.6" />
      </g>
      <circle cx="300" cy="120" r="10" fill={C.paper} />
      <circle cx="300" cy="120" r="26" fill={C.paper} opacity="0.2" />
      <rect y="300" width="400" height="20" fill={C.red} opacity="0.55" />
      <g fill={C.soft}>
        <rect x="0" y="290" width="90" height="190" />
        <rect x="86" y="250" width="70" height="230" />
        <rect x="152" y="310" width="110" height="170" />
        <rect x="258" y="270" width="80" height="210" />
        <rect x="334" y="300" width="70" height="180" />
        <rect x="108" y="232" width="22" height="20" rx="3" />
        <rect x="280" y="252" width="20" height="20" rx="3" />
      </g>
      {/* one lit window, a small bear */}
      <rect x="180" y="350" width="44" height="54" fill={C.deep} />
      <g fill={C.ink}>
        <circle cx="202" cy="378" r="10" />
        <circle cx="194" cy="368" r="4" />
        <circle cx="210" cy="368" r="4" />
        <ellipse cx="202" cy="398" rx="13" ry="10" />
      </g>
      <g fill={C.ink} opacity="0.9">
        {[[30, 330], [110, 290], [290, 300], [360, 340], [20, 400], [120, 380]].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="16" height="20" />
        ))}
      </g>
    </Plate>
  )
}

/** 2021·4 — Athens: the Acropolis at sunset, a glass on the bar */
export function AthensArt(props: ArtProps) {
  const p = 'at'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.deep} />
      <circle cx="250" cy="150" r="80" fill={C.red} />
      <rect x="150" y="70" width="200" height="160" fill={`url(#${p}-dots-red)`} opacity="0.35" />
      <path d="M0 260 Q 90 200 200 210 Q 300 200 400 250 L400 480 L0 480 Z" fill={C.sea} />
      <path d="M0 260 Q 90 200 200 210 Q 300 200 400 250 L400 480 L0 480 Z" fill={`url(#${p}-dots-ink)`} opacity="0.3" />
      {/* temple */}
      <g fill={C.ink}>
        <polygon points="110,170 290,170 200,140" />
        <rect x="104" y="170" width="192" height="10" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={114 + i * 23} y="182" width="10" height="44" />
        ))}
        <rect x="98" y="226" width="204" height="10" />
      </g>
      {/* bar counter + glass */}
      <rect y="380" width="400" height="100" fill={C.ink} />
      <rect y="372" width="400" height="10" fill={C.soft} />
      <path d="M300 300 L350 300 L330 340 L330 368 L344 372 L306 372 L320 368 L320 340 Z" fill={C.paper} opacity="0.9" stroke={C.ink} strokeWidth="2" />
      <path d="M306 308 L344 308 L330 334 L320 334 Z" fill={C.red} opacity="0.85" />
      <circle cx="338" cy="300" r="6" fill={C.sea} stroke={C.ink} strokeWidth="2" />
      {/* bouzouki neck */}
      <g transform="rotate(-28 90 400)">
        <ellipse cx="90" cy="420" rx="46" ry="34" fill={C.deep} stroke={C.ink} strokeWidth="3" />
        <circle cx="90" cy="420" r="9" fill={C.ink} />
        <rect x="84" y="290" width="12" height="100" fill={C.soft} />
      </g>
    </Plate>
  )
}

/** 2021·5 — the monitoring room, and one small video of equations and a ball */
export function ScreensArt(props: ArtProps) {
  const p = 'sc'
  const cells = [0, 1, 2]
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      {cells.map((r) =>
        cells.map((c) => {
          const focus = r === 1 && c === 1
          return (
            <g key={`${r}${c}`} transform={`translate(${24 + c * 122} ${30 + r * 112})`}>
              <rect width="108" height="96" fill={focus ? C.paper : C.sea} opacity={focus ? 1 : 0.55} />
              {!focus && (
                <g fill={C.ink} opacity="0.55">
                  <rect x="10" y="14" width="70" height="6" />
                  <rect x="10" y="28" width="86" height="6" />
                  <rect x="10" y="42" width="56" height="6" />
                  <rect x="10" y="56" width="78" height="6" />
                </g>
              )}
              {focus && (
                <g>
                  <text x="12" y="36" fontSize="26" fontFamily="serif" fill={C.ink} direction="ltr" unicodeBidi="embed">π√x</text>
                  <circle cx="78" cy="64" r="16" fill={C.paper} stroke={C.ink} strokeWidth="3" />
                  <path d="M78 52 l9 7 -3 10 h-12 l-3 -10z" fill={C.ink} />
                  <rect x="0" y="88" width="108" height="8" fill={C.red} />
                </g>
              )}
            </g>
          )
        }),
      )}
      <rect y="372" width="400" height="108" fill={C.soft} />
      <rect x="120" y="396" width="160" height="26" rx="3" fill={C.ink} />
      <g fill={C.deep}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={126 + i * 13} y="402" width="9" height="6" />
        ))}
      </g>
      <path d="M80 480 q30 -60 60 -40" stroke={C.ink} strokeWidth="14" fill="none" strokeLinecap="round" />
    </Plate>
  )
}

/** 2021·6 — the dreamers' roof: a scrap antenna, a radio, the sea */
export function AntennaArt(props: ArtProps) {
  const p = 'an'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      <g fill={C.paper}>
        {[[40, 40], [120, 90], [330, 60], [260, 30], [190, 120], [360, 140], [70, 160]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" />
        ))}
      </g>
      <circle cx="300" cy="110" r="24" fill={C.deep} />
      <rect y="250" width="400" height="80" fill={C.sea} />
      <rect y="250" width="400" height="80" fill={`url(#${p}-dots-ink)`} opacity="0.35" />
      <rect y="330" width="400" height="150" fill={C.soft} />
      {/* antenna */}
      <g stroke={C.paper} strokeWidth="4" strokeLinecap="round">
        <line x1="120" y1="330" x2="120" y2="150" />
        <line x1="84" y1="180" x2="156" y2="180" />
        <line x1="92" y1="206" x2="148" y2="206" />
        <line x1="100" y1="232" x2="140" y2="232" />
        <line x1="120" y1="150" x2="150" y2="128" />
      </g>
      <path d="M120 150 C 170 160, 210 210, 236 330" stroke={C.red} strokeWidth="2.5" fill="none" />
      {/* two boys */}
      <g fill={C.ink}>
        <circle cx="236" cy="352" r="16" />
        <path d="M212 430 q0 -58 24 -62 q24 4 24 62z" />
        <circle cx="296" cy="356" r="15" />
        <path d="M274 430 q0 -54 22 -58 q22 4 22 58z" />
      </g>
      {/* radio */}
      <rect x="250" y="404" width="44" height="26" rx="4" fill={C.red} />
      <circle cx="262" cy="417" r="7" fill={C.ink} />
      <line x1="288" y1="404" x2="306" y2="380" stroke={C.ink} strokeWidth="2" />
      <rect y="430" width="400" height="50" fill={C.ink} />
    </Plate>
  )
}

/* ───────────────────────── Season 2022 plates ───────────────────────── */

/** 2022·1 — a family photo torn in two, broken china, a sunflower behind */
export function TornPhotoArt(props: ArtProps) {
  const p = 'tp'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.deep} />
      {/* sunflower */}
      <g transform="translate(300 120)">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-48" rx="13" ry="30" fill={C.paper} stroke={C.ink} strokeWidth="2.5" transform={`rotate(${i * (360 / 14)})`} />
        ))}
        <circle r="30" fill={C.ink} />
        <circle r="30" fill={`url(#${p}-dots-red)`} opacity="0.5" />
      </g>
      <line x1="300" y1="150" x2="300" y2="300" stroke={C.sea} strokeWidth="7" />
      <path d="M300 230 q-36 -6 -48 -30 q30 -2 48 30z" fill={C.sea} />
      {/* the torn photo: left half */}
      <g transform="rotate(-7 120 300)">
        <path d="M40 210 L162 210 L150 240 L168 270 L148 300 L166 336 L152 390 L40 390 Z" fill={C.paper} stroke={C.ink} strokeWidth="3" />
        <rect x="54" y="224" width="96" height="152" fill={C.sea} opacity="0.85" />
        <g fill={C.ink}>
          <circle cx="82" cy="276" r="16" /><path d="M58 376 q0 -70 24 -76 q24 6 24 76z" />
          <circle cx="128" cy="290" r="13" /><path d="M110 376 q0 -58 18 -62 q18 4 18 62z" />
        </g>
      </g>
      {/* right half, drifting away */}
      <g transform="rotate(9 270 360)">
        <path d="M206 300 L330 300 L330 480 L212 480 L226 430 L208 396 L226 360 L210 330 Z" fill={C.paper} stroke={C.ink} strokeWidth="3" />
        <rect x="222" y="314" width="96" height="152" fill={C.red} opacity="0.85" />
        <g fill={C.ink}>
          <circle cx="252" cy="372" r="16" /><path d="M228 466 q0 -66 24 -72 q24 6 24 72z" />
          <circle cx="294" cy="380" r="13" /><path d="M276 466 q0 -56 18 -60 q18 4 18 60z" />
        </g>
      </g>
      {/* china shards */}
      <g fill={C.paper} stroke={C.ink} strokeWidth="2">
        <polygon points="40,440 70,428 64,456" />
        <polygon points="96,452 120,440 126,466 104,470" />
        <polygon points="160,430 176,420 182,444" />
        <polygon points="350,420 372,410 378,436 360,440" />
      </g>
      <path d="M44 446 q10 -6 18 -2" stroke={C.sea} strokeWidth="2" fill="none" />
    </Plate>
  )
}

/** 2022·2 — a story posted from Athens: a red flag before the Acropolis, a red heart in reply */
export function StoryArt(props: ArtProps) {
  const p = 'st'
  return (
    <Plate p={p} {...props}>
      <rect width="400" height="480" fill={C.ink} />
      {/* phone */}
      <rect x="86" y="24" width="228" height="432" rx="28" fill={C.soft} />
      <rect x="100" y="44" width="200" height="392" rx="16" fill={C.deep} />
      <g fill={C.paper} opacity="0.9">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={110 + i * 46} y="54" width="40" height="4" rx="2" />)}
      </g>
      {/* acropolis */}
      <path d="M100 300 Q 170 250 200 256 Q 240 250 300 290 L300 436 L100 436 Z" fill={C.sea} />
      <g fill={C.ink}>
        <polygon points="150,226 250,226 200,208" />
        <rect x="146" y="226" width="108" height="6" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={152 + i * 17} y="234" width="7" height="26" />)}
        <rect x="142" y="260" width="116" height="6" />
      </g>
      {/* the red flag */}
      <line x1="128" y1="96" x2="128" y2="250" stroke={C.ink} strokeWidth="4" />
      <path d="M130 98 Q 180 86 228 104 Q 250 112 270 104 L270 168 Q 240 178 214 168 Q 170 152 130 164 Z" fill={C.red} />
      <path d="M130 98 Q 180 86 228 104 Q 250 112 270 104 L270 168 Q 240 178 214 168 Q 170 152 130 164 Z" fill={`url(#${p}-dots-ink)`} opacity="0.25" />
      {/* reply bubble with a heart */}
      <g transform="translate(176 340)">
        <rect width="112" height="58" rx="20" fill={C.paper} />
        <path d="M18 58 l-10 16 l26 -16z" fill={C.paper} />
        <path d="M44 24 c0 -11 16 -11 16 0 c0 -11 16 -11 16 0 c0 14 -16 22 -16 26 c0 -4 -16 -12 -16 -26z" fill={C.red} />
      </g>
    </Plate>
  )
}

/* ───────────────────────── Season emblems (contents page) ───────────────────────── */

/** Emblems sit on the page itself, so unlike the plates they follow the reading theme. */
const T = {
  paper: 'var(--paper)',
  deep: 'var(--paper-deep)',
  ink: 'var(--ink)',
  soft: 'var(--ink-soft)',
  sea: 'var(--sea)',
  red: 'var(--thread)',
}

export function SeasonEmblem({ art, muted, className }: { art: string; muted?: boolean; className?: string }) {
  const C = T
  const p = `se-${art}`
  const accent = muted ? C.soft : C.red
  const body = (() => {
    switch (art) {
      case 'lockdown':
        return (
          <>
            <rect x="24" y="18" width="72" height="84" fill={C.paper} stroke={C.ink} strokeWidth="5" />
            <rect x="24" y="64" width="72" height="38" fill={`url(#${p}-dots)`} />
            <line x1="60" y1="18" x2="60" y2="102" stroke={C.ink} strokeWidth="5" />
            <path d="M66 52 q14 -8 26 0 v14 q-13 9 -26 0 z" fill={accent} />
            <path d="M66 54 q-6 6 0 12 M92 54 q6 6 0 12" stroke={C.ink} strokeWidth="2" fill="none" />
          </>
        )
      case 'vaccine':
        return (
          <>
            <g transform="rotate(-40 60 60)">
              <rect x="30" y="50" width="60" height="20" fill={C.paper} stroke={C.ink} strokeWidth="4" />
              <rect x="30" y="50" width="34" height="20" fill={accent} />
              <rect x="90" y="57" width="20" height="6" fill={C.ink} />
              <rect x="16" y="54" width="14" height="12" fill={C.ink} />
              <rect x="8" y="46" width="6" height="28" fill={C.ink} />
            </g>
            <circle cx="88" cy="88" r="14" fill={`url(#${p}-dots)`} />
          </>
        )
      case 'drift':
        return (
          <>
            <line x1="60" y1="70" x2="60" y2="112" stroke={C.sea} strokeWidth="5" />
            <path d="M60 96 q-18 -4 -24 -16 q16 -2 24 16z" fill={C.sea} />
            {Array.from({ length: 12 }, (_, i) => (
              <ellipse key={i} cx="60" cy="26" rx="8" ry="18" fill={muted ? C.soft : C.deep} stroke={C.ink} strokeWidth="2" transform={`rotate(${i * 30} 60 50)`} />
            ))}
            <circle cx="60" cy="50" r="16" fill={C.ink} />
            <circle cx="60" cy="50" r="16" fill={`url(#${p}-dots-red)`} opacity={muted ? 0 : 0.6} />
          </>
        )
      case 'fracture':
        return (
          <>
            <line x1="60" y1="64" x2="60" y2="112" stroke={C.sea} strokeWidth="5" />
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cx="60" cy="30" rx="15" ry="22" fill={accent} transform={`rotate(${r} 60 50)`} />
            ))}
            <circle cx="60" cy="50" r="10" fill={C.ink} />
            <path d="M18 10 L52 46 L44 58 L104 112" stroke={C.paper} strokeWidth="3" fill="none" />
          </>
        )
      case 'war':
        return (
          <>
            <path d="M14 96 Q 50 70 58 60" stroke={C.ink} strokeWidth="5" fill="none" />
            <path d="M66 56 Q 82 40 108 30" stroke={C.ink} strokeWidth="5" fill="none" />
            {[[30, 84, -30], [44, 72, 20], [80, 46, -40], [96, 36, 30]].map(([x, y, r]) => (
              <ellipse key={`${x}`} cx={x} cy={y} rx="12" ry="5" fill={C.sea} transform={`rotate(${r} ${x} ${y})`} />
            ))}
            <path d="M56 52 l6 10 l6 -14" stroke={accent} strokeWidth="4" fill="none" />
          </>
        )
      default:
        return (
          <>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M8 ${34 + i * 20} q 13 -12 26 0 t 26 0 t 26 0 t 26 0`} stroke={i === 1 ? accent : C.sea} strokeWidth="5" fill="none" />
            ))}
          </>
        )
    }
  })()
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <Defs p={p} />
      {body}
    </svg>
  )
}

export const ChapterArt = {
  terrace: TerraceArt,
  tea: TeaArt,
  bar: BarArt,
  raid: RaidArt,
  isolation: IsolationArt,
  nightmatch: NightMatchArt,
  sky: SkyArt,
  athens: AthensArt,
  screens: ScreensArt,
  antenna: AntennaArt,
  tornphoto: TornPhotoArt,
  story: StoryArt,
}
