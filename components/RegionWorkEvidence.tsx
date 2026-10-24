import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { getRegionWorkEvidence } from '../lib/regionWorkEvidence.mjs';

interface RegionWorkEvidenceProps {
  serviceId: string;
  regionId: string;
  regionName: string;
  serviceLabel: string;
  className?: string;
}

const RegionWorkEvidence: React.FC<RegionWorkEvidenceProps> = ({
  serviceId, regionId, regionName, serviceLabel, className,
}) => {
  const records = getRegionWorkEvidence(serviceId, regionId);
  if (records.length === 0) return null;

  const headingId = `region-work-evidence-${serviceId}-${regionId}`;
  const isSingle = records.length === 1;
  const visibleLabels = new Set(['현장', '주요 작업', '인원·시간']);

  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className="scroll-mt-28 text-xl sm:text-2xl font-bold text-slate-900 mb-3 break-keep">
        {regionName} {serviceLabel}, 실제 작업 기록
      </h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 break-keep">
        직접 진행한 {serviceLabel} 사례입니다. 작업 범위를 확인하고, 사진을 눌러 전체 현장 기록을 살펴보세요.
      </p>
      <div className={`grid ${isSingle ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} items-start gap-3 sm:gap-5`}>
        {records.map((record) => {
          const visibleFacts = record.summaryFacts.filter((fact) => visibleLabels.has(fact.label));
          const additionalFacts = record.summaryFacts.filter((fact) =>
            !visibleLabels.has(fact.label) || (!isSingle && fact.label === '주요 작업'),
          );
          return (
          <article key={record.slug} className={`min-w-0 rounded-xl sm:rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs ${isSingle ? 'md:grid md:grid-cols-2' : ''}`}>
            <Link
              to={record.sourceUrl}
              aria-label={`${record.heading} — 사진·전체 작업 기록 보기`}
              className="group/photo relative block self-start bg-slate-100 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <div className="overflow-hidden">
                <img
                  src={record.thumbnail}
                  alt={record.heading}
                  width={record.thumbnailWidth}
                  height={record.thumbnailHeight}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-4/3 object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/photo:scale-105"
                />
              </div>
              <span className={`flex min-h-11 items-center justify-center bg-emerald-700 py-2.5 ${isSingle ? 'gap-2 px-3 text-sm' : 'gap-1.5 px-2 text-[12px] sm:gap-2 sm:px-3 sm:text-sm'} font-bold leading-relaxed text-white group-hover/photo:bg-emerald-800 group-focus-visible/photo:bg-emerald-800`}>
                <span className="text-center break-keep">사진·전체 작업 기록 보기</span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0" />
              </span>
            </Link>
            <div className="min-w-0">
              <div className={isSingle ? 'p-5 sm:p-6' : 'p-3 sm:p-4'}>
                <h3 className={`${isSingle ? 'text-lg sm:text-xl' : 'text-[13px] sm:text-base'} font-bold text-slate-900 leading-snug break-keep [overflow-wrap:anywhere]`}>
                  <Link to={record.sourceUrl} className={`${isSingle ? '' : 'line-clamp-3 min-h-[4.125em]'} hover:text-primary focus-visible:outline-primary`}>
                    {record.cardTitle || record.heading}
                  </Link>
                </h3>
                <dl aria-label="작업 핵심 정보" className="mt-4 space-y-3">
                  {visibleFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="mb-1 text-xs sm:text-sm font-bold text-slate-800">{fact.label}</dt>
                      <dd className={`${isSingle ? 'text-sm sm:text-base' : 'text-[13px] sm:text-sm'} ${!isSingle && fact.label === '주요 작업' ? 'line-clamp-2' : ''} leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]`}>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            <details className="group border-t border-slate-100">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 bg-emerald-50/70 px-3 py-3 text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                  <span>작업 과정·참고사항</span>
                <ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className={isSingle ? 'p-5 sm:p-6' : 'p-3 sm:p-4'}>
                <dl className="space-y-3">
                  {additionalFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="mb-1 text-xs sm:text-sm font-bold text-slate-800">{fact.label}</dt>
                      <dd className="text-[13px] sm:text-sm leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                {record.summaryNote && (
                  <p className="mt-4 rounded-lg bg-slate-50 p-2.5 text-[13px] sm:text-sm leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]">
                    {record.summaryNote}
                  </p>
                )}
                <Link to={record.sourceUrl} className="mt-4 inline-flex min-h-11 items-center gap-1 text-xs sm:text-sm font-bold text-primary underline underline-offset-4 hover:text-primaryDark">
                  전체 현장 후기 <ArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
                </Link>
              </div>
            </details>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
};

export default RegionWorkEvidence;
