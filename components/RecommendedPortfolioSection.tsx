import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioItem } from '../types';
import { selectRecommendedPortfolio } from '../lib/recommendedPortfolio.mjs';

interface RecommendedPortfolioSectionProps {
  serviceId?: string;
}

const RecommendedPortfolioSection: React.FC<RecommendedPortfolioSectionProps> = ({ serviceId }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setVisibleCount(6);
    import('../lib/portfolioPublic')
      .then(({ getPublicPortfolioItems }) => getPublicPortfolioItems())
      .then(records => { if (!cancelled) setItems(records); })
      .catch(() => {
        // Existing static galleries and blog feeds remain usable if Firestore
        // is offline; avoid displaying an empty recommendation section.
        if (!cancelled) setItems([]);
      });
    return () => { cancelled = true; };
  }, [serviceId]);

  const recommendations = selectRecommendedPortfolio(items, serviceId);
  if (!recommendations.length) return null;

  return (
    <section id="recommended-portfolio" aria-labelledby="recommended-portfolio-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-6 md:mb-8">
        <h2 id="recommended-portfolio-title" className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">추천 시공 사례</h2>
        <p className="mt-3 text-sm md:text-base text-slate-600 break-keep">{serviceId ? '이 서비스와 관련된 현장 기록을 확인해 보세요.' : '느티울이 직접 선정한 현장 기록을 확인해 보세요.'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {recommendations.slice(0, visibleCount).map(item => (
          <a key={item.id} href={item.afterImage} target="_blank" rel="noopener noreferrer" className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-primary/50 hover:shadow-md transition-all focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <div className="aspect-video overflow-hidden bg-slate-100">
              <img src={item.beforeImage || '/images/logo.webp'} alt={item.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={event => {
                const image = event.currentTarget;
                if (image.dataset.fallbackApplied) return;
                image.dataset.fallbackApplied = 'true';
                image.src = '/images/logo.webp';
              }} />
            </div>
            <div className="flex grow flex-col p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-bold text-primaryDark">{item.category}</span>
                {item.date && <span className="text-slate-500">{item.date}</span>}
              </div>
              <h3 className="mt-3 font-bold text-lg text-slate-900 break-keep line-clamp-2">{item.title}</h3>
              {item.description && <p className="mt-2 mb-4 text-sm text-slate-600 leading-relaxed line-clamp-3 break-words">{item.description}</p>}
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primaryDark">현장 일지 보기 <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(새 창)</span></span>
            </div>
          </a>
        ))}
      </div>
      {visibleCount < recommendations.length && (
        <div className="mt-7 text-center">
          <button type="button" onClick={() => setVisibleCount(count => count + 6)} className="rounded-full border border-primary/30 bg-white px-6 py-3 font-bold text-primaryDark hover:bg-primary/10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">추천 시공 사례 더 보기</button>
        </div>
      )}
    </section>
  );
};

export default RecommendedPortfolioSection;
