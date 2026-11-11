import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plus27",
  description: "Create an account and manage your Plus27 profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <header className="border-b border-border bg-surface/95 backdrop-blur">
          <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-navy">
              Plus27
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Create account
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex flex-1">{children}</main>
      </body>
    </html>
  );
}