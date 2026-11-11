import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCommunityBySlug,
  getGroupById,
  getGroupsByCommunity,
  getPostsByGroup,
} from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

const toneClass = {
  mint: "from-primary/20 to-primary/5",
  teal: "from-secondary/20 to-secondary/5",
  violet: "from-violet/20 to-violet/5",
  navy: "from-surface-muted to-background",
} as const;

export default async function CommunityGroupPage({ params }: Props) {
  const { id } = await params;
  const group = getGroupById(id);
  if (!group) notFound();

  const posts = getPostsByGroup(group.id);
  const community = getCommunityBySlug(group.communitySlug);
  const related = getGroupsByCommunity(group.communitySlug).filter((g) => g.id !== group.id).slice(0, 3);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <Link href={`/community?area=${group.communitySlug}&tab=forums`} className="hover:text-primary">Community</Link>
          <span>/</span>
          <Link href={`/community?area=${group.communitySlug}&tab=forums`} className="hover:text-primary">Forums</Link>
          <span>/</span>
          <span className="text-foreground">{group.name}</span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className={`h-28 bg-gradient-to-r ${toneClass[group.coverTone]} sm:h-36`} />
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">{group.category} group</span>
                  <span>{community.name} · {group.area}</span>
                  <span>•</span>
                  <span>Active {group.lastActive}</span>
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy">{group.name}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-text-secondary">{group.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
                >
                  Join group
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  New post
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">#{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Group posts</h2>
              <div className="mt-4 space-y-4">
                {posts.length ? (
                  posts.map((post) => (
                    <article key={post.id} className="rounded-xl border border-border bg-background p-4">
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
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted">
                    No posts yet. Start the conversation in this group.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-semibold text-navy">Write a post</h3>
              <p className="mt-1 text-sm text-muted">Share an update or question with this group. (UI skeleton)</p>
              <textarea
                readOnly
                placeholder="Write something to the group..."
                className="mt-4 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  Post
                </button>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Group details</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-muted">Category</dt><dd className="text-foreground">{group.category}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Community</dt><dd className="text-foreground">{community.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Members</dt><dd className="text-foreground">{group.members}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted">Posts</dt><dd className="text-foreground">{group.posts}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">More groups in {community.name}</h3>
              <ul className="mt-3 space-y-3">
                {related.length ? related.map((g) => (
                  <li key={g.id}>
                    <Link href={`/community/groups/${g.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                      {g.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{g.members} members · {g.posts} posts</p>
                  </li>
                )) : (
                  <li className="text-sm text-muted">No other groups yet.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
