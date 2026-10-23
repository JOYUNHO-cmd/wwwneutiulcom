import React from 'react';
import { Link } from 'react-router-dom';
import { getRegionWorkEvidence } from '../lib/regionWorkEvidence.mjs';

interface RegionWorkEvidenceProps {
  serviceId: string;
  regionId: string;
  regionName: string;
  serviceLabel: string;
  className?: string;
}

type WorkEvidence = ReturnType<typeof getRegionWorkEvidence>[number];

const FACT_LABELS = [
  ['location', '현장 위치'],
  ['before', '작업 전 상태'],
  ['process', '작업 과정'],
  ['staff', '인원·시간 기록'],
] as const;

const CaseFacts: React.FC<{ record: WorkEvidence }> = ({ record }) => (
  <div className="space-y-5">
    <dl className="space-y-4">
      {FACT_LABELS.map(([key, label]) => record.facts?.[key] && (
        <div key={key} className="sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-bold text-slate-800 mb-1 sm:mb-0">{label}</dt>
          <dd className="text-sm sm:text-base leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]">
            {record.facts[key]}
          </dd>
        </div>
      ))}
    </dl>
    {record.closingSection && (
      <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
        <p className="font-bold text-sm text-slate-800 mb-2">{record.closingSection.heading}</p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]">
          {record.closingSection.body}
        </p>
      </div>
    )}
    {record.note && (
      <p className="text-sm leading-relaxed text-slate-600 break-keep [overflow-wrap:anywhere]">
        {record.note}
      </p>
    )}
  </div>
);

const RegionWorkEvidence: React.FC<RegionWorkEvidenceProps> = ({
  serviceId, regionId, regionName, serviceLabel, className,
}) => {
  const records = getRegionWorkEvidence(serviceId, regionId);
  if (records.length === 0) return null;

  const headingId = `region-work-evidence-${serviceId}-${regionId}`;

  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
        {regionName} {serviceLabel} 실제 작업 기록
      </h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 break-keep">
        각 현장의 작업 전 상태와 진행 과정을 기존 현장 후기에서 모았습니다.
      </p>
      <div className="space-y-6">
        {records.map((record, index) => (
          <article key={record.slug} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {index < 2 ? (
              <>
                <div className="sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <Link to={record.sourceUrl} className="block bg-slate-100">
                    <img
                      src={record.thumbnail}
                      alt={record.heading}
                      width={record.thumbnailWidth}
                      height={record.thumbnailHeight}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-4/3 object-cover sm:h-full"
                    />
                  </Link>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 break-keep [overflow-wrap:anywhere]">
                      <Link to={record.sourceUrl} className="hover:text-primary">{record.heading}</Link>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-keep [overflow-wrap:anywhere]">
                      {record.teaser}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-100 p-5 sm:p-6">
                  <CaseFacts record={record} />
                </div>
              </>
            ) : (
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 break-keep [overflow-wrap:anywhere]">
                  <Link to={record.sourceUrl} className="hover:text-primary">{record.heading}</Link>
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-keep [overflow-wrap:anywhere]">
                  {record.teaser}
                </p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-bold text-slate-700 py-2">작업 기록 펼치기</summary>
                  <div className="pt-3"><CaseFacts record={record} /></div>
                </details>
              </div>
            )}
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <Link
                to={record.sourceUrl}
                className="inline-flex py-2 text-sm font-bold text-primary underline underline-offset-4 hover:text-primaryDark"
              >
                사진과 전체 현장 후기 보기
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RegionWorkEvidence;
