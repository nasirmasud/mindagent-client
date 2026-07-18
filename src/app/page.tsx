"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { HeroSwiper } from "@/components/layout/hero-swiper";
import AgentCategories from "@/components/layout/agent-categories";

const categories = ["Writing", "Coding", "Research", "Design", "Analytics", "Productivity", "Education", "Finance"];

const features = [
  { title: "Content Creator", desc: "Generate blogs, social posts, and product descriptions with AI." },
  { title: "AI Chat Assistant", desc: "Get answers, guidance, and recommendations through conversation." },
  { title: "Data Analyzer", desc: "Upload and analyze data with natural language queries." },
  { title: "Document Summarizer", desc: "Summarize long documents into key points instantly." },
];

const steps = [
  { title: "Pick an Agent", desc: "Browse our marketplace of specialized AI agents." },
  { title: "Chat or Generate", desc: "Interact with agents through chat or content generation." },
  { title: "Save & Reuse", desc: "Save results and reuse them across your workflow." },
];

const testimonials = [
  { name: "Sarah K.", role: "Content Writer", text: "MindAgent cut my content creation time in half. The AI agents are incredibly intuitive." },
  { name: "Marcus J.", role: "Data Analyst", text: "The data analyzer feature is a game-changer. I can upload CSV files and get insights in seconds." },
  { name: "Priya R.", role: "Developer", text: "Having multiple specialized agents in one place is brilliant. Highly recommend." },
];

const faqs = [
  { q: "What is MindAgent?", a: "MindAgent is an AI-powered productivity platform with specialized agents for content generation, data analysis, and chat." },
  { q: "Is my data secure?", a: "Yes. Your data is encrypted in transit and at rest. We never share your data with third parties." },
  { q: "Can I try it for free?", a: "Absolutely. Use the demo login to explore all features without any commitment." },
  { q: "What file types are supported for data analysis?", a: "We support CSV, XLSX, and JSON files up to 5MB." },
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
    <div className="flex flex-col items-center">
      {/* 1. Hero */}
      <HeroSwiper />

      <AgentCategories />

      {/* 2. Featured Categories */}
      <section className="w-full px-4 md:px-20 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6">Agent Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link key={cat} href={`/explore?category=${cat.toLowerCase()}`}>
              <Badge variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-secondary/80">
                {cat}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Recommended for You */}
      {recData?.recommendations?.length > 0 && (
        <section className="w-full px-4 md:px-20 pb-16">
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recData.recommendations.map((agent: any) => (
              <Card key={agent._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{agent.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 4. AI Features */}
      <section className="w-full px-4 md:px-20 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">AI Agents</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="w-full bg-muted/50 py-16">
        <div className="px-4 md:px-20 text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title}>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="w-full px-4 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What Users Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="w-full bg-muted/50 py-16">
        <div className="px-4 md:px-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-background rounded-lg p-4 cursor-pointer">
                <summary className="font-medium">{faq.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter / CTA */}
      <section className="w-full py-16 text-center px-4 md:px-20">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">Get the latest AI tips and product updates.</p>
        <div className="flex gap-3 max-w-md mx-auto justify-center">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button onClick={() => { setEmail(""); toast.success("Subscribed!"); }}>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}
