import React from 'react';
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
}

// Link-out cards on the region+service landing page pointing at each real
// field-case article (its own page at /services/:serviceId/:regionId/:slug —
// see pages/RegionCaseDetail.tsx). The landing page itself only ever shows
// this short list, never the full case content, since a region can
// accumulate many separate case articles over time.
const RegionCaseLinks: React.FC<RegionCaseLinksProps> = ({ serviceId, regionId, cases, className }) => {
  if (!cases || cases.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">실제 작업 사례</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {cases.map((c) => (
          <Link
            key={c.slug}
            to={`/services/${serviceId}/${regionId}/${c.slug}`}
            className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-3"
          >
            <img
              src={c.thumbnail}
              alt={c.heading}
              loading="lazy"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shrink-0"
            />
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors break-keep line-clamp-2">
                {c.heading}
              </h3>
              <p className="text-gray-500 text-sm mt-1 break-keep line-clamp-2">{c.teaser}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RegionCaseLinks;
