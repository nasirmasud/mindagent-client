"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const features = [
  { title: "Content Creator", desc: "Generate blogs, social posts, and product descriptions with AI." },
  { title: "AI Chat Assistant", desc: "Get answers, guidance, and recommendations through conversation." },
  { title: "Data Analyzer", desc: "Upload and analyze data with natural language queries." },
  { title: "Document Summarizer", desc: "Summarize long documents into key points instantly." },
];

export default function Home() {
  const { isAuthenticated } = useAuthContext();

  const { data: recData } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<any>("/recommendations"),
    enabled: isAuthenticated,
  });

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight">MindAgent</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
          AI Agents That Think. Create. Deliver Results.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/explore">Explore Agents</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/ai-chat">Try AI Chat</Link>
          </Button>
        </div>
      </section>

      {recData?.recommendations?.length > 0 && (
        <section className="w-full max-w-5xl mx-auto px-4 pb-12">
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

      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
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
    </div>
  );
}
