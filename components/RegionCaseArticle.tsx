import React from 'react';

interface ArticleMedia {
  type?: 'image' | 'video';
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  poster?: string;
}

interface ArticleCase {
  sections: { heading: string; body: string; stepIndexes?: number[] }[];
  steps: { title: string; media: ArticleMedia[] }[];
  note: string;
}

// Opt-in narrative layout. Cases without section-step links keep the legacy proof block.
const RegionCaseArticle: React.FC<{ regionCase: ArticleCase }> = ({ regionCase }) => (
  <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
    {regionCase.sections.map((section, index) => (
      <div key={index} data-case-narrative={index}>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{section.heading}</h2>
        {section.stepIndexes?.map((stepIndex, groupIndex) => {
          const step = regionCase.steps[stepIndex];
          return (
            <div key={stepIndex} data-case-step={stepIndex} className="mb-4">
              {groupIndex > 0 && <h3 className="font-bold text-slate-800 mb-3">{step.title}</h3>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {step.media.map((media) => (
                  <figure key={media.src} className="rounded-xl overflow-hidden bg-gray-100">
                    {media.type === 'video' ? (
                      <video src={media.src} poster={media.poster} width={media.width} height={media.height}
                        aria-label={media.alt} controls muted playsInline preload="metadata"
                        className="w-full aspect-[3/4] object-cover bg-slate-900" />
                    ) : (
                      <img src={media.src} width={media.width} height={media.height} alt={media.alt}
                        loading="lazy" className="w-full aspect-[3/4] object-cover" />
                    )}
                    <figcaption className="text-[11px] sm:text-xs text-gray-500 px-2 py-1.5 break-keep">
                      {media.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          );
        })}
        <p className="text-gray-600 leading-relaxed break-keep">{section.body}</p>
      </div>
    ))}
    <p className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm sm:text-base text-amber-900 break-keep">
      {regionCase.note}
    </p>
  </section>
);

export default RegionCaseArticle;
