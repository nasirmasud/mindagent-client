import Link from "next/link";
import { CircleUser } from "lucide-react";
import { siteContact, siteSocials } from "@/lib/site-info";

const platformLinks = [
  { href: "/explore", label: "AI Agents" },
  { href: "/explore", label: "AI Tools" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/pricing", label: "Pricing" },
  { href: "/explore", label: "Integrations" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/about", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
];

const supportLinks = [
  { href: "/contact", label: "Help Center" },
  { href: "/about", label: "Documentation" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
];

const socialIconClass =
  "w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 text-white/75"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.09), transparent 45%), linear-gradient(135deg, #3A2FB0 0%, #5338C4 55%, #6E3FD4 100%)",
      }}
    >
      <div className="w-full px-4 md:px-20 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MindAgent"
                width={60}
                height={60}
                className="h-[3.75rem] w-[3.75rem] -mt-2"
              />
              <span className="text-xl font-bold text-white">
                Mind<span className="text-[#CDB9FF]">Agent</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Your all-in-one AI platform to create, analyze, and automate
              anything with intelligent agents.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={siteSocials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className={socialIconClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a
                href={siteSocials.x}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X (Twitter)"
                className={socialIconClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.2-6.4L5 21H1.9l7.7-8.8L1 3h6.7l4.7 5.9L18.9 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l12.3 14.5Z" />
                </svg>
              </a>
              <a
                href={siteSocials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className={socialIconClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.9 8.4H3.6V20h3.3V8.4ZM5.3 3.5a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9ZM20.4 20h-3.3v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V20h-3.3V8.4h3.2v1.6h.05c.45-.8 1.55-1.7 3.2-1.7 3.4 0 4.05 2.3 4.05 5.2V20Z" />
                </svg>
              </a>
              <a
                href={siteSocials.portfolio}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Portfolio"
                className={socialIconClass}
              >
                <CircleUser className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 mt-0.5 shrink-0 text-white/60"
                >
                  <path d="M3 6h18v12H3z" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <a
                  href={`mailto:${siteContact.email}`}
                  className="break-words transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-sm"
                >
                  {siteContact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 mt-0.5 shrink-0 text-white/60"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2Z" />
                </svg>
                <a
                  href={`tel:${siteContact.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-sm"
                >
                  {siteContact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 mt-0.5 shrink-0 text-white/60"
                >
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    siteContact.address
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-words transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-sm"
                >
                  {siteContact.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 mt-10 pt-6 text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} MindAgent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}