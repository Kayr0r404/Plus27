import Link from "next/link";
import CommunityAreaBar from "@/components/CommunityAreaBar";
import { getCommunityBySlug, getThreadsByCommunity } from "@/lib/mock-data";

const categories = ["All", "Community", "Marketplace", "Local Info", "Vendors"];

type Props = { searchParams: Promise<{ area?: string }> };

export default async function ForumPage({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area);
  const threads = getThreadsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Discussion Forum</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Ask questions, share updates, and discuss local topics with residents and vendors in your community. By default, you see discussions from {selected.name}.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Start a discussion
          </button>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/forum" label="Forum area" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span
                key={cat}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  i === 0
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <input
              type="search"
              placeholder={`Search discussions in ${selected.name} or other communities...`}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              readOnly
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="space-y-3">
            {threads.length ? threads.map((thread) => (
              <article
                key={thread.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-foreground">
                    {thread.category}
                  </span>
                  <span>{selected.name} · {thread.area}</span>
                  <span>•</span>
                  <span>Last active {thread.lastActive}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-navy">
                  <Link href={`/forum/${thread.id}`} className="hover:text-primary">
                    {thread.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">{thread.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>By {thread.author}</span>
                    <span>{thread.replies} replies</span>
                    <span>{thread.views} views</span>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                No discussions in {selected.name} yet. Switch or search another community to explore more.
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Forum guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>• Be respectful and helpful to neighbors.</li>
                <li>• Share accurate local information.</li>
                <li>• Use clear titles for easier discovery.</li>
                <li>• Recommend vendors based on real experiences.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Popular topics in your area</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["events", "vendors", "schools", "utilities", "small business", "safety"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}