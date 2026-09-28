import type { Shape } from "@/lib/products";

const CLAY = "#c89b77";
const CLAY_DARK = "#a97c5a";

type Props = { shape: Shape; glaze: string; className?: string; backdrop?: string };

// Wavy drip line from x1 to x2 around height y, used where glaze meets raw clay.
function drip(x1: number, x2: number, y: number, n = 5) {
  const step = (x2 - x1) / n;
  let d = `L ${x2} ${y}`;
  for (let i = n; i > 0; i--) {
    const cx = x1 + step * (i - 0.5);
    const dy = i % 2 ? 7 : 3;
    d += ` Q ${cx} ${y + dy} ${x1 + step * (i - 1)} ${y}`;
  }
  return d;
}

export function Art({ shape, glaze, className, backdrop = "#ece0d0" }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden>
      <rect width="200" height="200" fill={backdrop} />
      <ellipse cx="100" cy="168" rx="62" ry="9" fill="#2b211c" opacity="0.10" />
      {SHAPES[shape](glaze)}
    </svg>
  );
}

const shine = (x: number, y: number, h: number) => (
  <rect x={x} y={y} width="7" height={h} rx="3.5" fill="#fff" opacity="0.28" />
);

const SHAPES: Record<Shape, (g: string) => React.ReactNode> = {
  mug: (g) => (
    <g>
      <path d="M128 80 C 160 78, 162 128, 128 126" fill="none" stroke={g} strokeWidth="11" strokeLinecap="round" />
      <path d="M58 62 H 132 V 150 Q 132 164 118 164 H 72 Q 58 164 58 150 Z" fill={CLAY} />
      <path d={`M58 62 H 132 V 132 ${drip(58, 132, 132).replace(/^L 132 132/, "")} Z`} fill={g} />
      <ellipse cx="95" cy="62" rx="37" ry="7" fill={g} />
      <ellipse cx="95" cy="62" rx="31" ry="4.5" fill="#000" opacity="0.18" />
      {shine(70, 74, 44)}
    </g>
  ),
  cup: (g) => (
    <g>
      <path d="M62 78 H 138 L 128 156 Q 126 164 116 164 H 84 Q 74 164 72 156 Z" fill={CLAY} />
      <path d={`M62 78 H 138 L 132 132 ${drip(66, 132, 132).replace(/^L 132 132/, "")} Z`} fill={g} />
      <ellipse cx="100" cy="78" rx="38" ry="7" fill={g} />
      <ellipse cx="100" cy="78" rx="32" ry="4.5" fill="#000" opacity="0.18" />
      {shine(76, 88, 34)}
    </g>
  ),
  bowl: (g) => (
    <g>
      <path d="M36 92 Q 40 160 100 162 Q 160 160 164 92 Z" fill={CLAY} />
      <path d={`M36 92 Q 38 128 52 140 ${drip(52, 148, 140).replace(/^L 148 140/, "")} L 148 140 Q 162 128 164 92 Z`} fill={g} />
      <ellipse cx="100" cy="92" rx="64" ry="14" fill={g} />
      <ellipse cx="100" cy="93" rx="56" ry="10" fill="#000" opacity="0.2" />
      <path d="M52 104 Q 56 128 70 136" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  ),
  vase: (g) => (
    <g>
      <path d="M88 30 H 112 V 52 Q 112 66 128 82 Q 148 104 144 132 Q 140 162 112 164 H 88 Q 60 162 56 132 Q 52 104 72 82 Q 88 66 88 52 Z" fill={CLAY} />
      <path d={`M88 30 H 112 V 52 Q 112 66 128 82 Q 148 104 144 132 ${drip(56, 144, 136).replace(/^L 144 136/, "")} Q 52 104 72 82 Q 88 66 88 52 Z`} fill={g} />
      <ellipse cx="100" cy="30" rx="13" ry="3.5" fill="#000" opacity="0.3" />
      <path d="M74 98 Q 66 116 70 132" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  ),
  plate: (g) => (
    <g>
      <ellipse cx="100" cy="126" rx="76" ry="30" fill={CLAY_DARK} />
      <ellipse cx="100" cy="120" rx="76" ry="30" fill={CLAY} />
      <ellipse cx="100" cy="120" rx="64" ry="24" fill={g} />
      <ellipse cx="100" cy="122" rx="44" ry="15" fill="#000" opacity="0.08" />
      <ellipse cx="100" cy="98" rx="76" ry="30" fill={CLAY_DARK} opacity="0.0" />
      <ellipse cx="100" cy="92" rx="76" ry="30" fill={CLAY} />
      <ellipse cx="100" cy="92" rx="64" ry="24" fill={g} />
      <path d="M58 84 Q 76 72 104 71" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.3" />
    </g>
  ),
  teapot: (g) => (
    <g>
      <path d="M138 104 Q 162 96 170 72" stroke={g} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M62 92 C 30 94, 34 140, 62 138" stroke={g} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M52 110 Q 52 70 100 70 Q 148 70 148 110 Q 148 160 100 162 Q 52 160 52 110 Z" fill={CLAY} />
      <path d={`M52 110 Q 52 70 100 70 Q 148 70 148 110 Q 148 130 142 142 ${drip(58, 142, 142).replace(/^L 142 142/, "")} Q 52 130 52 110 Z`} fill={g} />
      <ellipse cx="100" cy="72" rx="26" ry="6" fill="#000" opacity="0.18" />
      <path d="M78 72 Q 100 52 122 72 Z" fill={g} />
      <circle cx="100" cy="56" r="6" fill={g} />
      <path d="M66 100 Q 64 118 70 130" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  ),
  planter: (g) => (
    <g>
      <ellipse cx="100" cy="158" rx="58" ry="10" fill={CLAY_DARK} />
      <ellipse cx="100" cy="154" rx="58" ry="10" fill={CLAY} />
      <path d="M58 80 H 142 L 134 150 Q 132 156 124 156 H 76 Q 68 156 66 150 Z" fill={g} />
      <ellipse cx="100" cy="80" rx="42" ry="8" fill={g} />
      <ellipse cx="100" cy="80" rx="36" ry="5.5" fill="#4a3526" />
      <path d="M100 78 Q 92 50 72 44 M100 78 Q 106 46 128 38 M100 78 Q 100 56 100 30" stroke="#5f6f47" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="74" cy="46" rx="10" ry="5" fill="#6f8352" transform="rotate(-30 74 46)" />
      <ellipse cx="126" cy="40" rx="11" ry="5" fill="#6f8352" transform="rotate(20 126 40)" />
      <ellipse cx="100" cy="32" rx="5" ry="10" fill="#6f8352" />
      {shine(74, 92, 40)}
    </g>
  ),
  pot: (g) => (
    <g>
      <path d="M62 112 Q 62 162 100 162 Q 138 162 138 112 Z" fill={CLAY} />
      <path d={`M62 112 Q 64 138 76 148 ${drip(76, 124, 148).replace(/^L 124 148/, "")} L 124 148 Q 136 138 138 112 Z`} fill={g} />
      <path d="M58 112 Q 60 92 100 92 Q 140 92 142 112 Z" fill={g} />
      <rect x="92" y="80" width="16" height="14" rx="6" fill={g} />
      <path d="M72 120 Q 72 136 80 142" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  ),
};
