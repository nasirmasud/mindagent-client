"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  Newspaper,
  ShoppingBag,
  Hash,
  BookOpen,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  History,
  Trash2,
  X,
} from "lucide-react";

const TEMPLATES = [
  { value: "blog", label: "Blog / Article", desc: "Long-form content", icon: Newspaper },
  { value: "product", label: "Product Description", desc: "E-commerce copy", icon: ShoppingBag },
  { value: "social", label: "Social Post", desc: "Short & punchy", icon: Hash },
  { value: "docs", label: "Documentation", desc: "Technical & clear", icon: BookOpen },
] as const;

const TONES = ["professional", "friendly", "persuasive", "witty"] as const;

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (~120 words)" },
  { value: "medium", label: "Medium (~300 words)" },
  { value: "long", label: "Long (~600 words)" },
] as const;

export default function ContentGeneratorPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [lengthIdx, setLengthIdx] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [historySidebar, setHistorySidebar] = useState(false);

  interface HistoryItem {
    _id: string;
    prompt: string;
    output: string;
    contentType: string;
    tone: string;
    length: string;
    createdAt: string;
  }

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    (async () => {
      try {
        const data: any = await api("/ai/history");
        setHistoryItems(data.items || []);
      } catch {}
    })();
  }, [isAuthenticated, authLoading]);

  const resultRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({
          topic,
          contentType,
          tone,
          length: LENGTH_OPTIONS[lengthIdx].value,
        }),
      });
      setOutput(data.content);
      const fresh: any = await api("/ai/history");
      setHistoryItems(fresh.items || []);
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setTopic(item.prompt);
    setContentType(item.contentType);
    setTone(item.tone);
    const idx = LENGTH_OPTIONS.findIndex((l) => l.value === item.length);
    if (idx !== -1) setLengthIdx(idx);
    setOutput(item.output);
    setHistorySidebar(false);
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api(`/ai/history/${id}`, { method: "DELETE" });
      setHistoryItems((prev) => prev.filter((h) => h._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentType}-content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const length = LENGTH_OPTIONS[lengthIdx];
  const ActiveTemplateIcon = TEMPLATES.find((t) => t.value === contentType)?.icon || FileText;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp .35s cubic-bezier(.4,0,.2,1) both; }
        @keyframes pulseBar {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .skeleton-line {
          background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--border)) 37%, hsl(var(--muted)) 63%);
          background-size: 400% 100%;
          animation: pulseBar 1.4s ease infinite;
        }
      `}</style>

      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 sm:px-6 h-16 border-b border-border flex-shrink-0 sticky top-0 bg-background z-10">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <FileText className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">AI Content Generator</p>
            <p className="text-xs text-muted-foreground truncate">Blogs, product copy, docs & social posts</p>
          </div>

          <Link
            href="/ai-chat"
            className="ml-auto hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground border border-border px-3 py-2 rounded-lg hover:bg-accent hover:text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Open Chat Assistant
          </Link>
          <button
            onClick={() => setHistorySidebar(true)}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          >
            <History className="w-4.5 h-4.5" />
          </button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr_280px]">
          {/* Left: controls */}
          <div className="border-b lg:border-b-0 lg:border-r border-border p-6 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Choose a template</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                const active = contentType === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setContentType(t.value)}
                    className={`text-left p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.2)] hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      active
                        ? "border-primary bg-accent"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                      active ? "bg-primary" : "bg-accent"
                    }`}>
                      <Icon className={`w-4 h-4 ${active ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Topic / prompt</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="e.g. Why small businesses should adopt AI agents in 2026"
              className="w-full rounded-xl border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground p-3 outline-none resize-none mb-5 transition-all duration-250 focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] focus:bg-card"
            />

            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tone</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    tone === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output length</label>
              <span className="text-xs font-semibold text-primary">{length.label}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={lengthIdx}
              onChange={(e) => setLengthIdx(Number(e.target.value))}
              className="w-full mb-1 h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_hsl(var(--primary))] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mb-6">
              <span>Short</span>
              <span>Medium</span>
              <span>Long</span>
            </div>

            <Button
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="w-full h-12 rounded-xl font-semibold text-sm gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_hsl(var(--primary)/0.45)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Generating..." : "Generate Content"}
            </Button>
          </div>

          {/* Right: output */}
          <div className="p-6 sm:p-8 overflow-y-auto bg-muted/40">
            {!output && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Your generated content will appear here</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Pick a template, describe your topic, and hit Generate.</p>
              </div>
            )}

            {loading && (
              <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary">Generating your content...</span>
                </div>
                <div className="space-y-3">
                  <div className="skeleton-line h-4 rounded w-3/4" />
                  <div className="skeleton-line h-4 rounded w-full" />
                  <div className="skeleton-line h-4 rounded w-full" />
                  <div className="skeleton-line h-4 rounded w-5/6" />
                  <div className="skeleton-line h-4 rounded w-full mt-5" />
                  <div className="skeleton-line h-4 rounded w-2/3" />
                </div>
              </div>
            )}

            {output && !loading && (
              <div className="max-w-2xl mx-auto" ref={resultRef}>
                <div className="fade-in bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full capitalize">
                        {TEMPLATES.find((t) => t.value === contentType)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{length.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={copyOutput} className="w-8 h-8 rounded-lg" aria-label="Copy output">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={downloadOutput} className="w-8 h-8 rounded-lg" aria-label="Download output">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" onClick={generate} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Not quite right? Tweak the prompt, tone, or length on the left and regenerate.
                </p>
              </div>
            )}
          </div>

          {/* Right: history sidebar */}
          <aside className="hidden lg:flex flex-col border-l border-border bg-muted/50">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">History</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto chat-scrollbar p-3 space-y-2">
              {historyItems.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No history yet</p>
              )}
              {historyItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => loadHistoryItem(item)}
                  className="group p-3 rounded-xl border border-border bg-card cursor-pointer transition-all hover:border-primary hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.prompt.length > 50 ? item.prompt.slice(0, 50) + "…" : item.prompt}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold text-primary bg-accent px-1.5 py-0.5 rounded capitalize">
                          {item.contentType}
                        </span>
                        <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteHistoryItem(e, item._id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile history overlay */}
          {historySidebar && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setHistorySidebar(false)} />
              <aside className="absolute right-0 top-0 h-full w-72 bg-card shadow-xl flex flex-col">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">History</span>
                  </div>
                  <button onClick={() => setHistorySidebar(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {historyItems.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">No history yet</p>
                  )}
                  {historyItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => loadHistoryItem(item)}
                      className="group p-3 rounded-xl border border-border bg-card cursor-pointer transition-all hover:border-primary"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {item.prompt.length > 50 ? item.prompt.slice(0, 50) + "…" : item.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-semibold text-primary bg-accent px-1.5 py-0.5 rounded capitalize">
                              {item.contentType}
                            </span>
                            <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* copy toast */}
      <div
        className={`fixed bottom-6 right-6 bg-foreground text-background text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-250 ${
          showCopied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span>Copied to clipboard</span>
      </div>
    </>
  );
}
