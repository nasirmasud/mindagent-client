"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChevronDown, KeyRound, Loader2, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuthContext();
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

  if (authLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-[#A09BB5] mt-1">
            Manage your account preferences and security.
          </p>
        </div>

        <div className="bg-[#131320] border border-[#232235] rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Settings</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-white">Display Name</p>
              <p className="text-xs text-[#9C97B5] mt-1 mb-3">
                Update your display name across the platform.
              </p>
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-[#2A2A40] bg-[#1E1A35] px-3 py-2 text-sm text-white placeholder:text-[#9C97B5] focus:border-[#7C5CFC] focus:outline-none"
                />
                <button
                  onClick={() => updateMutation.mutate({ name })}
                  disabled={updateMutation.isPending || name === user?.name}
                  className="rounded-lg bg-[#7C5CFC] hover:bg-[#6B4CE8] disabled:opacity-50 px-3 py-2 text-sm font-medium text-white transition-colors"
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
              <p className="text-xs text-[#9C97B5] mt-1 mb-3">
                Choose your default AI provider for all agents and tools.
              </p>
              <div className="relative">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full appearance-none bg-[#1E1A35] border border-[#2A2A40] text-sm text-white rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-[#7C5CFC]"
                >
                  <option>OpenAI</option>
                  <option>Gemini</option>
                  <option>DeepSeek</option>
                  <option>Hugging Face</option>
                  <option>OpenRouter</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#9C97B5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {user?.authProvider === "email" && (
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">
                    Change Password
                  </p>
                  <span className="text-xs bg-[#1E1A35] text-[#A09BB5] px-2 py-0.5 rounded-full">
                    Email Account
                  </span>
                </div>
                <p className="text-xs text-[#9C97B5] mt-1 mb-3">
                  Update your password to keep your account secure.
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full rounded-lg border border-[#2A2A40] bg-[#1E1A35] px-3 py-2 text-sm text-white placeholder:text-[#9C97B5] focus:border-[#7C5CFC] focus:outline-none"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full rounded-lg border border-[#2A2A40] bg-[#1E1A35] px-3 py-2 text-sm text-white placeholder:text-[#9C97B5] focus:border-[#7C5CFC] focus:outline-none"
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
                    className="flex items-center gap-2 border border-[#2A2A40] text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#1E1A35] disabled:opacity-50 transition-colors"
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

        <div className="bg-red-950/30 border border-red-900 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 shrink-0 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
              <p className="text-xs text-[#9C97B5] mt-0.5">
                Deleting your account is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <button className="shrink-0 flex items-center gap-2 border border-red-800 text-red-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-950 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}