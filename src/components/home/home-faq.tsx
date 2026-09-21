"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type Faq = { q: string; a: string };

const faqTabs: { label: string; items: Faq[] }[] = [
  {
    label: "General",
    items: [
      {
        q: "What is MindAgent?",
        a: "MindAgent is a platform of specialized AI agents for content generation, data analysis, image understanding, research, coding, and everyday assistance - each scoped to a single job.",
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
        a: "Yes - the Developer API and webhooks let you create agents, run tasks, and listen to events from your own applications.",
      },
      {
        q: "Which AI models do you use, and can I choose my provider? ⚠",
        a: "MindAgent works with several leading AI models. You can pick your preferred AI provider in Settings, and it applies to all agents and tools. Free plans include basic models, while Pro and Business include all models.",
      },
      {
        q: "What is the maximum file size I can upload?",
        a: "Data files (CSV, XLSX, JSON) can be up to 10MB, and images (JPG, PNG, WEBP) can be up to 15MB.",
      },
      {
        q: "Can I use MindAgent with my team?",
        a: "Yes. The Business plan is built for teams, with SSO, advanced security, and dedicated support. Contact our sales team to set it up.",
      },
    ],
  },
  {
    label: "Pricing",
    items: [
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. You can upgrade, downgrade, or cancel at any time from your account. Changes apply from your next billing cycle, and you keep access until then.",
      },
      {
        q: "What happens when I reach my monthly word limit? ⚠",
        a: "New generations pause until your limit resets next month, or you can upgrade to Pro for 200,000 words per month. Everything you have already created stays saved.",
      },
      {
        q: "Do you offer refunds? ⚠",
        a: "If you are not happy, contact us within [7] days of your first payment and we will review your request. See our Refund Policy for the full details.",
      },
      {
        q: "Is there a discount for yearly billing?",
        a: "Yes. Choose Yearly on the pricing page to save 20% compared with paying monthly.",
      },
    ],
  },
  {
    label: "Data & Security",
    items: [
      {
        q: "Can I delete my data and account?",
        a: "Yes. You can delete your account and all its data at any time from Settings. Deletion is permanent and cannot be undone.",
      },
      {
        q: "How is my data protected? ⚠",
        a: "Your data is encrypted in transit and at rest, and access is controlled by roles. We never sell your data.",
      },
      {
        q: "How do I get help?",
        a: "Visit the Help Center or send us a message on the Contact page. Pro users get priority support, and Business users get a dedicated contact.",
      },
    ],
  },
];

export function HomeFaq() {
  const [activeTab, setActiveTab] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const tab = faqTabs[activeTab];

  const selectTab = (index: number) => {
    setActiveTab(index);
    setOpenIndex(0);
  };

  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeader label="./help" title="Frequently Asked Questions" />

        <div className="mt-10 flex justify-center gap-1 border border-border bg-card p-1">
          {faqTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => selectTab(i)}
              className={cn(
                "flex-1 whitespace-nowrap px-4 py-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === activeTab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 divide-y divide-border border border-border bg-card">
          {tab.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${activeTab}-${i}`}
                    id={`faq-trigger-${activeTab}-${i}`}
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
                  id={`faq-panel-${activeTab}-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${activeTab}-${i}`}
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

        <div className="mt-8 border border-border bg-card p-6 text-center">
          <MessageCircleQuestion className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <p className="mt-3 text-base font-semibold text-foreground">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}