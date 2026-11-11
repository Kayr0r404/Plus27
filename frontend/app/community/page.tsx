import Link from "next/link";
import CommunityAreaBar from "@/components/CommunityAreaBar";
import {
  getCommunityBySlug,
  getEventsByCommunity,
  getGroupsByCommunity,
  getMeetPostsByCommunity,
} from "@/lib/mock-data";

type Props = { searchParams: Promise<{ area?: string; tab?: string }> };

const tabs = [
  { key: "meet", label: "Meet" },
  { key: "events", label: "Events" },
  { key: "forums", label: "Forums" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const groupToneClass = {
  mint: "from-primary/20 to-primary/5",
  teal: "from-secondary/20 to-secondary/5",
  violet: "from-violet/20 to-violet/5",
  navy: "from-surface-muted to-background",
} as const;

export default async function CommunityPage({ searchParams }: Props) {
  const { area, tab } = await searchParams;
  const selected = getCommunityBySlug(area);
  const activeTab: TabKey = tab === "events" || tab === "forums" ? tab : "meet";

  const meetPosts = getMeetPostsByCommunity(selected.slug);
  const events = getEventsByCommunity(selected.slug);
  const groups = getGroupsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Community</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Connect with people in {selected.name}. Meet others through casual posts, discover local events, and join forums (groups) around shared interests.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {activeTab === "meet" ? "Create post" : activeTab === "events" ? "Add event" : "Create group"}
          </button>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/community" label="Community area" />

        <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm">
          {tabs.map((t) => {
            const active = t.key === activeTab;
            return (
              <Link
                key={t.key}
                href={`/community?area=${selected.slug}&tab=${t.key}`}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {activeTab === "meet" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <section className="space-y-3">
              {meetPosts.length ? (
                meetPosts.map((post) => (
                  <article key={post.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                          {post.author.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{post.author}</p>
                          <p className="text-xs text-muted">{selected.name} · {post.area} · {post.time}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted"
                      >
                        Send invite
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">{post.content}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <button type="button" className="font-medium text-primary hover:underline">Connect</button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                  No meet posts in {selected.name} yet. Be the first to share something casual and connect with others.
                </div>
              )}
            </section>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">Meet in {selected.name}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>• Share casual posts and local updates.</li>
                  <li>• Connect with neighbors and new people.</li>
                  <li>• Send invites to meet up or chat.</li>
                  <li>• Keep it friendly and community-focused.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">People are talking about</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["meetup", "connect", "weekend", "fitness", "parents", "vendors"].map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">#{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <section className="space-y-3">
              {events.length ? (
                events.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">{event.category}</span>
                      <span>{selected.name} · {event.area}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-navy">{event.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>
                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div><dt className="text-muted">Date</dt><dd className="font-medium text-foreground">{event.date}</dd></div>
                      <div><dt className="text-muted">Time</dt><dd className="font-medium text-foreground">{event.time}</dd></div>
                      <div className="sm:col-span-2"><dt className="text-muted">Location</dt><dd className="font-medium text-foreground">{event.location}</dd></div>
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-muted">Hosted by {event.host} · {event.attendees} attending</p>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted"
                      >
                        Interested
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                  No events listed in {selected.name} yet. Check back soon or add a local event.
                </div>
              )}
            </section>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">Local events</h3>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Find what’s happening around {selected.name}, from community clean-ups and markets to meetups and youth activities.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">Event types</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Community", "Market", "Meetup", "Sports", "Youth", "Business"].map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "forums" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <section className="space-y-3">
              {groups.length ? (
                groups.map((group) => (
                  <article key={group.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-colors hover:border-primary/30">
                    <div className={`h-20 bg-gradient-to-r ${groupToneClass[group.coverTone]}`} />
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                            <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-foreground">{group.category}</span>
                            <span>{selected.name} · {group.area}</span>
                          </div>
                          <h2 className="mt-2 text-lg font-semibold text-navy">
                            <Link href={`/community/groups/${group.id}`} className="hover:text-primary">
                              {group.name}
                            </Link>
                          </h2>
                        </div>
                        <Link
                          href={`/community/groups/${group.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted"
                        >
                          View group
                        </Link>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{group.description}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((tag) => (
                            <span key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span>{group.members} members</span>
                          <span>{group.posts} posts</span>
                          <span>Active {group.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                  No forums (groups) in {selected.name} yet. Create a group to start discussions around shared interests.
                </div>
              )}
            </section>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">Forums are groups</h3>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Join local groups to take part in focused discussions, ask questions, and stay updated on topics that matter in your community.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="font-semibold text-navy">Popular group topics</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["general", "vendors", "parents", "business", "sports", "support"].map((t) => (
                    <span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">#{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
