"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { glowCard, glowCardTopGlow, primaryActionButton } from "@/components/shared/brand-styles";
import { PriceCardShell, usePriceCardHover } from "@/components/shared/price-card-shell";

const PLANS = [
  {
    name: "Free",
    price: 0,
    yearly: 0,
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
    yearly: 115.2,
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
    yearly: 470.4,
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

const COMPARE_ROWS = [
  { label: "AI Agents", free: "3", pro: "Unlimited", business: "Unlimited" },
  { label: "Monthly Words", free: "5,000", pro: "200,000", business: "Unlimited" },
  { label: "Access to All Models", free: false, pro: true, business: true },
  { label: "API Access", free: false, pro: true, business: true },
  { label: "SSO & Compliance", free: false, pro: false, business: true },
  { label: "Support", free: "Community", pro: "Priority", business: "Dedicated" },
];

function CompareCell({ value }: { value: boolean | string | number }) {
  if (value === true)
    return (
      <>
        <Check className="w-4 h-4 text-primary mx-auto" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <X className="w-4 h-4 text-muted-foreground/80 mx-auto" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="text-sm text-foreground">{value}</span>;
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const { shellProps } = usePriceCardHover();

  return (
    <section className="text-foreground py-20 px-4 md:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-center text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          Simple, Transparent Pricing
          <br />
          for{" "}
          <span className="bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] bg-clip-text text-transparent">
            Every Need
          </span>
        </h1>
        <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Choose the perfect plan to power your productivity with AI agents.
          Start free, upgrade anytime.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm font-medium", !yearly ? "text-foreground" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-12 h-6 rounded-full bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly billing to save 20%"
          >
            <span
              className={cn(
                "absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                yearly ? "translate-x-6" : "translate-x-0"
              )}
            />
          </button>
          <span className={cn("text-sm font-medium", yearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly
          </span>
          <span className="bg-accent border border-border text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-sm">
            Save 20%
          </span>
        </div>

        {/* Plan cards */}
        <div className="mt-14 grid gap-6 mb-12 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => (
            <PriceCardShell
              key={plan.name}
              {...shellProps(plan.name, plan.highlighted)}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-sm bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  ${yearly ? (plan.yearly > 0 ? (plan.yearly / 12).toFixed(2) : plan.price) : plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {yearly && plan.yearly > 0 ? `Billed yearly $${Math.round(plan.yearly)}` : "\u00A0"}
              </p>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className="mt-8 w-full gap-2"
              >
                <Link href={plan.href}>
                  {plan.cta}
                  {plan.highlighted && <ArrowRight className="h-4 w-4" />}
                </Link>
              </Button>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden="true" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </PriceCardShell>
          ))}
        </div>

        {/* Compare table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-14">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-lg">Compare Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Feature comparison across Free, Pro and Business plans</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="text-left font-medium text-muted-foreground px-5 py-3">Feature</th>
                  <th scope="col" className="font-medium text-muted-foreground px-5 py-3">Free</th>
                  <th scope="col" className="font-semibold text-primary bg-accent/50 px-5 py-3">Pro</th>
                  <th scope="col" className="font-medium text-muted-foreground px-5 py-3">Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i !== COMPARE_ROWS.length - 1 ? "border-b border-border/60" : ""}
                  >
                    <th scope="row" className="px-5 py-3 text-left font-normal text-foreground">{row.label}</th>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.free} /></td>
                    <td className="px-5 py-3 text-center bg-accent/40"><CompareCell value={row.pro} /></td>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.business} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`w-full px-6 py-10 ${glowCard}`}>
          <div aria-hidden="true" className={glowCardTopGlow} />
          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <p className="font-semibold text-lg text-foreground">
                Still not sure which plan is right for you?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start free, upgrade anytime. No credit card required.
              </p>
            </div>
            <Link href="/login?tab=register" className={cn(primaryActionButton, "whitespace-nowrap")}>
              Get Started Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}