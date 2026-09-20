"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe, { type Globe as CobeGlobe } from "cobe";
import { cn } from "@/lib/utils";
import { signalReady } from "@/lib/load-signals";
import { hasWebGL } from "@/lib/webgl";
import { StaticGlobe } from "./static-globe";

// Utility function to convert a hex color string to a normalized RGB array [0-1, 0-1, 0-1]
const hexToRgbNormalized = (hex: string): [number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;

  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return [0.4, 0.65, 1];
  }

  return [r / 255, g / 255, b / 255];
};

export interface GlobeMarker {
  location: [number, number];
  size: number;
}

export interface GlobeProps {
  className?: string;
  theta?: number;
  phi?: number;
  dark?: number;
  scale?: number;
  diffuse?: number;
  mapSamples?: number;
  mapBrightness?: number;
  baseColor?: [number, number, number] | string;
  markerColor?: [number, number, number] | string;
  glowColor?: [number, number, number] | string;
  markers?: GlobeMarker[];
  
  /** Enable mouse wheel and pinch zoom */
  enableZoom?: boolean;
  /** Minimum zoom scale */
  minScale?: number;
  /** Maximum zoom scale */
  maxScale?: number;
  /** Zoom sensitivity multiplier */
  zoomSensitivity?: number;
  /** Enable auto rotation */
  autoRotate?: boolean;
  /** Auto rotation speed */
  autoRotateSpeed?: number;
}

