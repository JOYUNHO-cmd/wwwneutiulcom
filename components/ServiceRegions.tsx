import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Info, MapPin } from 'lucide-react';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getVerifiedRegionsForService } from '../lib/serviceRegionPriority.mjs';

const GROUPS = ['서울', '인천', '경기'] as const;
type Group = (typeof GROUPS)[number];

export default function ServiceRegions({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  // Hooks run before the early return: this component stays mounted when the
  // route's serviceId changes, so the hook count must not depend on it.
  const [activeGroup, setActiveGroup] = useState<Group>('서울');
  if (!REGION_LANDING_SERVICES.includes(serviceId)) return null;

  const verifiedRegions = getVerifiedRegionsForService(serviceId).map(entry => ({
    ...entry,
    region: REGIONS.find(region => region.id === entry.regionId)!,
  }));
  const caseCountByRegion = new Map(verifiedRegions.map(entry => [entry.regionId, entry.caseCount]));

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20" aria-labelledby="service-regions-title">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-primary text-xs sm:text-sm font-extrabold tracking-[0.2em] mb-2 sm:mb-3">SERVICE AREA</p>
        <h2 id="service-regions-title" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug break-keep">
          지역별 <span className="text-primary">{serviceTitle}</span> 안내
        </h2>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-3 break-keep">
          시공하실 지역을 선택해 작업 환경과 상담 시 확인할 사항을 살펴보세요.
        </p>
      </div>

      {verifiedRegions.length > 0 && (
        <div className="mb-5 sm:mb-6 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">실제 사례가 있는 지역</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-keep">
                홈페이지에 정리된 실제 현장 사례와 상담 기준을 지역별로 확인해 보세요.
              </p>
            </div>
          </div>
          <nav aria-label={`실제 사례가 있는 ${serviceTitle} 지역`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {verifiedRegions.map(({ region, caseCount, href }) => (
              <Link
                key={region.id}
                to={href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="text-[11px] font-bold text-primary">{region.group}</span>
                <span className="mt-0.5 text-[15px] sm:text-base font-extrabold text-slate-900 break-keep">
                  {region.name}
                  <span className="sr-only"> {serviceTitle}</span>
                </span>
                <span className="mt-2.5 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>사례 {caseCount}건</span>
                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">전체 지역에서 찾기</h3>
          </div>
          <div role="tablist" aria-label="권역 선택" className="grid grid-cols-3 sm:inline-flex p-1 rounded-full bg-slate-100">
            {GROUPS.map(group => {
              const selected = group === activeGroup;
              return (
                <button
                  key={group}
                  type="button"
                  role="tab"
                  id={`service-regions-tab-${group}`}
                  aria-selected={selected}
                  aria-controls={`service-regions-panel-${group}`}
                  onClick={() => setActiveGroup(group)}
                  className={`whitespace-nowrap rounded-full px-3 sm:px-5 py-2 text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                    selected ? 'bg-white text-primaryDark shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {group}
                  <span className={`ml-1.5 text-xs font-semibold ${selected ? 'text-primary' : 'text-slate-400'}`}>
                    {REGIONS.filter(region => region.group === group).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Every panel stays in the markup (only the inactive ones are hidden) so
            all region links remain in the prerendered HTML for crawlers. */}
        {GROUPS.map(group => (
          <div
            key={group}
            role="tabpanel"
            id={`service-regions-panel-${group}`}
            aria-labelledby={`service-regions-tab-${group}`}
            hidden={group !== activeGroup}
          >
            <nav aria-label={`${group} ${serviceTitle}`} className="flex flex-wrap gap-2 sm:gap-2.5">
              {REGIONS.filter(region => region.group === group).map(region => {
                const caseCount = caseCountByRegion.get(region.id) || 0;
                return (
                  <Link
                    key={region.id}
                    to={`/services/${serviceId}/${region.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 sm:py-2 text-sm font-semibold text-slate-700 break-keep transition-colors hover:border-primary hover:bg-emerald-50 hover:text-primaryDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {region.name}
                    <span className="sr-only"> {serviceTitle}</span>
                    {caseCount > 0 && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-emerald-700">
                        사례 {caseCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <p className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 leading-relaxed break-keep">
          <Info className="mt-0.5 w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          서비스 상담 가능 지역 안내이며, 지역별 지점을 뜻하지 않습니다.
        </p>
      </div>
    </section>
  );
}
