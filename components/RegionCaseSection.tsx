import React from 'react';
import { MapPin, ClipboardList, Users2, Info } from 'lucide-react';
import SentenceText, { withDotBreaks } from './SentenceText';

interface CaseMedia {
  type?: 'image' | 'video';
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  poster?: string;
}

interface CaseStep {
  title: string;
  media: CaseMedia[];
}

interface RegionCase {
  facts: {
    location: string;
    before: string;
    process: string;
    staff: string;
  };
  steps: CaseStep[];
  note?: string;
}

interface RegionCaseSectionProps {
  regionCase: RegionCase;
  className?: string;
  headingId?: string;
  headingClassName?: string;
  footer?: React.ReactNode;
  // Steps already shown under their section text (RegionCaseDetail renders
  // them via CaseStepGroup); only the remaining steps are listed here.
  placedSteps?: ReadonlySet<number>;
}

// Captions start with a phase label ("작업 전 · …"). The label is shown as a
// badge so before/during/after reads at a glance; the " · " separator stays
// in the DOM (screen-reader only), so the caption text is unchanged.
const PHASE_STYLES: Array<[RegExp, string]> = [
  [/^작업 전/, 'bg-slate-100 text-slate-700 border-slate-300'],
  [/^작업 중/, 'bg-amber-50 text-amber-800 border-amber-300'],
  [/^(작업 후|마무리)/, 'bg-primary/10 text-primaryDark border-primary/40'],
];
const CaseCaption: React.FC<{ caption: string }> = ({ caption }) => {
  const at = caption.indexOf(' · ');
  if (at < 0) return <>{caption}</>;
  const label = caption.slice(0, at);
  const rest = caption.slice(at + 3);
  const style = PHASE_STYLES.find(([re]) => re.test(label))?.[1] ?? 'bg-gray-100 text-gray-700 border-gray-300';
  return (
    <>
      <span className={`inline-block rounded-md border px-1.5 py-0.5 mb-1 text-[12px] font-bold leading-none ${style}`}>{label}</span>
      <span className="sr-only"> · </span>
      <span className="block">{rest}</span>
    </>
  );
};

// One step's title and photos, kept together as a group. Used both inside
// this section and directly under the matching section text on the page.
export const CaseStepGroup: React.FC<{ step: CaseStep; si: number; className?: string }> = ({ step, si, className }) => (
  <div role="group" aria-labelledby={`case-step-${si + 1}`} className={className ?? 'border-t border-gray-200 pt-5'}>
    <h3 id={`case-step-${si + 1}`} className="font-bold text-slate-800 text-[17px] sm:text-lg mb-3 break-keep">{step.title}</h3>
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 gap-3">
      {step.media.map((m, mi) => (
        <figure key={mi} className="rounded-xl overflow-hidden bg-white border border-gray-200">
          {m.type === 'video' ? (
            <video
              src={m.src}
              poster={m.poster}
              width={m.width}
              height={m.height}
              aria-label={m.alt}
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full aspect-[3/4] object-cover bg-slate-900"
            />
          ) : (
            <img
              src={m.src}
              width={m.width}
              height={m.height}
              alt={m.alt}
              loading="lazy"
              className="w-full aspect-[3/4] object-cover"
            />
          )}
          <figcaption className="text-[13px] sm:text-sm leading-snug text-gray-700 px-2.5 py-2 break-keep">
            <CaseCaption caption={m.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
);

const FactLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <strong className="block text-slate-900 mb-0.5">{children}</strong>
    <span className="sr-only"> · </span>
  </>
);

// The proof block of a field-case article — facts table, step-by-step
// photos, and an honest limits note — sourced from actual crew photos and
// confirmed facts (see lib/regionCaseData.mjs). The article's own heading
// and intro live in pages/RegionCaseDetail.tsx; this only renders what
// comes after them.
const RegionCaseSection: React.FC<RegionCaseSectionProps> = ({ regionCase, className, headingId, headingClassName, footer, placedSteps }) => {
  const remainingSteps = regionCase.steps.map((step, si) => ({ step, si })).filter(({ si }) => !placedSteps?.has(si));
  return (
    <section className={className}>
      <h2
        id={headingId}
        tabIndex={headingId ? -1 : undefined}
        className={`${headingClassName ?? ''} text-xl sm:text-2xl font-bold text-slate-900 mb-5`}
      >
        현장 기록
      </h2>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-[15px] sm:text-base leading-[1.7] text-gray-700">
          <MapPin className="text-primary shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <span className="break-keep"><FactLabel>위치</FactLabel>{withDotBreaks(regionCase.facts.location)}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-[15px] sm:text-base leading-[1.7] text-gray-700">
          <ClipboardList className="text-primary shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <span className="break-keep"><FactLabel>작업 전 상태</FactLabel>{withDotBreaks(regionCase.facts.before)}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-[15px] sm:text-base leading-[1.7] text-gray-700">
          <ClipboardList className="text-primary shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <span className="break-keep"><FactLabel>작업 순서</FactLabel>{withDotBreaks(regionCase.facts.process)}</span>
        </div>
        <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-4 text-[15px] sm:text-base leading-[1.7] text-gray-700">
          <Users2 className="text-primary shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <span className="break-keep"><FactLabel>인원·시간</FactLabel>{withDotBreaks(regionCase.facts.staff)}</span>
        </div>
      </div>

      {remainingSteps.length > 0 && (
        <div className="space-y-8">
          {remainingSteps.map(({ step, si }) => (
            <CaseStepGroup key={si} step={step} si={si} />
          ))}
        </div>
      )}

      {regionCase.note && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-4 sm:p-5 mt-8 text-[15px] sm:text-base text-amber-950">
          <Info className="text-amber-600 shrink-0 mt-1" size={18} aria-hidden="true" />
          <SentenceText as="span" text={regionCase.note} className="block leading-[1.7]" />
        </div>
      )}
      {footer}
    </section>
  );
};

export default RegionCaseSection;
