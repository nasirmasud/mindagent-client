"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  FileText,
  MessageSquare,
  ImageIcon,
  Sparkles,
  Trash2,
  ExternalLink,
  Loader2,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "generations", label: "Generations", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Report {
  _id: string;
  title: string;
  sourceFileType: string;
  createdAt: string;
}

interface ChatSession {
  _id: string;
  agentType: string;
  messages: { role: string; content: string; timestamp?: string }[];
}

interface ImageAnalysis {
  _id: string;
  imageName: string;
  createdAt: string;
}

interface Generation {
  _id: string;
  contentType: string;
  prompt: string;
  createdAt: string;
}

const tabCls = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
const activeTabCls = "bg-[#7C5CFC] text-white";
const idleTabCls = "text-[#A09BB5] hover:bg-[#131320] hover:text-white";

function Row({
  icon: Icon,
  primary,
  secondary,
  date,
  href,
  onDelete,
  deleting,
}: {
  icon: any;
  primary: string;
  secondary?: string;
  date?: string;
  href: string;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className="bg-[#131320] border border-[#232235] rounded-xl p-4 flex items-center gap-4">
      <span className="w-10 h-10 shrink-0 rounded-lg bg-[#2E274A] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#9B85FF]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{primary}</p>
        {secondary && (
          <p className="text-xs text-[#A09BB5] truncate mt-0.5">{secondary}</p>
        )}
      </div>
      {date && <span className="text-xs text-[#9C97B5] shrink-0">{date}</span>}
      <Link
        href={href}
        className="shrink-0 w-9 h-9 rounded-lg border border-[#2A2A40] flex items-center justify-center text-[#A09BB5] hover:text-white hover:bg-[#1E1A35] transition-colors"
        aria-label="Open"
      >
        <ExternalLink className="w-4 h-4" />
      </Link>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="shrink-0 w-9 h-9 rounded-lg border border-[#2A2A40] flex items-center justify-center text-[#A09BB5] hover:text-red-400 hover:bg-red-950/40 hover:border-red-800 disabled:opacity-50 transition-colors"
        aria-label="Delete"
      >
        {deleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  actionLabel,
  actionHref,
}: {
  icon: any;
  title: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="bg-[#131320] border border-dashed border-[#232235] rounded-xl p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-xl bg-[#1E1A35] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#9C97B5]" />
      </span>
      <p className="text-sm text-[#A09BB5]">{title}</p>
      <Link
        href={actionHref}
        className="bg-[#7C5CFC] hover:bg-[#6B4CE8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function formatDate(d?: string) {
  return d ? new Date(d).toLocaleDateString() : "";
}

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("reports");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const reportsQuery = useQuery({
    queryKey: ["my-items"],
    queryFn: () =>
      api<{ success: boolean; items: Report[] }>("/items/my"),
    enabled: isAuthenticated && activeTab === "reports",
  });

  const chatsQuery = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () =>
      api<{ success: boolean; sessions: ChatSession[] }>("/ai/sessions"),
    enabled: isAuthenticated && activeTab === "chats",
  });

  const imagesQuery = useQuery({
    queryKey: ["image-history"],
    queryFn: () =>
      api<{ success: boolean; items: ImageAnalysis[] }>(
        "/ai/image-history"
      ),
    enabled: isAuthenticated && activeTab === "images",
  });

  const generationsQuery = useQuery({
    queryKey: ["ai-history"],
    queryFn: () =>
      api<{ success: boolean; items: Generation[] }>("/ai/history"),
    enabled: isAuthenticated && activeTab === "generations",
  });

  const activeQuery = {
    reports: reportsQuery,
    chats: chatsQuery,
    images: imagesQuery,
    generations: generationsQuery,
  }[activeTab];

  const deleteItem = async (endpoint: string, id: string) => {
    setDeletingId(id);
    try {
      await api(endpoint, { method: "DELETE" });
      toast.success("Deleted");
      activeQuery.refetch();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const reports = reportsQuery.data?.items ?? [];
  const sessions = chatsQuery.data?.sessions ?? [];
  const images = imagesQuery.data?.items ?? [];
  const generations = generationsQuery.data?.items ?? [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-sm text-[#A09BB5] mt-1">
            All your reports, chats, image analyses and AI generations.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#232235] pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${tabCls} flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id ? activeTabCls : idleTabCls
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeQuery.isPending ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#7C5CFC]" />
            </div>
          ) : activeTab === "reports" ? (
            reports.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No reports yet. Analyze your first dataset."
                actionLabel="New Report"
                actionHref="/items/add"
              />
            ) : (
              reports.map((r) => (
                <Row
                  key={r._id}
                  icon={FileText}
                  primary={r.title}
                  secondary={r.sourceFileType?.toUpperCase()}
                  date={formatDate(r.createdAt)}
                  href={`/items/${r._id}`}
                  deleting={deletingId === r._id}
                  onDelete={() => deleteItem(`/items/${r._id}`, r._id)}
                />
              ))
            )
          ) : activeTab === "chats" ? (
            sessions.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No chats yet. Start a conversation."
                actionLabel="Open Chat"
                actionHref="/ai-chat"
              />
            ) : (
              sessions.map((s) => (
                <Row
                  key={s._id}
                  icon={MessageSquare}
                  primary={s.agentType}
                  secondary={s.messages[0]?.content ?? "No messages"}
                  date={formatDate(s.messages[0]?.timestamp)}
                  href="/ai-chat"
                  deleting={deletingId === s._id}
                  onDelete={() => deleteItem(`/ai/sessions/${s._id}`, s._id)}
                />
              ))
            )
          ) : activeTab === "images" ? (
            images.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="No image analyses yet."
                actionLabel="Analyze an Image"
                actionHref="/image-analyzer"
              />
            ) : (
              images.map((im) => (
                <Row
                  key={im._id}
                  icon={ImageIcon}
                  primary={im.imageName}
                  date={formatDate(im.createdAt)}
                  href="/image-analyzer"
                  deleting={deletingId === im._id}
                  onDelete={() =>
                    deleteItem(`/ai/image-history/${im._id}`, im._id)
                  }
                />
              ))
            )
          ) : generations.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No generations yet. Create your first piece."
              actionLabel="Open Generator"
              actionHref="/content-generator"
            />
          ) : (
            generations.map((g) => (
              <Row
                key={g._id}
                icon={Sparkles}
                primary={g.contentType}
                secondary={g.prompt}
                date={formatDate(g.createdAt)}
                href="/content-generator"
                deleting={deletingId === g._id}
                onDelete={() => deleteItem(`/ai/history/${g._id}`, g._id)}
              />
            ))
          )}
        </div>

        {activeQuery.isSuccess && (
          <p className="flex items-center gap-1.5 text-xs text-[#9C97B5]">
            <Inbox className="w-3.5 h-3.5" />
            {{
              reports: reports.length,
              chats: sessions.length,
              images: images.length,
              generations: generations.length,
            }[activeTab]}{" "}
            saved items
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}