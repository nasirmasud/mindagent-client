"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="w-full px-4 md:px-20 py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-primary/30 bg-card px-6 py-12 text-center shadow-[0_0_80px_-20px_rgba(124,92,255,0.45)] sm:px-12 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] max-w-full -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />

        <h2 className="relative text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Stay Ahead with AI
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Get the latest AI news, product updates, and productivity tips -
          delivered straight to your inbox, once a week.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-8 mx-auto max-w-md">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Mail className="h-4 w-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all duration-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/25 sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 active:scale-[0.98]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform duration-250" aria-hidden="true" />
            </button>
          </div>

          <div
            className={`mt-4 flex items-center justify-center gap-2 text-sm text-primary transition-all duration-300 ${
              subscribed ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>You&apos;re subscribed - welcome aboard!</span>
          </div>
        </form>
      </div>
    </section>
  );
}