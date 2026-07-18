"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ACCEPTED = ".csv,.xlsx,.json";

const FILE_LABELS: Record<string, string> = {
  "text/csv": "CSV",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/json": "JSON",
};

type Status = "idle" | "uploading" | "analyzing" | "done";

export default function AddItemPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setStatusMessage("Uploading file...");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${BASE}/items`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setStatus("analyzing");
      setStatusMessage("AI is analyzing your data...");

      await new Promise((r) => setTimeout(r, 800));

      setStatus("done");
      setStatusMessage("Analysis complete!");

      toast.success("Analysis report created");
      router.push(`/items/${data.item._id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze file");
      setStatus("idle");
      setStatusMessage("");
    }
  };

  if (loading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const isProcessing = status === "uploading" || status === "analyzing";
  const fileType = file ? FILE_LABELS[file.type] || file.name.split(".").pop()?.toUpperCase() || "FILE" : "";

  return (
    <div className="w-full px-4 md:px-20 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Data</CardTitle>
          <CardDescription>
            Upload a CSV, XLSX, or JSON file. Our AI will analyze it and generate a full report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "done" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-medium">Report ready!</p>
              <p className="text-sm text-muted-foreground">Redirecting you to the report...</p>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
              <p className="text-lg font-medium">{statusMessage}</p>
              {status === "uploading" && file && (
                <p className="text-sm text-muted-foreground mt-2">{file.name}</p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) setFile(f);
                  }}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition"
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-indigo-500" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB &middot; {fileType}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium">Drop your file here or click to browse</p>
                      <p className="text-sm text-muted-foreground">CSV, XLSX, or JSON (max 5MB)</p>
                    </div>
                  )}
                  <Input
                    ref={fileRef}
                    id="file"
                    type="file"
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload & Analyze
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
