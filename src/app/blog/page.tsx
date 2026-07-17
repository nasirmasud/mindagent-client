import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  { title: "Getting Started with AI Agents", date: "2026-07-01", excerpt: "Learn how MindAgent's agents can boost your productivity." },
  { title: "Content Creation with AI", date: "2026-06-25", excerpt: "Tips for generating high-quality content using AI." },
  { title: "Understanding Multi-Provider AI", date: "2026-06-18", excerpt: "How OpenRouter powers MindAgent's AI capabilities." },
];

export default function BlogPage() {
  return (
    <div className="w-full px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.title}>
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
