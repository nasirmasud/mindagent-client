"use client";

import { FileText, KeyRound, Lock, ShieldHalf } from "lucide-react";
import { useRef } from "react";
import type { PointerEvent } from "react";

const features = [
  { name: "AES-256", detail: "Encryption at rest" },
  { name: "TLS 1.3", detail: "Encryption in transit" },
  { name: "RBAC", detail: "Role-based access" },
];

const MAX_TILT = 10;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function SecurityOrb({ name, detail }: { name: string; detail: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(500px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg)`;
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="security-orb flex h-24 w-24 items-center justify-center rounded-full transition-transform duration-300 ease-out will-change-transform"
      >
        <span className="security-orb-label whitespace-nowrap text-base font-bold tracking-tight sm:text-lg">
          {name}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </div>
  );
}

const cards = [
  {
    icon: Lock,
    title: "Encryption",
    description: "AES-256 at rest, TLS in transit.",
  },
  {
    icon: KeyRound,
    title: "Access control",
    description: "Fine-grained roles and permissions.",
  },
  {
    icon: FileText,
    title: "Audit logs",
    description: "Track every agent action.",
  },
  {
    icon: ShieldHalf,
    title: "Data privacy",
    description: "Multi-tenant isolation and SSO.",
  },
];

export function HomeSecurity() {
  return (
    <section className="w-full border-y border-border bg-card/60 dark:bg-card/40 px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Enterprise Security &amp; Compliance
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Your data is encrypted in transit and at rest, audited by third
            parties, and governed by strict access controls - so you stay
            compliant while you ship.
          </p>

          {/* Security features */}
          <div className="mt-8 flex flex-wrap gap-5">
            {features.map((f) => (
              <SecurityOrb key={f.name} name={f.name} detail={f.detail} />
            ))}
          </div>
        </div>

        {/* Security features grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}