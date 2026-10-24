import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { MapPin, CheckCircle2, HelpCircle, Award, ChevronDown } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { getRegion } from '../lib/regionData.mjs';
import { buildRegionServiceContent, REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import RegionWorkEvidence from '../components/RegionWorkEvidence';
import { getRegionPortfolioItems } from '../lib/regionPortfolioEvidence.mjs';
import { matchesServicePhoto } from '../lib/servicePhotoMatch.mjs';
import { getServiceBlogLinks } from '../lib/serviceBlogLinks.mjs';
import { josa } from '../lib/korean.mjs';
import ServiceBeforeAfterMarquee from '../components/ServiceBeforeAfterMarquee';
import ReviewsSection from '../components/ReviewsSection';
import CeoMessageSection from '../components/CeoMessageSection';
import PortfolioSplitCard, { PortfolioGalleryItem } from '../components/PortfolioSplitCard';
import PortfolioLightbox from '../components/PortfolioLightbox';
import ServiceCaseBlogSection from '../components/ServiceCaseBlogSection';
import portfolioManifest from '../lib/portfolioManifest.json';

const allPortfolioItems = portfolioManifest as PortfolioGalleryItem[];

const certifications = [
  { id: 1, title: '청소전문가 1급', issuer: '한국자격검정평가진흥원', image: '/images/about/cert-cleaning-expert.webp' },
  { id: 2, title: '고객상담사 1급', issuer: '한국자격검정평가진흥원', image: '/images/about/cert-customer-service.webp' },
  { id: 3, title: '환경관리전문가 1급', issuer: '한국자격검정평가진흥원', image: '/images/about/cert-environment-management.webp' },
  { id: 4, title: '방역관리사 1급', issuer: '한국방역전문인협회', image: '/images/about/cert-pest-control.webp' },
  { id: 5, title: '건물위생관리사 1급', issuer: '한국자격검정평가진흥원', image: '/images/about/cert-building-hygiene.webp' },
  { id: 6, title: '정리수납전문가 1급', issuer: '한국자격검정평가진흥원', image: '/images/about/cert-organizing-expert.webp' },
];

const RegionServiceLanding: React.FC = () => {
  const { serviceId, regionId } = useParams<{ serviceId: string; regionId: string }>();
  const { config } = useSite();
  const [openItem, setOpenItem] = useState<PortfolioGalleryItem | null>(null);

  const region = regionId ? getRegion(regionId) : null;
  const isEnabled = serviceId ? REGION_LANDING_SERVICES.includes(serviceId) : false;
  const content = region && serviceId ? buildRegionServiceContent(region, serviceId) : null;
  const service = config.services.find((s) => s.id === serviceId);
  // Keep evidence in a stable order on the server and after client navigation.
  // Related title matches are not described as confirmed local job addresses.
  const allRegionItems = useMemo(
    () => getRegionPortfolioItems(serviceId, region, allPortfolioItems),
    [region, serviceId],
  );
  // Office pages lead with office work. Local retail work remains available
  // as clearly labelled supporting experience further down the page.
  const regionItems = useMemo(() => allRegionItems.filter(item => serviceId !== 'office' || item.category === 'office'), [allRegionItems, serviceId]);
  const relatedRegionItems = useMemo(() => allRegionItems.filter(item => serviceId === 'office' && item.category !== 'office'), [allRegionItems, serviceId]);
  const otherItems = useMemo(() => {
    const shownIds = new Set(allRegionItems.map(item => item.id));
    return allPortfolioItems.filter(item => matchesServicePhoto(serviceId, item)
      && !shownIds.has(item.id) && (serviceId !== 'office' || item.category === 'office'));
  }, [allRegionItems, serviceId]);

  // Unknown routes must not silently become an indexable service page.
  if (!isEnabled || !region || !content) {
    return <NotFound />;
  }

  const cleanPhone = config.companyInfo.phone.replace(/[^0-9]/g, '');
  const hasRelatedWork = otherItems.length > 0 || relatedRegionItems.length > 0 || getServiceBlogLinks(serviceId).length > 0;
  const renderPhotos = (items: Array<PortfolioGalleryItem & { detailHref?: string | null }>) => (
    <div className={`grid items-start gap-3 sm:gap-5 ${items.length === 1 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
      {items.map(item => (
        <div key={item.id} className="min-w-0">
          <PortfolioSplitCard item={item} onClick={() => setOpenItem(item)} detailHref={item.detailHref} />
          {item.description && <p className="mt-3 text-sm leading-relaxed text-gray-600 break-keep">{item.description}</p>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full grow">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
        <Link to="/services" className="hover:text-primary">서비스</Link>
        <span>/</span>
        <Link to={`/services/${serviceId}`} className="hover:text-primary">{service?.title || content.serviceLabel}</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{region.name}</span>
      </div>

      {/* Hero */}
      <section data-section="region-intro" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <h1 className="text-3xl sm:text-4xl sm:leading-[2.5rem] font-black text-slate-900 mb-4 leading-tight text-center sm:text-left">
          {region.name} {content.serviceLabel}
        </h1>
        <p className="max-w-3xl text-gray-600 text-base sm:text-lg leading-relaxed break-keep text-center sm:text-left">
          {content.heroIntro}
        </p>
        <div className="text-center sm:text-left">
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base whitespace-nowrap shadow-lg shadow-primary/30 hover:bg-primaryDark transition-colors"
          >
            전화 상담 {config.companyInfo.phone}
          </a>
        </div>
      </section>

      <RegionWorkEvidence
        serviceId={serviceId || ''}
        regionId={regionId || ''}
        regionName={region.name}
        serviceLabel={content.serviceLabel}
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-12"
      />

      {/* Region-specific before/after proof, only when we actually have it */}
      {regionItems.length > 0 && (
        <section data-section="local-work-photos" aria-labelledby="region-work-photos-title" className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 id="region-work-photos-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
            {region.name} 관련 시공 사진
          </h2>
          <p className="text-gray-600 mb-5 leading-relaxed break-keep">
            기존 포트폴리오의 현장명과 작업 종류를 함께 확인할 수 있습니다. 사진을 누르면 크게 볼 수 있으며, 작업 기록이 있는 사진은 상세사례로 연결됩니다.
          </p>
          {renderPhotos(regionItems)}
        </section>
      )}

      {openItem && (
        <PortfolioLightbox item={openItem} onClose={() => setOpenItem(null)} />
      )}

      <section data-section="service-scope" aria-labelledby="service-scope-title" className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 id="service-scope-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
          {content.serviceLabel} 작업 범위와 일정 안내
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <h3 className="font-bold text-slate-900 mb-3">현장에서 확인할 범위</h3>
            <ul className="space-y-3">
              {content.scopeItems.map((item: string) => <li key={item} className="flex items-start gap-2 text-sm sm:text-base text-slate-700 leading-relaxed"><CheckCircle2 size={18} className="mt-1 text-primary shrink-0" /><span className="break-keep">{item}</span></li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-slate-900 mb-3">일정과 준비사항</h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-keep">{content.scheduleNote}</p>
            <a href={`tel:${cleanPhone}`} className="inline-flex min-h-11 items-center mt-3 font-bold text-sm text-primaryDark underline underline-offset-4">내 현장 작업 범위 상담하기</a>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-keep mb-5">{content.intro}</p>
        <details className="group rounded-xl border border-slate-200 bg-white">
          <summary className="flex items-center justify-between gap-3 list-none cursor-pointer min-h-12 p-4 text-sm sm:text-base font-bold text-slate-800 [&::-webkit-details-marker]:hidden">
            <span>{content.serviceLabel}{josa(content.serviceLabel, '이', '가')} 필요한 상황</span>
            <ChevronDown size={18} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
          </summary>
        <ul className="grid sm:grid-cols-2 gap-3 p-4 pt-0">
          {content.situations.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-gray-700 text-sm sm:text-base">
              <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
              <span className="break-keep">{s}</span>
            </li>
          ))}
        </ul>
        </details>
      </section>

      <ReviewsSection />

      {/* 대표 소개 — a named, accountable person, right before his credentials */}
      <CeoMessageSection />

      {/* 공인 자격 보유 — same trust badges as the homepage/service pages */}
      <section data-section="team-credentials" className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Award className="text-primary" size={22} />
          말이 아닌 자격증으로 증명합니다
        </h2>
        <p className="text-gray-500 mb-5 break-keep">대표와 전담팀이 취득한 6개 공인 자격증입니다.</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="text-center">
              <img
                src={cert.image}
                alt={`${cert.title} 자격증`}
                className="w-full aspect-square object-cover rounded-lg border border-gray-100 mb-1.5"
                loading="lazy"
              />
              <p className="text-[11px] sm:text-xs font-bold text-slate-700 truncate">{cert.title}</p>
            </div>
          ))}
        </div>
      </section>

      {hasRelatedWork && <section data-section="related-work" aria-labelledby="related-work-title" className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 id="related-work-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 break-keep">더 살펴볼 {content.serviceLabel} 시공 사례</h2>
        <p className="text-gray-600 leading-relaxed break-keep mb-6">여러 지역에서 진행한 작업과 관련 공간의 기록입니다. 각 사진과 글의 현장명·작업 종류를 확인해 주세요.</p>
        {otherItems.length > 0 && <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900">여러 지역의 {content.serviceLabel} 사진</h3>
          <ServiceBeforeAfterMarquee key={serviceId + ':' + regionId} serviceId={serviceId || ''} items={otherItems} compact />
        </div>}
        <ServiceCaseBlogSection serviceId={serviceId || ''} compact className="mb-8" />
        {relatedRegionItems.length > 0 && <div data-section="related-local-photos">
          <h3 className="text-lg font-bold text-slate-900 mb-3">{region.name} 관련 매장·백화점 청소 사진</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">사무실 외 상업공간에서 진행한 작업입니다. 사진을 누르면 크게 볼 수 있습니다.</p>
          {renderPhotos(relatedRegionItems)}
        </div>}
      </section>}

      <section data-section="service-area" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">{region.name} 출동 지역 안내</h2>
        <p className="text-gray-600 mb-4 break-keep">{region.name} 작업을 상담하실 때 주소와 공간 용도를 알려 주세요. 이동·출입 여건과 작업 범위를 확인한 뒤 방문 일정을 안내합니다.</p>
        <div className="flex flex-wrap gap-2">
          {content.dongs.map((dong) => <span key={dong} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primaryDark text-sm font-medium"><MapPin size={14} />{dong}</span>)}
        </div>
      </section>

      {/* FAQ */}
      <section data-section="service-faq" className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">자주 묻는 질문</h2>
        <div className="space-y-4">
          {content.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5 bg-white shadow-xs">
              <h3 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                <HelpCircle className="text-primary shrink-0 mt-0.5" size={18} />
                <span className="break-keep">{faq.q}</span>
              </h3>
              <p className="text-gray-600 text-base pl-6 break-keep">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section data-section="service-contact" className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-10 text-center">
          <h2 className="text-white text-sm sm:text-2xl font-bold mb-3 whitespace-nowrap">
            {region.name} {content.serviceLabel} 무료 상담 접수
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

export default RegionServiceLanding;
