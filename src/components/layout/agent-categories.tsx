import React from "react";
import {
  Sparkles,
  Code2,
  Search,
  Paintbrush,
  Megaphone,
  BarChart3,
  Bot,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    icon: Sparkles,
    title: "Writing",
    description: "Create compelling content, blogs, articles, and more.",
  },
  {
    icon: Code2,
    title: "Coding",
    description: "Generate, review and debug code in any language.",
  },
  {
    icon: Search,
    title: "Research",
    description: "Find insights, analyze data, and discover accurate information.",
  },
  {
    icon: Paintbrush,
    title: "Design",
    description: "Create stunning visuals, UI designs, and prototypes.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Craft marketing copies, strategies, and campaigns.",
  },
  {
    icon: BarChart3,
    title: "Data Analysis",
    description: "Analyze data, build reports, and uncover actionable insights.",
  },
];

export default function AgentCategories() {
  return (
    <section className="min-h-screen w-full bg-slate-50 dark:bg-[#0A0820] py-20 px-6">
      <div className="mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition-transform duration-300 hover:scale-105">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            FEATURED AGENT CATEGORIES
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-center text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Find an agent for any kind of work
        </h2>

        {/* Subheading */}
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-500 dark:text-slate-400">
          Explore specialized AI agents designed to help you write, analyze,
          research, and create — faster than ever.
        </p>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#1E1A35] p-8 shadow-sm dark:shadow-[#120E26]/50 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 transition-all duration-300 ease-out group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:scale-110 group-hover:rotate-6">
                <Icon
                  className="h-7 w-7 text-indigo-600 dark:text-indigo-400 transition-transform duration-300"
                  strokeWidth={2}
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>

              <button className="mt-5 inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:gap-2.5 hover:text-indigo-700 dark:hover:text-indigo-300">
                Explore agents
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-40 mx-auto w-2/3 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#1E1A35] p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/50">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 transition-transform duration-300 hover:scale-105 hover:-rotate-3">
              <Bot className="h-7 w-7 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Can't find what you need?
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Describe your task and let AI find the perfect agent for you.
              </p>
            </div>
          </div>

          <button className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-indigo-600 dark:border-indigo-400 px-5 py-2.5 font-semibold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white hover:scale-105 hover:shadow-md active:scale-95">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            Find for me
          </button>
        </div>
      </div>
    </section>
  );
}
