const stats = [
  { label: "agents", value: "06" },
  { label: "avg. response", value: "1.8s" },
  { label: "uptime", value: "99.8%" },
  { label: "users", value: "150+" },
];

export function HomeStatsStrip() {
  return (
    <section className="w-full border-y border-border bg-card/60 dark:bg-card/40 px-4 md:px-20 py-14 md:py-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-border">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-4 text-center md:px-6 md:text-left"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}