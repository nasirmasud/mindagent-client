export function WireframeGlobe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind the sphere */}
      <circle cx="100" cy="100" r="92" fill="url(#globe-glow)" className="home-pulse-glow" />

      {/* Longitude ellipses */}
      <ellipse cx="100" cy="100" rx="52" ry="68" stroke="hsl(var(--primary))" strokeOpacity="0.45" />
      <ellipse cx="100" cy="100" rx="30" ry="68" stroke="hsl(var(--primary))" strokeOpacity="0.3" />

      {/* Latitude ellipses */}
      <ellipse cx="100" cy="100" rx="68" ry="24" stroke="hsl(var(--primary))" strokeOpacity="0.45" />
      <ellipse cx="100" cy="100" rx="68" ry="46" stroke="hsl(var(--primary))" strokeOpacity="0.3" />

      {/* Outer ring */}
      <circle cx="100" cy="100" r="68" stroke="hsl(var(--primary))" strokeOpacity="0.55" />

      {/* Connecting arcs (dashed mesh) */}
      <path
        d="M32 100 Q 66 62 100 32"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.35"
        strokeDasharray="3 5"
      />
      <path
        d="M168 100 Q 134 138 100 168"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.35"
        strokeDasharray="3 5"
      />

      {/* Network nodes */}
      <circle cx="100" cy="32" r="4" fill="hsl(var(--primary))" fillOpacity="0.9" />
      <circle cx="100" cy="168" r="4" fill="hsl(var(--primary))" fillOpacity="0.9" />
      <circle cx="168" cy="100" r="4" fill="hsl(var(--primary))" fillOpacity="0.9" />
      <circle cx="32" cy="100" r="4" fill="hsl(var(--primary))" fillOpacity="0.9" />
      <circle cx="76" cy="68" r="3" fill="hsl(var(--primary))" fillOpacity="0.7" />
      <circle cx="124" cy="132" r="3" fill="hsl(var(--primary))" fillOpacity="0.7" />
      <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" fillOpacity="1" />
    </svg>
  );
}