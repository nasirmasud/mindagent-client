"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    q: "What is MindAgent and how does it work?",
    a: "MindAgent is an all-in-one AI productivity platform. It gives you a team of specialized AI agents — for content, data, research, and more — that understand your input and deliver accurate results in seconds, all from one simple interface.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Every document, chat, and dataset you upload is encrypted in transit and at rest. We never sell or share your data, and you can permanently delete your information from your account at any time.",
  },
  {
    q: "Which AI agents are included in my plan?",
    a: "Every plan includes access to Content Creator, Data Analyst, Research Assistant, and Image Creator. Higher tiers unlock priority processing, higher usage limits, and early access to new agents as they launch.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your account settings — no long-term contracts, and no cancellation fees.",
  },
  {
    q: "Do I need any technical skills to use MindAgent?",
    a: "None at all. MindAgent is built for everyone — just choose an agent, describe what you need in plain language, and get results. No coding or prompt-writing experience required.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! You can create a free account and try our core agents with no credit card required. Upgrade whenever you need higher limits or premium agents.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-blob { animation: floatSlow 7s ease-in-out infinite; }
      `}</style>

      <section className="relative w-full py-24 px-6 overflow-hidden bg-white dark:bg-[#0A0820]">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-100 dark:bg-indigo-900/20 opacity-60 blur-3xl float-blob" />
        <div
          className="pointer-events-none absolute bottom-0 -right-32 w-[28rem] h-[28rem] rounded-full bg-purple-100 dark:bg-purple-900/20 opacity-60 blur-3xl float-blob"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full uppercase">
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              FAQ
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Questions? We&apos;ve Got{" "}
              <span className="text-indigo-600">Answers</span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-base">
              Everything you need to know about MindAgent before you get started.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border bg-white dark:bg-[#1E1A35] px-6 py-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  openIndex === i
                    ? "border-indigo-300 dark:border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : "border-slate-200 dark:border-[#2E274A] hover:border-indigo-200 dark:hover:border-indigo-500/30"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === i
                        ? "bg-indigo-600 rotate-180"
                        : "bg-indigo-50 dark:bg-indigo-900/30"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 ${
                        openIndex === i
                          ? "text-white"
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: openIndex === i ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pt-3 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Still have questions?{" "}
              <a
                href="/contact"
                className="text-indigo-600 font-semibold hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
