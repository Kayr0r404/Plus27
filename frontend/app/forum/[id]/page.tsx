import Link from "next/link";
import { notFound } from "next/navigation";
import { getThreadById, getPostsByThread, getThreadsByCommunity, getCommunityBySlug } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export default async function ForumThreadPage({ params }: Props) {
  const { id } = await params;
  const thread = getThreadById(id);
  if (!thread) notFound();
  const posts = getPostsByThread(thread.id);
  const threadCommunity = getCommunityBySlug(thread.communitySlug);
  const related = getThreadsByCommunity(thread.communitySlug).filter((t) => t.id !== thread.id).slice(0, 3);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <Link href={`/forum?area=${thread.communitySlug}`} className="hover:text-primary">Forum</Link>
          <span>/</span>
          <Link href={`/?area=${thread.communitySlug}`} className="hover:text-primary">{threadCommunity.name}</Link>
          <span>/</span>
          <span className="text-foreground">{thread.category}</span>
        </div>
        <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Community discussion · {threadCommunity.name} ({thread.area})
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {thread.category}
                </span>
                <span>{thread.area}</span>
                <span>•</span>
                <span>{thread.lastActive}</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-navy">{thread.title}</h1>
              <p className="mt-2 text-sm text-muted">Started by {thread.author} · {thread.replies} replies · {thread.views} views</p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{thread.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {thread.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Replies</h2>
              <div className="mt-4 space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-primary">
                            {post.author.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{post.author}</p>
                            {post.role && <p className="text-xs text-primary">{post.role}</p>}
                          </div>
                        </div>
                        <span className="text-xs text-muted">{post.time}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-text-secondary">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted">
                    No replies yet. Be the first to join this discussion.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-semibold text-navy">Add a reply</h3>
              <p className="mt-1 text-sm text-muted">Share your thoughts or local knowledge. (UI skeleton)</p>
              <textarea
                readOnly
                placeholder="Write your reply..."
                className="mt-4 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  Post reply
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Thread details</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-muted">Category</dt><dd className="text-foreground">{thread.category}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Area</dt><dd className="text-foreground">{thread.area}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Replies</dt><dd className="text-foreground">{thread.replies}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Views</dt><dd className="text-foreground">{thread.views}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Related discussions</h3>
              <ul className="mt-3 space-y-3">
                {related.map((t) => (
                  <li key={t.id}>
                    <Link href={`/forum/${t.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                      {t.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{t.replies} replies</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}