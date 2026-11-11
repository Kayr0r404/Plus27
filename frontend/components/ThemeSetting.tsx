"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "light" | "dark" | "system";

const options: { value: ThemeChoice; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "Soft light appearance." },
  { value: "dark", label: "Dark", description: "Low-light dark appearance." },
  { value: "system", label: "System", description: "Match your device setting." },
];

function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return choice;
}

function applyTheme(choice: ThemeChoice) {
  const theme = resolveTheme(choice);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeSetting() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("plus27-theme");
    const initial: ThemeChoice = stored === "light" || stored === "dark" ? stored : "system";
    setChoice(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || choice !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice, mounted]);

  function select(next: ThemeChoice) {
    setChoice(next);
    localStorage.setItem("plus27-theme", next);
    applyTheme(next);
  }

  if (!mounted) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const active = choice === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => select(opt.value)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-background hover:bg-surface-muted"
            }`}
            aria-pressed={active}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-navy">{opt.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${active ? "bg-primary" : "bg-border-strong"}`}
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">{opt.description}</p>
          </button>
        );
      })}
    </div>
  );
}