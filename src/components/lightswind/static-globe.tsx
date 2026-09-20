interface StaticGlobeProps {
  className?: string;
}

export function StaticGlobe({ className }: StaticGlobeProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="img"
      aria-label="A stylized purple globe placeholder"
    >
      <defs>
        <radialGradient id="static-globe-grad" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="45%" stopColor="#6C4CF1" />
          <stop offset="100%" stopColor="#2a1a66" />
        </radialGradient>
        <radialGradient
          id="static-globe-glow"
          cx="50%"
          cy="50%"
          r="55%"
        >
          <stop offset="55%" stopColor="#B79CFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#B79CFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="100" cy="100" r="98" fill="url(#static-globe-glow)" />

      {/* Graticule (longitudes + latitudes) behind sphere at low opacity */}
      <g stroke="#B79CFF" strokeWidth="1" opacity="0.35" fill="none">
        <ellipse cx="100" cy="100" rx="78" ry="18" />
        <ellipse cx="100" cy="100" rx="78" ry="30" />
        <ellipse cx="100" cy="100" rx="78" ry="42" />
        <line x1="22" y1="100" x2="178" y2="100" />
        <ellipse cx="100" cy="100" rx="18" ry="78" />
        <ellipse cx="100" cy="100" rx="36" ry="78" />
        <ellipse cx="100" cy="100" rx="54" ry="78" />
        <ellipse cx="100" cy="100" rx="70" ry="78" />
      </g>

      {/* Sphere body */}
      <circle cx="100" cy="100" r="78" fill="url(#static-globe-grad)" />

      {/* Graticule drawn over the sphere face */}
      <g stroke="#B79CFF" strokeWidth="1" opacity="0.5" fill="none">
        <ellipse cx="100" cy="100" rx="78" ry="18" />
        <ellipse cx="100" cy="100" rx="78" ry="30" />
        <ellipse cx="100" cy="100" rx="78" ry="42" />
        <line x1="22" y1="100" x2="178" y2="100" />
        <ellipse cx="100" cy="100" rx="18" ry="78" />
        <ellipse cx="100" cy="100" rx="36" ry="78" />
        <ellipse cx="100" cy="100" rx="54" ry="78" />
        <ellipse cx="100" cy="100" rx="70" ry="78" />
      </g>

      {/* Specular highlight */}
      <circle cx="74" cy="70" r="34" fill="#ffffff" opacity="0.14" />
      <circle cx="66" cy="60" r="12" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}