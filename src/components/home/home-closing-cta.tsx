import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WireframeGlobe } from "./globe";

export function HomeClosingCta() {
  return (
    <section className="relative w-full overflow-hidden px-4 md:px-20 py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            2026
          </p>
          <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Your AI Journey
            <br />
            Starts Here.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Join 15,000+ users who&apos;ve already put AI agents to work. Set up
            your first agent in under a minute — free, no credit card required.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/login?tab=register">
                Get started free
                <Rocket className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group gap-2">
              <Link href="/about">
                Read the docs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <WireframeGlobe className="home-spin-slow mx-auto h-72 w-72 md:h-80 md:w-80" />
        </div>
      </div>
    </section>
  );
}