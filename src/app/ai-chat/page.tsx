"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPage() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    setInput("");
    setSuggestions([]);
    setStreaming(true);
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: text,
            sessionId,
            provider: localStorage.getItem("ai-provider") || "groq",
          }),
        }
      );

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = JSON.parse(line.slice(6));

          if (json.done) {
            setSessionId(json.sessionId);
            setSuggestions(json.suggestions || []);
          } else {
            full += json.text;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: full };
              return updated;
            });
          }
        }
      }
    } catch {
      toast.error("Chat failed");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, I encountered an error." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card className="min-h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle>AI Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[55vh]">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                Start a conversation with MindAgent Assistant.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(s)}
                  disabled={streaming}
                >
                  {s}
                </Button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={streaming}
            />
            <Button type="submit" disabled={streaming || !input.trim()}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
