import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: 0,
    tagline: "For individuals getting started with AI.",
    cta: "Get Started",
    href: "/login?tab=register&plan=free",
    highlighted: false,
    features: [
      "3 AI agents",
      "5,000 words / month",
      "Basic AI models",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 12,
    tagline: "For power users who need speed and scale.",
    cta: "Upgrade to Pro",
    href: "/login?tab=register&plan=pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited AI agents",
      "200,000 words / month",
      "All AI models",
      "Priority support",
      "API access",
    ],
  },
  {
    name: "Business",
    price: 49,
    tagline: "For teams with advanced security and scale.",
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Unlimited words",
      "SSO & compliance",
      "Dedicated support",
    ],
  },
];

export function HomePricing() {
  return (
    <section className="w-full px-4 md:px-20 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel
            anytime.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8",
                plan.highlighted
                  ? "border-primary shadow-2xl shadow-primary/20 lg:-my-3 lg:p-10"
                  : "border-border"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={cn("mt-8 w-full gap-2", plan.highlighted && "")}
              >
                <Link href={plan.href}>
                  {plan.cta}
                  {plan.highlighted && <ArrowRight className="h-4 w-4" />}
                </Link>
              </Button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}