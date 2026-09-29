import React from 'react';
import { MapPin, ClipboardList, Users2, Info } from 'lucide-react';

interface CaseMedia {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

interface CaseStep {
  title: string;
  media: CaseMedia[];
}

interface RegionCase {
  heading: string;
  lead: string;
  facts: {
    location: string;
    before: string;
    process: string;
    staff: string;
  };
  steps: CaseStep[];
  note: string;
}

interface RegionCaseSectionProps {
  regionCase: RegionCase;
  className?: string;
}

// A single real job's before/after photos and facts, sourced from actual
// crew photos (see lib/regionCaseData.mjs) — distinct from the generic
// region+service template text and from the shuffled portfolio marquee
// above it. Only renders when a case for this exact service+region exists.
const RegionCaseSection: React.FC<RegionCaseSectionProps> = ({ regionCase, className }) => {
  return (
    <section className={className}>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{regionCase.heading}</h2>
      <p className="text-gray-600 mb-6 break-keep">{regionCase.lead}</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-sm sm:text-base text-gray-700">
          <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
          <span className="break-keep"><strong className="text-slate-800">위치</strong> · {regionCase.facts.location}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-sm sm:text-base text-gray-700">
          <ClipboardList className="text-primary shrink-0 mt-0.5" size={18} />
          <span className="break-keep"><strong className="text-slate-800">작업 전 상태</strong> · {regionCase.facts.before}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-sm sm:text-base text-gray-700">
          <ClipboardList className="text-primary shrink-0 mt-0.5" size={18} />
          <span className="break-keep"><strong className="text-slate-800">작업 순서</strong> · {regionCase.facts.process}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-sm sm:text-base text-gray-700">
          <Users2 className="text-primary shrink-0 mt-0.5" size={18} />
          <span className="break-keep"><strong className="text-slate-800">인원·시간</strong> · {regionCase.facts.staff}</span>
        </div>
      </div>

      <div className="space-y-8">
        {regionCase.steps.map((step, si) => (
          <div key={si}>
            <h3 className="font-bold text-slate-800 mb-3">{step.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {step.media.map((m, mi) => (
                <figure key={mi} className="rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={m.src}
                    width={m.width}
                    height={m.height}
                    alt={m.alt}
                    loading="lazy"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <figcaption className="text-[11px] sm:text-xs text-gray-500 px-2 py-1.5 break-keep">
                    {m.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-4 mt-8 text-sm sm:text-base text-amber-900">
        <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <span className="break-keep">{regionCase.note}</span>
      </div>
    </section>
  );
};

export default RegionCaseSection;
