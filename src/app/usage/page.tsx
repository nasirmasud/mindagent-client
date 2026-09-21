"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Crown,
  Zap,
  FileText,
  Sparkles,
  MessageSquare,
  Calendar,
} from "lucide-react";

const WORDS_USED = 3450;
const WORDS_LIMIT = 10000;

const FEATURES = [
  { icon: FileText, label: "Data analyses", value: "3 / month" },
  { icon: Sparkles, label: "AI generations", value: "Included" },
  { icon: MessageSquare, label: "Chat sessions", value: "Included" },
];

export default function UsagePage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  const pct = Math.min(100, Math.round((WORDS_USED / WORDS_LIMIT) * 100));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Usage & Plan</h1>
          <p className="text-sm text-[#A09BB5] mt-1">
            Your current plan and monthly usage at a glance.
          </p>
        </div>

        <div className="bg-[#131320] border border-[#232235] rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-lg bg-[#7C5CFC] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-white">Free Plan</p>
                  <p className="text-xs text-[#9C97B5] mt-0.5">
                    Renews on{" "}
                    {new Date(
                      new Date().setDate(new Date().getDate() + 12)
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A09BB5] mt-4 max-w-sm leading-relaxed">
                You are on the free tier. Upgrade to Pro for unlimited
                analyses, more words and priority AI access.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6B4CE8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Link>
          </div>
        </div>

        <div className="bg-[#131320] border border-[#232235] rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Words Used</h3>
            <span className="text-sm text-[#9C97B5]">
              <span className="font-semibold text-white">
                {WORDS_USED.toLocaleString()}
              </span>{" "}
              / {WORDS_LIMIT.toLocaleString()} words
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#1E1A35] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#7C5CFC] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-[#9C97B5] mt-3">
            {pct}% of your {WORDS_LIMIT.toLocaleString()} word monthly limit
            used. Resets at the start of next month.
          </p>
        </div>

        <div className="bg-[#131320] border border-[#232235] rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">
            Included in your plan
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="bg-[#0B0B1F] border border-[#232235] rounded-lg p-4"
              >
                <f.icon className="w-4 h-4 text-[#9B85FF] mb-2" />
                <p className="text-xs text-[#9C97B5]">{f.label}</p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-sm font-medium text-[#C0B2FF] hover:text-white mt-5 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Compare all plans
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}