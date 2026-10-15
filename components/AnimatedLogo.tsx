import React, { useEffect, useId, useRef, useState } from 'react';

// The 느티울 logo assembling itself in the order its name tells it:
// 느티(나무) + 울(타리). The ground and the tree arrive smoothly — the hill
// spreads out, the trunk grows up from it, the crown leafs out around the
// house — then the circle, the fence (springing up from below the circle)
// and the name pop in one beat at a time with a little bounce.
//
// Nothing is redrawn: each stage is the real logo image seen through its own
// mask. The smooth stages grow their mask's white shape (classes nl-m-*); the
// pop stages bounce the masked piece as a whole. The mask regions are disjoint,
// so no pixel belongs to two pieces (a shared pixel would show as a second,
// differently-moving copy), and together they cover the whole logo (checked by
// rasterising them against the source: ~10 anti-aliased edge pixels of 615k
// differ), so the finished frame is the logo as-is. Mask regions are in the source
// image's 1254x1254 coordinate space (the web copy is a downscale; see
// scripts/convert-logo-full.mjs). The logo's inside and its house are
// transparent, so place it on a light background.
//
// Server render and no-JS show the complete logo; pieces are only hidden
// once the client has mounted ("is-armed"), and the animation starts when the
// logo scrolls into view ("is-playing"). Users who prefer reduced motion get
// the static logo. Timings live in src/styles.css (.nl-m-*, .nl-piece-*).

const SIZE = 1254;
const CX = 627; // circle centre
const CY = 627;

// The crescent hill under the tree. Checked against the source pixels: it
// holds every hill pixel, stays above the letters (top of '느' ~y865, '울'
// ~y850) and clear of the inner ring (r ≥ ~540).
const HILL = 'M170 865 Q627 640 1084 865 L1084 893 Q627 771 170 893 Z';
// The fence sits in the gap at the bottom of the inner ring; below y1000 and
// between these x bounds, everything inside the outer ring is fence.
const FENCE_BOX = { x: 200, y: 1000, w: 854, h: 254 };
const NAME_BOX = { x: 330, y: 840, w: 610, h: 270 };

type Stage = 'tree' | 'ring' | 'fence' | 'name';

export default function AnimatedLogo({ className = '', alt = '느티울종합청소 로고' }: { className?: string; alt?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const mask = (stage: Stage) => `nl-${id}-${stage}`;
  const fenceClip = `nl-${id}-fence-box`;
  const crownClip = `nl-${id}-crown-box`;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const image = <image href="/images/logo-full.webp" width={SIZE} height={SIZE} />;
  const stages: Stage[] = ['tree', 'ring', 'fence', 'name'];
  const maskProps = { maskUnits: 'userSpaceOnUse' as const, x: 0, y: 0, width: SIZE, height: SIZE };
  // Both rings: an annulus from r≈520 to r≈636 around the centre (the rings
  // sit slightly off-centre, so the band is wider than the strokes look).
  const ringBand = (color: string) => (
    <circle cx={CX} cy={CY} r="578" fill="none" stroke={color} strokeWidth="116" />
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={alt}
      className={`nl-logo ${armed ? 'is-armed' : ''} ${playing ? 'is-playing' : ''} ${className}`}
    >
      <defs>
        <clipPath id={fenceClip}>
          <rect x={FENCE_BOX.x} y={FENCE_BOX.y} width={FENCE_BOX.w} height={FENCE_BOX.h} />
        </clipPath>

        <clipPath id={crownClip}>
          <rect x="0" y="0" width={SIZE} height="706" />
        </clipPath>

        {/* 땅 + 기둥 + 나뭇잎·집 — one mask, so the growing shapes overlap
            inside it instead of meeting edge to edge (two half-covered edge
            pixels show as a faint line). The hill spreads out, the trunk
            (and the foot of the house) grows up from it, and the crown —
            everything above y≈700 inside the rings — leafs out last. */}
        <mask id={mask('tree')} {...maskProps}>
          <rect className="nl-m nl-m-trunk" x="430" y="690" width="390" height="110" fill="#fff" />
          <g clipPath={`url(#${crownClip})`}>
            <circle className="nl-m nl-m-crown" cx={CX} cy="560" r="480" fill="#fff" />
          </g>
          {ringBand('#000')}
          <rect x={FENCE_BOX.x} y={FENCE_BOX.y} width={FENCE_BOX.w} height={FENCE_BOX.h} fill="#000" />
          <rect x={NAME_BOX.x} y={NAME_BOX.y} width={NAME_BOX.w} height={NAME_BOX.h} fill="#000" />
          <path className="nl-m nl-m-hill" d={HILL} fill="#fff" />
        </mask>
        {/* 원 — both rings, except the inner part of the band inside the fence
            box, which is the fence's rails rather than ring */}
        <mask id={mask('ring')} {...maskProps}>
          {ringBand('#fff')}
          <circle cx={CX} cy={CY} r="553" fill="none" stroke="#000" strokeWidth="66" clipPath={`url(#${fenceClip})`} />
        </mask>
        {/* 울타리 — the fence box, minus the outer ring and the name */}
        <mask id={mask('fence')} {...maskProps}>
          <rect x={FENCE_BOX.x} y={FENCE_BOX.y} width={FENCE_BOX.w} height={FENCE_BOX.h} fill="#fff" />
          <circle cx={CX} cy={CY} r="613" fill="none" stroke="#000" strokeWidth="54" />
          <rect x={NAME_BOX.x} y={NAME_BOX.y} width={NAME_BOX.w} height={NAME_BOX.h} fill="#000" />
        </mask>
        {/* 느티울 */}
        <mask id={mask('name')} {...maskProps}>
          <rect x={NAME_BOX.x} y={NAME_BOX.y} width={NAME_BOX.w} height={NAME_BOX.h} fill="#fff" />
          <path d={HILL} fill="#000" />
        </mask>
      </defs>

      {/* The bounce transforms the masked group as a whole, mask included —
          like a cut-out sticker popping in — so even at full overshoot a piece
          never shows any pixel outside its own region. */}
      <g className="nl-parts">
        {stages.map((stage) => (
          <g key={stage} mask={`url(#${mask(stage)})`} className={`nl-piece nl-piece-${stage}`}>
            {image}
          </g>
        ))}
      </g>
      {/* The finished logo, shown on its own once the pieces have landed */}
      <g className="nl-whole">{image}</g>
    </svg>
  );
}
