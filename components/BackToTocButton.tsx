import React from 'react';
import { ArrowUpToLine } from 'lucide-react';

interface BackToTocButtonProps {
  tocId: string;
  // The TOC link to focus after jumping back, so keyboard users land on the
  // list and can pick another entry right away.
  fromId: string;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Round icon button placed at the end of each TOC-linked part of a case
// article. It returns to the in-page contents list (not the page top).
const BackToTocButton: React.FC<BackToTocButtonProps> = ({ tocId, fromId }) => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const toc = document.getElementById(tocId);
    if (!toc) return;
    e.preventDefault();
    toc.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    const link = toc.querySelector<HTMLAnchorElement>(`a[href="#${fromId}"]`) ?? toc.querySelector('a');
    link?.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${tocId}`);
  };

  return (
    <div className="flex justify-center sm:justify-end mt-6">
      <a
        href={`#${tocId}`}
        onClick={onClick}
        aria-label="상단 메뉴로 이동"
        title="상단 메뉴로 이동"
        className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-primary border border-primary/30 shadow-md shadow-primary/15 transition-colors hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowUpToLine size={20} aria-hidden="true" className="anim-toc-back" />
      </a>
    </div>
  );
};

export default BackToTocButton;
