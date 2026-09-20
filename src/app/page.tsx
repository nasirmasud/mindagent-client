"use client";

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
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Recommended for You
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map((agent) => (
                <Card key={agent._id} className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      {agent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {agent.description}
                    </CardDescription>
                  </CardContent>
                </Card>
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