import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./section-label";

export interface SectionLink {
  href: string;
  label: string;
}

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  link?: SectionLink;
  action?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  link,
  action,
  align,
  className,
  titleClassName,
}: SectionHeaderProps) {
  const hasSide = Boolean(link ?? action);
  const left = align === "left" || (align === undefined && hasSide);

  const right = action ?? (link && (
    <Link
      href={link.href}
      className="group inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {link.label}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  ));

  return (
    <div className={cn(!left && "flex flex-col items-center text-center", className)}>
      <SectionLabel path={label} />
      <div
        className={cn(
          "mt-4 w-full",
          hasSide && "flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
        )}
      >
        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-foreground md:text-4xl",
            titleClassName
          )}
        >
          {title}
        </h2>
        {hasSide && right}
      </div>
      {description && (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-muted-foreground md:text-base",
            !left && "mx-auto max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}