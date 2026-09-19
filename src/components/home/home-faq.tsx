"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is MindAgent?",
    a: "MindAgent is a platform of specialized AI agents for content generation, data analysis, image understanding, research, coding, and everyday assistance — each scoped to a single job.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan is free forever and never asks for a card. You can upgrade to Pro or Business whenever you need more capacity.",
  },
  {
    q: "Which file types can the Data Analyzer handle?",
    a: "It accepts CSV, Excel (.xlsx), and JSON files up to a few MB. It parses the data, sends a statistical summary to the AI, and returns insights, trends, risks, and KPIs with charts.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Data is encrypted in transit and at rest. MindAgent is SOC 2 Type II and ISO 27001 aligned, and GDPR compliant for EU users.",
  },
  {
    q: "Can I use MindAgent programmatically?",
    a: "Yes — the Developer API and webhooks let you create agents, run tasks, and listen to events from your own applications.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full border-t border-border px-4 md:px-20 py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                        open && "rotate-180 text-primary"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}