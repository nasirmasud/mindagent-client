import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 md:px-20">
      <div className="relative mb-8">
        <div className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          404
        </div>
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-400 flex items-center justify-center text-white text-sm md:text-base font-bold animate-pulse">
          !
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-3">Agent Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Looks like this page wandered off — maybe it&apos;s analyzing data
        somewhere else. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/explore">
            <Search className="h-4 w-4 mr-2" />
            Explore Agents
          </Link>
        </Button>
      </div>
    </div>
  );
}
