import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { useSite } from '../context/SiteContext';
import { getRegion } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getRegionCase, getRegionCases } from '../lib/regionCaseData.mjs';
import RegionCaseSection from '../components/RegionCaseSection';
import SentenceText from '../components/SentenceText';
import BackToTocButton, { prefersReducedMotion } from '../components/BackToTocButton';
import { HelpCircle, ListOrdered, ArrowDown } from 'lucide-react';

// A single real field-case article, at /services/:serviceId/:regionId/:caseId —
// its own indexable page, separate from the region+service landing page
// (pages/RegionServiceLanding.tsx), which only links out to these.
const RegionCaseDetail: React.FC = () => {
  const { serviceId, regionId, caseId } = useParams<{ serviceId: string; regionId: string; caseId: string }>();
  const { config } = useSite();

  const region = regionId ? getRegion(regionId) : null;
  const isEnabled = serviceId ? REGION_LANDING_SERVICES.includes(serviceId) : false;
  const service = config.services.find((s) => s.id === serviceId);
  const regionCase = serviceId && regionId && caseId ? getRegionCase(serviceId, regionId, caseId) : null;
  const otherCases = serviceId && regionId
    ? getRegionCases(serviceId, regionId).filter((c) => c.slug !== regionCase?.slug)
    : [];

  if (!isEnabled || !region || !regionCase) {
    return <NotFound />;
  }

  const cleanPhone = config.companyInfo.phone.replace(/[^0-9]/g, '');

  // In-page table of contents — every entry points at a heading that is
  // already on the page, so nothing is hidden or reordered.
  const toc = [
    ...regionCase.sections.map((s, i) => ({ id: `case-section-${i + 1}`, label: s.heading })),
    { id: 'case-record', label: '현장 기록' },
    { id: 'case-faq', label: '자주 묻는 질문' },
  ];
  // Headings carry tabIndex={-1} so focus can follow the jump: keyboard
  // users continue reading (and tabbing) from the section they picked.
  const jumpTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${id}`);
  };
  // Clears the sticky navbar (≈97px) when a heading is scrolled into view.
  const anchorClass = 'scroll-mt-28 focus:outline-none';

  return (
    <div className="w-full flex-grow">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
        <Link to="/services" className="hover:text-primary">서비스</Link>
        <span>/</span>
        <Link to={`/services/${serviceId}`} className="hover:text-primary">{service?.title || serviceId}</Link>
        <span>/</span>
        <Link to={`/services/${serviceId}/${regionId}`} className="hover:text-primary">{region.name}</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{regionCase.heading}</span>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-5 leading-snug break-keep max-w-2xl">
          {regionCase.heading}
        </h1>
        <SentenceText
          text={regionCase.intro}
          className="text-gray-700 text-[17px] sm:text-lg leading-[1.8] max-w-2xl"
        />
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base whitespace-nowrap shadow-lg shadow-primary/30 hover:bg-primaryDark transition-colors"
        >
          전화 상담 {config.companyInfo.phone}
        </a>
      </section>

      {/* Table of contents */}
      <nav id="case-toc" aria-labelledby="case-toc-title" className="max-w-5xl mx-auto px-4 sm:px-6 py-4 scroll-mt-28">
        <div className="max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
          <p id="case-toc-title" className="flex items-center gap-2 text-base font-bold text-slate-800 mb-3">
            <ListOrdered className="text-primary" size={18} aria-hidden="true" />
            목차
          </p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {toc.map((t, i) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  onClick={(e) => jumpTo(e, t.id)}
                  className="group flex items-center gap-3 min-h-[3rem] h-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[15px] sm:text-base text-slate-800 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 break-keep leading-snug">{t.label}</span>
                  <ArrowDown size={16} aria-hidden="true" className="text-primary shrink-0" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* What was actually done, in prose — grounded in regionCase.facts */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="max-w-2xl space-y-10">
          {regionCase.sections.map((s, i) => (
            <div key={i}>
              <h2
                id={`case-section-${i + 1}`}
                tabIndex={-1}
                className={`${anchorClass} text-xl sm:text-2xl font-bold text-slate-900 mb-3 break-keep`}
              >
                {s.heading}
              </h2>
              <SentenceText text={s.body} className="text-gray-700 text-[17px] sm:text-lg leading-[1.8]" />
              <BackToTocButton tocId="case-toc" fromId={`case-section-${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <RegionCaseSection
        regionCase={regionCase}
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-6"
        headingId="case-record"
        headingClassName={anchorClass}
        footer={<BackToTocButton tocId="case-toc" fromId="case-record" />}
      />

      {/* This case's FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <h2 id="case-faq" tabIndex={-1} className={`${anchorClass} text-xl sm:text-2xl font-bold text-slate-900 mb-5`}>자주 묻는 질문</h2>
        <div className="space-y-4 max-w-2xl">
          {regionCase.faq.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
              <h3 className="font-bold text-slate-800 text-[17px] sm:text-lg mb-2 flex items-start gap-2">
                <HelpCircle className="text-primary shrink-0 mt-1" size={18} aria-hidden="true" />
                <span className="break-keep">{faq.q}</span>
              </h3>
              <SentenceText text={faq.a} className="text-gray-700 text-base sm:text-[17px] leading-[1.75] pl-6" />
            </div>
          ))}
          <BackToTocButton tocId="case-toc" fromId="case-faq" />
        </div>
      </section>

      {/* Other cases in the same region+service */}
      {otherCases.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">{region.name}의 다른 현장 사례</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherCases.map((c) => (
              <Link
                key={c.slug}
                to={`/services/${serviceId}/${regionId}/${c.slug}`}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-3"
              >
                <img
                  src={c.thumbnail}
                  alt={c.heading}
                  loading="lazy"
                  className="w-24 h-24 object-cover rounded-xl shrink-0"
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
      )}

      {/* Back to the region+service landing page */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <Link
          to={`/services/${serviceId}/${regionId}`}
          className="text-primary font-bold hover:underline"
        >
          ← {region.name} {service?.title} 전체 안내 보기
        </Link>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-10 text-center">
          <h2 className="text-white text-base sm:text-2xl font-bold mb-3 break-keep">
            {region.name} {service?.title} 무료 상담 접수
          </h2>
          <p className="text-gray-300 mb-6 break-keep">
            현장 상황을 알려 주시면 필요한 작업 범위부터 무료로 안내해 드립니다.
          </p>
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-lg whitespace-nowrap shadow-lg shadow-primary/30 hover:bg-primaryDark transition-colors"
          >
            전화 상담 {config.companyInfo.phone}
          </a>
        </div>
      </section>
    </div>
  );
};

export default RegionCaseDetail;
