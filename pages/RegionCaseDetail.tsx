import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import { useSite } from '../context/SiteContext';
import { getRegion } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getRegionCase, getRegionCases } from '../lib/regionCaseData.mjs';
import RegionCaseSection from '../components/RegionCaseSection';
import { HelpCircle } from 'lucide-react';

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
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
          {regionCase.heading}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed break-keep">{regionCase.lead}</p>
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base whitespace-nowrap shadow-lg shadow-primary/30 hover:bg-primaryDark transition-colors"
        >
          전화 상담 {config.companyInfo.phone}
        </a>
      </section>

      <RegionCaseSection regionCase={regionCase} showHeading={false} className="max-w-5xl mx-auto px-4 sm:px-6 py-6" />

      {/* This case's FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">자주 묻는 질문</h2>
        <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
            <HelpCircle className="text-primary shrink-0 mt-0.5" size={18} />
            <span className="break-keep">{regionCase.faq.q}</span>
          </h3>
          <p className="text-gray-600 text-base pl-6 break-keep">{regionCase.faq.a}</p>
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
          <h2 className="text-white text-sm sm:text-2xl font-bold mb-3 whitespace-nowrap">
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
