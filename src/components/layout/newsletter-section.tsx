"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

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
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        .float-orb { animation: floatSlow 6s ease-in-out infinite; }
        .float-orb-delay { animation: floatSlow 8s ease-in-out infinite; animation-delay: 1.5s; }
      `}</style>

      <section className="w-full dark:bg-[#0A0820]">
        <div className="newsletter-card relative overflow-hidden px-8 sm:px-14 py-14 text-center dark:[background:radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.08),transparent_45%),linear-gradient(135deg,#2a1f8e_0%,#4f3fd6_55%,#7c3aed_100%)]" style={{
              background: "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.14), transparent 45%), linear-gradient(135deg, #4f3fd6 0%, #6c4ee6 55%, #8b5cf6 100%)",
            }}>
            <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl float-orb" />
            <div className="pointer-events-none absolute -bottom-14 -right-10 w-52 h-52 rounded-full bg-white/10 blur-2xl float-orb-delay" />
            <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 rounded-full bg-white/5 blur-xl hidden sm:block" />

            <img src="/favicon.ico" alt="MindAgent" className="mx-auto block w-16 h-16 mb-6" />

            <span className="relative inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/90 bg-white/10 border border-white/20 px-3 py-1 rounded-full uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Newsletter
            </span>

            <h2 className="relative text-3xl sm:text-4xl font-bold text-white leading-tight">
              Stay Ahead with AI
            </h2>
            <p className="relative mt-3 text-white/80 text-base sm:text-lg max-w-xl mx-auto">
              Get the latest AI news, product updates, and productivity tips — delivered straight to your inbox, once a week.
            </p>

            <form onSubmit={handleSubmit} className="relative mt-8 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="nl-input w-full h-12 pl-11 pr-4 rounded-xl bg-white/90 text-slate-800 placeholder:text-slate-400 text-sm sm:text-base outline-none transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.35)] focus:bg-white dark:bg-white/95 dark:text-slate-900 dark:focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="nl-btn flex-shrink-0 h-12 px-6 rounded-xl bg-slate-900 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.98]"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5" />
                </button>
              </div>

              <div
                className={`mt-4 flex items-center justify-center gap-2 text-sm text-white/95 transition-all duration-300 ${
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
                  className="w-4 h-4"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>You&apos;re subscribed — welcome aboard!</span>
              </div>
            </form>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="nl-pill inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full transition-all duration-250 hover:bg-white/20 hover:-translate-y-0.5">
                <Users className="w-3.5 h-3.5" />
                15,000+ subscribers
              </span>
              <span className="nl-pill inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full transition-all duration-250 hover:bg-white/20 hover:-translate-y-0.5">
                <Calendar className="w-3.5 h-3.5" />
                One email a week
              </span>
              <span className="nl-pill inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full transition-all duration-250 hover:bg-white/20 hover:-translate-y-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                No spam, unsubscribe anytime
              </span>
            </div>
        </div>
      </section>
    </>
  );
}
