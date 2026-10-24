import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface CertificateLightboxProps {
  certificate: { title: string; issuer: string; image: string };
  onClose: () => void;
}

const CertificateLightbox: React.FC<CertificateLightboxProps> = ({ certificate, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const issuerId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    // Native modal dialogs keep keyboard focus inside and make the rest of
    // the document inert. The top layer also avoids transformed ancestors.
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={issuerId}
      aria-modal="true"
      className="fixed inset-0 m-auto h-fit w-[calc(100%_-_2rem)] max-w-4xl max-h-[calc(100dvh_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-black/80"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        // Only the backdrop closes the dialog; its own scrollbar does not.
        if (event.clientX < bounds.left || event.clientX > bounds.right
          || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white p-4 sm:p-5">
        <div className="min-w-0 break-keep [overflow-wrap:anywhere]">
          <h2 id={titleId} className="text-base sm:text-xl font-bold leading-relaxed">{certificate.title}</h2>
          <p id={issuerId} className="mt-1 text-sm leading-relaxed text-slate-600">{certificate.issuer}</p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`${certificate.title} 자격증 확대보기 닫기`}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X size={18} aria-hidden="true" /> 닫기
        </button>
      </div>
      <div className="bg-slate-100 p-2 sm:p-4">
        <img
          src={certificate.image}
          alt={`${certificate.title} 자격증 원본`}
          decoding="async"
          className="mx-auto block h-auto max-w-full"
        />
      </div>
    </dialog>
  );
};

export default CertificateLightbox;
