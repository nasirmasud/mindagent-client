"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { glowCard, glowCardTopGlow, primaryActionButton } from "@/components/shared/brand-styles";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { SectionHeader } from "@/components/home/section-header";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await api("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-40">
      <div className={`relative mx-auto w-full max-w-3xl px-6 py-12 text-center sm:px-12 sm:py-14 ${cn(glowCard, "rounded-none")}`}>
        <div aria-hidden="true" className={glowCardTopGlow} />

        <SectionHeader
          label="./subscribe"
          title="Stay Ahead with AI"
          description="Get the latest AI news, product updates, and productivity tips - delivered straight to your inbox, once a week."
          titleClassName="text-2xl sm:text-3xl"
        />

        {subscribed ? (
          <div className="relative mt-8 flex items-center justify-center gap-2 text-sm text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>You&apos;re subscribed - welcome aboard!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative mt-8 mx-auto max-w-md">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <Mail className="h-4 w-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 rounded-none border border-border bg-background/50 text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all duration-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/25 sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className={`${primaryActionButton} rounded-none disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Subscribing
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform duration-[250ms]" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}