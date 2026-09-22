"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { priceCardGlow } from "@/components/shared/brand-styles";

interface PriceCardShellProps {
  highlighted: boolean;
  hovered: boolean;
  enlarged: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
  children: ReactNode;
}

export function PriceCardShell({
  highlighted,
  hovered,
  enlarged,
  onMouseEnter,
  onMouseLeave,
  className,
  children,
}: PriceCardShellProps) {
  const scaleClass = hovered
    ? enlarged
      ? "[@media(hover:hover)]:lg:scale-[1.08]"
      : "[@media(hover:hover)]:scale-[1.03]"
    : enlarged
      ? "lg:scale-[1.05]"
      : "";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card p-8 transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform",
        "group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/30",
        enlarged ? "border-primary shadow-2xl shadow-primary/20" : "border-border",
        scaleClass,
        className
      )}
    >
      <div aria-hidden="true" className={priceCardGlow(highlighted)} />
      {children}
    </div>
  );
}

export function usePriceCardHover() {
  const [hovered, setHovered] = useState<string | null>(null);
  const shellProps = useCallback(
    (name: string, highlighted: boolean) => ({
      highlighted,
      hovered: hovered === name,
      enlarged: highlighted && (hovered === null || hovered === name),
      onMouseEnter: () => setHovered(name),
      onMouseLeave: () => setHovered((h) => (h === name ? null : h)),
    }),
    [hovered]
  );
  return { shellProps };
}