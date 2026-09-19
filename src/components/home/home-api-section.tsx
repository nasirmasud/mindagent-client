"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const code = `from mindagent import Agent

agent = Agent(
  name="research-assistant",
  model="claude-3-haiku",
  tools=[
    "web-search",
    "file-parser",
    "report-builder",
  ],
)

result = agent.run(
  task="Summarize Q3 sales data",
  input="./reports/q3.csv",
)`;

function HighlightedCode() {
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
      <code>
        <span className="text-muted-foreground">from </span>
        <span className="text-primary">mindagent</span>
        <span className="text-muted-foreground"> import </span>
        <span className="text-amber-600 dark:text-amber-400">Agent</span>
        {"\n\n"}
        <span className="text-muted-foreground">agent = </span>
        <span className="text-primary">Agent</span>
        <span className="text-foreground">(</span>
        {"\n  "}
        <span className="text-muted-foreground">name=</span>
        <span className="text-emerald-600 dark:text-emerald-400">&quot;research-assistant&quot;</span>
        <span className="text-foreground">,</span>
        {"\n  "}
        <span className="text-muted-foreground">model=</span>
        <span className="text-emerald-600 dark:text-emerald-400">&quot;claude-3-haiku&quot;</span>
        <span className="text-foreground">,</span>
        {"\n  "}
        <span className="text-muted-foreground">tools=</span>
        <span className="text-foreground">[</span>
        {"\n    "}
        <span className="text-emerald-600 dark:text-emerald-400">&quot;web-search&quot;</span>
        <span className="text-foreground">,</span>
        {"\n    "}
        <span className="text-emerald-600 dark:text-emerald-400">&quot;file-parser&quot;</span>
        <span className="text-foreground">,</span>
        {"\n    "}
        <span className="text-emerald-600 dark:text-emerald-400">&quot;report-builder&quot;</span>
        <span className="text-foreground">,</span>
        {"\n  "}
        <span className="text-foreground">],</span>
        {"\n)\n\n"}
        <span className="text-muted-foreground">result = </span>
        <span className="text-primary">agent</span>
        <span className="text-foreground">.</span>
        <span className="text-primary">run</span>
        <span className="text-foreground">(</span>
        {"\n  "}
        <span className="text-muted-foreground">task=</span>
        <span className="text-emerald-600 dark:text-emerald-400">&quot;Summarize Q3 sales data&quot;</span>
        <span className="text-foreground">,</span>
        {"\n  "}
        <span className="text-muted-foreground">input=</span>
        <span className="text-emerald-600 dark:text-emerald-400">&quot;./reports/q3.csv&quot;</span>
        <span className="text-foreground">,</span>
        {"\n)"}
      </code>
    </pre>
  );
}

export function HomeApiSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="w-full px-4 md:px-20 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            New
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Developer API &amp; Webhooks
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Spin up agents programmatically, listen to events with webhooks, and
            embed MindAgent into your own products in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/about">
                View Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/login?tab=register">
                <KeyRound className="h-4 w-4" />
                Get API Key
              </Link>
            </Button>
          </div>
        </div>

        {/* Code editor mockup */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between border-b border-border bg-accent/50 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Python</span>
            <button
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy code"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <HighlightedCode />
        </div>
      </div>
    </section>
  );
}