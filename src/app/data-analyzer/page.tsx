"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Download,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Shield,
  Zap,
  LineChart,
  PieChart,
  Activity,
  FileSpreadsheet,
  Bot,
  Loader2,
  X,
  RefreshCw,
  Clock,
  ChevronRight,
  Eye,
  Star,
  Quote,
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://mindagent-server.onrender.com/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface KPI {
  label: string;
  value: string;
}

interface ChartItem {
  label: string;
  value: number;
}

interface ItemInsights {
  summary: string;
  trends: string[];
  kpis: KPI[];
  risks: string[];
}

interface ParsedRow {
  [key: string]: unknown;
}

interface ItemData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  sourceFileName: string;
  sourceFileType: string;
  rowCount: number;
  columns: string[];
  parsedPreview: ParsedRow[];
  insights: ItemInsights;
  chartData: ChartItem[];
  status: string;
  createdAt: string;
  ownerId?: { name: string; email: string };
}

/* ───── Helpers ───── */
function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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

/* ───── Color Theme ───── */
const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.55)", "#5CE5D5", "#FF8C66", "#66B8FF", "#FFD666", "#FF66A8", "#7CE87C"];

/* ───── Section: Testimonial Card ───── */
function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 relative group hover:border-primary/40 transition-colors">
      <Quote className="text-primary/20 w-8 h-8 absolute top-4 right-4" />
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">{author}</p>
          <p className="text-muted-foreground text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export default function DataAnalyzerPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  /* state */
  const [uploading, setUploading] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemData | null>(null);
  const [history, setHistory] = useState<ItemData[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [recentFiles, setRecentFiles] = useState<ItemData[]>([]);
  const [editableKpis, setEditableKpis] = useState<{ label: string; value: string }[]>([]);
  const [chartColumn, setChartColumn] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  /* Derive chart data from parsedPreview grouped by selected column */
  const dynamicChartData = useMemo(() => {
    if (!chartColumn || !currentItem?.parsedPreview?.length) return [];
    const counts = new Map<string, number>();
    for (const row of currentItem.parsedPreview) {
      const val = String(row[chartColumn] ?? "(empty)");
      counts.set(val, (counts.get(val) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [chartColumn, currentItem?.parsedPreview]);

  /* Reset chart column when item changes */
  useEffect(() => {
    if (currentItem?.columns?.length) {
      setChartColumn(currentItem.columns[0]);
    }
  }, [currentItem?.columns]);

  /* Sync editableKpis when currentItem changes */
  useEffect(() => {
    if (currentItem?.insights?.kpis) {
      setEditableKpis(currentItem.insights.kpis.map(k => ({ label: k.label, value: k.value })));
    }
  }, [currentItem?.insights?.kpis]);

  /* Fetch recent items for the "Recent Files" section */
  const fetchRecent = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/items/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setRecentFiles(data.items?.slice(0, 5) || []);
        setHistory(data.items || []);
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) fetchRecent();
  }, [isAuthenticated]);

  /* Upload */
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please log in to analyze data");
        router.push("/login");
        return;
      }
      const form = new FormData();
      form.append("file", file);
      if (userPrompt.trim()) form.append("prompt", userPrompt.trim());
      const res = await fetch(`${BASE}/items`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setCurrentItem(data.item);
      toast.success("Analysis complete!");
      fetchRecent();
      setFile(null);
      setUserPrompt("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      if (currentItem?._id === id) setCurrentItem(null);
      fetchRecent();
    } catch {
      toast.error("Failed to delete");
    }
  };

  /* Download report */
  const handleDownload = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/items/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const item = currentItem || recentFiles.find((x) => x._id === id);
      a.download = `${item?.sourceFileName?.replace(/\.[^.]+$/, "") || "data"}-analysis.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  /* Drag handlers */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  if (loading || !isAuthenticated) return <PageSkeleton />;

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-4rem)]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative text-center">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-Powered Data Analysis
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-foreground via-primary to-primary/60 bg-clip-text text-transparent">
            Transform Your Data
            <br />
            Into Actionable Insights
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your CSV, Excel, or JSON files and let AI analyze patterns, detect trends,
            identify risks, and generate comprehensive reports in seconds.
          </p>

        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-y border-border py-8 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-muted-foreground text-xs uppercase tracking-widest mb-6">Trusted by teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground">
            {["TechFlow", "DataBridge", "CloudSync", "NexGen AI", "Quantum Labs", "InsightPro"].map((name) => (
              <span key={name} className="text-lg font-semibold tracking-tight opacity-60 hover:opacity-90 transition-opacity">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPLOAD SECTION ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4">
          {!isAuthenticated ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <Database className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ready to analyze your data?</h3>
              <p className="text-muted-foreground mb-6">Log in or create an account to upload files and get AI-powered insights.</p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-primary to-primary/80 px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-[0_0_30px_-8px_hsl(var(--primary))] transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Data File
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">CSV, XLSX, or JSON &mdash; up to 10MB</p>
                  </div>
                  <button
                    onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchRecent(); }}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    History
                    <ChevronRight className={`w-3 h-3 transition-transform ${showHistory ? "rotate-90" : ""}`} />
                  </button>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.json"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                        className="ml-4 p-1.5 rounded-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Drop your file here or click to browse</p>
                      <p className="text-muted-foreground text-sm mt-1">Supports CSV, XLSX, JSON</p>
                    </div>
                  )}
                </div>

                {file && (
                  <>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Optional: Ask the AI to focus on something specific (e.g. 'Highlight sales trends by region' or 'Find anomalies')"
                      rows={2}
                      className="mt-4 w-full rounded-xl border border-border bg-muted text-sm text-foreground placeholder:text-muted-foreground p-3 outline-none resize-none transition-all focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                    />
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="mt-4 w-full h-auto bg-gradient-to-r from-primary to-primary/80 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-8px_hsl(var(--primary))] transition-all"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Upload & Analyze
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              {/* Upload History Side */}
              {showHistory && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Analysis History
                  </h4>
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No analyses yet. Upload your first file above.</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {history.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => { setCurrentItem(item); setShowHistory(false); }}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{item.title || item.sourceFileName}</p>
                              <p className="text-xs text-muted-foreground">{item.rowCount} rows &middot; {timeAgo(item.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {item.insights?.summary && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownload(item._id); }}
                              className="p-1.5 rounded-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                              title="Download report"
                            >
                              <Download className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                              className="p-1.5 rounded-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── RESULTS DASHBOARD ── */}
      {currentItem && currentItem.insights?.summary && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Analysis Results
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {currentItem.sourceFileName} &middot; {currentItem.rowCount.toLocaleString()} rows &middot; {currentItem.columns.length} columns
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(currentItem._id)}
                  className="rounded-xl text-sm gap-2"
                >
                  <Download className="w-4 h-4" />
                  Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentItem(null)}
                  className="rounded-xl text-sm gap-2 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Summary */}
              <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-2">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Summary
                </h3>
                {currentItem.title && (
                  <h4 className="text-lg font-bold text-foreground mb-2">{currentItem.title}</h4>
                )}
                {currentItem.shortDescription && (
                  <p className="text-primary/70 text-sm mb-3">{currentItem.shortDescription}</p>
                )}
                {currentItem.fullDescription && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{currentItem.fullDescription}</p>
                )}
                {currentItem.insights.summary && (
                  <div className="bg-muted rounded-xl p-4 mt-2">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Key Findings</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{currentItem.insights.summary}</p>
                  </div>
                )}
              </div>

              {/* KPIs */}
              {(currentItem.insights.kpis.length > 0 || editableKpis.length > 0) && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary/80" />
                      Key Metrics
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditableKpis([...editableKpis, { label: "", value: "" }])}
                        className="text-xs text-primary hover:text-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors"
                      >
                        + Add
                      </button>
                      {JSON.stringify(editableKpis) !== JSON.stringify(currentItem.insights.kpis) && (
                        <button
                          onClick={() => {
                            const updated = { ...currentItem, insights: { ...currentItem.insights, kpis: editableKpis.filter(k => k.label || k.value) } };
                            setCurrentItem(updated);
                            toast.success("KPIs updated");
                          }}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors font-medium"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {editableKpis.map((kpi, i) => (
                      <div key={i} className="bg-muted border border-border rounded-xl p-3 text-center group">
                        <select
                          value={kpi.label}
                          onChange={(e) => {
                            const next = [...editableKpis];
                            next[i] = { ...next[i], label: e.target.value };
                            setEditableKpis(next);
                          }}
                          className="w-full bg-transparent text-xs text-muted-foreground text-center mb-1 outline-none focus:text-foreground border-b border-transparent focus:border-primary transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-muted">Select column...</option>
                          {currentItem.columns.map((col) => (
                            <option key={col} value={col} className="bg-muted">{col}</option>
                          ))}
                          {kpi.label && !currentItem.columns.includes(kpi.label) && (
                            <option value={kpi.label} className="bg-muted">{kpi.label}</option>
                          )}
                        </select>
                        <input
                          value={kpi.value}
                          onChange={(e) => {
                            const next = [...editableKpis];
                            next[i] = { ...next[i], value: e.target.value };
                            setEditableKpis(next);
                          }}
                          className="w-full bg-transparent text-lg font-bold text-foreground text-center outline-none"
                          placeholder="Value"
                        />
                        <button
                          onClick={() => setEditableKpis(editableKpis.filter((_, j) => j !== i))}
                          className="mt-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-[10px] text-destructive hover:text-destructive/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trends */}
              {currentItem.insights.trends.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trends
                  </h3>
                  <ul className="space-y-2">
                    {currentItem.insights.trends.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Charts */}
            {currentItem.columns.length > 0 && (
              <div className="mb-4">
                <label className="text-xs text-muted-foreground font-medium mr-2">Chart Column:</label>
                <select
                  value={chartColumn}
                  onChange={(e) => setChartColumn(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                >
                  {currentItem.columns.map((col) => (
                    <option key={col} value={col} className="bg-muted">{col}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {dynamicChartData.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-destructive" />
                    Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dynamicChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                        labelStyle={{ color: "hsl(var(--primary))" }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {dynamicChartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {dynamicChartData.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-primary/80" />
                    Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RePieChart>
                      <Pie
                        data={dynamicChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dynamicChartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                        labelStyle={{ color: "hsl(var(--primary))" }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Risks */}
            {currentItem.insights.risks.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Risks & Anomalies
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {currentItem.insights.risks.map((risk, i) => (
                    <div key={i} className="bg-muted border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Preview Table */}
            {currentItem.parsedPreview.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 mt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  Data Preview
                  <span className="text-xs text-muted-foreground font-normal">(first {currentItem.parsedPreview.length} rows)</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {Object.keys(currentItem.parsedPreview[0]).map((col) => (
                          <th key={col} className="text-left p-3 text-muted-foreground font-medium whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItem.parsedPreview.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted transition-colors">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-3 text-muted-foreground whitespace-nowrap">{String(val ?? "")}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── RECENT FILES ── */}
      {recentFiles.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Analyses
              </h2>
              <button
                onClick={() => { setShowHistory(true); fetchRecent(); }}
                className="text-sm text-primary hover:text-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentFiles.slice(0, 6).map((item) => (
                <button
                  key={item._id}
                  onClick={() => setCurrentItem(item)}
                  className="text-left bg-card border border-border rounded-xl p-5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FileSpreadsheet className="w-8 h-8 text-primary" />
                    <span className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1 truncate group-hover:text-primary/70 transition-colors">
                    {item.title || item.sourceFileName}
                  </h4>
                  <p className="text-xs text-muted-foreground">{item.rowCount.toLocaleString()} rows &middot; {item.sourceFileType?.toUpperCase()}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-card to-muted border border-border rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/8 rounded-full blur-[80px]" />
            <div className="relative">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to analyze your data?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of professionals who trust our AI-powered data analysis platform.
                Start with our free tier &mdash; no credit card required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={() => {
                    if (!isAuthenticated) router.push("/login");
                    else fileRef.current?.click();
                  }}
                  className="h-auto bg-gradient-to-r from-primary to-primary/80 px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-[0_0_30px_-8px_hsl(var(--primary))] transition-all hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5" />
                  Start Analyzing
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-auto px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Free tier available</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
