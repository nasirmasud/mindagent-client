"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { ItemActions } from "@/components/items/manage/item-actions";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, FileText, Calendar, HardDrive } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ManageItem {
  _id: string;
  title: string;
  sourceFileName: string;
  sourceFileType: string;
  rowCount: number;
  createdAt: string;
}

export default function ManageItemsPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const [items, setItems] = useState<ManageItem[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/items/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {
      toast.error("Failed to load your items");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) fetchItems();
  }, [isAuthenticated, loading, fetchItems]);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  if (loading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="w-full px-4 md:px-20 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <Button asChild>
          <Link href="/items/add">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Analysis Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No analysis reports yet.</p>
              <Button asChild variant="outline">
                <Link href="/items/add">Upload your first file</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left p-3 font-medium">Title</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">File</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Type</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Rows</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{item.sourceFileName}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="uppercase text-xs font-medium bg-muted px-2 py-1 rounded">{item.sourceFileType}</span>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {item.rowCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground hidden lg:table-cell">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <ItemActions itemId={item._id} onDeleted={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
