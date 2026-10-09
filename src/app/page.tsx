"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewsletterSection from "@/components/layout/newsletter-section";
import { HomeActivityStream } from "@/components/home/home-activity-stream";
import { HomeBlog } from "@/components/home/home-blog";
import { HomeClosingCta } from "@/components/home/home-closing-cta";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeFeatureGrid } from "@/components/home/home-feature-grid";
import { HomeHero } from "@/components/home/home-hero";
import { HomeIntegrations } from "@/components/home/home-integrations";
import { HomePricing } from "@/components/home/home-pricing";
import { HomeSecurity } from "@/components/home/home-security";
import { HomeStatsStrip } from "@/components/home/home-stats-strip";
import { SectionDivider } from "@/components/home/section-divider";
import { HomeSteps } from "@/components/home/home-steps";
import { HomeTestimonials } from "@/components/home/home-testimonials";
import { HomeTrustStats } from "@/components/home/home-trust-stats";
import { HomeLoader } from "@/components/layout/home-loader";
import { SectionHeader } from "@/components/home/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";

interface Recommendation {
  _id: string;
  name: string;
  description: string;
  category?: string;
}

// Agents are matched by category against the user's most-used content types, so the
// stored category will not always be one we can map. Anything unmapped lands on
// /explore rather than a dead link - there is no per-agent detail route.
const AGENT_ROUTES: Record<string, string> = {
  research: "/ai-chat",
  data: "/data-analyzer",
  writing: "/content-generator",
  content: "/content-generator",
  vision: "/image-analyzer",
  coding: "/ai-chat",
  chat: "/ai-chat",
};

function agentHref(category?: string): string {
  return AGENT_ROUTES[(category ?? "").toLowerCase()] ?? "/explore";
}

export default function Home() {
  const { isAuthenticated } = useAuthContext();

  const { data: recData } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<{ recommendations: Recommendation[] }>("/recommendations"),
    enabled: isAuthenticated,
  });

  const recommendations = recData?.recommendations ?? [];

  return (
    <div className="flex flex-col items-center">
      <HomeLoader />
      <HomeHero />

      {recommendations.length > 0 && (
        <section className="w-full px-4 md:px-20 pb-24 border-b border-border">
          <div className="mx-auto w-full max-w-7xl">
            <SectionHeader
              align="left"
              label="./recommended"
              titleClassName="mb-6 text-2xl"
              title="Recommended for You"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map((agent) => (
                <Link
                  key={agent._id}
                  href={agentHref(agent.category)}
                  className="group rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full rounded-none border-border bg-card shadow-none transition-colors group-hover:bg-accent/40">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">
                        {agent.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {agent.description}
                      </CardDescription>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                        Open agent
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeStatsStrip />
      <HomeFeatureGrid />
      <SectionDivider />
      <HomeSteps />
      <HomeIntegrations />
      <HomeTestimonials />
      <HomeTrustStats />
      <HomeSecurity />
      <HomePricing />
      <HomeActivityStream />
      <HomeFaq />
      <SectionDivider />
      <HomeBlog />
      <SectionDivider />
      <HomeClosingCta />

      <NewsletterSection />
    </div>
  );
}