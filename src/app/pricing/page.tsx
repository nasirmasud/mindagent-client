"use client";

import { useState } from "react";
import { Rocket, Box, Star, Briefcase, Check, X } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    icon: Rocket,
    tagline: "For individuals getting started with AI.",
    monthly: 0,
    yearly: 0,
    cta: "Get Started Free",
    highlighted: false,
    features: [
      { label: "3 AI Agents", included: true },
      { label: "5,000 Words / month", included: true },
      { label: "Basic AI Models", included: true },
      { label: "Community Support", included: true },
      { label: "No Custom Tools", included: false },
    ],
  },
  {
    name: "Starter",
    icon: Box,
    tagline: "For professionals who want more power.",
    monthly: 19,
    yearly: 228,
    cta: "Start Starter",
    highlighted: false,
    features: [
      { label: "15 AI Agents", included: true },
      { label: "50,000 Words / month", included: true },
      { label: "Advanced AI Models", included: true },
      { label: "Priority Support", included: true },
      { label: "Custom Tools (5)", included: true },
      { label: "Export & Share", included: true },
    ],
  },
  {
    name: "Pro",
    icon: Star,
    tagline: "For teams and power users who need more.",
    monthly: 49,
    yearly: 588,
    cta: "Get Pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { label: "Unlimited AI Agents", included: true },
      { label: "200,000 Words / month", included: true },
      { label: "All AI Models", included: true },
      { label: "Priority Support", included: true },
      { label: "Custom Tools (Unlimited)", included: true },
      { label: "Export & Share", included: true },
      { label: "API Access", included: true },
      { label: "Team Collaboration", included: true },
    ],
  },
  {
    name: "Enterprise",
    icon: Briefcase,
    tagline: "For businesses with advanced security and scale.",
    custom: true,
    monthly: 0,
    yearly: 0,
    cta: "Contact Sales",
    highlighted: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited Words", included: true },
      { label: "SLA & Dedicated Support", included: true },
      { label: "Advanced Security", included: true },
      { label: "SSO & Compliance", included: true },
      { label: "Custom Integrations", included: true },
      { label: "Onboarding & Training", included: true },
    ],
  },
];

const COMPARE_ROWS = [
  { label: "AI Agents", free: "3", starter: "15", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "Monthly Words", free: "5,000", starter: "50,000", pro: "200,000", enterprise: "Unlimited" },
  { label: "Access to All Models", free: false, starter: true, pro: true, enterprise: true },
  { label: "Custom Tools", free: false, starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "API Access", free: false, starter: false, pro: true, enterprise: true },
  { label: "Team Collaboration", free: false, starter: false, pro: true, enterprise: true },
  { label: "Support", free: "Community", starter: "Priority", pro: "Priority", enterprise: "Dedicated" },
];

function CompareCell({ value }: { value: boolean | string | number }) {
  if (value === true) return <Check className="w-4 h-4 text-indigo-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-slate-600 mx-auto" />;
  return <span className="text-slate-300 text-sm">{value}</span>;
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="bg-slate-950 text-white py-20 px-4 md:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
            <Star className="w-3 h-3" />
            PRICING PLAN
          </span>
        </div>

        <h2 className="text-center text-4xl md:text-5xl font-bold leading-tight mb-4">
          Simple, Transparent Pricing
          <br />
          for{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Every Need
          </span>
        </h2>
        <p className="text-center text-slate-400 max-w-xl mx-auto mb-10">
          Choose the perfect plan to power your productivity with AI agents.
          Upgrade, downgrade, or cancel anytime.
        </p>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-slate-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-12 h-6 rounded-full bg-indigo-600 transition-colors"
            aria-label="Toggle yearly billing"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                yearly ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-white" : "text-slate-500"}`}>
            Yearly
          </span>
          <span className="bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-slate-900 rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-indigo-500"
                    : "border-slate-800"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  {plan.custom ? (
                    <div className="text-3xl font-bold">Custom</div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          ${yearly ? Math.round(plan.yearly / 12) : plan.monthly}
                        </span>
                        <span className="text-slate-500 text-sm">/month</span>
                      </div>
                      {yearly && plan.yearly > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          Billed yearly ${plan.yearly}
                        </p>
                      )}
                    </>
                  )}
                  {plan.custom && (
                    <p className="text-xs text-slate-500 mt-1">Tailored pricing</p>
                  )}
                </div>

                <button
                  className={`w-full py-2.5 rounded-lg font-medium text-sm mb-6 transition-colors ${
                    plan.highlighted
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : plan.custom
                      ? "border border-indigo-700 text-white hover:bg-indigo-950"
                      : "border border-slate-700 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={f.included ? "text-slate-300" : "text-slate-600"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-14">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-semibold text-lg">Compare Plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left font-medium text-slate-400 px-5 py-3">Feature</th>
                  <th className="font-medium text-slate-400 px-5 py-3">Free</th>
                  <th className="font-medium text-slate-400 px-5 py-3">Starter</th>
                  <th className="font-medium text-slate-400 px-5 py-3">Pro</th>
                  <th className="font-medium text-slate-400 px-5 py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i !== COMPARE_ROWS.length - 1 ? "border-b border-slate-800/60" : ""}
                  >
                    <td className="px-5 py-3 text-slate-300">{row.label}</td>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.free} /></td>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.starter} /></td>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.pro} /></td>
                    <td className="px-5 py-3 text-center"><CompareCell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-800 rounded-2xl px-8 py-6">
          <div className="flex items-center gap-4">
            <img src="/favicon.ico" alt="MindAgent" className="h-14 w-14 object-contain shrink-0" />
            <div>
              <p className="font-semibold">Still not sure which plan is right for you?</p>
              <p className="text-sm text-slate-400">
                Try MindAgent free for 7 days. No credit card required.
              </p>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
