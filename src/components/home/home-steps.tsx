import { ChevronRight, Inbox, PenLine, ScanSearch, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up in seconds - free, no card required.",
  },
  {
    number: 2,
    icon: ScanSearch,
    title: "Choose an AI Agent",
    description: "Pick the focused agent that matches your task.",
  },
  {
    number: 3,
    icon: Inbox,
    title: "Provide Your Input",
    description: "Add details, upload files, or ask a question.",
  },
  {
    number: 4,
    icon: PenLine,
    title: "Get Results Instantly",
    description: "Receive accurate AI-powered results in seconds.",
  },
];

export function HomeSteps() {
  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeader label="./get-started" title="Simple Steps to Get Started" />

        <div className="mt-14 border border-border">
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, icon: Icon, title, description }, i) => (
              <div key={number} className="relative flex h-full flex-col items-center bg-card px-5 py-8 text-center transition-colors duration-300 hover:bg-accent/40">
                {i < 3 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 -right-2.5 z-20 flex h-5 w-5 -translate-y-1/2 items-center justify-center bg-card text-primary/60",
                      i === 1 ? "hidden lg:flex" : "hidden md:flex"
                    )}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className="relative">
                  <span className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary/5 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center bg-primary font-mono text-xs font-bold text-primary-foreground">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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