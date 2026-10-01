"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Figma, Github, Slack } from "lucide-react";
import { SectionHeader } from "./section-header";

function NotionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M8.1 17.7V7.2l.1-1.1c.3-.1.5-.2.8-.2.3 0 .6 0 .9 0 0 2.7.1 5.4.3 8.1 1.6-2.7 2.6-4.8 3.1-6.3.4 0 .7-.1 1.1-.1 0 2.4-.6 5.6-1.8 9.5-.5.2-1 .4-1.6.4-.4-2.3-.8-4.4-1.1-6.4l-.6.4c-.2 2.3-.5 4.6-.9 7.1h-1.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ZapierIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.157 0A4.151 4.151 0 0 0 0 4.161v15.678A4.151 4.151 0 0 0 4.157 24h15.682A4.152 4.152 0 0 0 24 19.839V4.161A4.152 4.152 0 0 0 19.839 0H4.157Zm10.61 8.761h.03a.577.577 0 0 1 .23.038.585.585 0 0 1 .201.124.63.63 0 0 1 .162.431.612.612 0 0 1-.162.435.58.58 0 0 1-.201.128.58.58 0 0 1-.23.042.529.529 0 0 1-.235-.042.585.585 0 0 1-.332-.328.559.559 0 0 1-.038-.235.613.613 0 0 1 .17-.431.59.59 0 0 1 .405-.162Zm2.853 1.572c.03.004.061.004.095.004.325-.011.646.064.937.219.238.144.431.355.552.609.128.279.189.582.185.888v.193a2 2 0 0 1 0 .219h-2.498c.003.227.075.45.204.642a.78.78 0 0 0 .646.265.714.714 0 0 0 .484-.136.642.642 0 0 0 .23-.318l.915.257a1.398 1.398 0 0 1-.28.537c-.14.159-.321.284-.521.355a2.234 2.234 0 0 1-.836.136 1.923 1.923 0 0 1-1.001-.245 1.618 1.618 0 0 1-.665-.703 2.221 2.221 0 0 1-.227-1.036 1.95 1.95 0 0 1 .48-1.398 1.9 1.9 0 0 1 1.3-.488Zm-9.607.023c.162.004.325.026.48.079.207.065.4.174.563.314.26.302.393.692.366 1.088v2.276H8.53l-.109-.711h-.065c-.064.163-.155.31-.272.439a1.122 1.122 0 0 1-.374.264 1.023 1.023 0 0 1-.453.083 1.334 1.334 0 0 1-.866-.264.965.965 0 0 1-.329-.801.993.993 0 0 1 .076-.431 1.02 1.02 0 0 1 .242-.363 1.478 1.478 0 0 1 1.043-.303h.952v-.181a.696.696 0 0 0-.136-.454.553.553 0 0 0-.438-.154.695.695 0 0 0-.378.086.48.48 0 0 0-.193.254l-.99-.144a1.26 1.26 0 0 1 .257-.563c.14-.174.321-.302.533-.378.261-.091.54-.136.82-.129.053-.003.106-.007.163-.007Zm4.384.007c.174 0 .347.038.506.114.182.083.34.211.458.374.257.423.377.911.351 1.406a2.53 2.53 0 0 1-.355 1.448 1.148 1.148 0 0 1-1.009.517c-.204 0-.401-.045-.582-.136a1.052 1.052 0 0 1-.48-.457 1.298 1.298 0 0 1-.114-.234h-.045l.004 1.784h-1.059v-4.713h.904l.117.805h.057c.068-.208.177-.401.328-.56a1.129 1.129 0 0 1 .843-.344h.076v-.004Zm7.559.084h.903l.113.805h.053a1.37 1.37 0 0 1 .235-.484.813.813 0 0 1 .313-.242.82.82 0 0 1 .39-.076h.234v1.051h-.401a.662.662 0 0 0-.313.008.623.623 0 0 0-.272.155.663.663 0 0 0-.174.26.683.683 0 0 0-.027.314v1.875h-1.054v-3.666Zm-17.515.003h3.262v.896L3.73 13.104l.034.113h1.973l.042.9H2.4v-.9l1.931-1.754-.045-.117H2.441v-.896Zm11.815 0h1.055v3.659h-1.055V10.45Zm3.443.684.019.016a.69.69 0 0 0-.351.045.756.756 0 0 0-.287.204c-.11.155-.174.336-.189.522h1.545c-.034-.526-.257-.787-.74-.787h.003Zm-5.718.163c-.026 0-.057 0-.083.004a.78.78 0 0 0-.31.053.746.746 0 0 0-.257.189 1.016 1.016 0 0 0-.204.695v.064c-.015.257.057.507.204.711a.634.634 0 0 0 .253.196.638.638 0 0 0 .314.061.644.644 0 0 0 .578-.265c.14-.223.204-.48.189-.74a1.216 1.216 0 0 0-.181-.711.677.677 0 0 0-.503-.257Zm-4.509 1.266a.464.464 0 0 0-.268.102.373.373 0 0 0-.114.276c0 .053.008.106.027.155a.375.375 0 0 0 .087.132.576.576 0 0 0 .397.11v.004a.863.863 0 0 0 .563-.182.573.573 0 0 0 .211-.457v-.14h-.903Z" />
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

function GoogleSheetsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
    </svg>
  );
}

function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.5 5.3A16.9 16.9 0 0 0 15.2 4l-.5 1a15.6 15.6 0 0 0-5.4 0L8.8 4a16.9 16.9 0 0 0-4.3 1.3C2 9 1.4 12.7 1.7 16.3A17 17 0 0 0 6.7 19l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 10.5 0l.4.3c-.5.3-1.1.6-1.7.8L16.9 19a17 17 0 0 0 5-2.7c.4-4.3-.7-7.9-2.4-11ZM9.3 14c-.8 0-1.5-.8-1.5-1.7S8.5 10.6 9.3 10.6s1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm5.4 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        X
      </text>
    </svg>
  );
}

const iconClass =
  "h-6 w-6 text-slate-700 transition-colors duration-300 group-hover:text-foreground dark:text-muted-foreground/70";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const PULSE_SLOTS = 4;
const PULSE_LENGTH_PX = 24;
const OUTBOUND_MS = 900;
const DWELL_MS = 200;
const INBOUND_MS = 700;
const MIN_INTERVAL_MS = 400;
const MAX_INTERVAL_MS = 1500;
const MIN_SPEED = 0.8;
const MAX_SPEED = 1.25;
const FLASH_MS = 300;
const FADE_RATIO = 0.15;

type ToolNode = {
  name: string;
  icon: React.ReactNode;
  x: number;
  y: number;
};

const SPOKE_COUNT = 10;
const SPOKE_START_DEG = -90;
const SPOKE_STEP_DEG = 360 / SPOKE_COUNT;

const RX_RATIO = 0.409;
const RY_RATIO = 0.55;
const DIAGRAM_SCALE = 1.5;
const BOX_HALF = 36;

type PulsePhase = "idle" | "out" | "dwell" | "back";

