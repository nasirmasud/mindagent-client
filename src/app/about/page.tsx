"use client";

import {
  Sparkles, ArrowRight, Gauge, ShieldCheck, Eye,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "42", label: "People on the team" },
  { value: "2023", label: "Founded" },
  { value: "6", label: "Agents shipped" },
];

const values = [
  { icon: Gauge, title: "Ship useful, not flashy", body: "Every agent has to save someone a real hour before it ships." },
  { icon: ShieldCheck, title: "Privacy by default", body: "Your files are processed in memory and never used to train models." },
  { icon: Eye, title: "Explainable by design", body: "If an agent can't show its reasoning, we don't trust the output either." },
];

const team = [
  { name: "Alia Rahman", role: "Co-founder & CEO", init: "AR", color: "#7C5CFC" },
  { name: "Devon Kessler", role: "Co-founder & CTO", init: "DK", color: "#4F8CFF" },
  { name: "Marisol Vega", role: "Head of AI Research", init: "MV", color: "#5ED9A6" },
  { name: "Theo Nakamura", role: "Head of Design", init: "TN", color: "#F5B942" },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A13] text-white">
      {/* HERO */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-[34px] font-bold leading-[1.2] md:text-[42px]">
          We build agents that
          <br />
          <span className="bg-gradient-to-r from-[#9B85FF] to-[#7FA8FF] bg-clip-text text-transparent">
            do the busywork
          </span>{" "}
          for you.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400">
          MindAgent started with a simple complaint: too many good hours were going
          into reading spreadsheets, summarizing reports, and describing images by
          hand. So we built agents that do it instead.
        </p>

        <div className="mx-auto mt-10 flex max-w-md justify-between border-t border-[#1D1D2C] pt-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-[#1D1D2C] bg-[#0F0F1A] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold">
            What we don&apos;t compromise on
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="text-center sm:text-left">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC]/10 sm:mx-0">
                    <Icon size={18} className="text-[#9B85FF]" />
                  </span>
                  <h3 className="mt-3.5 text-sm font-semibold">{v.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Meet the team</h2>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {team.map((m, i) => (
            <div key={i} className="text-center">
              <span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: m.color }}
              >
                {m.init}
              </span>
              <p className="mt-3 text-sm font-semibold">{m.name}</p>
              <p className="text-xs text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#232235] bg-[#131320] px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold">
              Want to build the next agent with us?
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Remote-friendly, small teams, every agent has a named owner.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#7C5CFC] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#6B4CE8] transition-colors"
          >
            See open roles&nbsp; <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
