import Link from "next/link";
import { communities } from "@/lib/mock-data";

type Props = {
  currentSlug: string;
  basePath: string;
  label?: string;
};

export default function CommunityAreaBar({ currentSlug, basePath, label }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label ?? "Your area"}</p>
          <p className="mt-1 text-sm text-text-secondary">
            Showing content for <span className="font-medium text-foreground">{communities.find((c) => c.slug === currentSlug)?.name ?? currentSlug}</span> by default. Search or switch to browse other communities.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {communities.map((c) => {
            const active = c.slug === currentSlug;
            return (
              <Link
                key={c.slug}
                href={`${basePath}?area=${c.slug}`}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted hover:text-foreground"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
          <span className="ml-1 hidden text-xs text-muted sm:inline">|</span>
          <input
            readOnly
            placeholder="Search other communities..."
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted/70 sm:w-56"
          />
        </div>
      </div>
    </div>
  );
}