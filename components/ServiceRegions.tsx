import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, MapPin, Info } from 'lucide-react';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getVerifiedRegionsForService } from '../lib/serviceRegionPriority.mjs';
import { REGION_GROUPS, getCitiesInGroup, getChildRegions, getHotspots } from '../lib/regionHierarchy.mjs';

type Group = '서울' | '인천' | '경기';

// emoji: each 권역's best-known landmark — 남산(N서울)타워, 인천국제공항,
// 수원화성. tint: soft pastel behind it on the unselected card. delay:
// staggers the float animation so the three badges don't bob in sync.
const GROUP_META: Record<Group, { en: string; unit: string; emoji: string; tint: string; delay: number }> = {
  서울: { en: 'SEOUL', unit: '구', emoji: '🗼', tint: 'bg-rose-50', delay: 0 },
  인천: { en: 'INCHEON', unit: '구·군', emoji: '✈️', tint: 'bg-sky-50', delay: 0.6 },
  경기: { en: 'GYEONGGI', unit: '시·군', emoji: '🏯', tint: 'bg-amber-50', delay: 1.2 },
};

// Height-animated "curtain": collapses to 0 rows instead of unmounting, so
// every region link stays in the prerendered HTML for crawlers while the
// closed panels are hidden from sighted users, keyboard and screen readers.
const Curtain: React.FC<{ id: string; open: boolean; children: React.ReactNode }> = ({ id, open, children }) => {
  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};

function CaseBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold leading-none text-emerald-700">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      사례 {count}
    </span>
  );
}

