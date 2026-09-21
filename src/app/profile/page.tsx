"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  UserCircle2,
  FileText,
  MessageSquare,
  ImageIcon,
  Sparkles,
  Pencil,
  Mail,
  Calendar,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Camera,
  Clock,
} from "lucide-react";

interface Item {
  _id: string;
  title: string;
  sourceFileType: string;
  createdAt: string;
}

interface Session {
  _id: string;
  agentType: string;
  messages: { role: string; content: string; timestamp: string }[];
}

interface ImageAnalysis {
  _id: string;
  imageName: string;
  createdAt: string;
}

interface GenContent {
  _id: string;
  contentType: string;
  prompt: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: "report" | "chat" | "image" | "content";
  label: string;
  subtitle: string;
  date: string;
  time: string;
  href: string;
}

const DONUT_COLORS = ["#818cf8", "#a78bfa", "#34d399", "#fbbf24"];

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#131320] border border-[#232235] rounded-lg p-5">
      <div className="w-9 h-9 rounded-lg bg-[#7C5CFC] flex items-center justify-center mb-4">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-sm text-[#A09BB5] whitespace-pre-line leading-snug mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
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
      <div className="bg-[#131320] border border-[#232235] rounded-lg p-5">
        <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
        <div className="flex items-center justify-center h-28 text-[#9C97B5] text-xs">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131320] border border-[#232235] rounded-lg p-5">
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
            <span className="text-xs text-[#9C97B5]">Total</span>
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
                <span className="flex items-center gap-1.5 text-[#C9C3EA]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        DONUT_COLORS[i % DONUT_COLORS.length],
                    }}
                  />
                  {d.name}
                </span>
                <span className="text-[#9C97B5]">
                  {d.value}{" "}
                  <span className="text-[#8B86A3]">({pct}%)</span>
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

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading, user } = useAuthContext();
  const router = useRouter();
  const [provider] = useState("OpenAI");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const { data: reportsData } = useQuery({
    queryKey: ["my-items"],
    queryFn: () =>
      api<{ success: boolean; items: Item[] }>("/items/my"),
    enabled: isAuthenticated,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () =>
      api<{ success: boolean; sessions: Session[] }>("/ai/sessions"),
    enabled: isAuthenticated,
  });

  const { data: imagesData } = useQuery({
    queryKey: ["image-history"],
    queryFn: () =>
      api<{ success: boolean; items: ImageAnalysis[] }>(
        "/ai/image-history"
      ),
    enabled: isAuthenticated,
  });

  const { data: historyData } = useQuery({
    queryKey: ["ai-history"],
    queryFn: () =>
      api<{ success: boolean; items: GenContent[] }>("/ai/history"),
    enabled: isAuthenticated,
  });

  const reports = reportsData?.items ?? [];
  const sessions = sessionsData?.sessions ?? [];
  const images = imagesData?.items ?? [];
  const history = historyData?.items ?? [];

  const hasAnyData =
    reports.length + sessions.length + images.length + history.length > 0;

  const stats = useMemo(
    () => [
      {
        icon: FileText,
        label: "Total Reports\nAnalyzed",
        value: reports.length,
      },
      {
        icon: MessageSquare,
        label: "Total Chat\nSessions",
        value: sessions.length,
      },
      {
        icon: ImageIcon,
        label: "Total Image\nAnalyses",
        value: images.length,
      },
      {
        icon: Sparkles,
        label: "Total AI\nGenerations",
        value: history.length,
      },
    ],
    [reports.length, sessions.length, images.length, history.length]
  );

  const donuts = useMemo(
    () =>
      [
        {
          title: "Reports by Type",
          total: reports.length,
          data: groupByKey(reports, (r) => r.sourceFileType.toUpperCase()),
        },
        {
          title: "Chat Sessions by Model",
          total: sessions.length,
          data: groupByKey(sessions, (s) => s.agentType),
        },
        {
          title: "Image Analyses",
          total: images.length,
          data:
            images.length > 0
              ? [{ name: "Images", value: images.length }]
              : [],
        },
        {
          title: "AI Generations by Type",
          total: history.length,
          data: groupByKey(history, (h) => h.contentType),
        },
      ].filter((d) => d.data.length > 0),
    [reports, sessions, images, history]
  );

  const activities: Activity[] = useMemo(
    () =>
      [
        ...reports.slice(0, 5).map((r) => ({
          id: r._id,
          type: "report" as const,
          label: `Analyzed a Report`,
          subtitle: r.title,
          date: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(r.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          href: `/items/${r._id}`,
        })),
        ...sessions.slice(0, 5).map((s) => ({
          id: s._id,
          type: "chat" as const,
          label: "Chat Session",
          subtitle: `${s.agentType} discussion`,
          date: new Date(
            s.messages[0]?.timestamp || ""
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(
            s.messages[0]?.timestamp || ""
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          href: "/ai-chat",
        })),
        ...images.slice(0, 5).map((i) => ({
          id: i._id,
          type: "image" as const,
          label: "Image Analysis",
          subtitle: i.imageName || "Uploaded image",
          date: new Date(i.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(i.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          href: "/image-analyzer",
        })),
        ...history.slice(0, 5).map((h) => ({
          id: h._id,
          type: "content" as const,
          label: "AI Content Generation",
          subtitle: h.prompt.slice(0, 40) + (h.prompt.length > 40 ? "..." : ""),
          date: new Date(h.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(h.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          href: "/content-generator",
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 10),
    [reports, sessions, images, history]
  );

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-[#A09BB5] mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <button className="flex items-center gap-2 border border-[#6C56D6] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2E274A] transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="relative overflow-hidden bg-[#131320] border border-[#232235] rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#7C5CFC]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6B4CE8] to-[#8B5CF6] flex items-center justify-center border-2 border-[#7C5CFC]">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#7C5CFC] flex items-center justify-center border-2 border-[#131320]">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <Pencil className="w-3.5 h-3.5 text-[#9C97B5]" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-[#A09BB5]">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1 bg-[#1E1A35] text-[#C9C3EA] text-xs px-2 py-0.5 rounded-sm">
                  {user?.authProvider === "google" ? "Google" : "Email"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-[#A09BB5]">
                <Calendar className="w-3.5 h-3.5" />
                Member since {memberDate}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-[#A09BB5]">
                Preferred AI Provider
                <span className="flex items-center gap-1 bg-[#1E1A35] text-slate-200 text-xs font-medium px-2.5 py-1 rounded-sm">
                  {provider}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex relative w-48 h-40 items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#3D3560]" />
            <img
              src="/favicon.ico"
              alt="MindAgent"
              className="w-24 h-24 rounded-lg z-10 object-contain drop-shadow-lg"
            />
            {[
              TrendingUp,
              ImageIcon,
              FileText,
              Sparkles,
            ].map((Icon, i) => (
              <div
                key={i}
                className="absolute w-9 h-9 rounded-lg bg-[#2E274A] border border-[#3D3560] flex items-center justify-center"
                style={{
                  top:
                    i === 0
                      ? "0%"
                      : i === 1
                        ? "60%"
                        : i === 2
                          ? "10%"
                          : "65%",
                  left:
                    i === 0
                      ? "60%"
                      : i === 1
                        ? "70%"
                        : i === 2
                          ? "5%"
                          : "5%",
                }}
              >
                <Icon className="w-4 h-4 text-[#9B85FF]" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#C9C3EA] mb-3">
            Activity Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {hasAnyData ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {donuts.map((d) => (
                <DonutCard key={d.title} {...d} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#131320] border border-[#232235] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <Link
                    href="/items/manage"
                    className="text-xs font-medium text-[#9B85FF] hover:text-[#C0B2FF]"
                  >
                    View All
                  </Link>
                </div>
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-[#9C97B5]">
                    <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No activity yet</p>
                    <p className="text-xs mt-1">
                      Start using MindAgent to see your activity here
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {activities.map((a, i) => {
                      const icons: Record<string, any> = {
                        report: FileText,
                        chat: MessageSquare,
                        image: ImageIcon,
                        content: Sparkles,
                      };
                      const Icon = icons[a.type];
                      return (
                        <li key={`${a.type}-${a.id}-${i}`}>
                          <Link
                            href={a.href}
                            className="flex items-start gap-3 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#2E274A] border border-[#3D3560] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#9B85FF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white group-hover:text-[#C0B2FF] transition-colors">
                                {a.label}
                              </p>
                              <p className="text-xs text-[#9C97B5] truncate">
                                {a.subtitle}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-[#A09BB5]">{a.date}</p>
                              <p className="text-xs text-[#8B86A3]">
                                {a.time}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="bg-[#131320] border border-[#232235] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Reports</h3>
                  <Link
                    href="/items/manage"
                    className="text-xs font-medium text-[#9B85FF] hover:text-[#C0B2FF]"
                  >
                    View All
                  </Link>
                </div>
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-[#9C97B5]">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No reports yet</p>
                    <Link
                      href="/items/add"
                      className="text-xs text-[#9B85FF] hover:underline mt-1 inline-block"
                    >
                      Upload your first file
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {reports.slice(0, 5).map((r) => (
                      <li key={r._id}>
                        <Link
                          href={`/items/${r._id}`}
                          className="flex items-center gap-3 py-1 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#2E274A] border border-[#3D3560] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#9B85FF]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-[#C0B2FF] transition-colors">
                              {r.title}
                            </p>
                            <p className="text-xs text-[#9C97B5]">
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              &middot;{" "}
                              {new Date(r.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <span className="text-[11px] font-medium bg-emerald-950 text-emerald-400 px-2 py-1 rounded-sm shrink-0">
                            Completed
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#8B86A3] group-hover:text-[#A09BB5] shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#131320] border border-[#232235] rounded-lg p-10 text-center">
            <div className="w-14 h-14 rounded-lg bg-[#7C5CFC]/15 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#9B85FF]" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Start your first analysis
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#A09BB5]">
              Upload a file, start an AI chat, or generate content — your
              stats, charts, and activity will appear here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/items/add"
                className="bg-[#7C5CFC] hover:bg-[#6B4CE8] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Upload your first file
              </Link>
              <Link
                href="/ai-chat"
                className="border border-[#232235] text-[#A09BB5] hover:text-white hover:border-[#2A2A40] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Open AI Chat
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}