import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
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

  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className="scroll-mt-28 text-xl sm:text-2xl font-bold text-slate-900 mb-3 break-keep">
        {regionName} 현장으로 확인하는 느티울의 시공 경험
      </h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 break-keep">
        직접 진행한 {serviceLabel} 사례입니다. 작업 요약을 펼쳐 보거나 사진을 눌러 전체 후기를 확인하세요.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 items-start gap-3 sm:gap-5">
        {records.map((record) => (
          <article key={record.slug} className="min-w-0 rounded-xl sm:rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <Link
              to={record.sourceUrl}
              aria-label={`${record.heading} 전체 후기 보기`}
              className="group/photo relative block bg-slate-100 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <img
                src={record.thumbnail}
                alt={record.heading}
                width={record.thumbnailWidth}
                height={record.thumbnailHeight}
                loading="lazy"
                decoding="async"
                className="w-full aspect-4/3 object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/photo:scale-105"
              />
              <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-full bg-white/95 p-1.5 text-slate-800 shadow-sm">
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <div className="p-3 sm:p-4">
              <h3 className="text-[13px] sm:text-base font-bold text-slate-900 leading-snug break-keep [overflow-wrap:anywhere]">
                <Link to={record.sourceUrl} className="line-clamp-3 min-h-[4.125em] hover:text-primary focus-visible:outline-primary">
                  {record.cardTitle || record.heading}
                </Link>
              </h3>
            </div>
            <details className="group border-t border-slate-100">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 bg-emerald-50/70 px-3 py-3 text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">작업 요약 보기</span>
                <span className="hidden group-open:inline">작업 요약 접기</span>
                <ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="p-3 sm:p-4">
                <dl className="space-y-3">
                  {record.summaryFacts.map((fact) => (
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
          </article>
        ))}
      </div>
    </section>
  );
};

export default RegionWorkEvidence;
