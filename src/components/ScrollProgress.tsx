"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fixed 3px reading-progress bar. `scaleX` on a single element is used rather than
 * a width change so the bar only composites one layer per frame instead of forcing
 * layout on every scroll event.
 *
 * The handler is registered passive and does no layout-reading writes, but the
 * progress state is committed through a ref to React state only when the rounded
 * percentage actually changes. A continuous scroll would otherwise re-render on
 * every single pixel.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const doc = document.documentElement;

    const update = () => {
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        if (lastRef.current !== 0) {
          lastRef.current = 0;
          setProgress(0);
        }
        return;
      }

      const ratio = doc.scrollTop / scrollable;
      // Clamp: overscroll (rubber-banding on iOS, momentum past the end on
      // desktop) can push scrollTop past scrollHeight and would otherwise scale
      // the bar wider than the viewport.
      const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      const pct = Math.round(clamped * 1000) / 1000;

      if (pct !== lastRef.current) {
        lastRef.current = pct;
        setProgress(pct);
      }
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[3px] bg-primary/15"
    >
      <div
        className="h-full w-full origin-left bg-primary"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}