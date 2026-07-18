"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Copy, RefreshCw } from "lucide-react";
const contentTypes = [
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Media" },
  { value: "product", label: "Product Description" },
];

const tones = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
];

const lengths = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export default function ContentGeneratorPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const data: any = await api("/ai/generate-content", {
        method: "POST",
        body: JSON.stringify({ topic, contentType, tone, length }),
      });
      setOutput(data.content);
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="w-full px-4 md:px-20 py-10">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
          <CardDescription>
            Generate blog posts, social media content, and product descriptions with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Enter your topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generate} disabled={loading || !topic.trim()}>
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Button
              variant="outline"
              onClick={generate}
              disabled={loading || !topic.trim()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated Content</Label>
                <Button variant="ghost" size="sm" onClick={copyOutput}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <Textarea
                value={output}
                readOnly
                className="min-h-[200px]"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
