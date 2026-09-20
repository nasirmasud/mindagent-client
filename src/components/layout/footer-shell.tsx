"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

const HIDDEN_PATHS = [
  "/ai-chat",
  "/content-generator",
  "/data-analyzer",
  "/image-analyzer",
  "/profile",
  "/settings",
  "/items",
];

export function FooterShell() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;
  return <Footer />;
}