"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "MindAgent has completely transformed how I work. The content generator and data analyzer save me hours every day!",
    name: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "The AI chat assistant is incredibly smart and context-aware. It feels like having a real partner.",
    name: "Michael Chen",
    role: "Data Analyst",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    quote:
      "Best AI platform I've used so far. The document summarizer is a game changer for research!",
    name: "Emily Rodriguez",
    role: "Researcher",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "Switching to this platform cut my workload in half. The agents actually understand what I need.",
    name: "David Park",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    quote:
      "Support is fast and the AI results are shockingly accurate. It's become part of my daily routine.",
    name: "Lisa Nguyen",
    role: "Content Strategist",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    quote:
      "I was skeptical at first, but the coding agent alone has saved my team dozens of hours.",
    name: "James Carter",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    quote:
      "Our whole team relies on it now. Onboarding new agents into our workflow took minutes.",
    name: "Tom Becker",
    role: "Team Lead",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    quote:
      "It just works. Fast, accurate, and the results keep getting better over time.",
    name: "Ana Costa",
    role: "Freelance Writer",
    avatar: "https://i.pravatar.cc/150?img=39",
  },
  {
    quote:
      "The interface is clean and the agents are genuinely useful, not just gimmicks.",
    name: "Priya Sharma",
    role: "Operations Lead",
    avatar: "https://i.pravatar.cc/150?img=26",
  },
];

const PER_PAGE = 3;
const pageCount = Math.ceil(testimonials.length / PER_PAGE);

export function HomeTestimonials() {
  const [page, setPage] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => clearInterval(timerRef.current ?? undefined);
  }, []);

  const goTo = (i: number) => {
    clearInterval(timerRef.current ?? undefined);
    setPage(i);
  };

  const prev = () => goTo((page - 1 + pageCount) % pageCount);
  const next = () => goTo((page + 1) % pageCount);

  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center">
          <div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Loved by Users Worldwide
            </h2>
          </div>
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read all reviews
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }).map((_, pageIdx) => (
                <div
                  key={pageIdx}
                  className="grid w-full shrink-0 grid-cols-1 gap-5 md:grid-cols-3"
                >
                  {testimonials
                    .slice(pageIdx * PER_PAGE, pageIdx * PER_PAGE + PER_PAGE)
                    .map((t) => (
                      <div
                        key={t.name}
                        className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                      >
                        <Quote
                          className="h-6 w-6 text-primary/40"
                          fill="currentColor"
                          strokeWidth={0}
                          aria-hidden="true"
                        />
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="mt-6 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-border"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-foreground">
                                {t.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {t.role}
                              </p>
                            </div>
                          </div>

                          <div className="hidden shrink-0 gap-0.5 sm:flex" aria-label={`${t.name} rated this 5 out of 5 stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 text-primary"
                                fill="currentColor"
                                strokeWidth={0}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow controls */}
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 hidden h-10 w-10 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial page ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                page === i
                  ? "w-6 bg-primary"
                  : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}