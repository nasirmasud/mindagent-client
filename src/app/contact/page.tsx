"use client";

import { useState } from "react";
import {
  Mail, Phone, MapPin, Twitter, Linkedin, Github,
  Send, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@mindagent.ai" },
  { icon: Phone, label: "Phone", value: "+1 (085) 123-4567" },
  { icon: MapPin, label: "Office", value: "San Francisco, CA" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    if (form.message.length < 10) {
      toast.error("Message must be at least 10 characters.");
      return;
    }
    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({ name: form.name, email: form.email, message: `${form.subject ? `[${form.subject}] ` : ""}${form.message}` }),
      });
      setSent(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 text-gray-900 dark:bg-[#0B0B1F] dark:text-white">
      {/* HEADER */}
      <section className="mx-auto max-w-3xl px-4 pt-10 text-center">
        <h1 className="text-[32px] font-bold leading-[1.2] md:text-[38px]">
          Get in{" "}
          <span className="bg-gradient-to-r from-[#9B85FF] to-[#7FA8FF] bg-clip-text text-transparent">
            touch
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Questions, feedback, or just want to say hi &mdash; the team reads every message.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.3fr]">
          {/* Contact info */}
          <div className="space-y-5">
            {contactInfo.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC]/10">
                    <Icon size={16} className="text-[#9B85FF]" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">{c.label}</p>
                    <p className="text-sm font-medium">{c.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              {[Twitter, Linkedin, Github].map((I, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:border-[#232235] dark:hover:border-[#3A3A55] dark:hover:text-white"
                >
                  <I size={14} />
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#232235] dark:bg-[#131320]">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5ED9A6]/10">
                  <CheckCircle2 size={22} className="text-[#5ED9A6]" />
                </span>
                <p className="mt-4 text-sm font-medium">Message sent</p>
                <p className="mt-1 text-xs text-gray-500">
                  We&apos;ll get back to you within a day or two.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-xs text-gray-500 hover:border-gray-400 dark:border-[#2A2A40] dark:text-gray-300 dark:hover:border-[#3A3A55]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Subject</label>
                  <input
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="What's this about?"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Message</label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell us what's on your mind&hellip;"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C5CFC] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#6B4CE8] disabled:opacity-60 sm:w-auto"
                >
                  <Send size={14} /> {sending ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
