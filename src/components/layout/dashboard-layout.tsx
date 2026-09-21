"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle2,
  History as HistoryIcon,
  Gauge,
  Settings as SettingsIcon,
  LogOut,
  Crown,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuthContext } from "@/providers/auth-provider";

const NAV_ITEMS = [
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/usage", label: "Usage & Plan", icon: Gauge },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const activeCls = "bg-[#7C5CFC] text-white";
const idleCls = "text-[#A09BB5] hover:bg-[#131320] hover:text-white";

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active ? activeCls : idleCls
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function DashboardLayout({
  children,
  fill = false,
}: {
  children: ReactNode;
  fill?: boolean;
}) {
  const pathname = usePathname();
  const { logout } = useAuthContext();

  return (
    <div
      className={`flex bg-[#0B0B1F] text-white ${
        fill
          ? "h-[calc(100vh-4rem)] overflow-hidden"
          : "min-h-[calc(100vh-4rem)]"
      }`}
    >
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[#232235] sticky top-16 h-[calc(100vh-4rem)] flex-col p-4">
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <SidebarNav pathname={pathname} />
        </nav>

        <div className="mt-auto pt-4 border-t border-[#232235] space-y-4">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A09BB5] hover:bg-[#131320] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          <div className="bg-[#131320] border border-[#232235] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-[#FBBF24]" />
              <span className="text-sm font-semibold text-white">Pro</span>
            </div>
            <p className="text-xs text-[#A09BB5] leading-relaxed">
              Upgrade to unlock unlimited analyses and AI generations.
            </p>
            <Link
              href="/pricing"
              className="mt-3 block w-full text-center bg-[#7C5CFC] hover:bg-[#6B4CE8] text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile nav */}
        <nav className="lg:hidden sticky top-16 z-20 flex items-center gap-2 overflow-x-auto border-b border-[#232235] bg-[#0B0B1F]/95 px-4 py-2.5 backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? activeCls : idleCls
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`flex-1 ${
            fill ? "min-h-0 overflow-hidden" : "min-w-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}