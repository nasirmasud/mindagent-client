import { cn } from "@/lib/utils";

interface SectionLabelProps {
  path: string;
  className?: string;
}

export function SectionLabel({ path, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-sm font-medium tracking-wide text-primary",
        className
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 bg-primary" />
      {path}
    </span>
  );
}