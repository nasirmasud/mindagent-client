"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";
import {
  UploadCloud, ImageIcon, Sparkles, Bot, CheckCircle2, RefreshCw,
  Search, Eye, ScanEye, Copy, Download,
  X, Clock, Trash2, ChevronRight, Wand2, Loader2,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://mindagent-server.onrender.com/api";

const promptChips = [
  "Describe this image",
  "What's in the receipt?",
  "Identify the plant",
  "Explain this UI screenshot",
];

interface HistoryItem {
  _id: string;
  imageName: string;
  prompt: string;
  analysis: string;
  createdAt: string;
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ImageAnalyzerPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<"idle" | "analyzing" | "done">("idle");
  const [analysis, setAnalysis] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${BASE}/ai/image-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.items || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchHistory();
  }, [isAuthenticated, fetchHistory]);

  const loadFile = (file: File) => {
    if (!file || !file.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setPreview(e.target.result as string);
    };
    reader.readAsDataURL(file);
    setStage("idle");
    setAnalysis("");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    if (inputRef.current) inputRef.current.value = "";
  };

  const analyze = async () => {
    if (!preview) {
      toast.error("Upload an image first");
      return;
    }
    setStage("analyzing");
    setAnalysis("");
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please log in");
        router.push("/login");
        return;
      }
      const res = await fetch(`${BASE}/ai/analyze-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: preview,
          imageName: fileName || "untitled",
          prompt: prompt.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");
      setAnalysis(data.analysis.analysis);
      setStage("done");
      fetchHistory();
    } catch (err: any) {
      toast.error(err.message);
      setStage("idle");
    }
  };

  const deleteHistory = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/ai/image-history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setHistory((h) => h.filter((item) => item._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const loadHistoryItem = async (item: HistoryItem) => {
    setAnalysis(item.analysis);
    setPrompt(item.prompt || "");
    setFileName(item.imageName);
    setStage("done");
    setPreview(null);
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/ai/image-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const full = data.items?.find((i: HistoryItem) => i._id === item._id);
        if (full?.imageData) {
          setPreview(full.imageData);
        }
      }
    } catch {}
    setShowHistory(false);
  };

  const clearImage = () => {
    setPreview(null);
    setFileName("");
    setStage("idle");
    setAnalysis("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyResult = () => {
    navigator.clipboard.writeText(analysis);
    toast.success("Copied to clipboard");
  };

  if (authLoading) return <PageSkeleton />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0A13] text-white">
      <style>{`
        @keyframes scanY {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#1D1D2C] pt-16 pb-14 md:pt-20 md:pb-16">
        <div className="pointer-events-none absolute -top-52 left-[15%] h-[480px] w-[480px] rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(closest-side, #4F3FBF, transparent)" }} />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A40] bg-[#131320] px-3 py-1 text-xs text-[#9B85FF]">
            <ScanEye size={12} /> Multimodal understanding
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Show it a picture.
            <br />
            <span className="bg-gradient-to-r from-[#9B85FF] to-[#7FA8FF] bg-clip-text text-transparent">Get the whole story.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
            Upload any image &mdash; a receipt, a plant, a UI screenshot &mdash; add an optional question, and the vision
            agent explains exactly what it sees.
          </p>
        </div>
      </section>

      {/* ── WORKSPACE ── */}
      <section className="mx-auto max-w-[1600px] px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* History sidebar */}
          <aside className="order-2 lg:order-1">
            <div className="rounded-2xl border border-[#232235] bg-[#131320] p-4 lg:sticky lg:top-24">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Clock size={14} className="text-[#9B85FF]" /> History
                </h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors lg:hidden"
                >
                  <ChevronRight className={`w-3 h-3 transition-transform ${showHistory ? "rotate-90" : ""}`} />
                  {showHistory ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mb-3 hidden lg:flex items-center gap-1.5 rounded-lg border border-[#232235] bg-[#0F0F1A] px-2.5 py-1.5">
                <Search size={12} className="text-gray-500" />
                <input placeholder="Search history" className="w-full bg-transparent text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none" />
              </div>
              <div className={`space-y-1.5 overflow-y-auto pr-1 ${showHistory ? "max-h-[520px]" : "max-h-[520px]"} max-lg:${showHistory ? "block" : "hidden"}`}>
                {history.length === 0 ? (
                  <p className="py-8 text-center text-xs text-gray-600">No analyses yet</p>
                ) : (
                  history.map((h) => (
                    <div
                      key={h._id}
                      onClick={() => loadHistoryItem(h)}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-transparent bg-[#0F0F1A] p-2 text-left transition-colors hover:border-[#232235] cursor-pointer"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC]/10">
                        <ImageIcon size={14} className="text-[#9B85FF]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{h.imageName}</p>
                        <p className="truncate text-[10px] text-gray-500">{h.prompt || "No prompt"} &middot; {timeAgo(h.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHistory(h._id); }}
                        className="shrink-0 p-1 rounded hover:bg-[#232235] transition-colors"
                      >
                        <Trash2 size={11} className="text-gray-500 hover:text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main panel */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Upload / preview */}
              <div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => !preview && inputRef.current?.click()}
                  className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
                    dragging ? "border-[#7C5CFC] bg-[#7C5CFC]/5" : "border-[#2A2A40] bg-[#0F0F1A]"
                  } ${!preview ? "cursor-pointer" : ""}`}
                >
                  <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
                  {!preview && (
                    <div className="flex flex-col items-center px-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7C5CFC]/10">
                        <UploadCloud size={24} className="text-[#9B85FF]" />
                      </div>
                      <p className="text-sm font-medium">Drag an image here, or browse</p>
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WEBP up to 15MB</p>
                    </div>
                  )}

                  {preview && (
                    <>
                      <img src={preview} alt="preview" className="h-full w-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); clearImage(); }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                      {stage === "analyzing" && (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-black/30" />
                          <div
                            className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9B85FF] to-transparent shadow-[0_0_16px_2px_rgba(155,133,255,0.7)]"
                            style={{ animation: "scanY 1.6s ease-in-out infinite alternate" }}
                          />
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-gray-300 backdrop-blur">
                            <RefreshCw size={10} className="animate-spin" /> Analyzing&hellip;
                          </div>
                        </>
                      )}
                      {stage === "done" && (
                        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-[10px] font-semibold text-[#0A0A13]">
                          <CheckCircle2 size={11} /> Analyzed
                        </span>
                      )}
                    </>
                  )}
                </div>
                {fileName && (
                  <p className="mt-2 truncate text-xs text-gray-500">{fileName}</p>
                )}
              </div>

              {/* Prompt + analyze + results */}
              <div className="flex flex-col">
                <label className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Optional prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask something specific, or leave blank for a general description&hellip;"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#232235] bg-[#0F0F1A] px-3.5 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#7C5CFC]/60 focus:outline-none"
                />
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {promptChips.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPrompt(c)}
                      className="rounded-full border border-[#232235] bg-[#131320] px-2.5 py-1 text-[11px] text-gray-400 hover:border-[#3A3A55] hover:text-gray-200"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <button
                  onClick={analyze}
                  disabled={stage === "analyzing" || !preview}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5A38EA] text-white px-5 py-3 text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_30px_-8px_#7C5CFC] transition-all"
                >
                  {stage === "analyzing" ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing image&hellip;</>
                  ) : (
                    <><Wand2 size={16} /> Analyze image</>
                  )}
                </button>

                {/* Results */}
                <div className="mt-5 flex-1 rounded-2xl border border-[#232235] bg-[#131320] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Bot size={15} className="text-[#9B85FF]" /> Result
                  </h3>

                  {stage === "idle" && (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                      <Eye size={22} className="mb-2 text-gray-600" />
                      <p className="text-xs text-gray-500">Upload an image and hit analyze to see what the agent finds.</p>
                    </div>
                  )}

                  {stage === "analyzing" && (
                    <div className="space-y-2.5 pt-3">
                      <div className="h-2.5 w-full animate-pulse rounded bg-[#1D1D2C]" />
                      <div className="h-2.5 w-5/6 animate-pulse rounded bg-[#1D1D2C]" />
                      <div className="h-2.5 w-3/4 animate-pulse rounded bg-[#1D1D2C]" />
                    </div>
                  )}

                  {stage === "done" && analysis && (
                    <div className="pt-3">
                      <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{analysis}</p>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={copyResult}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#2A2A40] px-3 py-2 text-xs text-gray-300 hover:border-[#3A3A55]"
                        >
                          <Copy size={12} /> Copy result
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([analysis], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${fileName || "image"}-analysis.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#2A2A40] px-3 py-2 text-xs text-gray-300 hover:border-[#3A3A55]"
                        >
                          <Download size={12} /> Export
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="py-16">
          <div className="mx-auto max-w-[1600px] px-4 text-center">
            <div className="bg-gradient-to-br from-[#131320] to-[#0D0D1A] border border-[#232235] rounded-3xl p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFC]/10 rounded-full blur-[100px]" />
              <div className="relative">
                <Sparkles className="w-10 h-10 text-[#7C5CFC] mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to analyze images?</h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-8">
                  Sign up free &mdash; no credit card required.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-[#7C5CFC] to-[#5A38EA] text-white px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-[0_0_30px_-8px_#7C5CFC] transition-all"
                >
                  <Wand2 className="w-5 h-5" />
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
