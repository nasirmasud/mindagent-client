import { ArrowRight, Bot, ShieldCheck, ShieldHalf } from "lucide-react";

const badges = [
  {
    name: "SOC 2",
    detail: "Type II certified",
    className: "bg-[#E5F2FF] text-[#0B6BCB]",
  },
  {
    name: "ISO 27001",
    detail: "Information security",
    className: "bg-[#E8F3FF] text-[#1F6FEB]",
  },
  {
    name: "GDPR",
    detail: "Data protection",
    className: "bg-[#E4F5EF] text-[#0F9D6E]",
  },
];

const flow = [
  { icon: ShieldCheck, label: "Compliant" },
  { icon: ShieldHalf, label: "Security" },
  { icon: Bot, label: "Site Agents" },
];

export function HomeSecurity() {
  return (
    <section className="w-full border-y border-border bg-card/40 px-4 md:px-20 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Security
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Enterprise Security &amp; Compliance
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Your data is encrypted in transit and at rest, audited by third
            parties, and governed by strict access controls — so you stay
            compliant while you ship.
          </p>

          {/* Compliance badges */}
          <div className="mt-8 flex flex-wrap gap-5">
            {badges.map((b) => (
              <div key={b.name} className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-background text-center text-2xl font-bold shadow-lg ${b.className}`}
                >
                  {b.name.split(" ")[0]}
                </span>
                <span className="text-xs text-muted-foreground">{b.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flow diagram */}
        <div>
          <div className="flex flex-col items-stretch gap-3">
            {flow.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-foreground">{label}</span>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}