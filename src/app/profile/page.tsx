"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Settings as SettingsIcon,
  LogOut,
  Pencil,
  Mail,
  Calendar,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Crown,
  KeyRound,
  Trash2,
  Camera,
  Loader2,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";

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
  change,
}: {
  icon: any;
  label: string;
  value: number;
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

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading, user, logout } =
    useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [provider, setProvider] = useState("OpenAI");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

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

  const updateMutation = useMutation({
    mutationFn: (body: { name?: string; avatar?: string }) =>
      api("/auth/me", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Profile updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: (body: {
      currentPassword: string;
      newPassword: string;
    }) =>
      api("/auth/password", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const reports = reportsData?.items ?? [];
  const sessions = sessionsData?.sessions ?? [];
  const images = imagesData?.items ?? [];
  const history = historyData?.items ?? [];

  const stats = useMemo(
    () => [
      {
        icon: FileText,
        label: "Total Reports\nAnalyzed",
        value: reports.length,
        change: "+12%",
      },
      {
        icon: MessageSquare,
        label: "Total Chat\nSessions",
        value: sessions.length,
        change: "+18%",
      },
      {
        icon: ImageIcon,
        label: "Total Image\nAnalyses",
        value: images.length,
        change: "+7%",
      },
      {
        icon: Sparkles,
        label: "Total AI\nGenerations",
        value: history.length,
        change: "+22%",
      },
    ],
    [reports.length, sessions.length, images.length, history.length]
  );

  const donuts = useMemo(
    () => [
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
    ],
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
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800 flex flex-col p-4 hidden lg:flex">
        <nav className="space-y-1">
          {[
            { label: "Profile", icon: UserCircle2, active: true },
            { label: "My Reports", icon: FileText, href: "/items/manage" },
            {
              label: "AI Chat Sessions",
              icon: MessageSquare,
              href: "/ai-chat",
            },
            {
              label: "Image Analyses",
              icon: ImageIcon,
              href: "/image-analyzer",
            },
            {
              label: "AI Generations",
              icon: Sparkles,
              href: "/content-generator",
            },
            { label: "Settings", icon: SettingsIcon, href: "#settings" },
          ].map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="mt-auto space-y-1">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-3">
            <Crown className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-sm font-semibold text-white">
              Upgrade to Pro
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Unlock unlimited access to all AI tools and features.
            </p>
            <Link
              href="/pricing"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <button className="flex items-center gap-2 border border-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-950 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Profile card */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-600">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-slate-900">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                  {user?.authProvider === "google" ? "Google" : "Email"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Member since {memberDate}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                Preferred AI Provider
                <span className="flex items-center gap-1 bg-slate-800 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {provider}
                </span>
              </div>
            </div>
          </div>

          {/* Decorative favicon illustration */}
          <div className="hidden lg:flex relative w-48 h-40 items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border border-dashed border-indigo-800" />
            <img
              src="/favicon.ico"
              alt="MindAgent"
              className="w-24 h-24 rounded-2xl z-10 object-contain drop-shadow-lg"
            />
            {[
              TrendingUp,
              ImageIcon,
              FileText,
              Sparkles,
            ].map((Icon, i) => (
              <div
                key={i}
                className="absolute w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center"
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
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stats - 1 row */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Activity Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Donut charts - 1 row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {donuts.map((d) => (
            <DonutCard key={d.title} {...d} />
          ))}
        </div>

        {/* Recent Activity + Recent Reports side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <Link
                href="/items/manage"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                View All
              </Link>
            </div>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
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
                        <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                            {a.label}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {a.subtitle}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-400">{a.date}</p>
                          <p className="text-[11px] text-slate-600">
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

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Reports</h3>
              <Link
                href="/items/manage"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                View All
              </Link>
            </div>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No reports yet</p>
                <Link
                  href="/items/add"
                  className="text-xs text-indigo-400 hover:underline mt-1 inline-block"
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
                      <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-xs text-slate-500">
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
                      <span className="text-[11px] font-medium bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full shrink-0">
                        Completed
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Settings + Danger Zone */}
        <div
          id="settings"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Settings</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-white">
                  Display Name
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  Update your display name across the platform.
                </p>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none"
                  />
                  <button
                    onClick={() => updateMutation.mutate({ name })}
                    disabled={
                      updateMutation.isPending || name === user?.name
                    }
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-2 text-sm font-medium text-white transition-colors"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Preferred AI Provider
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  Choose your default AI provider for all agents and tools.
                </p>
                <div className="relative">
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-indigo-600"
                  >
                    <option>OpenAI</option>
                    <option>Gemini</option>
                    <option>DeepSeek</option>
                    <option>Hugging Face</option>
                    <option>OpenRouter</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {user?.authProvider === "email" && (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      Change Password
                    </p>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                      Email Account
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    Update your password to keep your account secure.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Current password"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        passwordMutation.mutate({
                          currentPassword,
                          newPassword,
                        })
                      }
                      disabled={
                        passwordMutation.isPending ||
                        !currentPassword ||
                        !newPassword ||
                        newPassword.length < 6
                      }
                      className="flex items-center gap-2 border border-slate-700 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                      {passwordMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <KeyRound className="h-4 w-4" />
                      )}
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-900 rounded-2xl p-5">
            <h3 className="font-semibold text-red-400 mb-2">
              Danger Zone
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Once you delete your account, there is no going back. Please
              be certain.
            </p>
            <button className="flex items-center gap-2 border border-red-800 text-red-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-950 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
