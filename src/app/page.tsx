"use client";

import AgentCategories from "@/components/layout/agent-categories";
import FaqSection from "@/components/layout/faq-section";
import FeatureStrip from "@/components/layout/feature-strip";
import HowItWorks from "@/components/layout/how-it-works";
import NewsletterSection from "@/components/layout/newsletter-section";
import Testimonials from "@/components/layout/testimonials";
import { HeroSwiper } from "@/components/layout/hero-swiper";
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

const categories = [
  "Writing",
  "Coding",
  "Research",
  "Design",
  "Analytics",
  "Productivity",
  "Education",
  "Finance",
];



export default function Home() {
  const { isAuthenticated } = useAuthContext();

  const { data: recData } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<any>("/recommendations"),
    enabled: isAuthenticated,
  });

  return (
    <div className='flex flex-col items-center'>
      {/* 1. Hero */}
      <HeroSwiper />

      <FeatureStrip />

      {/* 2. Agent Categories */}
      <AgentCategories />

      {/* 3. Recommended for You */}
      {recData?.recommendations?.length > 0 && (
        <section className='w-full px-4 md:px-20 pb-16'>
          <h2 className='text-2xl font-bold mb-6'>Recommended for You</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {recData.recommendations.map((agent: any) => (
              <Card key={agent._id}>
                <CardHeader>
                  <CardTitle className='text-lg'>{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{agent.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}


      <HowItWorks />

      <Testimonials />

      <FaqSection />

      <NewsletterSection />
    </div>
  );
}
