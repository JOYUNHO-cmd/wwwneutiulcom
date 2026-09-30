import React from 'react';
import { Link } from 'react-router-dom';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getRegionCases } from '../lib/regionCaseData.mjs';
import { getPriorityRegionsForService } from '../lib/serviceRegionPriority.mjs';

export default function ServiceRegions({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  if (!REGION_LANDING_SERVICES.includes(serviceId)) return null;
  const priorityRegions = getPriorityRegionsForService(serviceId)
    .map(regionId => REGIONS.find(region => region.id === regionId))
    .filter((region): region is (typeof REGIONS)[number] => Boolean(region));

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="service-regions-title">
      <h2 id="service-regions-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">지역별 {serviceTitle} 안내</h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 break-keep">시공하실 지역을 선택해 작업 환경과 상담 시 확인할 사항을 살펴보세요. 서비스 상담 가능 지역 안내이며, 지역별 지점을 뜻하지 않습니다.</p>
      {priorityRegions.length > 0 && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">실제 현장사진이 있는 우선 안내 지역</h3>
          <p className="text-sm text-slate-600 mb-4 break-keep">지역별 작업 전후 사진과 상담 기준을 먼저 확인해 보세요.</p>
          <nav aria-label={`우선 ${serviceTitle} 지역`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {priorityRegions.map(region => {
              const caseCount = getRegionCases(serviceId, region.id).length;
              return (
                <Link
                  key={region.id}
                  to={`/services/${serviceId}/${region.id}`}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-4 text-center shadow-sm hover:border-primary hover:shadow-md transition-all"
                >
                  <span className="block font-extrabold text-primaryDark break-keep">{region.name} {serviceTitle}</span>
                  <span className="block mt-1 text-xs text-slate-500">
                    {caseCount > 0 ? `자체 상세사례 ${caseCount}건` : '전후사진·상담 기준'}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      <div className="space-y-3">
        {['서울', '인천', '경기'].map(group => (
          <details key={group} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <summary className="cursor-pointer font-bold text-slate-900">{group} 지역 보기</summary>
            <nav aria-label={`${group} ${serviceTitle}`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
              {REGIONS.filter(region => region.group === group).map(region => (
                <Link key={region.id} to={`/services/${serviceId}/${region.id}`} aria-label={`${region.name} ${serviceTitle} 안내`} className="rounded-lg px-3 py-2 text-sm text-primaryDark hover:bg-emerald-50 underline underline-offset-4 break-keep">{region.name}</Link>
              ))}
            </nav>
          </details>
        ))}
      </div>
    </section>
  );
}
