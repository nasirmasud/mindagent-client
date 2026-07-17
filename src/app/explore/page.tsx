"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";

const agents = [
  { name: "Content Creator", category: "Writing", desc: "Generate blogs, social posts, and product descriptions.", rating: 4.8 },
  { name: "Chat Assistant", category: "Conversation", desc: "Intelligent chat with context-aware responses.", rating: 4.9 },
  { name: "Data Analyzer", category: "Analytics", desc: "Analyze data with natural language.", rating: 4.6 },
  { name: "Document Summarizer", category: "Productivity", desc: "Summarize long documents instantly.", rating: 4.7 },
];

export default function ExplorePage() {
  const { isAuthenticated } = useAuthContext();

  const { data: recData, isLoading: recLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<any>("/recommendations"),
    enabled: isAuthenticated,
  });

  return (
    <div className="w-full px-4 md:px-20 py-10">
      {/* Recommended for You */}
      {isAuthenticated && recLoading && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </section>
      )}

      {recData?.recommendations?.length > 0 && (
        <section className="mb-10">
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

      {/* All Agents */}
      <h1 className="text-3xl font-bold mb-8">Explore AI Agents</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge>{agent.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{agent.desc}</CardDescription>
              <p className="text-sm text-muted-foreground">Rating: {agent.rating}/5</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
