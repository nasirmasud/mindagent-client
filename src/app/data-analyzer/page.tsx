"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

interface Analysis {
  _id: string;
  fileName: string;
  fileType: string;
  originalRowCount: number;
  parsedPreview: Record<string, unknown>[];
  aiInsights: {
    summary: string;
    trends: string[];
    risks: string[];
    kpis: { label: string; value: string }[];
  };
  createdAt: string;
}

export default function DataAnalyzerPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [tab, setTab] = useState<"upload" | "history">("upload");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const token = getToken();
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/data-analysis/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setAnalysis({
        _id: data.analysisId,
        fileName: data.fileName,
        fileType: data.fileType,
        originalRowCount: data.rowCount,
        parsedPreview: data.preview,
        aiInsights: { summary: "", trends: [], risks: [], kpis: [] },
        createdAt: new Date().toISOString(),
      });
      toast.success("File uploaded and parsed");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!analysis) return;
    setAnalyzing(true);
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/data-analysis/${analysis._id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");
      setAnalysis(data.analysis);
      toast.success("Analysis complete");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadHistory = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/data-analysis`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setHistory(data.analyses);
    } catch {}
  };

  const loadAnalysis = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/data-analysis/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setAnalysis(data.analysis);
    } catch {}
  };

  const downloadReport = async () => {
    if (!analysis) return;
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/data-analysis/${analysis._id}/report`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${analysis.fileName.replace(/\.[^.]+$/, "")}-analysis.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Analyzer</h1>
        <div className="flex gap-2">
          <Button variant={tab === "upload" ? "default" : "outline"} onClick={() => setTab("upload")}>Upload</Button>
          <Button variant={tab === "history" ? "default" : "outline"} onClick={() => { setTab("history"); loadHistory(); }}>History</Button>
        </div>
      </div>

      {tab === "upload" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>CSV, XLSX, or JSON (max 5MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input ref={fileRef} type="file" accept=".csv,.xlsx,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Uploading..." : "Upload & Parse"}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{analysis.fileName}</CardTitle>
                  <CardDescription>{analysis.originalRowCount} rows · {analysis.fileType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          {analysis.parsedPreview.length > 0 && Object.keys(analysis.parsedPreview[0]).map((col) => (
                            <th key={col} className="text-left p-2 font-medium">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.parsedPreview.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-b">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="p-2">{String(val ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button className="mt-4" onClick={handleAnalyze} disabled={analyzing}>
                    {analyzing ? "Analyzing..." : "Run AI Analysis"}
                  </Button>
                </CardContent>
              </Card>

              {analysis.aiInsights?.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Summary</Label>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.aiInsights.summary}</p>
                    </div>
                    {analysis.aiInsights.trends.length > 0 && (
                      <div>
                        <Label>Trends</Label>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          {analysis.aiInsights.trends.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {analysis.aiInsights.risks.length > 0 && (
                      <div>
                        <Label>Risks</Label>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                          {analysis.aiInsights.risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                    {analysis.aiInsights.kpis.length > 0 && (
                      <div>
                        <Label>KPIs</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {analysis.aiInsights.kpis.map((k, i) => (
                            <div key={i} className="border rounded-lg p-3 text-center">
                              <p className="text-xs text-muted-foreground">{k.label}</p>
                              <p className="text-lg font-bold">{k.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button variant="outline" onClick={downloadReport}>Download Excel Report</Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Past Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No analyses yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h._id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm">{h.fileName}</p>
                      <p className="text-xs text-muted-foreground">{h.originalRowCount} rows · {new Date(h.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setTab("upload"); loadAnalysis(h._id); }}>View</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
