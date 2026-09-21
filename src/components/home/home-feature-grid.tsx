import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Code2, Image as ImageIcon, PenLine, Search } from "lucide-react";
import { SectionHeader } from "./section-header";

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

function FeatureCard({
  icon: Icon,
  tag,
  title,
  description,
  href,
}: (typeof features)[number]) {
  return (
    <Link
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

      <span className="mt-auto pt-6 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
        Explore
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function HomeFeatureGrid() {
  return (
    <section className="w-full px-4 md:px-20 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeader
          label="./agents"
          title="Every agent, scoped to one job."
          description="No one-size-fits-all chatbots. Pick a focused agent, give it your input, and get a result built for exactly that task."
        />

        <div className="mt-12 border border-border">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.slice(0, 3).map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
          <div aria-hidden="true" className="h-px w-full bg-border" />
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.slice(3).map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}