import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, MapPin, Info } from 'lucide-react';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { REGION_GROUPS, getCitiesInGroup, getChildRegions, getHotspots } from '../lib/regionHierarchy.mjs';
// Headings/thumbnails/URLs only — generated from lib/regionCaseData.mjs by
// scripts/generate-region-case-index.mjs to keep the article text out of this page.
import regionCaseIndex from '../lib/regionCaseIndex.json';

type RegionCaseIndexItem = { serviceId: string; regionId: string; heading: string; thumbnail: string; url: string };
const REGION_CASE_INDEX = regionCaseIndex as RegionCaseIndexItem[];

type Group = '서울' | '인천' | '경기';

// tile: soft pastel gradient behind each 권역's icon on an unselected card.
const GROUP_META: Record<Group, { en: string; unit: string; tile: string }> = {
  서울: { en: 'SEOUL', unit: '구', tile: 'from-rose-50 to-pink-100' },
  인천: { en: 'INCHEON', unit: '구·군', tile: 'from-sky-50 to-sky-100' },
  경기: { en: 'GYEONGGI', unit: '시·군', tile: 'from-amber-50 to-orange-100' },
};

// Small flat 2D illustrations of each 권역's best-known landmark — rounded
// shapes, a few soft colors, no outlines:
// 서울 = N서울타워 on 남산, 인천 = a plane over a cloud (인천국제공항),
// 경기 = 수원화성 팔달문 (tiled roof, red pillars, stone wall, arched gate).
// The cloud is white on the sky-blue tile and turns sky blue once the card is
// selected (the tile turns white there).
const GroupIcon: React.FC<{ group: Group; selected?: boolean; className?: string }> = ({ group, selected = false, className }) => (
  <svg viewBox="0 0 48 48" className={className}>
    {group === '서울' && (
      <>
        <circle cx="39" cy="10" r="3.5" fill="#fde68a" />
        <path d="M2 46c5-10 13-14 22-14s17 4 22 14z" fill="#86efac" />
        <path d="M10 46c4-6 9-8.5 14-8.5S34 40 38 46z" fill="#4ade80" />
        <path d="M21.5 20h5l2.2 17h-9.4z" fill="#f8fafc" />
        <path d="M24 20h2.5l2.2 17H24z" fill="#e2e8f0" />
        <rect x="23" y="3" width="2" height="7" rx="1" fill="#f43f5e" />
        <rect x="15.5" y="9.5" width="17" height="10.5" rx="5.25" fill="#fb7185" />
        <rect x="18" y="13" width="12" height="3" rx="1.5" fill="#fff" fillOpacity="0.9" />
      </>
    )}
    {group === '인천' && (
      <>
        <path d="M7 40a6 6 0 0 1 5.5-6 8.5 8.5 0 0 1 16-1.5A5.5 5.5 0 0 1 34 40z" fill={selected ? "#bae6fd" : "#fff"} />
        <g transform="rotate(-28 25 19)">
          <path d="M22 17 29 6h4.5l-3.2 11z" fill="#7dd3fc" />
          <path d="M11 17.5 8 11h3.5l5 6.5z" fill="#7dd3fc" />
          <rect x="8" y="16" width="34" height="8" rx="4" fill="#0ea5e9" />
          <path d="M22 23 29 34h4.5l-3.2-11z" fill="#38bdf8" />
          <circle cx="31" cy="20" r="1.2" fill="#fff" />
          <circle cx="34.5" cy="20" r="1.2" fill="#fff" />
          <circle cx="38" cy="20" r="1.2" fill="#fff" />
        </g>
      </>
    )}
    {group === '경기' && (
      <>
        <rect x="7" y="28" width="34" height="16" rx="3" fill="#fcd9a8" />
        <path d="M7 34h34M7 39h34M15 28v6M24 28v6M33 28v6M11 34v5M20 34v5M29 34v5M37 34v5" stroke="#f5b971" strokeWidth="1" />
        <path d="M18.5 44v-6.5a5.5 5.5 0 0 1 11 0V44z" fill="#92400e" />
        <rect x="12" y="20" width="24" height="8" fill="#fef3c7" />
        <rect x="13" y="20" width="3" height="8" fill="#ef4444" />
        <rect x="32" y="20" width="3" height="8" fill="#ef4444" />
        <rect x="22.5" y="20" width="3" height="8" fill="#ef4444" />
        <path d="M3 21c5 0 10-3.5 14-8h14c4 4.5 9 8 14 8v1.5H3z" fill="#334155" />
        <path d="M15 13c2-3.5 5.5-5.5 9-5.5s7 2 9 5.5z" fill="#475569" />
      </>
    )}
  </svg>
);

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

