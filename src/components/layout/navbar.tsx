"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { toast } from "sonner";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const baseLinks = [{ href: "/explore" }, { href: "/pricing" }];

const authLinks = [
  { href: "/ai-chat" },
  { href: "/content-generator" },
  { href: "/data-analyzer" },
  { href: "/image-analyzer" },
];

const contactLink = { href: "/contact" };

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuthContext();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-20">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src="/favicon.ico" alt="MindAgent logo" className="h-[4.5rem] w-[4.5rem] -mt-2" />
          <span className="text-xl font-bold text-foreground">
            Mind<span className="text-primary">Agent</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-medium text-muted-foreground" aria-label="Main navigation">
          {[...baseLinks, ...(!loading && isAuthenticated ? authLinks : []), contactLink].map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-mono text-[15px] rounded-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active ? "text-primary" : "hover:text-primary"
                )}
              >
                {link.href}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {[...baseLinks, ...(!loading && isAuthenticated ? authLinks : []), contactLink].map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-mono text-lg font-medium transition rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {link.href}
                    </Link>
                  );
                })}
                <hr className="my-2 border-border" />
                {!loading && isAuthenticated ? (
                  <>
                    <Link href="/history" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition">History</Link>
                    <Link href="/profile" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition">Profile</Link>
                    <Button variant="outline" onClick={() => { logout(); toast.success("Logged out"); setOpen(false); }}>Logout</Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/login?tab=register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {!loading && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-md max-lg:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); toast.success("Logged out"); }}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/login?tab=register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
