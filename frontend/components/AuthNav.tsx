"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe, logout } from "@/lib/api";
import type { User } from "@/lib/api";

function initials(user: User): string {
  const first = (user.first_name ?? "").trim()[0] ?? "";
  const last = (user.last_name ?? "").trim()[0] ?? "";
  const combined = (first + last).toUpperCase();
  return combined || user.username.slice(0, 1).toUpperCase() || "?";
}

export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
      setOpen(false);
      router.push("/login?logged_out=1");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-16 animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-9 w-9 animate-pulse rounded-full bg-surface-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Join
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-2.5 text-sm transition-colors hover:bg-surface-muted"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar is a user-supplied remote URL
          <img
            src={user.avatar_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/30"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            {initials(user)}
          </span>
        )}
        <span className="hidden max-w-[7rem] truncate text-foreground sm:inline">
          {user.first_name || user.username}
        </span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg"
        >
          <div className="border-b border-border px-2.5 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-xs text-muted">@{user.username}</p>
          </div>
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-surface-muted"
          >
            Profile &amp; dashboard
          </Link>
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-surface-muted"
          >
            Account settings
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
  );
}