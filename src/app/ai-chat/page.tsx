"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Bot,
  Plus,
  Search,
  MessageSquare,
  X,
  PanelLeft,
  Send,
  Paperclip,
  Settings,
  Trash2,
} from "lucide-react";

/* ───── types ───── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SessionListItem {
  _id: string;
  title: string;
  dateGroup: string;
  latestTimestamp: string;
}

/* ───── helpers ───── */
function currentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str: string) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

/* ───── component ───── */
export default function AIChatPage() {
  const { isAuthenticated, loading, user } = useAuthContext();
  const router = useRouter();

  /* chat state */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  /* ui state */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  /* ───── sessions from API ───── */
  const [sessions, setSessions] = useState<SessionListItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated || loading) return;
    (async () => {
      try {
        const data: any = await api("/ai/sessions");
        const mapped: SessionListItem[] = (data.sessions || []).map((s: any) => {
          const firstUserMsg = s.messages.find((m: any) => m.role === "user");
          const title = firstUserMsg
            ? firstUserMsg.content.length > 40
              ? firstUserMsg.content.slice(0, 40) + "…"
              : firstUserMsg.content
            : "Untitled chat";
          const latest = s.messages[s.messages.length - 1]?.timestamp || s.createdAt;
          const date = new Date(latest);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          const dateGroup =
            diff < 86400000
              ? "Today"
              : diff < 172800000
              ? "Yesterday"
              : "Previous 7 days";
          return { _id: s._id, title, dateGroup, latestTimestamp: latest };
        });
        setSessions(mapped);
      } catch {}
    })();
  }, [isAuthenticated, loading]);

  const groupedSessions = sessions.reduce<Record<string, SessionListItem[]>>((acc, s) => {
    (acc[s.dateGroup] ??= []).push(s);
    return acc;
  }, {});

  const groupedOrder = ["Today", "Yesterday", "Previous 7 days"];

  /* refs */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  /* ───── auth guard ───── */
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  /* ───── auto scroll ───── */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  /* ───── auto grow textarea ───── */
  const autoGrow = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 128) + "px";
    }
  }, []);

  useEffect(() => {
    autoGrow();
  }, [input, autoGrow]);

  /* ───── send message ───── */
  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || streaming) return;

    setInput("");
    setSuggestions([]);
    setStreaming(true);
    setShowTyping(true);

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://mindagent-server.onrender.com/api"}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: trimmed,
            ...(sessionId ? { sessionId } : {}),
          }),
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let full = "";
      let buffer = "";

      setShowTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(part.slice(6));
            if (json.done) {
              setSessionId(json.sessionId);
              setSuggestions(json.suggestions || []);
              const cleaned = full.replace(/```json[\s\S]*?```/, "").replace(/\n*Here are a few follow-up questions.*$/, "").trim();
              if (cleaned.length < full.length) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: cleaned };
                  return updated;
                });
              }
            } else {
              full += json.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: full };
                return updated;
              });
            }
          } catch { /* skip malformed chunk */ }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat failed";
      toast.error(msg);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "user") {
          updated.push({
            role: "assistant",
            content: `Sorry, I encountered an error${msg !== "Chat failed" ? `: ${msg}` : ""}.`,
          });
        }
        return updated;
      });
    } finally {
      setStreaming(false);
      setShowTyping(false);
    }
  };

  /* ───── new chat ───── */
  const newChat = () => {
    setMessages([]);
    setSessionId(null);
    setSuggestions([]);
    setActiveSessionId(null);
    setSidebarOpen(false);
  };

  /* ───── load session ───── */
  const loadSession = async (id: string) => {
    try {
      const data: any = await api(`/ai/sessions`);
      const session = (data.sessions || []).find((s: any) => s._id === id);
      if (!session) return;
      const msgs: Message[] = session.messages
        .filter((m: any) => m.role !== "system")
        .map((m: any) => ({ role: m.role, content: m.content }));
      setMessages(msgs);
      setSessionId(id);
      setActiveSessionId(id);
      setSuggestions([]);
      setSidebarOpen(false);
    } catch {
      toast.error("Failed to load session");
    }
  };

  /* ───── delete session ───── */
  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api(`/ai/sessions/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (activeSessionId === id) {
        setMessages([]);
        setSessionId(null);
        setActiveSessionId(null);
      }
    } catch {
      toast.error("Failed to delete session");
    }
  };

  /* ───── loading state ───── */
  if (loading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-in { animation: fadeUp .35s cubic-bezier(.4,0,.2,1) both; }

        @keyframes bounceDot {
          0%, 80%, 100% { transform: translateY(0); opacity: .5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot { animation: bounceDot 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: .15s; }
        .typing-dot:nth-child(3) { animation-delay: .3s; }

        @keyframes blink { 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s steps(1) infinite; }

        .chat-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .dark .chat-scrollbar::-webkit-scrollbar-thumb { background: #2E274A; }
        .dark .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #3D3560; }
      `}</style>

      <div className="fixed inset-0 top-16 flex overflow-hidden bg-white dark:bg-[#0A0820]">
        {/* ─── SIDEBAR ─── */}
        <aside
          className={`mobile-sidebar fixed lg:static z-30 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 w-72 h-full bg-slate-50 dark:bg-[#1E1A35] border-r border-slate-200 dark:border-[#2E274A] flex flex-col transition-transform duration-350`}
        >
          {/* logo + new chat */}
          <div className="p-4 border-b border-slate-200 dark:border-[#2E274A]">
            <div className="flex items-center justify-end mb-4 lg:hidden">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={newChat}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_rgba(108,78,230,0.4)] active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* search */}
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats"
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-white dark:bg-[#16132B] border border-slate-200 dark:border-[#2E274A] text-xs outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-300 dark:focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

          {/* chat history */}
          <div className="flex-1 overflow-y-auto chat-scrollbar px-3 py-3 space-y-1">
            {groupedOrder.map((group) => {
              const groupSessions = groupedSessions[group];
              if (!groupSessions) return null;
              return (
                <div key={group}>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-2 mb-1 mt-4 first:mt-0">
                    {group}
                  </p>
                  {groupSessions.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => loadSession(s._id)}
                      className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-violet-50 dark:hover:bg-indigo-900/20 hover:translate-x-0.5 group ${
                        activeSessionId === s._id
                          ? "bg-violet-50 dark:bg-indigo-900/20"
                          : ""
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate flex-1">
                        {s.title}
                      </span>
                      <button
                        onClick={(e) => deleteSession(e, s._id)}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            {sessions.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
                No chat history yet
              </p>
            )}
          </div>

          {/* user profile */}
          <div className="p-3 border-t border-slate-200 dark:border-[#2E274A]">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-violet-50 dark:hover:bg-indigo-900/20 transition-colors">
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Free plan</p>
              </div>
              <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </aside>

        {/* sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── MAIN CHAT AREA ─── */}
        <main className="flex-1 flex flex-col h-full min-w-0">
          {/* messages */}
          <div className="flex-1 overflow-y-auto chat-scrollbar px-4 sm:px-8 py-6 relative">
            <div className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute top-2 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors z-10"
            >
              <PanelLeft className="w-4.5 h-4.5" />
            </button>
            {messages.length === 0 && (
              <div className="msg-in max-w-2xl">
                <div className="bg-slate-100 dark:bg-[#16132B] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Hi! I&apos;m your MindAgent assistant. Ask me anything — I can help with research, explain concepts, draft content, or work through problems with you.
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {currentTime()}
                </span>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`msg-in flex ${msg.role === "user" ? "justify-end" : ""}`}
              >
                <div className="max-w-2xl">
                  <div
                    className={
                      msg.role === "user"
                        ? "rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed"
                        : "bg-slate-100 dark:bg-[#16132B] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                    }
                    style={
                      msg.role === "user"
                        ? { background: "linear-gradient(135deg, #6c4ee6, #8b5cf6)" }
                        : undefined
                    }
                  >
                    {streaming && i === messages.length - 1 && msg.role === "assistant" ? (
                      <span>
                        {msg.content}
                        <span className="cursor-blink text-indigo-600">▍</span>
                      </span>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] text-slate-400 dark:text-slate-500 mt-1 block ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {currentTime()}
                  </span>

                  {/* suggestion chips after last AI message */}
                  {msg.role === "assistant" &&
                    i === messages.length - 1 &&
                    !streaming &&
                    suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {suggestions.map((s, si) => (
                          <button
                            key={si}
                            onClick={() => sendMessage(s)}
                            className="text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2E274A] bg-white dark:bg-[#1E1A35] px-3 py-1.5 rounded-full hover:border-indigo-500 hover:bg-violet-50 dark:hover:bg-indigo-900/20 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {showTyping && (
              <div className="msg-in max-w-2xl">
                <div className="bg-slate-100 dark:bg-[#16132B] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 w-fit">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                </div>
              </div>
            )}
            </div>
          </div>

          {/* input bar */}
          <div className="px-4 sm:px-8 pb-5 pt-2 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] px-3 py-2.5 transition-all duration-250 focus-within:border-indigo-500 focus-within:shadow-[0_0_0_4px_rgba(108,78,230,0.10)]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.xlsx,.xls,.json" />
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Message MindAgent Assistant..."
                  className="flex-1 resize-none bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 py-1.5 max-h-32"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || streaming}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center flex-shrink-0 transition-all duration-250 hover:-translate-y-0.5 hover:scale-103 hover:shadow-[0_10px_22px_-8px_rgba(108,78,230,0.45)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                MindAgent can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
