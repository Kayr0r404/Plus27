"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getMe, logout } from "@/lib/api";
import type { User } from "@/lib/api";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/vendors", label: "Vendors" },
  { href: "/jobs", label: "Jobs" },
  { href: "/rentals", label: "Rentals" },
];

function initials(user: User): string {
  const first = (user.first_name ?? "").trim()[0] ?? "";
  const last = (user.last_name ?? "").trim()[0] ?? "";
  const combined = (first + last).toUpperCase();
  return combined || user.username.slice(0, 1).toUpperCase() || "?";
}

function NavLink({
  href,
  label,
  active,
  onClick,
  mobile = false,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const base = mobile
    ? "flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
    : "whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors";
  const state = active
    ? mobile
      ? "bg-primary/10 text-primary"
      : "text-primary"
    : mobile
      ? "text-muted hover:bg-surface-muted hover:text-foreground"
      : "text-muted hover:text-foreground";
  return (
    <Link href={href} onClick={onClick} className={`${base} ${state}`} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
      setProfileOpen(false);
      setMobileOpen(false);
      router.push("/login?logged_out=1");
      router.refresh();
    }
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto w-full max-w-7xl px-4">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-2 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center justify-start">
            <Link href="/" className="inline-flex min-w-0 shrink-0 items-center gap-2" aria-label="Plus27">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/30">
                +27
              </span>
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="h-5 w-0.5 rounded-sm bg-gradient-to-b from-primary via-secondary to-violet" aria-hidden="true" />
                <span className="truncate text-lg font-extrabold tracking-[0.04em] text-navy">Plus27</span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
            ))}
          </div>

          <div className="col-start-2 flex shrink-0 items-center justify-self-end gap-1 sm:gap-1.5 md:col-start-3">
            {loading ? (
              <div className="hidden h-9 w-24 animate-pulse rounded-full bg-surface-muted md:block" />
            ) : user ? (
              <div className="relative hidden md:flex items-center" ref={profileRef}>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-l-full px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary ring-1 ring-primary/20">
                    {initials(user)}
                  </span>
                  <span className="max-w-[8rem] truncate">{user.first_name || user.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center rounded-r-full px-2 py-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg"
                  >
                    <div className="border-b border-border px-2.5 py-2">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="block truncate text-sm font-medium text-foreground hover:text-primary">
                        {user.first_name} {user.last_name}
                      </Link>
                      <p className="truncate text-xs text-muted">@{user.username}</p>
                    </div>
                    <Link
                      href="/notifications"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-surface-muted"
                    >
                      Notifications
                    </Link>
                    <Link
                      href="/inbox"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-surface-muted"
                    >
                      Inbox
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm text-danger hover:bg-danger/10"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground">
                  Log in
                </Link>
                <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
                  Join
                </Link>
              </div>
            )}

            <div className="flex items-center gap-0.5 md:hidden">
              {!loading && user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/20"
                  aria-label="Profile"
                >
                  {initials(user)}
                </Link>
              ) : null}
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border/70 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                  mobile
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
            <div className="mt-3 border-t border-border/70 pt-3">
              {loading ? (
                <div className="h-10 animate-pulse rounded-lg bg-surface-muted" />
              ) : user ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground hover:text-primary">
                      {user.first_name} {user.last_name}
                    </Link>
                    <p className="text-xs text-muted">@{user.username}</p>
                  </div>
                  <Link href="/notifications" onClick={() => setMobileOpen(false)} className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-foreground">
                    Notifications
                  </Link>
                  <Link href="/inbox" onClick={() => setMobileOpen(false)} className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-foreground">
                    Inbox
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-danger/10">
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-foreground">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="inline-flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}