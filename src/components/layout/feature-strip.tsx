import React from "react";
import { Users, Lock, Zap, UserCog } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Multi-AI Agents",
    description: "Multiple specialized AI agents for different tasks",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your data is encrypted and always private",
  },
  {
    icon: Zap,
    title: "Smart & Fast",
    description: "Get intelligent results in seconds",
  },
  {
    icon: UserCog,
    title: "Easy to Use",
    description: "Simple interface for powerful AI",
  },
];

export default function FeatureStrip() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0A0820] dark:to-[#0B0B1F] py-16 md:py-24">
      <div className="mx-auto w-full px-4 md:px-20">
        <div className="relative rounded-3xl border border-slate-200/60 dark:border-[#2E274A]/60 bg-white/70 dark:bg-[#1E1A35]/70 backdrop-blur-xl shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50 dark:divide-[#2E274A]/50">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative flex flex-col items-center p-8 md:p-10 text-center transition-all duration-500 hover:z-10"
              >
                <span className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                  <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 transition-transform duration-500 group-hover:rotate-3" strokeWidth={1.5} />
                </span>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
