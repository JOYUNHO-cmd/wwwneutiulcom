import React, { useEffect, useId, useRef, useState } from 'react';

// The 느티울 logo drawn in the order its name tells it: 느티(나무) + 울(타리).
// The ground spreads out, the trunk grows up from it, the crown leafs out
// around the house, the circle wraps around them, the fence goes up, and the
// name appears last.
//
// Nothing is redrawn: every stage shows the real logo image through its own
// animated mask, so the finished frame is pixel-identical to the logo. Mask
// regions are in the source image's 1254x1254 coordinate space (the web copy
// is a downscale of it; see scripts/convert-logo-full.mjs). The logo's inside
// and its house are transparent, so place it on a light background.
//
// Server render and no-JS show the complete logo; the masks only hide the
// pieces once the client has mounted ("is-armed"), and the animation starts
// when the logo scrolls into view ("is-playing"). Users who prefer reduced
// motion get the static logo.

const SIZE = 1254;
const CX = 627; // circle centre
const CY = 627;

type Stage = 'hill' | 'trunk' | 'crown' | 'ring' | 'fence' | 'name';

export default function AnimatedLogo({ className = '', alt = '느티울종합청소 로고' }: { className?: string; alt?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const mask = (stage: Stage) => `nl-${id}-${stage}`;

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
  const stages: Stage[] = ['hill', 'trunk', 'crown', 'ring', 'fence', 'name'];

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={alt}
      className={`nl-logo ${armed ? 'is-armed' : ''} ${playing ? 'is-playing' : ''} ${className}`}
    >
      <defs>
        {/* 땅 — the crescent hill under the tree, plus its two tips */}
        <mask id={mask('hill')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <g className="nl-m nl-m-hill">
            <rect x="150" y="755" width="960" height="85" fill="#fff" />
            <rect x="150" y="820" width="185" height="80" fill="#fff" />
            <rect x="925" y="820" width="185" height="80" fill="#fff" />
          </g>
        </mask>
        {/* 기둥 — trunk and the foot of the house, growing up from the ground */}
        <mask id={mask('trunk')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <rect className="nl-m nl-m-trunk" x="430" y="620" width="390" height="180" fill="#fff" />
        </mask>
        {/* 나뭇잎 — the crown leafing out from the top of the trunk */}
        <mask id={mask('crown')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <circle className="nl-m nl-m-crown" cx={CX} cy="560" r="480" fill="#fff" />
          <rect x="0" y="700" width={SIZE} height={SIZE - 700} fill="#000" />
        </mask>
        {/* 원 — both rings, drawn from the top down both sides */}
        <mask id={mask('ring')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <circle className="nl-m nl-m-ring" cx={CX} cy={CY} r="586" fill="none" stroke="#fff" strokeWidth="96" pathLength={100} />
          <circle className="nl-m nl-m-ring nl-m-ring-mirror" cx={CX} cy={CY} r="586" fill="none" stroke="#fff" strokeWidth="96" pathLength={100} />
        </mask>
        {/* 울타리 — fence posts going up from the middle outwards */}
        <mask id={mask('fence')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <rect className="nl-m nl-m-fence" x="200" y="1000" width="854" height="240" fill="#fff" />
          <rect x="330" y="840" width="610" height="270" fill="#000" />
        </mask>
        {/* 느티울 — the name */}
        <mask id={mask('name')} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <rect className="nl-m nl-m-name" x="330" y="840" width="610" height="270" fill="#fff" />
        </mask>
      </defs>

      {stages.map((stage) => (
        <g key={stage} mask={`url(#${mask(stage)})`} className={`nl-piece nl-piece-${stage}`}>
          {image}
        </g>
      ))}
    </svg>
  );
}
