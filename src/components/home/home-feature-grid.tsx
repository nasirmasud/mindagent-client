import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Code2, Image as ImageIcon, PenLine, Search } from "lucide-react";
import { SectionLabel } from "./section-label";

const features = [
  {
    icon: PenLine,
    tag: "01 - writing",
    title: "Content Generator",
    description: "Turn a topic into polished blogs, posts, and scripts in seconds.",
    href: "/content-generator",
  },
  {
    icon: BarChart3,
    tag: "02 - data",
    title: "Data Analyzer",
    description: "Upload CSV, Excel or JSON and get instant insights and charts.",
    href: "/data-analyzer",
  },
  {
    icon: Search,
    tag: "03 - research",
    title: "Research Assistant",
    description: "Gather, cross-check, and summarize sources with citations.",
    href: "/ai-chat",
  },
  {
    icon: ImageIcon,
    tag: "04 - vision",
    title: "Image Analyst",
    description: "Understand and describe any image - charts, screenshots, photos.",
    href: "/image-analyzer",
  },
  {
    icon: Code2,
    tag: "05 - code",
    title: "Coding Agent",
    description: "Write, review, and refactor code across your whole stack.",
    href: "/ai-chat",
  },
  {
    icon: Bot,
    tag: "06 - chat",
    title: "Smart Assistant",
    description: "Your everyday AI copilot for questions, ideas, and tasks.",
    href: "/ai-chat",
  },
];

export function HomeFeatureGrid() {
  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <SectionLabel path="./agents" />
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Every agent, scoped to one job.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            No one-size-fits-all chatbots. Pick a focused agent, give it your
            input, and get a result built for exactly that task.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, tag, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex flex-col bg-card p-6 transition-colors duration-300 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-medium text-muted-foreground">{tag}</span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>

              <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                Explore
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}