import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Toaster } from "@/components/shared/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindAgent",
  description: "AI Agents That Think. Create. Deliver Results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
              <Footer />
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
