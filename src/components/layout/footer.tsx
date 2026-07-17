import Link from "next/link";

const platformLinks = [
  { href: "/explore", label: "AI Agents" },
  { href: "/explore", label: "AI Tools" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/pricing", label: "Pricing" },
  { href: "/explore", label: "Integrations" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
];

const supportLinks = [
  { href: "/contact", label: "Help Center" },
  { href: "/docs", label: "Documentation" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="bg-[#0B0B1F] text-gray-300">
      <div className="w-full px-4 md:px-20 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/favicon.ico" alt="MindAgent" className="h-[3.75rem] w-[3.75rem] -mt-2" />
              <span className="text-white font-semibold text-lg">MindAgent</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Your all-in-one AI platform to create, analyze, and automate anything with intelligent agents.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300"><path d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.2-6.4L5 21H1.9l7.7-8.8L1 3h6.7l4.7 5.9L18.9 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l12.3 14.5Z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300"><path d="M6.9 8.4H3.6V20h3.3V8.4ZM5.3 3.5a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9ZM20.4 20h-3.3v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V20h-3.3V8.4h3.2v1.6h.05c.45-.8 1.55-1.7 3.2-1.7 3.4 0 4.05 2.3 4.05 5.2V20Z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.9 3.6 12 3.6 12 3.6h0s-4.9 0-7.8.3c-.4 0-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S.6 9.1.6 11v1.9c0 1.9.4 3.8.4 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.9 0 7.8-.3c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.4-1.9.4-3.8V11c0-1.9-.4-3.8-.4-3.8ZM9.7 14.9V8.5l6.1 3.2-6.1 3.2Z" /></svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0 text-gray-500"><path d="M4 4h16v16H4z" opacity="0" /><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
                <span>hello@mindagent.ai</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0 text-gray-500"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2Z" /></svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0 text-gray-500"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>123 AI Street, San Francisco, CA 94107, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MindAgent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
