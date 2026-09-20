"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Terminal } from "lucide-react";

const LOG_POOL = [
  { level: "INFO", text: "research-agent - started task #4821 (web-search)" },
  { level: "OK", text: "research-agent - scraped 12 sources in 1.2s" },
  { level: "INFO", text: "data-analyzer - parsing reports/q3.csv (2,431 rows)" },
  { level: "OK", text: "image-analyst - detected chart type: line" },
  { level: "WARN", text: "content-agent - retrying model call after timeout" },
  { level: "OK", text: "content-agent - generated 4 draft variants" },
  { level: "INFO", text: "coding-agent - reviewed pull request #118" },
  { level: "OK", text: "data-analyzer - insights saved (3 trends, 2 risks)" },
  { level: "INFO", text: "smart-assistant - summarizing 12 inbox threads" },
  { level: "OK", text: "keyword-agent - cluster ready · 18 terms" },
];

const VISIBLE_LINES = 11;
const INTERVAL_MS = 1600;
const LINE_STEP_MS = 1500;

function levelClass(level: string) {
  if (level === "OK") return "text-emerald-500 dark:text-emerald-400";
  if (level === "WARN") return "text-amber-500 dark:text-amber-400";
  return "text-primary";
}

export function HomeActivityStream() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(1);
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const live = tick > 0;
  const line = live ? (tick - 1) % LOG_POOL.length : 0;
  const now = live ? Date.now() : 0;

  const visible = Array.from({ length: VISIBLE_LINES }, (_, i) => {
    const poolIndex =
      (line - (VISIBLE_LINES - 1 - i) + LOG_POOL.length * 2) % LOG_POOL.length;
    const log = LOG_POOL[poolIndex];
    const time = live
      ? new Date(now - (VISIBLE_LINES - 1 - i) * LINE_STEP_MS).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : "--:--:--";
    return { key: `${poolIndex}-${i}`, time, level: log.level, text: log.text };
  });

  return (
    <section className="w-full border-y border-border bg-card/40 px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center">
          <div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Live Agent Activity Stream
            </h2>
          </div>
          <button className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            View all logs
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>

        {/* Terminal card */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between border-b border-border bg-accent/50 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              mindagent agent logs
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              live
            </span>
          </div>

          <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
            {visible.map((log) => (
              <p key={log.key} className="flex flex-wrap gap-x-2 whitespace-nowrap text-muted-foreground">
                <span className="text-muted-foreground/60">{log.time}</span>
                <span className={`font-semibold ${levelClass(log.level)}`}>[{log.level}]</span>
                <span className="truncate">{log.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}