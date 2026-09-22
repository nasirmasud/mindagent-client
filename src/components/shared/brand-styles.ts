import { cn } from "@/lib/utils";

export const glowCard =
  "relative overflow-hidden rounded-lg border border-primary/30 bg-card shadow-[0_0_80px_-20px_rgba(124,92,255,0.45)]";

export const glowCardTopGlow =
  "pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] max-w-full -translate-x-1/2 rounded-full bg-primary/20 blur-3xl";

export const primaryActionButton =
  "flex-shrink-0 h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 active:scale-[0.98]";

export function priceCardGlow(strong: boolean): string {
  return cn(
    "pointer-events-none absolute left-1/2 -top-16 h-32 w-72 max-w-full -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100",
    strong ? "bg-primary/25 opacity-70" : "bg-primary/10 opacity-35"
  );
}