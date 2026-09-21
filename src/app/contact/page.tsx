"use client";

import { useState } from "react";
import {
  Mail, Phone, MapPin, Linkedin, Github,
  Send, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { siteContact } from "@/lib/site-info";

const contactInfo = [
  { icon: Mail, label: "Email", value: siteContact.email },
  { icon: Phone, label: "Phone", value: siteContact.phone },
  { icon: MapPin, label: "Office", value: siteContact.address },
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
    <div className="flex-1 text-gray-900 dark:text-white">
      {/* HEADER */}
      <section className="mx-auto max-w-3xl px-4 pt-10 text-center">
        <h1 className="text-[32px] font-bold leading-[1.2] md:text-[38px]">
          Get in{" "}
          <span className="bg-gradient-to-r from-[#9B85FF] to-[#7FA8FF] bg-clip-text text-transparent">
            touch
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Questions, feedback, or just want to say hi &mdash; the team reads every message.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.3fr]">
          {/* Contact info */}
          <div className="flex flex-col gap-5">
            {contactInfo.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="flex flex-1 items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-[#232235] dark:bg-[#131320]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC]/10">
                    <Icon size={18} className="text-[#9B85FF]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{c.label}</p>
                    <p className="text-sm font-medium">{c.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:border-[#232235] dark:hover:border-[#3A3A55] dark:hover:text-white"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.2-6.4L5 21H1.9l7.7-8.8L1 3h6.7l4.7 5.9L18.9 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l12.3 14.5Z" />
                </svg>
              </span>
              {[Linkedin, Github].map((I, i) => (
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-[#232235] dark:bg-[#131320]">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5ED9A6]/10">
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
                    <label className="mb-1.5 block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                  <input
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="What's this about?"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell us what's on your mind&hellip;"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#7C5CFC]/60 focus:outline-none dark:border-[#232235] dark:bg-[#0F0F1A] dark:text-white dark:placeholder:text-gray-600"
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
