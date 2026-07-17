import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agents = [
  { name: "Content Creator", category: "Writing", desc: "Generate blogs, social posts, and product descriptions.", rating: 4.8 },
  { name: "Chat Assistant", category: "Conversation", desc: "Intelligent chat with context-aware responses.", rating: 4.9 },
  { name: "Data Analyzer", category: "Analytics", desc: "Analyze data with natural language.", rating: 4.6 },
  { name: "Document Summarizer", category: "Productivity", desc: "Summarize long documents instantly.", rating: 4.7 },
];

export default function ExplorePage() {
  return (
    <div className="w-full px-4 py-10">
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
