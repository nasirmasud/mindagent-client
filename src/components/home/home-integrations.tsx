import { Figma, Github, Slack } from "lucide-react";

function NotionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="16" rx="3" fill="currentColor" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        N
      </text>
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.5 5.3A16.9 16.9 0 0 0 15.2 4l-.5 1a15.6 15.6 0 0 0-5.4 0L8.8 4a16.9 16.9 0 0 0-4.3 1.3C2 9 1.4 12.7 1.7 16.3A17 17 0 0 0 6.7 19l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 10.5 0l.4.3c-.5.3-1.1.6-1.7.8L16.9 19a17 17 0 0 0 5-2.7c.4-4.3-.7-7.9-2.4-11ZM9.3 14c-.8 0-1.5-.8-1.5-1.7S8.5 10.6 9.3 10.6s1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm5.4 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}

function ZapierIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l2 7.6L21 12l-7 2.4L12 22l-2-7.6L3 12l7-2.4L12 2Z" />
      <path d="M12 9.8l1.3 4.9 4.9 1.3-4.9 1.3L12 22l-1.3-4.7L5.8 16l4.9-1.3L12 9.8Z" fill="transparent" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="16" rx="3" fill="#217346" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        X
      </text>
    </svg>
  );
}

const integrations = [
  { name: "Excel", icon: <ExcelIcon className="h-6 w-6" />, x: "50%", y: "7%" },
  { name: "GitHub", icon: <Github className="h-6 w-6" />, x: "85%", y: "22%" },
  { name: "Slack", icon: <Slack className="h-6 w-6" />, x: "94%", y: "60%" },
  { name: "Figma", icon: <Figma className="h-6 w-6" />, x: "70%", y: "91%" },
  { name: "Discord", icon: <DiscordIcon className="h-6 w-6" />, x: "30%", y: "91%" },
  { name: "Notion", icon: <NotionIcon className="h-6 w-6" />, x: "6%", y: "60%" },
  { name: "Zapier", icon: <ZapierIcon className="h-6 w-6" />, x: "15%", y: "22%" },
];

export function HomeIntegrations() {
  return (
    <section className="w-full border-y border-border bg-card/40 px-4 md:px-20 py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Integrate Seamlessly with Your Tools
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            MindAgent plugs into the stack you already use, so your agents can
            act where your work actually happens.
          </p>
        </div>

        {/* Hub-and-spoke diagram */}
        <div className="relative mx-auto mt-10 aspect-square w-full max-w-[820px]" role="img" aria-label="MindAgent connects with Excel, Slack, GitHub, Figma, Notion, Discord and Zapier">
          {/* Connector lines */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {integrations.map((i) => (
              <line
                key={i.name}
                x1="50"
                y1="50"
                x2={i.x.replace("%", "")}
                y2={i.y.replace("%", "")}
                stroke="hsl(var(--primary))"
                strokeOpacity="0.35"
                strokeWidth="0.4"
                strokeDasharray="1.4 1.6"
              />
            ))}
          </svg>

          {/* Spoke nodes */}
          {integrations.map((i) => (
            <div
              key={i.name}
              className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-1 text-foreground shadow-lg shadow-primary/10 transition-transform duration-300 hover:-translate-x-1/2 hover:-translate-y-[55%] hover:scale-110 md:h-[72px] md:w-16"
              style={{ left: i.x, top: i.y }}
            >
              {i.icon}
              <span className="max-w-full truncate text-[11px] font-medium leading-none">
                {i.name}
              </span>
              <span className="sr-only">MindAgent connects with {i.name}</span>
            </div>
          ))}

          {/* Center node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary bg-card shadow-2xl shadow-primary/30">
              <img src="/favicon.ico" alt="" className="h-12 w-12" />
              <span className="sr-only">MindAgent hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}