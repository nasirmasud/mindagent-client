import Link from "next/link";
import { ArrowRight, BarChart3, Lightbulb, LineChart, Wand2 } from "lucide-react";

const posts = [
  {
    icon: BarChart3,
    tag: "Product",
    title: "What we shipped: smarter Data Analysis with native charts",
    href: "/blog",
  },
  {
    icon: LineChart,
    tag: "AI Research",
    title: "How agents read spreadsheets and reason over raw numbers",
    href: "/blog",
  },
  {
    icon: Lightbulb,
    tag: "Guides",
    title: "10 prompts that turn the Content Generator into a copy team",
    href: "/blog",
  },
  {
    icon: Wand2,
    tag: "Company",
    title: "Why we built every agent to do exactly one job well",
    href: "/blog",
  },
];

export function HomeBlog() {
  return (
    <section className="w-full border-t border-border px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Blog
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              From our blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map(({ icon: Icon, tag, title, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* Thumbnail */}
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-accent to-primary/10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(124,92,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />
                <Icon
                  className="relative h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="self-start rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {tag}
                </span>
                <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-foreground">
                  {title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}