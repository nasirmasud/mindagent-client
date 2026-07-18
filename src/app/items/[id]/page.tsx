"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";
import { ArrowLeft, Download, Calendar, User, FileText, Table2, TrendingUp, AlertTriangle, BarChart3, Target, ExternalLink } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  sourceFileName: string;
  sourceFileType: string;
  rowCount: number;
  columns: string[];
  parsedPreview: Record<string, unknown>[];
  insights: {
    summary: string;
    trends: string[];
    kpis: { label: string; value: string }[];
    risks: string[];
  };
  chartData: { label: string; value: number }[];
  status: string;
  ownerId: { _id: string; name: string; email: string };
  createdAt: string;
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [related, setRelated] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE}/items/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Not found");
        setItem(data.item);
        setRelated(data.related || []);
      } catch {
        toast.error("Failed to load report");
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/items/${id}/report`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item?.sourceFileName.replace(/\.[^.]+$/, "")}-analysis.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (!item) return null;

  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="w-full px-4 md:px-20 py-8 space-y-8">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/explore">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl">{item.title}</CardTitle>
              <CardDescription className="text-base">{item.shortDescription}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1 shrink-0">{item.sourceFileType.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {item.ownerId?.name || "Unknown"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {date}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> {item.sourceFileName}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Table2 className="h-4 w-4 text-indigo-500" /> Data Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Rows</span>
              <span className="font-medium">{item.rowCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Columns</span>
              <span className="font-medium">{item.columns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">File Type</span>
              <span className="font-medium">{item.sourceFileType.toUpperCase()}</span>
            </div>
          </CardContent>
        </Card>

        {item.insights.kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" /> {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {item.insights.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{item.insights.summary}</p>
          </CardContent>
        </Card>
      )}

      {item.fullDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Full Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{item.fullDescription}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {item.insights.trends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" /> Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {item.insights.trends.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {item.insights.risks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {item.insights.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {item.chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" /> Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={item.chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {item.parsedPreview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Preview</CardTitle>
            <CardDescription>{item.parsedPreview.length} of {item.rowCount} rows shown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    {Object.keys(item.parsedPreview[0]).map((col) => (
                      <th key={col} className="text-left p-2 font-medium text-muted-foreground">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.parsedPreview.map((row, i) => (
                    <tr key={i} className="border-b">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="p-2">{String(val ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={handleDownload} disabled={downloading}>
          <Download className="h-4 w-4 mr-2" />
          {downloading ? "Downloading..." : "Download Excel Report"}
        </Button>
      </div>

      {related.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Reports</CardTitle>
            <CardDescription>Other {item.sourceFileType.toUpperCase()} analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link key={r._id} href={`/items/${r._id}`}>
                  <Card className="h-full hover:bg-muted/50 transition cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{r.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{r.rowCount} rows</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3" /> View
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
