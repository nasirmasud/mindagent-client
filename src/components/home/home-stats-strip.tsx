const stats = [
  { label: "agents", value: "06" },
  { label: "avg. response", value: "1.8s" },
  { label: "uptime", value: "99.8%" },
  { label: "users", value: "150+" },
];

export function HomeStatsStrip() {
  return (
    <section className='relative w-full overflow-hidden border-y border-border bg-card/60 px-4 py-10 dark:bg-card/40 md:px-12 md:py-16'>
      {/* soft background glow */}
      <div className='pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-40 max-w-4xl -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl' />

      <div className='relative mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-12 md:grid-cols-4'>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className='group relative px-6 text-center md:px-10'
          >
            {/* Divider. Painted with an inline gradient rather than a
                `bg-gradient-to-b` + `via-*` pair: those resolve their colour stops
                through CSS custom properties that inherit from the theme, and the
                result was too faint to read in both themes. A literal rgba() stop and
                an indigo glow are independent of the theme, so the line renders the
                same on light and dark. */}
            {i > 0 && (
              <span
                aria-hidden='true'
                className='absolute left-0 top-1/2 hidden h-28 w-[2px] -translate-y-1/2 md:block'
                style={{
                  backgroundImage:
                    'linear-gradient(to bottom, transparent, rgba(129,140,248,0.9), transparent)',
                  boxShadow: '0 0 10px 2px rgba(129,140,248,0.35)',
                }}
              />
            )}

            <p className='flex items-center justify-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground md:text-sm'>
              <span className='h-1.5 w-1.5 bg-indigo-500' />
              {s.label}
            </p>

            <p className='mt-4 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text font-mono text-5xl font-bold tracking-tight text-transparent transition-transform duration-300 group-hover:scale-105 md:text-7xl'>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
