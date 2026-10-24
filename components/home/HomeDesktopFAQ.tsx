import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '../../lib/faqData';

// Separate state keeps desktop category choices from changing the existing
// mobile/tablet chooser when the viewport crosses the CSS breakpoint.
const HomeDesktopFAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('reservation');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const id = `home-desktop-faq-${useId()}`;
  const listId = `${id}-questions`;
  const categories = [{ category: 'all', categoryName: '전체 보기' }, ...FAQ_DATA];
  const activeLabel = categories.find(category => category.category === activeCategory)?.categoryName || '';

  return (
    <div className="home-faq-desktop">
      <div className="min-w-0">
        <nav aria-label="질문 카테고리" className="space-y-2 rounded-3xl border border-slate-200/90 bg-white/80 p-3 shadow-xs">
          {categories.map(category => {
            const selected = activeCategory === category.category;
            return (
              <button
                key={category.category}
                type="button"
                aria-pressed={selected}
                aria-controls={listId}
                onClick={() => {
                  setActiveCategory(category.category);
                  setOpenQuestion(null);
                }}
                className={`w-full rounded-2xl px-4 py-3.5 text-left text-sm font-extrabold break-keep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${selected
                  ? 'bg-linear-to-r/srgb from-[#04a875] to-[#22ba8b] text-white font-black shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'}`}
              >
                {category.categoryName}
              </button>
            );
          })}
        </nav>
        <p className="mt-5 px-3 text-slate-600 font-bold text-base leading-relaxed break-keep">
          위에서 궁금하신 카테고리를 선택하시면 질문을 확인하실 수 있어요.
        </p>
      </div>

      <div id={listId} role="region" aria-label={`${activeLabel} 질문 목록`} className="min-w-0 space-y-4">
        {FAQ_DATA.flatMap(category => category.qas.map((qa, index) => {
          const key = `${category.category}-${index}`;
          const expanded = openQuestion === key;
          const questionId = `${id}-question-${key}`;
          const answerId = `${id}-answer-${key}`;
          return (
            <div
              key={key}
              hidden={activeCategory !== 'all' && activeCategory !== category.category}
              className={`overflow-hidden rounded-3xl border bg-white transition-colors ${expanded
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/5'
                : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-md'}`}
            >
              <button
                id={questionId}
                type="button"
                aria-expanded={expanded}
                aria-controls={answerId}
                onClick={() => setOpenQuestion(expanded ? null : key)}
                className="group flex w-full items-center justify-between gap-4 p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-700"
              >
                <span className="flex min-w-0 flex-1 items-center gap-4">
                  <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black transition-colors ${expanded
                    ? 'bg-[#04a875] text-white shadow-md'
                    : 'bg-emerald-100/90 text-[#04a875]'}`}>Q</span>
                  <span className={`min-w-0 flex-1 text-[19px] font-extrabold leading-snug tracking-tight break-keep ${expanded
                    ? 'text-[#04a875]'
                    : 'text-slate-900 group-hover:text-emerald-700'}`}>{qa.q}</span>
                </span>
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform ${expanded
                  ? 'rotate-180 bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'}`}>
                  <ChevronDown className="h-5 w-5 stroke-[2.5]" />
                </span>
              </button>
              <div id={answerId} role="region" hidden={!expanded} aria-labelledby={questionId}>
                <div className="px-7 pb-7 pt-1 text-left">
                  <div className="flex items-start gap-4 rounded-2xl border border-emerald-100/80 bg-linear-to-r/srgb from-emerald-50/70 to-slate-50 p-6 shadow-inner">
                    <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white shadow-xs">A</span>
                    <div className="min-w-0 flex-1 text-slate-800 text-[17px] leading-relaxed font-semibold break-keep whitespace-pre-line">{qa.a}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};

export default HomeDesktopFAQ;
