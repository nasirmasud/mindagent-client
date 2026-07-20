"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  HardDrive,
  TrendingUp,
  Plus,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ItemActions } from "@/components/items/manage/item-actions";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthContext } from "@/providers/auth-provider";

interface ManageItem {
  _id: string;
  title: string;
  sourceFileName: string;
  sourceFileType: string;
  rowCount: number;
  createdAt: string;
}

const DONUT_COLORS = ["#818cf8", "#a78bfa", "#34d399", "#fbbf24"];

function StatCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: any;
  label: string;
  value: number | string;
  change: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center mb-4">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-xs text-slate-400 whitespace-pre-line leading-snug mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 mt-1">from last month</p>
    </div>
  );
}

function DonutCard({
  title,
  total,
  data,
}: {
  title: string;
  total: number;
  data: { name: string; value: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
        <div className="flex items-center justify-center h-28 text-slate-500 text-xs">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={34}
                outerRadius={52}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">{total}</span>
            <span className="text-[10px] text-slate-500">Total</span>
          </div>
        </div>
        <ul className="flex-1 space-y-1.5">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
            return (
              <li
                key={d.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        DONUT_COLORS[i % DONUT_COLORS.length],
                    }}
                  />
                  {d.name}
                </span>
                <span className="text-slate-500">
                  {d.value}{" "}
                  <span className="text-slate-600">({pct}%)</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function groupByKey<T>(items: T[], keyFn: (item: T) => string) {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const k = keyFn(item);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function ManageItemsPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ["my-items"],
    queryFn: () =>
      api<{ success: boolean; items: ManageItem[] }>("/items/my"),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Report deleted");
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete"),
  });

  const items = itemsData?.items ?? [];
  const totalRows = items.reduce((sum, i) => sum + i.rowCount, 0);
  const fileTypes = new Set(items.map((i) => i.sourceFileType)).size;
  const avgRows = items.length > 0 ? Math.round(totalRows / items.length) : 0;

  const stats = useMemo(
    () => [
      {
        icon: FileText,
        label: "Total Reports\nAnalyzed",
        value: items.length,
        change: "+12%",
      },
      {
        icon: HardDrive,
        label: "Total Rows\nAnalyzed",
        value: totalRows.toLocaleString(),
        change: "+8%",
      },
      {
        icon: FileText,
        label: "File Types\nUsed",
        value: fileTypes,
        change: "+2",
      },
      {
        icon: TrendingUp,
        label: "Avg Rows\nper Report",
        value: avgRows.toLocaleString(),
        change: "+5%",
      },
    ],
    [items.length, totalRows, fileTypes, avgRows]
  );

  const donuts = useMemo(
    () => [
      {
        title: "Reports by Type",
        total: items.length,
        data: groupByKey(items, (r) => r.sourceFileType.toUpperCase()),
      },
    ],
    [items]
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="p-4 md:p-8 space-y-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Reports</h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage and analyze your uploaded data files
              </p>
            </div>
            <Button asChild className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white">
              <Link href="/items/add">
                <Plus className="h-4 w-4" />
                New Analysis
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {donuts.map((d) => (
              <DonutCard key={d.title} {...d} />
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-white mb-2">
                No analysis reports yet
              </p>
              <p className="text-slate-500 mb-6">
                Upload a CSV, Excel, or JSON file to get started
              </p>
              <Button asChild className="gap-2">
                <Link href="/items/add">
                  <Plus className="h-4 w-4" />
                  Upload Your First File
                </Link>
              </Button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-300">
                        Title
                      </th>
                      <th className="text-left p-4 font-medium text-slate-300 hidden sm:table-cell">
                        File
                      </th>
                      <th className="text-left p-4 font-medium text-slate-300 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left p-4 font-medium text-slate-300 hidden md:table-cell">
                        Rows
                      </th>
                      <th className="text-left p-4 font-medium text-slate-300 hidden lg:table-cell">
                        Date
                      </th>
                      <th className="text-right p-4 font-medium text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-4 font-medium text-white">
                          {item.title}
                        </td>
                        <td className="p-4 text-slate-400 hidden sm:table-cell">
                          {item.sourceFileName}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="uppercase text-xs font-medium bg-indigo-950 text-indigo-400 px-2 py-1 rounded">
                            {item.sourceFileType}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 hidden md:table-cell flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {item.rowCount.toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-400 hidden lg:table-cell flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <ItemActions
                            itemId={item._id}
                            onDeleted={() => handleDelete(item._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}