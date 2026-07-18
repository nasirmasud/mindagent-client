import React from "react";
import { UserPlus, ScanSearch, Inbox, PenLine, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up in seconds and get access to all features.",
  },
  {
    number: 2,
    icon: ScanSearch,
    title: "Choose an AI Agent",
    description: "Pick the right agent for your task or goal.",
  },
  {
    number: 3,
    icon: Inbox,
    title: "Provide Your Input",
    description: "Add details, upload files, or ask questions.",
  },
  {
    number: 4,
    icon: PenLine,
    title: "Get Results Instantly",
    description: "Receive accurate, AI-powered results in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-slate-50 dark:bg-[#0A0820] flex items-center justify-center px-6 pt-10 pb-40">
      <div className="w-full max-w-6xl">
        {/* Eyebrow */}
        <p className="text-center text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
          HOW IT WORKS
        </p>

        {/* Heading */}
        <h2 className="mt-2 text-center text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Simple Steps to Get Started
        </h2>

        {/* Steps row */}
        <div className="mt-10 flex items-stretch gap-2 md:gap-4">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <React.Fragment key={number}>
              <div className="group relative flex-1 min-w-0 rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#1E1A35] p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/50">
                {/* Step number badge */}
                <div className="absolute -top-3 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-110">
                  {number}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 transition-all duration-300 ease-out group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:scale-110 group-hover:rotate-6">
                  <Icon
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform duration-300"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="mt-4 text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-snug">
                  {description}
                </p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center shrink-0 text-slate-300 dark:text-slate-600">
                  <ArrowRight className="h-5 w-5" strokeWidth={2} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
