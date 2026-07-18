"use client";

import AgentCategories from "@/components/layout/agent-categories";
import FeatureStrip from "@/components/layout/feature-strip";
import HowItWorks from "@/components/layout/how-it-works";
import Testimonials from "@/components/layout/testimonials";
import { HeroSwiper } from "@/components/layout/hero-swiper";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { toast } from "sonner";

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




const faqs = [
  {
    q: "What is MindAgent?",
    a: "MindAgent is an AI-powered productivity platform with specialized agents for content generation, data analysis, and chat.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is encrypted in transit and at rest. We never share your data with third parties.",
  },
  {
    q: "Can I try it for free?",
    a: "Absolutely. Use the demo login to explore all features without any commitment.",
  },
  {
    q: "What file types are supported for data analysis?",
    a: "We support CSV, XLSX, and JSON files up to 5MB.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");

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

      {/* 7. FAQ */}
      <section className='w-full bg-muted/50 py-16'>
        <div className='px-4 md:px-20 max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-8'>FAQ</h2>
          <div className='space-y-3'>
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className='bg-background rounded-lg p-4 cursor-pointer'
              >
                <summary className='font-medium'>{faq.q}</summary>
                <p className='mt-2 text-sm text-muted-foreground'>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter / CTA */}
      <section className='w-full py-16 text-center px-4 md:px-20'>
        <h2 className='text-3xl font-bold mb-4'>Stay Updated</h2>
        <p className='text-muted-foreground mb-6'>
          Get the latest AI tips and product updates.
        </p>
        <div className='flex gap-3 max-w-md mx-auto justify-center'>
          <input
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          />
          <Button
            onClick={() => {
              setEmail("");
              toast.success("Subscribed!");
            }}
          >
            Subscribe
          </Button>
        </div>
      </section>
    </div>
  );
}
