import { cn } from "@/lib/utils";

interface SectionLabelProps {
  path: string;
  className?: string;
}

export function SectionLabel({ path, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wide text-primary",
        className
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
      {path}
    </span>
  );
}