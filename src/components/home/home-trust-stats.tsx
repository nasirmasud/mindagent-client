import { Activity, Bot, Gauge, Star } from "lucide-react";
import { GlobePulse } from "@/components/lightswind/globe-pulse";
import { SectionHeader } from "./section-header";

const pills = [
  { icon: Bot, value: "15,000+", label: "Agents deployed" },
  { icon: Activity, value: "250,000+", label: "Tasks completed" },
  { icon: Gauge, value: "99.9%", label: "Uptime" },
  { icon: Star, value: "4.0/5", label: "Avg. rating" },
];

export function HomeTrustStats() {
  return (
    <section className="w-full border-y border-border bg-card/60 dark:bg-card/40 px-4 md:px-20 py-1">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
          align="left"
          label="./metrics"
          title="Trusted by 15,000+ Users"
          description="Real teams rely on MindAgent every day to automate research, content, and data work - and the numbers keep climbing."
        />

          <div className="mt-8 flex flex-wrap gap-3">
            {pills.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-border bg-card px-5 py-3 transition-colors duration-300 hover:border-primary/50"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="font-mono text-sm font-bold text-foreground">{value}</span>
                <span className="font-mono text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full items-center justify-center">
          <GlobePulse className="mx-auto h-[576px] w-[576px] md:h-[640px] md:w-[640px]" />
        </div>
      </div>
    </section>
  );
}