import { Inbox, PenLine, ScanSearch, UserPlus } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up in seconds — free, no card required.",
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
    <section className="w-full px-4 md:px-20 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple Steps to Get Started
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div key={number} className="relative">
              {/* Dashed connector between step cards on large screens */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -right-4 top-7 hidden w-8 border-t-2 border-dashed border-border lg:block"
                />
              )}

              <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/5 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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