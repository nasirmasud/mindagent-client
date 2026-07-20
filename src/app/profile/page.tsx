"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Mail, Calendar, FileText, MessageSquare, Image, Sparkles, Shield, KeyRound, Trash2, ChevronRight, ExternalLink, Loader2, Check, X, Clock } from "lucide-react";
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
  date: string;
  href: string;
}

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading, user, logout } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const { data: reportsData } = useQuery({
    queryKey: ["my-items"],
    queryFn: () => api<{ success: boolean; items: Item[] }>("/items/my"),
    enabled: isAuthenticated,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () => api<{ success: boolean; sessions: Session[] }>("/ai/sessions"),
    enabled: isAuthenticated,
  });

  const { data: imagesData } = useQuery({
    queryKey: ["image-history"],
    queryFn: () => api<{ success: boolean; items: ImageAnalysis[] }>("/ai/image-history"),
    enabled: isAuthenticated,
  });

  const { data: historyData } = useQuery({
    queryKey: ["ai-history"],
    queryFn: () => api<{ success: boolean; items: GenContent[] }>("/ai/history"),
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: (body: { name?: string; avatar?: string }) =>
      api("/auth/me", { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Profile updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const passwordMutation = useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      api("/auth/password", { method: "PUT", body: JSON.stringify(body) }),
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

  const activities: Activity[] = [
    ...reports.slice(0, 5).map((r) => ({
      id: r._id,
      type: "report" as const,
      label: r.title,
      date: r.createdAt,
      href: `/items/${r._id}`,
    })),
    ...sessions.slice(0, 5).map((s) => ({
      id: s._id,
      type: "chat" as const,
      label: `Chat: ${s.agentType}`,
      date: s.messages[0]?.timestamp || "",
      href: "/ai-chat",
    })),
    ...images.slice(0, 5).map((i) => ({
      id: i._id,
      type: "image" as const,
      label: i.imageName || "Image analysis",
      date: i.createdAt,
      href: "/image-analyzer",
    })),
    ...history.slice(0, 5).map((h) => ({
      id: h._id,
      type: "content" as const,
      label: `${h.contentType}: ${h.prompt.slice(0, 50)}${h.prompt.length > 50 ? "..." : ""}`,
      date: h.createdAt,
      href: "/content-generator",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const stats = [
    { icon: FileText, label: "Reports", count: reports.length, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: MessageSquare, label: "Chats", count: sessions.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Image, label: "Images", count: images.length, color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: Sparkles, label: "Generations", count: history.length, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const memberDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0B0B1F] dark:to-[#0A0820]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-8 md:py-12 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group shrink-0">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-[#1E1A35] shadow-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{user?.name?.charAt(0) || "U"}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">{user?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Member since {memberDate}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <Shield className="h-3 w-3" />
                {user?.authProvider === "google" ? "Google" : "Email"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-slate-200/60 dark:border-[#2E274A]/60 bg-white/70 dark:bg-[#1E1A35]/70 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/50">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.count}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/60 dark:border-[#2E274A]/60 bg-white/70 dark:bg-[#1E1A35]/70 backdrop-blur-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-[#2E274A]/50">
                <h2 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-5">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No activity yet</p>
                    <p className="text-xs mt-1">Start using MindAgent to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {activities.map((a, i) => {
                      const icons = { report: FileText, chat: MessageSquare, image: Image, content: Sparkles };
                      const colors = { report: "text-indigo-400 bg-indigo-500/10", chat: "text-emerald-400 bg-emerald-500/10", image: "text-purple-400 bg-purple-500/10", content: "text-amber-400 bg-amber-500/10" };
                      const Icon = icons[a.type];
                      return (
                        <Link
                          key={`${a.type}-${a.id}-${i}`}
                          href={a.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-[#2E274A]/50 group"
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors[a.type]}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{a.label}</p>
                            <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-[#2E274A]/60 bg-white/70 dark:bg-[#1E1A35]/70 backdrop-blur-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-[#2E274A]/50">
                <h2 className="font-semibold text-slate-900 dark:text-white">Recent Reports</h2>
                <Link href="/items/manage" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
              </div>
              <div className="p-5">
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No reports yet</p>
                    <Link href="/items/add" className="text-xs text-indigo-500 hover:underline mt-1 inline-block">Upload your first file</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reports.slice(0, 5).map((r) => (
                      <Link
                        key={r._id}
                        href={`/items/${r._id}`}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-[#2E274A]/50 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                            <FileText className="h-4 w-4 text-indigo-400" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.title}</p>
                            <p className="text-xs text-slate-400">{r.sourceFileType.toUpperCase()} &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/60 dark:border-[#2E274A]/60 bg-white/70 dark:bg-[#1E1A35]/70 backdrop-blur-sm">
              <div className="p-5 border-b border-slate-200/50 dark:border-[#2E274A]/50">
                <h2 className="font-semibold text-slate-900 dark:text-white">Settings</h2>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Display Name</label>
                  <div className="flex gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#0F0F1A] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => updateMutation.mutate({ name })}
                      disabled={updateMutation.isPending || name === user?.name}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-2 text-sm font-medium text-white transition-colors"
                    >
                      {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </button>
                  </div>
                </div>

                {user?.authProvider === "email" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Change Password</label>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full rounded-lg border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#0F0F1A] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 6 chars)"
                        className="w-full rounded-lg border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#0F0F1A] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => passwordMutation.mutate({ currentPassword, newPassword })}
                        disabled={passwordMutation.isPending || !currentPassword || !newPassword || newPassword.length < 6}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-[#2E274A] px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2E274A]/50 disabled:opacity-50 transition-colors"
                      >
                        {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200/60 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm">
              <div className="p-5 border-b border-red-200/50 dark:border-red-900/50">
                <h2 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Danger Zone
                </h2>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Permanently delete your account and all data.</p>
                <button className="w-full rounded-lg border border-red-300 dark:border-red-800 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
