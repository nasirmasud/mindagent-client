import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

const Globe = dynamic(() => import("@/components/lightswind/globe"), { ssr: false });

export function HomeClosingCta() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2"
      >
        <Globe
          className="h-full w-full !min-h-0"
          dark={0}
          scale={0.83}
          diffuse={1.2}
          mapBrightness={10}
          mapSamples={24000}
          baseColor="#6C4CF1"
          markerColor="#8B5CF6"
          glowColor="#B79CFF"
          autoRotateSpeed={0.0015}
          enableZoom={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background via-background/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-background to-transparent md:h-56"
      />
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-32 md:px-20 md:py-44">
        <div className="max-w-2xl">
          <SectionHeader
          align="left"
          label="./launch"
          titleClassName="max-w-lg leading-tight md:text-5xl"
          title={
            <>
              Your AI Journey
              <br />
              Starts Here.
            </>
          }
        />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Join 15,000+ users who&apos;ve already put AI agents to work. Set up
            your first agent in under a minute - free, no credit card required.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2 rounded-none">
              <Link href="/login?tab=register">
                Get started free
                <Rocket className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group gap-2 rounded-none">
              <Link href="/about">
                Read the docs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}