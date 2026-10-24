import React, { useEffect, useRef, useState } from 'react';

const CertificateZoomIcon: React.FC = () => {
  const iconRef = useRef<SVGSVGElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(icon);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={iconRef} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"
      data-seen={seen ? 'true' : undefined}
      className="certificate-zoom-icon h-[14px] w-[14px] min-[360px]:size-5 sm:size-7 shrink-0">
      <path d="m20 20 7 7" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
      <path d="m22 21 5 5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <circle cx="13" cy="13" r="9" fill="#d1fae5" stroke="#059669" strokeWidth="2.5" />
      <path d="M7.5 10a6 6 0 0 1 5-3" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 9.5v7M9.5 13h7" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

export default CertificateZoomIcon;
