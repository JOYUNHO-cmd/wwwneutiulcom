import React, { useEffect, useId, useRef, useState } from 'react';

const CertificateZoomIcon: React.FC = () => {
  const iconRef = useRef<SVGSVGElement>(null);
  const [seen, setSeen] = useState(false);
  const gradientId = useId();

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
    <svg ref={iconRef} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false"
      data-seen={seen ? 'true' : undefined}
      className="certificate-zoom-icon size-9 sm:size-12 shrink-0">
      <defs>
        <linearGradient id={`${gradientId}-frame`} x1="12" y1="8" x2="43" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ee7b7" />
          <stop offset="0.45" stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id={`${gradientId}-glass`} x1="17" y1="12" x2="38" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ecfdf5" />
          <stop offset="1" stopColor="#a7f3d0" />
        </linearGradient>
      </defs>
      <path d="m39 39 15 15" stroke="#064e3b" strokeWidth="13" strokeLinecap="round" />
      <path d="m39 38 15 15" stroke={`url(#${gradientId}-frame)`} strokeWidth="10" strokeLinecap="round" />
      <path d="m43 40 10 10" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="26" r="20" fill="#065f46" />
      <circle cx="26" cy="25" r="19" fill={`url(#${gradientId}-frame)`} />
      <circle cx="26" cy="25" r="14.5" fill={`url(#${gradientId}-glass)`} stroke="#047857" strokeWidth="1.2" />
      <path d="M15.5 21a11 11 0 0 1 8-6.5" stroke="white" strokeOpacity="0.9" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 20v10M21 25h10" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};

export default CertificateZoomIcon;
