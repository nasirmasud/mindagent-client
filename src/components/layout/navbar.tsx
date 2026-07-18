"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
];

const authLinks = [
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/content-generator", label: "Content Generator" },
  { href: "/data-analyzer", label: "Data Analyzer" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#0B0B1F]/95 backdrop-blur">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-20">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src="/favicon.ico" alt="MindAgent" className="h-[4.5rem] w-[4.5rem] -mt-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Mind<span className="text-indigo-600">Agent</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          {[...baseLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {[...baseLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                {isAuthenticated ? (
                  <>
                    <Link href="/items/manage" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition">My Items</Link>
                    <Link href="/profile" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition">Profile</Link>
                    <Button variant="outline" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full max-md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/items/manage">My Items</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" asChild className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
