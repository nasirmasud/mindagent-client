import { FileText, KeyRound, Lock, ShieldHalf } from "lucide-react";

const features = [
  { name: "AES-256", detail: "Encryption at rest" },
  { name: "TLS 1.3", detail: "Encryption in transit" },
  { name: "RBAC", detail: "Role-based access" },
];

const cards = [
  {
    icon: Lock,
    title: "Encryption",
    description: "AES-256 at rest, TLS in transit.",
  },
  {
    icon: KeyRound,
    title: "Access control",
    description: "Fine-grained roles and permissions.",
  },
  {
    icon: FileText,
    title: "Audit logs",
    description: "Track every agent action.",
  },
  {
    icon: ShieldHalf,
    title: "Data privacy",
    description: "Multi-tenant isolation and SSO.",
  },
];

export function HomeSecurity() {
  return (
    <section className="w-full border-y border-border bg-card/40 px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Enterprise Security &amp; Compliance
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Your data is encrypted in transit and at rest, audited by third
            parties, and governed by strict access controls - so you stay
            compliant while you ship.
          </p>

          {/* Security features */}
          <div className="mt-8 flex flex-wrap gap-5">
            {features.map((f) => (
              <div key={f.name} className="flex flex-col items-center gap-2">
                <span className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-center text-xl font-bold text-foreground shadow-lg sm:text-2xl">
                  {f.name}
                </span>
                <span className="text-xs text-muted-foreground">{f.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security features grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}