type PulseSlot = {
  phase: PulsePhase;
  phaseStart: number;
  nextStart: number;
  index: number;
  speed: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function edgeFade(progress: number) {
  return Math.min(1, progress / FADE_RATIO, (1 - progress) / FADE_RATIO);
}

const baseTools = [
  { name: "Excel", icon: <ExcelIcon className={iconClass} /> },
  { name: "Notion", icon: <NotionIcon className={iconClass} /> },
  { name: "GitHub", icon: <Github className={iconClass} /> },
  { name: "Slack", icon: <Slack className={iconClass} /> },
  { name: "Gmail", icon: <GmailIcon className={iconClass} /> },
  { name: "Google Drive", icon: <GoogleDriveIcon className={iconClass} /> },
  { name: "Figma", icon: <Figma className={iconClass} /> },
  { name: "Discord", icon: <DiscordIcon className={iconClass} /> },
  { name: "Zapier", icon: <ZapierIcon className={iconClass} /> },
  { name: "Google Sheets", icon: <GoogleSheetsIcon className={iconClass} /> },
];

/**
 * Single source of truth for the diagram. Every consumer (box positions,
 * connector lines and pulses) is derived from these pixel coordinates, so a
 * line endpoint and its box center are the same number by construction.
 */
function buildLayout(width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;

  const rx = Math.max(0, Math.min(RX_RATIO * width, width / 2 - BOX_HALF));
  const ry = Math.max(0, Math.min(RY_RATIO * rx, height / 2 - BOX_HALF));

  const tools: ToolNode[] = baseTools.map((tool, i) => {
    const angle = ((SPOKE_START_DEG + i * SPOKE_STEP_DEG) * Math.PI) / 180;
    return {
      name: tool.name,
      icon: tool.icon,
      x: centerX + rx * Math.cos(angle),
      y: centerY + ry * Math.sin(angle),
    };
  });

  return { centerX, centerY, tools };
}

export function HomeIntegrations() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [flashing, setFlashing] = useState<number[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const diagramRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<SVGSVGElement>(null);

  const layout = useMemo(
    () => buildLayout(size.width, size.height),
    [size.width, size.height]
  );

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const measure = () => {
      const rect = diagram.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize((prev) =>
          Math.abs(prev.width - rect.width) < 0.5 &&
          Math.abs(prev.height - rect.height) < 0.5
            ? prev
            : { width: rect.width, height: rect.height }
        );
      }
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(diagram);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || layout.tools.length === 0) return;

    const layer = layerRef.current;
    if (!layer) return;

    const nodes = Array.from(
      layer.querySelectorAll<SVGGElement>("[data-pulse-slot]")
    );
    if (nodes.length !== PULSE_SLOTS) return;

    const lines = nodes.map((node) => {
      const found = node.querySelectorAll<SVGLineElement>("line");
      return { group: node, glow: found[0], core: found[1] };
    });

    const { centerX, centerY, tools } = layout;

    const geometry = tools.map((tool) => {
      const dx = tool.x - centerX;
      const dy = tool.y - centerY;
      const length = Math.hypot(dx, dy) || 1;
      return { length, ux: dx / length, uy: dy / length };
    });

    const now0 = performance.now();
    const slots: PulseSlot[] = Array.from({ length: PULSE_SLOTS }, (_, slot) => ({
      phase: "idle",
      phaseStart: 0,
      nextStart: now0 + slot * randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS),
      index: -1,
      speed: 1,
    }));

    const flashTimers = new Set<ReturnType<typeof setTimeout>>();

    const hide = (node: SVGGElement) => node.setAttribute("opacity", "0");

    const flash = (index: number) => {
      setFlashing((prev) => (prev.includes(index) ? prev : [...prev, index]));
      const timer = setTimeout(() => {
        flashTimers.delete(timer);
        setFlashing((prev) => prev.filter((value) => value !== index));
      }, FLASH_MS);
      flashTimers.add(timer);
    };

    const draw = (slotIndex: number, index: number, progress: number, alpha: number) => {
      const geo = geometry[index];
      const { group, glow, core } = lines[slotIndex];
      const segment = Math.min(PULSE_LENGTH_PX * DIAGRAM_SCALE, geo.length / 2.5);
      const travel = Math.max(0, geo.length - segment);
      const start = progress * travel;
      const x1 = centerX + geo.ux * start;
      const y1 = centerY + geo.uy * start;
      const x2 = x1 + geo.ux * segment;
      const y2 = y1 + geo.uy * segment;

      for (const line of [glow, core]) {
        line.setAttribute("x1", x1.toFixed(3));
        line.setAttribute("y1", y1.toFixed(3));
        line.setAttribute("x2", x2.toFixed(3));
        line.setAttribute("y2", y2.toFixed(3));
      }
      group.setAttribute("opacity", Math.max(0, Math.min(1, alpha)).toFixed(3));
    };

    const pickLine = (slotIndex: number) => {
      const busy = new Set(
        slots
          .filter((slot, i) => i !== slotIndex && slot.index >= 0)
          .map((slot) => slot.index)
      );
      const free = tools.map((_, i) => i).filter((i) => !busy.has(i));
      const pool = free.length > 0 ? free : tools.map((_, i) => i);
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const begin = (slotIndex: number, now: number) => {
      const slot = slots[slotIndex];
      slot.index = pickLine(slotIndex);
      slot.speed = randomBetween(MIN_SPEED, MAX_SPEED);
      slot.phase = "out";
      slot.phaseStart = now;
    };

    const scheduleNext = (slot: PulseSlot, now: number) => {
      slot.phase = "idle";
      slot.index = -1;
      slot.nextStart = now + randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    };

    let raf = 0;

    const tick = (now: number) => {
      for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
        const slot = slots[slotIndex];
        const { group } = lines[slotIndex];

        if (slot.phase === "idle") {
          if (now >= slot.nextStart) begin(slotIndex, now);
          continue;
        }

        const elapsed = now - slot.phaseStart;

        if (slot.phase === "out") {
          const progress = Math.min(1, elapsed / (OUTBOUND_MS * slot.speed));
          draw(slotIndex, slot.index, smoothstep(progress), edgeFade(progress));
          if (progress >= 1) {
            slot.phase = "dwell";
            slot.phaseStart = now;
            hide(group);
            flash(slot.index);
          }
        } else if (slot.phase === "dwell") {
          hide(group);
          if (elapsed >= DWELL_MS * slot.speed) {
            slot.phase = "back";
            slot.phaseStart = now;
          }
        } else {
          const progress = Math.min(1, elapsed / (INBOUND_MS * slot.speed));
          draw(
            slotIndex,
            slot.index,
            1 - smoothstep(progress),
            edgeFade(progress)
          );
          if (progress >= 1) {
            hide(group);
            scheduleNext(slot, now);
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      for (const timer of flashTimers) clearTimeout(timer);
      flashTimers.clear();
      setFlashing([]);
    };
  }, [reducedMotion, layout]);

  return (
    <section className="w-full border-y border-border bg-card/60 dark:bg-card/40 px-4 md:px-20 py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeader
          label="./integrations"
          title="Integrate Seamlessly with Your Tools"
          description="MindAgent plugs into the stack you already use, so your agents can act where your work actually happens."
        />

        {/* Hub-and-spoke diagram */}
        <div
          ref={diagramRef}
          className="relative mx-auto mt-10 aspect-square w-full max-w-[1230px] md:aspect-[5/3]"
          role="img"
          aria-label="MindAgent connects with Excel, Notion, GitHub, Slack, Gmail, Google Drive, Figma, Discord, Zapier and Google Sheets"
        >
          {/* Connector lines */}
          <svg
            viewBox={`0 0 ${size.width} ${size.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {layout.tools.map((tool) => (
              <line
                key={tool.name}
                x1={layout.centerX}
                y1={layout.centerY}
                x2={tool.x}
                y2={tool.y}
                stroke="hsl(var(--primary))"
                strokeOpacity="0.35"
                strokeWidth={1}
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* Traveling pulses */}
          {!reducedMotion && size.width > 0 && (
            <svg
              ref={layerRef}
              viewBox={`0 0 ${size.width} ${size.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                <filter id="integrations-pulse-glow" filterUnits="userSpaceOnUse" x={0} y={0} width={size.width} height={size.height}>
                  <feGaussianBlur stdDeviation={6 * DIAGRAM_SCALE} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {Array.from({ length: PULSE_SLOTS }, (_, slot) => (
                <g key={slot} data-pulse-slot={slot} opacity="0" filter="url(#integrations-pulse-glow)">
                  <line stroke="hsl(var(--primary))" strokeOpacity="0.7" strokeWidth={5 * DIAGRAM_SCALE} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <line stroke="hsl(var(--primary))" strokeOpacity="1" strokeWidth={2 * DIAGRAM_SCALE} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </g>
              ))}
            </svg>
          )}

          {/* Spoke nodes */}
          {layout.tools.map((tool, index) => (
            <div
              key={tool.name}
              className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 border bg-card px-1 text-foreground shadow-lg shadow-primary/10 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-x-1/2 hover:-translate-y-[55%] hover:scale-110 ${
                flashing.includes(index)
                  ? "border-primary shadow-primary/40"
                  : "border-border"
              }`}
              style={{
                left: tool.x,
                top: tool.y,
                width: 56 * DIAGRAM_SCALE,
                height: 56 * DIAGRAM_SCALE,
              }}
            >
              {tool.icon}
              <span className="max-w-full text-center font-mono text-[10px] font-medium leading-tight">
                {tool.name}
              </span>
              <span className="sr-only">MindAgent connects with {tool.name}</span>
            </div>
          ))}

          {/* Center node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl"
            />
            <div className="relative flex h-20 w-20 items-center justify-center border-2 border-primary bg-card shadow-2xl shadow-primary/30">
              <img src="/logo.png" alt="" width={48} height={48} className="h-12 w-12" />
              <span className="sr-only">MindAgent hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}