const Globe: React.FC<GlobeProps> = ({
  className,
  theta = 0.25,
  phi = 0,
  dark = 0,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 24000,
  mapBrightness = 10,
  baseColor = "#ffffff",
  markerColor = "#ff3b30",
  glowColor = "#ffffff",
  markers = [],
  enableZoom = true,
  minScale = 0.4,
  maxScale = 3.5,
  zoomSensitivity = 0.002,
  autoRotate = true,
  autoRotateSpeed = 0.003,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<CobeGlobe | null>(null);
  const failedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  const fail = useRef((msg?: string) => {
    if (failedRef.current) return;
    failedRef.current = true;
    if (msg) console.warn(`[globe] ${msg}`);
    setFailed(true);
    signalReady("globe");
  });

  // Interaction refs
  const phiRef = useRef(phi);
  const thetaRef = useRef(theta);
  const targetScaleRef = useRef(scale);
  const currentScaleRef = useRef(scale);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Synchronize initial prop scale
  useEffect(() => {
    targetScaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Normalize color props
    const resolvedBaseColor: [number, number, number] =
      typeof baseColor === "string" ? hexToRgbNormalized(baseColor) : baseColor;

    const resolvedMarkerColor: [number, number, number] =
      typeof markerColor === "string" ? hexToRgbNormalized(markerColor) : markerColor;

    const resolvedGlowColor: [number, number, number] =
      typeof glowColor === "string" ? hexToRgbNormalized(glowColor) : glowColor;

    let internalWidth = 0;
    let internalHeight = 0;
    let renderRafId = 0;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderFrame = () => {
      if (!globeRef.current) return;
      currentScaleRef.current +=
        (targetScaleRef.current - currentScaleRef.current) * 0.12;
      if (!isDragging.current && autoRotate && !prefersReducedMotion) {
        phiRef.current += autoRotateSpeed;
      }
      globeRef.current.update({
        width: internalWidth,
        height: internalHeight,
        phi: phiRef.current,
        theta: thetaRef.current,
        scale: currentScaleRef.current,
        offset: [0, 0],
        opacity: 1,
      });
      renderRafId = requestAnimationFrame(renderFrame);
    };

    const startRenderLoop = () => {
      if (renderRafId) {
        cancelAnimationFrame(renderRafId);
      }
      renderRafId = requestAnimationFrame(renderFrame);
    };

    const stopRenderLoop = () => {
      if (renderRafId) {
        cancelAnimationFrame(renderRafId);
        renderRafId = 0;
      }
    };

    const initGlobe = () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }

      if (!hasWebGL()) {
        fail.current(
          "WebGL is not available in this browser; showing static globe fallback."
        );
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(100, Math.round(rect.width || 600));
      const height = Math.max(100, Math.round(rect.height || 500));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      internalWidth = Math.round(width * dpr);
      internalHeight = Math.round(height * dpr);

      canvas.width = internalWidth;
      canvas.height = internalHeight;

      try {
        globeRef.current = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: internalWidth,
          height: internalHeight,
          phi: phiRef.current,
          theta: thetaRef.current,
          dark,
          scale: currentScaleRef.current,
          diffuse,
          mapSamples,
          mapBrightness,
          baseColor: resolvedBaseColor,
          markerColor: resolvedMarkerColor,
          glowColor: resolvedGlowColor,
          opacity: 1,
          offset: [0, 0],
          markers,
        });
      } catch (err) {
        globeRef.current = null;
        fail.current(
          `cobe initialization failed (${err instanceof Error ? err.message : String(err)}); showing static globe fallback.`
        );
        return;
      }

      if (failedRef.current) {
        failedRef.current = false;
        setFailed(false);
      }

      globeRef.current.update({
        width: internalWidth,
        height: internalHeight,
        phi: phiRef.current,
        theta: thetaRef.current,
        scale: currentScaleRef.current,
        offset: [0, 0],
        opacity: 1,
      });
      signalReady("globe");

      startRenderLoop();
    };

    // --- Mouse Drag Interaction Handlers ---
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastMouseX.current;
        const deltaY = e.clientY - lastMouseY.current;
        const rotationSpeed = 0.005;

        phiRef.current += deltaX * rotationSpeed;
        thetaRef.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, thetaRef.current - deltaY * rotationSpeed)
        );

        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = "grab";
      }
    };

    // --- Mouse Wheel Zoom Interaction Handler ---
    const onWheel = (e: WheelEvent) => {
      if (!enableZoom) return;
      // Allow natural page scrolling; only intercept wheel when user is explicitly zooming with Ctrl/Cmd or dragging
      if (!e.ctrlKey && !e.metaKey && !isDragging.current) {
        return;
      }
      e.preventDefault();
      const zoomDelta = -e.deltaY * zoomSensitivity;
      const nextScale = targetScaleRef.current + zoomDelta;
      targetScaleRef.current = Math.max(minScale, Math.min(maxScale, nextScale));
    };

    // --- Touch Interaction (Drag + Pinch to Zoom) ---
    let touchDistance = 0;
    let initialTouchScale = 1;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastMouseX.current = e.touches[0].clientX;
        lastMouseY.current = e.touches[0].clientY;
      } else if (e.touches.length === 2 && enableZoom) {
        isDragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistance = Math.hypot(dx, dy);
        initialTouchScale = targetScaleRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        const deltaX = e.touches[0].clientX - lastMouseX.current;
        const deltaY = e.touches[0].clientY - lastMouseY.current;
        const rotationSpeed = 0.005;

        phiRef.current += deltaX * rotationSpeed;
        thetaRef.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, thetaRef.current - deltaY * rotationSpeed)
        );

        lastMouseX.current = e.touches[0].clientX;
        lastMouseY.current = e.touches[0].clientY;
      } else if (e.touches.length === 2 && enableZoom && touchDistance > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / touchDistance;
        const nextScale = initialTouchScale * factor;
        targetScaleRef.current = Math.max(minScale, Math.min(maxScale, nextScale));
      }
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      touchDistance = 0;
    };

    let isVisible = true;
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => {
            const visible = entry && entry.isIntersecting;
            isVisible = visible;
            if (visible) {
              if (!globeRef.current) {
                initGlobe();
              }
            } else {
              if (globeRef.current) {
                globeRef.current.destroy();
                globeRef.current = null;
              }
            }
          },
          { rootMargin: "150px" }
        )
      : null;

    initGlobe();
    if (observer) {
      observer.observe(canvas);
    }

    // Re-init when the container actually gains a non-zero size (e.g. it was
    // hidden / collapsed at mount time so the canvas rect was 0).
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const w = Math.round(entry.contentRect.width);
        const h = Math.round(entry.contentRect.height);
        if (w <= 0 || h <= 0) return;
        const rect = canvas.getBoundingClientRect();
        if (Math.round(rect.width) !== w || Math.round(rect.height) !== h) {
          if (isVisible) {
            initGlobe();
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    // Attach interaction listeners
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    const handleResize = () => {
      if (isVisible) {
        initGlobe();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) {
        observer.disconnect();
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (canvas) {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
      }
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      stopRenderLoop();
    };
  }, [
    theta,
    dark,
    diffuse,
    mapSamples,
    mapBrightness,
    baseColor,
    markerColor,
    glowColor,
    enableZoom,
    minScale,
    maxScale,
    zoomSensitivity,
    autoRotate,
    autoRotateSpeed,
    markers,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center justify-center relative w-full h-full min-h-[400px]",
        className
      )}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {failed ? (
        <StaticGlobe className="w-full h-full min-h-[400px]" />
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            cursor: "grab",
            opacity: 1,
          }}
        />
      )}
    </div>
  );
};

export default Globe;