export default function ServiceRegions({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  // Hooks run before the early return: this component stays mounted when the
  // route's serviceId changes, so the hook count must not depend on it.
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const [openCity, setOpenCity] = useState<string | null>(null);
  if (!REGION_LANDING_SERVICES.includes(serviceId)) return null;

  const caseCountByRegion = new Map(
    getVerifiedRegionsForService(serviceId).map((entry) => [entry.regionId, entry.caseCount])
  );
  // A city's case count includes its sub-areas (군포시 + 산본 ...).
  const cityCaseCount = (cityId: string) =>
    (caseCountByRegion.get(cityId) || 0) +
    getChildRegions(cityId).reduce((sum, child) => sum + (caseCountByRegion.get(child.id) || 0), 0);
  const groupCaseCount = (group: Group) =>
    getCitiesInGroup(group).reduce((sum, city) => sum + cityCaseCount(city.id), 0);
  const regionHref = (regionId: string) => `/services/${serviceId}/${regionId}`;

  // After a panel opens, bring it into view — with 31 cities in 경기 the
  // 동네 panel opens below the whole grid, out of sight on most screens.
  // Waits for the curtain's 500ms height transition to finish before measuring.
  const revealPanel = (panelId: string) => {
    window.setTimeout(() => {
      document.getElementById(panelId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 520);
  };
  const toggleGroup = (group: Group) => {
    const opening = openGroup !== group;
    setOpenGroup(opening ? group : null);
    setOpenCity(null);
    if (opening) revealPanel(`service-regions-group-${group}`);
  };
  const toggleCity = (cityId: string) => {
    const opening = openCity !== cityId;
    setOpenCity(opening ? cityId : null);
    if (opening) revealPanel(`service-regions-city-${cityId}`);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20" aria-labelledby="service-regions-title">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-primary text-xs sm:text-sm font-extrabold tracking-[0.2em] mb-2 sm:mb-3">SERVICE AREA</p>
        <h2 id="service-regions-title" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug break-keep">
          지역별 <span className="text-primary">{serviceTitle}</span> 안내
        </h2>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-3 break-keep">
          권역을 누르고, 시·구를 고르면 주요 동네까지 차례로 펼쳐집니다.
        </p>
      </div>

      {/* Level 1 — 권역 */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
        {(REGION_GROUPS as Group[]).map((group) => {
          const selected = openGroup === group;
          const cases = groupCaseCount(group);
          return (
            <button
              key={group}
              type="button"
              onClick={() => toggleGroup(group)}
              aria-expanded={selected}
              aria-controls={`service-regions-group-${group}`}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selected
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-900/20 -translate-y-1'
                  : 'bg-white text-slate-900 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg hover:border-primary/40'
              }`}
            >
              {/* Landmark emoji badge: in the flow above the name on narrow
                  phones and tablets, pinned top-right from md up (narrower cards would
                  overlap the big region name). */}
              <span
                aria-hidden="true"
                style={{ animationDelay: `${GROUP_META[group].delay}s` }}
                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm motion-safe:animate-float sm:h-11 sm:w-11 sm:text-2xl md:absolute md:right-5 md:top-5 md:mb-0 md:h-14 md:w-14 md:text-3xl ${
                  selected ? 'bg-white/20 ring-1 ring-white/30' : `${GROUP_META[group].tint} ring-1 ring-white`
                }`}
              >
                {GROUP_META[group].emoji}
              </span>
              <span className={`hidden sm:block text-xs font-extrabold tracking-[0.18em] ${selected ? 'text-emerald-100' : 'text-primary'}`}>
                {GROUP_META[group].en}
              </span>
              <span className="mt-1 flex items-center gap-1 text-xl sm:text-4xl font-black tracking-tight">
                {group}
                <ChevronDown
                  aria-hidden="true"
                  className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 ${selected ? 'rotate-180' : ''}`}
                />
              </span>
              <span className={`mt-1.5 sm:mt-3 block text-[11px] sm:text-sm font-semibold ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>
                {getCitiesInGroup(group).length}개 {GROUP_META[group].unit}
              </span>
              {cases > 0 && (
                <span className={`mt-0.5 hidden sm:block whitespace-nowrap text-sm font-semibold ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>
                  실제 사례 {cases}건
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Level 2 — 시·구·군, then Level 3 — 하위 지역 · 주요 동네 */}
      {(REGION_GROUPS as Group[]).map((group) => {
        const cities = getCitiesInGroup(group);
        const groupOpen = openGroup === group;
        return (
          <Curtain key={group} id={`service-regions-group-${group}`} open={groupOpen}>
            <div className="pt-4 sm:pt-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="mb-4 sm:mb-5 flex items-baseline justify-between gap-3">
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {group} <span className="text-primary">{cities.length}개 {GROUP_META[group].unit}</span>
                  </h3>
                  <p className="text-[11px] sm:text-sm text-slate-400 break-keep text-right">지역을 누르면 주요 동네가 펼쳐져요</p>
                </div>

                <nav aria-label={`${group} ${serviceTitle}`} className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
                  {cities.map((city) => {
                    const selected = openCity === city.id;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => toggleCity(city.id)}
                        aria-expanded={selected}
                        aria-controls={`service-regions-city-${city.id}`}
                        className={`flex min-h-[3.25rem] flex-col items-start justify-center gap-1 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                          selected
                            ? 'border-primary bg-emerald-50 shadow-md'
                            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <span className={`flex w-full items-center justify-between gap-1 text-sm sm:text-[15px] font-extrabold break-keep ${selected ? 'text-primaryDark' : 'text-slate-800'}`}>
                          {city.name}
                          <ChevronDown aria-hidden="true" className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-300 ${selected ? 'rotate-180 text-primary' : ''}`} />
                        </span>
                        <CaseBadge count={cityCaseCount(city.id)} />
                      </button>
                    );
                  })}
                </nav>

                {cities.map((city) => {
                  const children = getChildRegions(city.id);
                  const hotspots = getHotspots(city.id);
                  return (
                    <Curtain key={city.id} id={`service-regions-city-${city.id}`} open={groupOpen && openCity === city.id}>
                      <div className="pt-4">
                        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <p className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-slate-900">
                              <MapPin aria-hidden="true" className="w-5 h-5 text-primary" />
                              {city.name} <span className="text-slate-400 font-bold">·</span>
                              <span className="text-primary">{serviceTitle}</span>
                            </p>
                            <Link
                              to={regionHref(city.id)}
                              className="group inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/25 transition-colors hover:bg-primaryDark sm:self-auto"
                            >
                              {city.name} 안내 보기
                              <span className="sr-only"> {serviceTitle}</span>
                              <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </div>

                          {children.length > 0 && (
                            <div className="mb-4">
                              <p className="mb-2 text-xs font-bold text-slate-500">세부 지역</p>
                              <div className="flex flex-wrap gap-2">
                                {children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={regionHref(child.id)}
                                    className="group inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-extrabold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primaryDark hover:shadow-md"
                                  >
                                    {child.name}
                                    <span className="sr-only"> {serviceTitle}</span>
                                    <CaseBadge count={caseCountByRegion.get(child.id) || 0} />
                                    <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {hotspots.length > 0 && (
                            <div>
                              <p className="mb-2 text-xs font-bold text-slate-500">주요 동네</p>
                              <div className="flex flex-wrap gap-2">
                                {hotspots.map((dong) => (
                                  <Link
                                    key={dong}
                                    to={regionHref(city.id)}
                                    aria-label={`${city.name} ${dong} ${serviceTitle} 안내`}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-primary hover:bg-emerald-50 hover:text-primaryDark"
                                  >
                                    <span aria-hidden="true" className="text-primary">#</span>
                                    {dong}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Curtain>
                  );
                })}
              </div>
            </div>
          </Curtain>
        );
      })}

      <p className="mt-6 flex items-start justify-center gap-2 text-xs text-slate-400 leading-relaxed break-keep">
        <Info className="mt-0.5 w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        서비스 상담 가능 지역 안내이며, 지역별 지점을 뜻하지 않습니다.
      </p>
    </section>
  );
}
