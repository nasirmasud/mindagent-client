"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

function retriggerReveal(swiper: SwiperType) {
  const slide = swiper.slides[swiper.activeIndex];
  if (!slide) return;
  const els = slide.querySelectorAll<HTMLElement>(".reveal");
  els.forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
}

export function HeroSwiper() {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const prev = document.getElementById("heroPrev");
    const next = document.getElementById("heroNext");
    const onPrev = () => swiperRef.current?.slidePrev();
    const onNext = () => swiperRef.current?.slideNext();
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);
    return () => {
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
    };
  }, []);

  return (
    <div className="w-full relative min-h-[660px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        speed={700}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onInit={retriggerReveal}
        onSlideChangeTransitionStart={retriggerReveal}
        onSwiper={(s) => { swiperRef.current = s; }}
        className="hero-swiper"
      >
        {/* SLIDE 1 */}
        <SwiperSlide>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8F7FD] to-[#EFEBFA] dark:from-[#120E26] dark:to-[#1A1533] px-6 sm:px-10 lg:px-16 py-14 lg:py-20 pb-[60px]">
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* LEFT */}
              <div className="max-w-xl">
                <div className="reveal reveal-1 inline-flex items-center gap-2 rounded-full bg-[var(--violet-100)] text-[var(--violet-700)] text-sm font-semibold pl-3 pr-4 py-1.5 mb-7">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="2.3"/></svg>
                  Your All-in-One AI Productivity Platform
                </div>

                <h1 className="reveal reveal-2 text-[2.6rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[var(--ink)]">
                  Work Smarter.<br />
                  Create Faster.<br />
                  <span className="bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] bg-clip-text text-transparent">Achieve More.</span>
                </h1>

                <p className="reveal reveal-3 mt-6 text-lg text-[var(--sub)] leading-relaxed">
                  MindAgent brings powerful AI agents together in one platform to help you write, analyze, research, and automate your tasks effortlessly.
                </p>

                <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-4">
                  <Link href="/explore" className="hero-btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] text-white font-semibold px-6 py-3.5 shadow-lg shadow-violet-500/25">
                    Get Started Free
                    <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </Link>
                  <Link href="/ai-chat" className="hero-btn-secondary inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#1E1A35] text-[var(--ink)] font-semibold px-6 py-3.5 border border-[var(--ring-custom)]">
                    Try AI Chat
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </Link>
                </div>

                <div className="reveal reveal-5 mt-10 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[12, 32, 47, 5].map((n) => (
                      <img key={n} className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-[#1E1A35] object-cover" src={`https://i.pravatar.cc/64?img=${n}`} alt="" />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--sub)] font-medium">Trusted by 15,000+ users worldwide</span>
                </div>

                <div className="reveal reveal-6 mt-3 flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.6L12 16.9 6.1 20.4l1.4-6.6-5-4.5 6.6-.7z"/></svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)]">4.9/5</span>
                  <span className="text-sm text-[var(--sub)]">(from 2,500+ reviews)</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative h-[520px] sm:h-[580px] lg:h-[660px] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="ring-pulse w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[var(--violet-200)]" />
                  <div className="ring-spin-slow absolute w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full border border-dashed border-violet-200/70" />
                  <div className="ring-spin-slower absolute w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border border-violet-200/60" />
                </div>

                <div className="relative z-10 flex flex-col items-center bot-bob">
                  <svg width="190" height="200" viewBox="0 0 190 200" className="drop-shadow-xl">
                    <line x1="95" y1="6" x2="95" y2="34" stroke="#B9AFF0" strokeWidth="4" strokeLinecap="round" />
                    <circle className="antenna-glow" cx="95" cy="10" r="9" fill="#7C5CFF" />
                    <rect x="20" y="34" width="150" height="120" rx="46" fill="url(#botGrad)" />
                    <circle cx="14" cy="95" r="12" fill="url(#botGrad)" />
                    <circle cx="176" cy="95" r="12" fill="url(#botGrad)" />
                    <rect x="45" y="56" width="100" height="76" rx="34" fill="var(--bot-face)" />
                    <circle className="eye-blink" cx="80" cy="94" r="9" fill="#8B6CFF" />
                    <circle className="eye-blink" cx="110" cy="94" r="9" fill="#8B6CFF" />
                    <path d="M83 112 Q95 120 107 112" stroke="#584A9E" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <rect x="72" y="154" width="46" height="18" rx="9" fill="#DED7FA" />
                    <defs>
                      <linearGradient id="botGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#DCD3F8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="w-56 h-8 -mt-2 rounded-[50%] bg-gradient-to-b from-violet-200/70 dark:from-violet-900/50 dark:to-transparent blur-[2px]"></div>
                  <div className="w-40 h-3 rounded-full bg-violet-300/40 dark:bg-violet-900/40 blur-md -mt-3"></div>
                </div>

                <div className="float-chip d1 absolute left-[6%] top-[38%] w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16l5-5 4 4 5-6 4 5"/><circle cx="8" cy="8" r="2"/></svg>
                </div>
                <div className="float-chip d2 absolute right-[6%] top-[42%] w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
                </div>

                <div className="feature-card float-card d1 absolute left-0 top-[2%] w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Content Generator</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Create high-quality content in seconds.</p>
                  </div>
                </div>

                <div className="feature-card float-card d2 absolute right-0 top-0 w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Data Analyzer</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Turn data into actionable insights.</p>
                  </div>
                </div>

                <div className="feature-card float-card d3 absolute left-0 bottom-[4%] w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Smart Assistant</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Get instant answers and suggestions.</p>
                  </div>
                </div>

                <div className="feature-card float-card d4 absolute right-0 bottom-0 w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Document Intelligence</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Summarize, extract and understand docs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* SLIDE 2 */}
        <SwiperSlide>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8F7FD] via-[#EEEAFC] to-[#CFC3F6] dark:from-[#120E26] dark:via-[#1A1533] dark:to-[#201A3D] px-6 sm:px-10 lg:px-16 py-14 lg:py-20 pb-[60px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.35)_0%,rgba(124,92,255,0)_70%)]"></div>
              <div className="absolute right-0 bottom-0 w-[60%] h-[55%] opacity-70">
                <svg viewBox="0 0 500 300" className="w-full h-full">
                  <path d="M0 220 Q120 180 240 220 T500 200" stroke="#B9A9F5" strokeWidth="1.5" fill="none" opacity=".5" />
                  <path d="M0 260 Q140 230 260 260 T500 240" stroke="#B9A9F5" strokeWidth="1.5" fill="none" opacity=".35" />
                </svg>
              </div>
              <span className="absolute right-[14%] top-[18%] w-1.5 h-1.5 rounded-full bg-white dark:bg-violet-300 shadow-[0_0_8px_2px_rgba(255,255,255,.8)] dark:shadow-[0_0_8px_2px_rgba(124,92,255,.4)] float-chip d1"></span>
              <span className="absolute right-[28%] top-[70%] w-1 h-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,.8)] dark:shadow-[0_0_6px_2px_rgba(124,92,255,.4)] float-chip d2"></span>
              <span className="absolute right-[6%] bottom-[10%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,.8)] dark:shadow-[0_0_10px_3px_rgba(124,92,255,.4)] float-chip d1"></span>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* LEFT */}
              <div className="max-w-xl">
                <div className="reveal reveal-1 inline-flex items-center gap-2 rounded-full bg-[var(--violet-100)] text-[var(--violet-700)] text-sm font-semibold pl-3 pr-4 py-1.5 mb-7">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="2.3" /></svg>
                  Your All-in-One AI Productivity Platform
                </div>

                <h1 className="reveal reveal-2 text-[2.6rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[var(--ink)]">
                  One Platform.<br />
                  Infinite Possibilities.<br />
                  <span className="bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] bg-clip-text text-transparent">Powered by AI.</span>
                </h1>

                <p className="reveal reveal-3 mt-6 text-lg text-[var(--sub)] leading-relaxed">
                  MindAgent helps you write, analyze, research, and automate tasks with powerful AI agents — all in one place.
                </p>

                <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-4">
                  <Link href="/explore" className="hero-btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] text-white font-semibold px-6 py-3.5 shadow-lg shadow-violet-500/25">
                    Get Started Free
                    <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/ai-chat" className="hero-btn-secondary inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#1E1A35] text-[var(--ink)] font-semibold px-6 py-3.5 border border-[var(--ring-custom)]">
                    Try AI Chat
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                  </Link>
                </div>

                <div className="reveal reveal-5 mt-10 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[51, 45, 13, 25].map((n) => (
                      <img key={n} className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-[#1E1A35] object-cover" src={`https://i.pravatar.cc/64?img=${n}`} alt="" />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--sub)] font-medium">Trusted by 15,000+ users worldwide</span>
                </div>

                <div className="reveal reveal-6 mt-3 flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.6L12 16.9 6.1 20.4l1.4-6.6-5-4.5 6.6-.7z" /></svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)]">4.9/5</span>
                  <span className="text-sm text-[var(--sub)]">(from 2,500+ reviews)</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative h-[520px] sm:h-[580px] lg:h-[660px] flex items-center justify-center">
                {/* dashed orbit rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="ring-spin-slow w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-violet-300/50" />
                  <div className="ring-spin-slower absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-violet-300/40" />
                </div>

                {/* glow blob under bot */}
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(148,110,255,0.55)_0%,rgba(148,110,255,0)_72%)] dark:bg-[radial-gradient(circle,rgba(148,110,255,0.25)_0%,rgba(148,110,255,0)_72%)] blur-sm"></div>

                {/* bot */}
                <div className="relative z-10 flex flex-col items-center bot-bob">
                  <svg width="190" height="200" viewBox="0 0 190 200" className="drop-shadow-xl">
                    <line x1="95" y1="6" x2="95" y2="34" stroke="#B9AFF0" strokeWidth="4" strokeLinecap="round" />
                    <circle className="antenna-glow" cx="95" cy="10" r="9" fill="#7C5CFF" />
                    <rect x="20" y="34" width="150" height="120" rx="46" fill="url(#botGrad2)" />
                    <circle cx="14" cy="95" r="12" fill="url(#botGrad2)" />
                    <circle cx="176" cy="95" r="12" fill="url(#botGrad2)" />
                    <rect x="45" y="56" width="100" height="76" rx="34" fill="var(--bot-face)" />
                    <circle className="eye-blink" cx="80" cy="94" r="9" fill="#8B6CFF" />
                    <circle className="eye-blink" cx="110" cy="94" r="9" fill="#8B6CFF" />
                    <path d="M83 112 Q95 120 107 112" stroke="#584A9E" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="botGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#DCD3F8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="w-52 h-6 -mt-1 rounded-[50%] bg-gradient-to-b from-violet-300/60 dark:from-violet-900/50 dark:to-transparent blur-[3px]"></div>
                </div>

                {/* small floating chips */}
                <div className="float-chip d1 absolute left-[6%] top-[38%] w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
                </div>
                <div className="float-chip d2 absolute right-[6%] top-[46%] w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2.2" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(0 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" /></svg>
                </div>

                {/* feature cards */}
                <div className="feature-card float-card d1 absolute left-0 top-[2%] w-[230px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                    </div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Content Generator</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-full"></div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-3/5"></div>
                  </div>
                  <button className="mt-4 text-xs font-semibold text-[var(--violet-700)] bg-[var(--violet-100)] rounded-lg px-3 py-1.5">Generate</button>
                </div>

                <div className="feature-card float-card d2 absolute right-0 top-0 w-[230px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></svg>
                    </div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Data Analyzer</p>
                  </div>
                  <p className="mt-3 text-xs text-[var(--sub)]">Total Insights</p>
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-extrabold text-[var(--ink)]">18,642</p>
                    <span className="text-xs font-semibold text-emerald-500 mb-0.5">+25.6%</span>
                  </div>
                  <svg className="mt-1 w-full" height="34" viewBox="0 0 180 34" fill="none">
                    <path d="M2 26 Q30 30 50 20 T95 16 T140 8 T178 4" stroke="var(--violet-500)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <circle cx="178" cy="4" r="3.5" fill="var(--violet-600)" />
                  </svg>
                </div>

                <div className="feature-card float-card d3 absolute left-0 bottom-[4%] w-[230px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Smart Assistant</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-full"></div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-2/5"></div>
                  </div>
                  <button className="mt-4 text-xs font-semibold text-[var(--violet-700)] bg-[var(--violet-100)] rounded-lg px-3 py-1.5">Ask Anything</button>
                </div>

                <div className="feature-card float-card d4 absolute right-0 bottom-0 w-[230px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /><path d="M9 13h6M9 17h6" /></svg>
                    </div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Document Intelligence</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-full"></div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2E274A] w-3/5"></div>
                  </div>
                  <button className="mt-4 text-xs font-semibold text-[var(--violet-700)] bg-[var(--violet-100)] rounded-lg px-3 py-1.5">Summarize</button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 3 */}
        <SwiperSlide>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8F7FD] to-[#EDE9FA] dark:from-[#120E26] dark:to-[#1A1533] px-6 sm:px-10 lg:px-16 py-14 lg:py-20 pb-[60px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <svg className="absolute left-[38%] top-[8%] w-[45%] h-[70%] opacity-40" viewBox="0 0 400 400">
                <circle cx="40" cy="60" r="2" fill="#9C86F0" />
                <circle cx="150" cy="30" r="2" fill="#9C86F0" />
                <circle cx="260" cy="80" r="2" fill="#9C86F0" />
                <circle cx="90" cy="180" r="2" fill="#9C86F0" />
                <line x1="40" y1="60" x2="150" y2="30" stroke="#C6B9F5" strokeWidth="1" />
                <line x1="150" y1="30" x2="260" y2="80" stroke="#C6B9F5" strokeWidth="1" />
                <line x1="40" y1="60" x2="90" y2="180" stroke="#C6B9F5" strokeWidth="1" />
              </svg>
              <div className="absolute left-[4%] bottom-[8%] w-72 h-72 rounded-full bg-white/50 dark:bg-violet-900/30 blur-3xl"></div>
              <span className="absolute right-[16%] top-[14%] w-1.5 h-1.5 rounded-full bg-white dark:bg-violet-300 shadow-[0_0_8px_2px_rgba(255,255,255,.8)] dark:shadow-[0_0_8px_2px_rgba(124,92,255,.4)] float-chip d1"></span>
              <span className="absolute right-[10%] bottom-[22%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,.8)] dark:shadow-[0_0_10px_3px_rgba(124,92,255,.4)] float-chip d2"></span>
              <span className="absolute left-[18%] top-[20%] w-1 h-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,.8)] dark:shadow-[0_0_6px_2px_rgba(124,92,255,.4)] float-chip d1"></span>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* LEFT */}
              <div className="max-w-xl">
                <div className="reveal reveal-1 inline-flex items-center gap-2 rounded-full bg-[var(--violet-100)] text-[var(--violet-700)] text-sm font-semibold pl-3 pr-4 py-1.5 mb-7">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="2.3" /></svg>
                  Your All-in-One AI Productivity Platform
                </div>

                <h1 className="reveal reveal-2 text-[2.6rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[var(--ink)]">
                  Intelligent Agents.<br />
                  Real Results.<br />
                  <span className="bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] bg-clip-text text-transparent">Limitless Potential.</span>
                </h1>

                <p className="reveal reveal-3 mt-6 text-lg text-[var(--sub)] leading-relaxed">
                  MindAgent empowers you to write, analyze, research, and automate anything with AI agents that understand and deliver.
                </p>

                <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-4">
                  <Link href="/explore" className="hero-btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--violet-600)] to-[var(--violet-500)] text-white font-semibold px-6 py-3.5 shadow-lg shadow-violet-500/25">
                    Get Started Free
                    <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/ai-chat" className="hero-btn-secondary inline-flex items-center gap-2 rounded-xl bg-white dark:bg-[#1E1A35] text-[var(--ink)] font-semibold px-6 py-3.5 border border-[var(--ring-custom)]">
                    Try AI Chat
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                  </Link>
                </div>

                <div className="reveal reveal-5 mt-10 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[60, 44, 15, 48].map((n) => (
                      <img key={n} className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-[#1E1A35] object-cover" src={`https://i.pravatar.cc/64?img=${n}`} alt="" />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--sub)] font-medium">Trusted by 15,000+ users worldwide</span>
                </div>

                <div className="reveal reveal-6 mt-3 flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.6L12 16.9 6.1 20.4l1.4-6.6-5-4.5 6.6-.7z" /></svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)]">4.9/5</span>
                  <span className="text-sm text-[var(--sub)]">(from 2,500+ reviews)</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative h-[520px] sm:h-[580px] lg:h-[660px] flex items-end justify-center pb-6">

                <div className="absolute z-0 left-1/2 -translate-x-1/2 bottom-[9%] w-36 h-44 opacity-70" style={{ clipPath: 'polygon(38% 100%, 62% 100%, 84% 0%, 16% 0%)', background: 'linear-gradient(to top, rgba(124,92,255,.55), rgba(124,92,255,.12) 55%, transparent 100%)' }}></div>
                <div className="absolute z-0 left-1/2 -translate-x-1/2 bottom-[10%] w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(148,110,255,0.4)_0%,rgba(148,110,255,0)_70%)]"></div>

                <div className="reveal reveal-bot relative z-10 flex flex-col items-center bot-bob" style={{ marginBottom: 68 }}>
                  <svg width="180" height="190" viewBox="0 0 190 200" className="drop-shadow-xl">
                    <line x1="95" y1="6" x2="95" y2="34" stroke="#B9AFF0" strokeWidth="4" strokeLinecap="round" />
                    <circle className="antenna-glow" cx="95" cy="10" r="9" fill="#7C5CFF" />
                    <rect x="20" y="34" width="150" height="120" rx="46" fill="url(#botGrad3)" />
                    <circle cx="14" cy="95" r="12" fill="url(#botGrad3)" />
                    <circle cx="176" cy="95" r="12" fill="url(#botGrad3)" />
                    <rect x="45" y="56" width="100" height="76" rx="34" fill="var(--bot-face)" />
                    <circle className="eye-blink" cx="80" cy="94" r="9" fill="#8B6CFF" />
                    <circle className="eye-blink" cx="110" cy="94" r="9" fill="#8B6CFF" />
                    <path d="M83 112 Q95 120 107 112" stroke="#584A9E" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <rect x="72" y="154" width="46" height="18" rx="9" fill="#DED7FA" />
                    <defs>
                      <linearGradient id="botGrad3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#DCD3F8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] z-[1] flex flex-col items-center">
                  <div className="w-56 h-8 rounded-[50%] bg-gradient-to-b from-white to-[#EDE7FB] dark:from-[#2E274A] dark:to-[#1E1A35] shadow-[0_0_28px_8px_rgba(148,110,255,.3)] border border-white/80 dark:border-[#3D3560]"></div>
                  <div className="w-56 h-4 -mt-2 rounded-b-[50%] bg-gradient-to-b from-[var(--violet-600)] to-[var(--violet-700)]"></div>
                </div>

                <div className="float-chip d1 absolute left-[6%] top-[38%] w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
                </div>
                <div className="float-chip d2 absolute right-[6%] top-[42%] w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] shadow-lg shadow-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
                </div>

                <div className="feature-card float-card d1 absolute left-0 top-[2%] w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Content Generator</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Create high-quality content in seconds.</p>
                  </div>
                </div>

                <div className="feature-card float-card d2 absolute right-0 top-0 w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Data Analyzer</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Turn data into actionable insights.</p>
                  </div>
                </div>

                <div className="feature-card float-card d3 absolute left-0 bottom-[4%] w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Smart Assistant</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Get instant answers and suggestions.</p>
                  </div>
                </div>

                <div className="feature-card float-card d4 absolute right-0 bottom-0 w-[220px] bg-white dark:bg-[#1E1A35] rounded-2xl shadow-xl shadow-violet-900/5 dark:shadow-violet-500/10 p-4 flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--violet-600)] to-[var(--violet-500)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /><path d="M9 13h6M9 17h6" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)] text-sm">Document Intelligence</p>
                    <p className="text-xs text-[var(--sub)] mt-0.5 leading-snug">Summarize, extract and understand docs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <button id="heroPrev" className="nav-btn hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 dark:bg-[#120E26]/80 backdrop-blur items-center justify-center shadow-md">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A2CD1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button id="heroNext" className="nav-btn hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 dark:bg-[#120E26]/80 backdrop-blur items-center justify-center shadow-md">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A2CD1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}
