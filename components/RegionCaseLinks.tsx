import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegionCaseSummary {
  slug: string;
  heading: string;
  teaser: string;
  thumbnail: string;
}

interface RegionCaseLinksProps {
  serviceId: string;
  regionId: string;
  cases: RegionCaseSummary[];
  className?: string;
  // When the cards sit right under the blog section, that section's own
  // "전체 작업 과정들이 궁금하시다면??" already introduces them, so the visible
  // heading would only repeat it. It stays in the markup for screen readers.
  hideHeading?: boolean;
}

// Link-out cards on the region+service landing page pointing at each real
// field-case article (its own page at /services/:serviceId/:regionId/:slug —
// see pages/RegionCaseDetail.tsx). The landing page itself only ever shows
// this short list, never the full case content, since a region can
// accumulate many separate case articles over time.
// How many cards show before the "더보기" button. The rest are still
// rendered (just hidden) so every case link stays in the prerendered HTML.
const INITIAL_VISIBLE = 4;

const RegionCaseLinks: React.FC<RegionCaseLinksProps> = ({ serviceId, regionId, cases, className, hideHeading }) => {
  const [expanded, setExpanded] = useState(false);
  if (!cases || cases.length === 0) return null;

  const hiddenCount = Math.max(0, cases.length - INITIAL_VISIBLE);
  // Same two-up mobile grid as the blog cards above (ServiceCaseBlogSection).
  const gridClass = cases.length === 1
    ? 'grid-cols-1 max-w-xs mx-auto'
    : cases.length === 2
    ? 'grid-cols-2 max-w-2xl mx-auto'
    : cases.length === 3
    ? 'grid-cols-2 md:grid-cols-3'
    : 'grid-cols-2 md:grid-cols-4';

  return (
    <section className={className}>
      <h2 className={hideHeading ? 'sr-only' : 'text-xl sm:text-2xl font-bold text-slate-900 mb-5'}>실제 작업 사례</h2>
      <div className={`grid gap-3 sm:gap-5 ${gridClass}`}>
        {cases.map((c, i) => (
          <Link
            key={c.slug}
            to={`/services/${serviceId}/${regionId}/${c.slug}`}
            className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary/40 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex-col h-full ${
              i >= INITIAL_VISIBLE && !expanded ? 'hidden' : 'flex'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden w-full bg-slate-100 border-b border-slate-100">
              <img
                src={c.thumbnail}
                alt={c.heading}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-md">
                현장 후기
              </span>
            </div>
            <div className="p-3.5 sm:p-4">
              <h3 className="text-[13px] sm:text-[15px] font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug break-keep">
                {c.heading}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-primary/40 text-primary font-bold text-sm sm:text-base bg-white hover:bg-primary hover:text-white transition-colors"
          >
            {expanded ? '접기' : `현장 후기 더보기 (+${hiddenCount})`}
            <ChevronDown size={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </section>
  );
};

export default RegionCaseLinks;