export default function ServiceRegions({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  // Hooks run before the early return: this component stays mounted when the
  // route's serviceId changes, so the hook count must not depend on it.
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const [openCity, setOpenCity] = useState<string | null>(null);
  if (!REGION_LANDING_SERVICES.includes(serviceId)) return null;

  const regionHref = (regionId: string) => `/services/${serviceId}/${regionId}`;
  const serviceCases = REGION_CASE_INDEX.filter((item) => item.serviceId === serviceId);

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
        <h2 id="service-regions-title" className="text-2xl sm:text-4xl sm:leading-[2.5rem] font-black text-slate-900 tracking-tight leading-snug break-keep">
          지역별 <span className="text-primary">{serviceTitle}</span> 안내
        </h2>
        <p className="text-sm sm:text-base sm:leading-[1.5rem] text-slate-500 leading-relaxed mt-3 break-keep">
          권역을 누르고, 시·구를 고르면 주요 동네까지 차례로 펼쳐집니다.
        </p>
      </div>

      {/* Level 1 — 권역 */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
        {(REGION_GROUPS as Group[]).map((group) => {
          const selected = openGroup === group;
          return (
            <button
              key={group}
              type="button"
              onClick={() => toggleGroup(group)}
              aria-expanded={selected}
              aria-controls={`service-regions-group-${group}`}
              className={`group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl sm:rounded-3xl px-2 py-4 text-center transition-all duration-300 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:flex-row md:gap-5 md:px-5 md:py-5 md:text-left ${
                selected
                  ? 'bg-linear-to-br/srgb from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-900/20 -translate-y-1'
                  : 'bg-white text-slate-900 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg hover:border-primary/40'
              }`}
            >
              {/* Icon tile + English label as one unit on the left, name and
                  counts on the right, the pair centered in the card. Stacked
                  and centered below md, where the card is too narrow for a row. */}
              <span className="flex shrink-0 flex-col items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl ring-1 transition-all duration-300 group-hover:scale-105 ${
                    selected ? 'bg-white ring-white/60 shadow-md' : `bg-linear-to-br/srgb ${GROUP_META[group].tile} ring-white shadow-xs`
                  }`}
                >
                  <GroupIcon group={group} selected={selected} className="h-8 w-8 sm:h-10 sm:w-10" />
                </span>
                <span className={`hidden sm:block text-[10px] font-extrabold tracking-[0.18em] ${selected ? 'text-emerald-100' : 'text-primary'}`}>
                  {GROUP_META[group].en}
                </span>
              </span>
              <span className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1 text-xl sm:text-3xl sm:leading-[2.5rem] md:text-4xl md:leading-[2.5rem] font-black tracking-tight leading-none">
                  {group}
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 ${selected ? 'rotate-180' : ''}`}
                  />
                </span>
                <span className={`mt-1.5 sm:mt-2.5 block whitespace-nowrap text-[11px] sm:text-sm font-semibold ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>
                  {getCitiesInGroup(group).length}개 {GROUP_META[group].unit}
                </span>
              </span>
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
                        className={`flex min-h-13 flex-col items-start justify-center gap-1 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-primary ${
                          selected
                            ? 'border-primary bg-emerald-50 shadow-md'
                            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <span className={`flex w-full items-center justify-between gap-1 text-sm sm:text-[15px] font-extrabold break-keep ${selected ? 'text-primaryDark' : 'text-slate-800'}`}>
                          {city.name}
                          <ChevronDown aria-hidden="true" className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-300 ${selected ? 'rotate-180 text-primary' : ''}`} />
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {cities.map((city) => {
                  const children = getChildRegions(city.id);
                  const hotspots = getHotspots(city.id);
                  // This service's field cases in the city and its sub-areas.
                  const cases = serviceCases.filter(
                    (item) => item.regionId === city.id || children.some((child) => child.id === item.regionId)
                  );
                  const regionName = (regionId: string) => children.find((child) => child.id === regionId)?.name ?? city.name;
                  return (
                    <Curtain key={city.id} id={`service-regions-city-${city.id}`} open={groupOpen && openCity === city.id}>
                      <div className="pt-4">
                        <div className="rounded-2xl border border-emerald-100 bg-linear-to-br/srgb from-emerald-50/80 to-white p-4 sm:p-6">
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

                          {cases.length > 0 && (
                            <div className="mb-5">
                              <p className="mb-2 text-xs font-bold text-slate-500">실제 현장 사례</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                                {cases.map((item) => (
                                  <Link
                                    key={item.url}
                                    to={item.url}
                                    className="group flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-2.5 pr-3 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                                  >
                                    <span className="h-16 w-20 sm:h-18 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                      <img
                                        src={item.thumbnail}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      {item.regionId !== city.id && (
                                        <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-primaryDark">
                                          {regionName(item.regionId)}
                                        </span>
                                      )}
                                      <span className="block text-[13px] sm:text-sm sm:leading-[1.25rem] font-extrabold leading-snug text-slate-800 line-clamp-2 break-keep group-hover:text-primaryDark">
                                        {item.heading}
                                      </span>
                                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary">
                                        사례 보기
                                        <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                      </span>
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {children.length > 0 && (
                            <div className="mb-4">
                              <p className="mb-2 text-xs font-bold text-slate-500">세부 지역</p>
                              <div className="flex flex-wrap gap-2">
                                {children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={regionHref(child.id)}
                                    className="group inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm font-extrabold text-slate-800 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primaryDark hover:shadow-md"
                                  >
                                    {child.name}
                                    <span className="sr-only"> {serviceTitle}</span>
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
