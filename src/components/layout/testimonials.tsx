import React, { useState, useEffect, useRef } from "react";
import { Quote, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
      "The interface is clean and the agents are genuinely useful, not just gimmicks.",
    name: "Priya Sharma",
    role: "Operations Lead",
    avatar: "https://i.pravatar.cc/150?img=26",
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
];

const PER_PAGE = 3;
const pageCount = Math.ceil(testimonials.length / PER_PAGE);

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i: number) => {
    clearInterval(timerRef.current);
    setPage(i);
  };

  const prev = () => goTo((page - 1 + pageCount) % pageCount);
  const next = () => goTo((page + 1) % pageCount);

  return (
    <section className="w-full bg-slate-50 dark:bg-[#0A0820] flex items-center justify-center px-6 pt-10 pb-40">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 text-center">
            <p className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              TESTIMONIALS
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Loved by Users Worldwide
            </h2>
          </div>
        </div>
        <div className="flex justify-end -mt-8 mb-2">
          <button className="group inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:gap-2 hover:text-indigo-700 dark:hover:text-indigo-300">
            View all reviews
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative mt-8 group/carousel">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }).map((_, pageIdx) => (
                <div
                  key={pageIdx}
                  className="grid w-full shrink-0 grid-cols-3 gap-2 sm:gap-4 md:gap-6 px-1"
                >
                  {testimonials
                    .slice(pageIdx * PER_PAGE, pageIdx * PER_PAGE + PER_PAGE)
                    .map((t) => (
                      <div
                        key={t.name}
                        className="group relative flex flex-col rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#1E1A35] p-3 sm:p-5 md:p-6 min-w-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/50"
                      >
                        <Quote
                          className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 text-indigo-200 dark:text-indigo-700 transition-colors duration-300 group-hover:text-indigo-300 dark:group-hover:text-indigo-500"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                        <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 sm:line-clamp-none sm:min-h-[4.5rem]">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="mt-3 sm:mt-6 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {t.name}
                              </p>
                              <p className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 truncate">
                                {t.role}
                              </p>
                            </div>
                          </div>

                          <div className="hidden sm:flex gap-0.5 shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 text-indigo-500"
                                fill="currentColor"
                                strokeWidth={0}
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1E1A35] border border-slate-200 dark:border-[#2E274A] shadow-sm text-slate-500 dark:text-slate-400 opacity-0 transition-all duration-300 group-hover/carousel:opacity-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1E1A35] border border-slate-200 dark:border-[#2E274A] shadow-sm text-slate-500 dark:text-slate-400 opacity-0 transition-all duration-300 group-hover/carousel:opacity-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110"
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
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                page === i
                  ? "w-6 bg-indigo-600"
                  : "w-2 bg-indigo-200 dark:bg-indigo-800 hover:bg-indigo-300 dark:hover:bg-indigo-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
