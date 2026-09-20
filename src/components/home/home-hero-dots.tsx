"use client";

import { useEffect, useRef } from "react";
import { signalReady } from "@/lib/load-signals";

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

const SIZE_FALLBACK = 26;
const CURSOR_RADIUS = 150;
const BASE_ALPHA = 0.25;
const BRIGHT_ALPHA = 0.7;
const BASE_RADIUS = 1; // matches old CSS dot: a 2px-diameter disc (hard stop at radius 1px)
const MAX_RADIUS = 2.25;
const EASE = 0.15;
const POS_EPSILON = 0.05;
const VISUAL_EPSILON = 0.01;
const COLOR = "124, 92, 255";

export function HeroDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!context || !host) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");
    const isStatic = reduceMotion.matches || coarsePointer.matches;

    let dots: Dot[] = [];
    let size = SIZE_FALLBACK;
    let lastDocLeft: number | null = null;
    let lastDocTop: number | null = null;
    let lastSize = 0;
    let width = 0;
    let height = 0;
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let rafId: number | null = null;
    let dprMedia: MediaQueryList | null = null;

    function readSize() {
      const value = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--grid-size")
      );
      return Number.isFinite(value) && value > 0 ? value : SIZE_FALLBACK;
    }

    function buildGrid() {
      const rect = canvasEl.getBoundingClientRect();
      const docLeft = rect.left + window.scrollX;
      const docTop = rect.top + window.scrollY;
      const sizeNow = readSize();
      lastDocLeft = docLeft;
      lastDocTop = docTop;
      lastSize = sizeNow;
      size = sizeNow;
      const phaseX = (sizeNow - (docLeft % sizeNow)) % sizeNow;
      const phaseY = (sizeNow - (docTop % sizeNow)) % sizeNow;
      const startX = phaseX + sizeNow / 2 - sizeNow;
      const startY = phaseY + sizeNow / 2 - sizeNow;
      const cols = Math.ceil(width / sizeNow) + 2;
      const rows = Math.ceil(height / sizeNow) + 2;
      dots = new Array(cols * rows);
      let index = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const homeX = startX + i * sizeNow;
          const homeY = startY + j * sizeNow;
          dots[index++] = {
            homeX,
            homeY,
            x: homeX,
            y: homeY,
            radius: BASE_RADIUS,
            alpha: BASE_ALPHA,
          };
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, ${dot.alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function resize() {
      const rect = canvasEl.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvasEl.width = Math.max(1, Math.round(width * dpr));
      canvasEl.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouseX = null;
      mouseY = null;
      buildGrid();
      draw();
    }

    function sync() {
      const rect = canvasEl.getBoundingClientRect();
      const docLeft = rect.left + window.scrollX;
      const docTop = rect.top + window.scrollY;
      const sizeNow = readSize();
      if (docLeft === lastDocLeft && docTop === lastDocTop && sizeNow === lastSize) {
        return;
      }
      buildGrid();
      draw();
    }

    function tick() {
      rafId = null;
      let needsWork = false;

      for (const dot of dots) {
        let targetX = dot.homeX;
        let targetY = dot.homeY;
        let targetRadius = BASE_RADIUS;
        let targetAlpha = BASE_ALPHA;

        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - dot.homeX;
          const dy = mouseY - dot.homeY;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS && d > 0) {
            const strength = 1 - d / CURSOR_RADIUS;
            const scale = (strength * size * 0.45) / d;
            targetX = dot.homeX + dx * scale;
            targetY = dot.homeY + dy * scale;
            targetRadius = BASE_RADIUS + strength * (MAX_RADIUS - BASE_RADIUS);
            targetAlpha = BASE_ALPHA + strength * (BRIGHT_ALPHA - BASE_ALPHA);
          }
        }

        dot.x += (targetX - dot.x) * EASE;
        dot.y += (targetY - dot.y) * EASE;
        dot.radius += (targetRadius - dot.radius) * EASE;
        dot.alpha += (targetAlpha - dot.alpha) * EASE;

        if (
          Math.abs(targetX - dot.x) > POS_EPSILON ||
          Math.abs(targetY - dot.y) > POS_EPSILON ||
          Math.abs(targetRadius - dot.radius) > VISUAL_EPSILON ||
          Math.abs(targetAlpha - dot.alpha) > VISUAL_EPSILON
        ) {
          needsWork = true;
        }
      }

      draw();

      if (needsWork) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function startLoop() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvasEl.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startLoop();
    }

    function onPointerLeave() {
      mouseX = null;
      mouseY = null;
      startLoop();
    }

    function onDprChange() {
      resize();
      watchDpr();
    }

    function watchDpr() {
      if (dprMedia) {
        if (dprMedia.removeEventListener) {
          dprMedia.removeEventListener("change", onDprChange);
        } else {
          dprMedia.removeListener(onDprChange);
        }
      }
      dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      if (dprMedia.addEventListener) {
        dprMedia.addEventListener("change", onDprChange, { once: true });
      } else {
        dprMedia.addListener(onDprChange);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvasEl);
    const bodyObserver = new ResizeObserver(sync);
    bodyObserver.observe(document.body);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    resize();
    signalReady("hero-dots");

    if (!isStatic) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      watchDpr();
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      if (dprMedia) {
        if (dprMedia.removeEventListener) {
          dprMedia.removeEventListener("change", onDprChange);
        } else {
          dprMedia.removeListener(onDprChange);
        }
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}