"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PriceCardShell, usePriceCardHover } from "@/components/shared/price-card-shell";
import { SectionLabel } from "./section-label";

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
  const { shellProps } = usePriceCardHover();

  return (
    <section className="w-full border-y border-border bg-card/60 dark:bg-card/40 px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <SectionLabel path="./pricing" />
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
            <PriceCardShell
              key={plan.name}
              {...shellProps(plan.name, plan.highlighted)}
              className="rounded-none"
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 font-mono text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold tracking-tight text-foreground">
                  ${plan.price}
                </span>
                <span className="font-mono text-sm text-muted-foreground">/month</span>
              </div>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={cn("mt-8 w-full gap-2 rounded-none", plan.highlighted && "")}
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
            </PriceCardShell>
          ))}
        </div>
      </div>
    </section>
  );
}