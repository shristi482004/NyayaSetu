import React from 'react';

/**
 * NyayaSetu Official Brand Logo
 * Renders the uploaded official NyayaSetu logo asset from /images/
 * Preserves the 3:1 natural aspect ratio with responsive scaling.
 */
export const NyayaSetuLogo = ({ variant = 'dark', size = 'default', className = '' }) => {
  const isLight = variant === 'light';

  // Responsive height presets that maintain the 3:1 aspect ratio without stretching
  const sizeClasses = {
    sm: 'h-8 sm:h-9 w-auto',
    default: 'h-10 sm:h-11 w-auto',
    navbar: 'h-11 sm:h-12 md:h-14 w-auto',
    lg: 'h-12 sm:h-14 w-auto',
    xl: 'h-16 sm:h-20 w-auto',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.default;
  const logoSrc = isLight ? '/images/logo-light.png' : '/images/logo-transparent.png';

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <img
        src={logoSrc}
        alt="NyayaSetu Logo"
        className={`${selectedSize} object-contain aspect-[3/1] select-none transition-opacity duration-200`}
        loading="eager"
        onError={(e) => {
          // Fallback to default uploaded logo.png if variant fails
          e.currentTarget.src = '/images/logo.png';
        }}
      />
    </div>
  );
};

/**
 * Minimalist Restrained Arrow Badge (↗)
 */
export const ArrowUpRightBadge = ({ className = 'w-4 h-4' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-white/20 text-current transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`}
  >
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3"
    >
      <line x1="4" y1="12" x2="12" y2="4" />
      <polyline points="5 4 12 4 12 11" />
    </svg>
  </span>
);

/**
 * Hairline Geometric Wireframe Glyphs for Trust Cards
 */
export const GeometricWireframe = ({ type = 'traceability', className = 'w-5 h-5' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {type === 'traceability' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-full h-full">
          <circle cx="12" cy="12" r="9" strokeDasharray="2 2" opacity="0.6" />
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )}

      {type === 'privacy' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-full h-full">
          <path d="M12 3L4 6.5v6c0 5 3.5 9 8 10.5 4.5-1.5 8-5.5 8-10.5v-6L12 3z" />
          <rect x="9.5" y="10" width="5" height="4" rx="1" stroke="currentColor" />
          <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
        </svg>
      )}

      {type === 'clarity' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-full h-full">
          <rect x="3" y="4" width="7" height="6" rx="1" />
          <rect x="14" y="14" width="7" height="6" rx="1" />
          <path d="M10 7h2a2 2 0 0 1 2 2v5" />
          <polyline points="12 12 14 14 16 12" />
        </svg>
      )}
    </div>
  );
};
