"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { OrbitRing } from "@/components/ui/orbit-ring";
import { waitForSignal } from "@/lib/load-signals";

const FADE_MS = 500;
const FAILSAFE_MS = 10000;

function waitForAboveFoldImages(): Promise<void> {
  return new Promise((resolve) => {
    const images = Array.from(document.images).filter((img) => {
      const rect = img.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.top >= 0 &&
        rect.top <= window.innerHeight &&
        rect.bottom <= window.innerHeight + 1
      );
    });

    if (images.length === 0) {
      resolve();
      return;
    }

    let remaining = images.length;
    const onSettle = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
    };

    images.forEach((img) => {
      if (img.complete) {
        onSettle();
        return;
      }
      img.addEventListener("load", onSettle, { once: true });
      img.addEventListener("error", onSettle, { once: true });
    });
  });
}

export function HomeLoader() {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    let finished = false;
    let fadeTimer = 0;

    const unlockScroll = () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      unlockScroll();
      setPhase("fading");
      fadeTimer = window.setTimeout(() => setPhase("done"), FADE_MS);
    };

    // Lock scroll only for the duration of the visible overlay.
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const failsafe = window.setTimeout(finish, FAILSAFE_MS);
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", () => resolve(), { once: true });
    });

    const fontsReady =
      typeof document.fonts !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();

    Promise.all([
      fontsReady,
      pageLoaded,
      waitForSignal("hero-dots"),
      waitForSignal("globe"),
      waitForAboveFoldImages(),
    ])
      .then(finish)
      .catch(finish);

    return () => {
      window.clearTimeout(failsafe);
      window.clearTimeout(fadeTimer);
      unlockScroll();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden={phase === "fading"}
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-out ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <OrbitRing
            className="absolute inset-0 text-primary"
            style={{ "--duration": "1.6s" } as CSSProperties}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.ico"
            alt=""
            className="size-16 rounded-full object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold tracking-wide text-foreground">
            MindAgent
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Waking up the grid...
          </p>
        </div>
      </div>
    </div>
  );
}