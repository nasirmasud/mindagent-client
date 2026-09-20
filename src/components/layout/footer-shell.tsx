"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function FooterShell() {
  const pathname = usePathname();
  if (pathname === "/ai-chat") return null;
  return <Footer />;
}