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
    <section className="w-full bg-slate-50 dark:bg-[#0A0820] flex items-center justify-center px-6 py-40">
      <div className="w-full max-w-6xl rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-white/80 dark:bg-[#1E1A35]/80 backdrop-blur-sm p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-slate-200 dark:divide-[#2E274A]">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`group flex items-start gap-2 sm:gap-4 px-2 sm:px-6 ${
                i === 0 ? "pl-0" : ""
              } ${i === features.length - 1 ? "pr-0" : ""} ${
                i % 2 === 0 ? "md:pl-0" : ""
              } transition-transform duration-300 ease-out hover:-translate-y-1`}
            >
              <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 transition-all duration-300 ease-out group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:scale-110 group-hover:rotate-6">
                <Icon
                  className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400 transition-transform duration-300"
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {title}
                </h3>
                <p className="mt-1 text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 leading-snug hidden sm:block">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
