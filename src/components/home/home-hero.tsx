"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Inbox, KeyRound, Lightbulb, Search, Workflow } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroDotGrid } from "@/components/home/home-hero-dots";
import { waitForSignal } from "@/lib/load-signals";

const agents = [
  { icon: Search, color: "bg-primary/15 text-primary", name: "Research Agent", status: "scraping 12 sources" },
  { icon: Workflow, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", name: "Data Alignment", status: "mapping 4 schemas" },
  { icon: Lightbulb, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400", name: "Content Ideas", status: "generating 4 drafts" },
  { icon: KeyRound, color: "bg-sky-500/15 text-sky-600 dark:text-sky-400", name: "Keyword Cluster", status: "ready · 18 terms" },
  { icon: Inbox, color: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400", name: "Priority Inbox", status: "summarized 12 emails" },
];

export function HomeHero() {
  const [revealRows, setRevealRows] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void waitForSignal("home-loadout").then(() => {
      if (!cancelled) setRevealRows(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
<section
      className="relative w-full overflow-hidden px-4 md:px-20 py-24 md:py-36"
    >
      <HeroDotGrid />

      {/* Ambient violet glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/80">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            status: 15,000+ users active
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Agents that read, write and reason -{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              on your terms.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            MindAgent puts a fleet of specialized AI agents at your fingertips -
            summarize documents, analyze data, generate content, and automate
            busywork. Build the workflow you want, not the one you&apos;re given.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/login?tab=register">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Read the docs</Link>
            </Button>
          </div>
        </div>

        {/* Product / status card mockup */}
        <div className="relative mx-auto w-full max-w-md">
          {/* Halo behind the card */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-90 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-2xl shadow-primary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Agent activity</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Live
              </span>
            </div>

            <ul className={`mt-3 space-y-1.5${revealRows ? " rows-animating" : ""}`}>
              {agents.map(({ icon: Icon, color, name, status }) => (
                <li
                  key={name}
                  className="agent-row flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-accent/60"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{status}</span>
                  </span>
                  <Check className="agent-check h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-accent/50 px-3 py-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                120 tasks processed today
              </span>
              <span className="text-xs font-semibold text-primary">+18% vs yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}