import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export interface LegalPageProps {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
  className?: string;
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
  className,
}: LegalPageProps) {
  return (
    <div className={cn("w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
          ./legal
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated {updated}
        </p>

        <div className="mt-8 text-sm leading-relaxed text-muted-foreground md:text-base">
          {intro}
        </div>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">Contact us</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Questions about this policy? Email us at{" "}
            <Link
              href="mailto:nasir.masud@ymail.com"
              className="font-medium text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              nasir.masud@ymail.com
            </Link>{" "}
            or use the{" "}
            <Link
              href="/contact"
              className="font-medium text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              contact form
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}