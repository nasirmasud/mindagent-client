"use client";

import { useEffect, useState } from "react";
import { waitForSignal, signalReady } from "@/lib/load-signals";

const FADE_MS = 500;
// Scroll is locked for as long as the overlay is up, so this is also the longest a
// visitor can be unable to move the page. Keep it short enough that a hung signal
// degrades to "the overlay went away" rather than "the site is frozen".
const FAILSAFE_MS = 2500;

function waitForAboveFoldImages(): Promise<void> {
  return new Promise((resolve) => {
    const images = Array.from(document.images).filter((img) => {
      if (img.dataset.loaderAsset === "true") return false;
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
      fadeTimer = window.setTimeout(() => {
        setPhase("done");
        signalReady("home-loadout");
      }, FADE_MS);
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

    // Only gate on things that are above the fold. The `globe` signal comes from the
    // trust-stats globe far down the page; waiting on it while scroll is locked meant
    // the overlay sat for the full failsafe on every mobile load, because a below-fold
    // canvas cannot become visible until the overlay is gone.
    Promise.all([
      fontsReady,
      pageLoaded,
      waitForSignal("hero-dots"),
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

  // The overlay catches pointer events rather than passing them through. It used to be
  // `pointer-events-none`, which meant a tap during load landed on the CTA sitting
  // invisible behind an opaque full-screen overlay. It is aria-hidden throughout - the
  // visible text is decorative and the section below announces load state instead.
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-out ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping duration-1000" />
          <div className="absolute h-16 w-16 rounded-full border-2 border-t-primary border-r-transparent border-b-foreground/10 border-l-transparent animate-spin" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            decoding="async"
            data-loader-asset="true"
            className="relative size-10 rounded-full object-contain"
          />
          <div className="absolute h-full w-full rounded-full border border-transparent border-l-primary/30 animate-spin [animation-duration:3s]" />
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