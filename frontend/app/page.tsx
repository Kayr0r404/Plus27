import Link from "next/link";
import { communities, defaultCommunitySlug, getCommunityBySlug } from "@/lib/mock-data";

type Props = { searchParams: Promise<{ area?: string }> };

const features = [
  {
    title: "Community hub",
    description:
      "Give every community a space to meet, share casual posts, connect with others, discover local events, and join forums (groups).",
    href: "/community",
    cta: "Explore community",
  },
  {
    title: "Community marketplace",
    description:
      "See what people and vendors around you are selling in one place, from everyday essentials to local services.",
    href: "/marketplace",
    cta: "Browse marketplace",
  },
  {
    title: "Vendor stores & reviews",
    description:
      "Vendors can showcase products like a mini e-commerce store, while residents recommend and rate trusted local businesses.",
    href: "/vendors",
    cta: "Find vendors",
  },
  {
    title: "Odd jobs near you",
    description:
      "Help people find quick gigs and local opportunities in their area, from once-off tasks to part-time work.",
    href: "/jobs",
    cta: "View jobs",
  },
  {
    title: "Rooms & houses for rent",
    description:
      "Make it easier to discover available rentals in your community without searching through unrelated listings.",
    href: "/rentals",
    cta: "See rentals",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose your area",
    description:
      "People see what’s relevant to where they are by default, so a resident in one township isn’t flooded with posts from another.",
  },
  {
    step: "02",
    title: "Connect and discover",
    description:
      "Join local discussions, find vendors and products, spot odd jobs, and browse rentals all within your community.",
  },
  {
    step: "03",
    title: "Support local growth",
    description:
      "Vendors build visibility, residents share recommendations, and communities create their own trusted digital hub.",
  },
];

export default async function Home({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area ?? defaultCommunitySlug);

  return (
    <div className="w-full bg-background">
      <section className="relative overflow-hidden border-b border-border bg-surface-muted/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(48,136,160,0.14),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(19,72,89,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(245,91,3,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(76,174,196,0.16),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(31,95,112,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,122,47,0.10),transparent_28%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for local communities across South Africa
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
              One platform for your community to <span className="text-primary">talk, trade, hire, and find home</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
              Plus27 brings local life into one place. Each community gets its own community hub, marketplace, vendor stores, odd jobs board, and rental listings, so people see what’s relevant to their area first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/community?area=${selected.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Explore {selected.name}
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              >
                Join Plus27
              </Link>
              <Link
                href="#communities"
                className="inline-flex h-12 items-center justify-center rounded-xl px-2 text-sm font-semibold text-link hover:underline"
              >
                Choose a community
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              Example: someone in <span className="font-medium text-foreground">{selected.name}</span> sees local discussions, vendors, jobs, and rentals by default, and can search other communities when needed.
            </p>
          </div>

          <div className="grid gap-4 self-center">
            <div className="rounded-2xl border border-border bg-surface/95 p-5 shadow-lg shadow-black/5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Inside Plus27</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Community", value: "Meet, events & forums" },
                  { label: "Marketplace", value: "Local products & services" },
                  { label: "Vendors", value: "Stores, ratings & reviews" },
                  { label: "Jobs", value: "Odd jobs nearby" },
                  { label: "Rentals", value: "Rooms & houses to let" },
                  { label: "Area-first", value: "Relevant to your location" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-background/70 p-3">
                    <p className="text-sm font-semibold text-navy">{item.label}</p>
                    <p className="mt-1 text-xs text-muted">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-muted p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-primary">Local by default</p>
                  <h2 className="mt-1 text-lg font-semibold text-navy">Your area comes first</h2>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {selected.name}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                A Daveyton resident sees Daveyton discussions, vendors, jobs, and rentals first. If they want to explore Soweto or another community, they can search for it.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/vendors?area=${selected.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted">Local vendors</Link>
                <Link href={`/jobs?area=${selected.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted">Odd jobs</Link>
                <Link href={`/rentals?area=${selected.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-surface-muted">Rentals</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Why Plus27</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            A digital home for everyday community life
          </h2>
          <p className="mt-3 text-base leading-7 text-muted">
            Instead of splitting conversations, buying and selling, local services, job opportunities, and rentals across different places, Plus27 brings them together in one community-centered platform.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-navy">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-text-secondary">{feature.description}</p>
              <Link href={`${feature.href}?area=${selected.slug}`} className="mt-4 inline-flex text-sm font-semibold text-link hover:underline">
                {feature.cta}
              </Link>
            </article>
          ))}
          <article className="flex flex-col rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-navy">Designed around place</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-text-secondary">
              Communities are different. Plus27 is built so each area can have its own activity and identity while still making it easy to search and discover others when you choose to.
            </p>
            <Link href={`/community?area=${selected.slug}`} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
              See a local example
            </Link>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Relevant to your area, open when you need more
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              The experience starts local. People can explore beyond their area, but the default view keeps attention on nearby conversations, opportunities, and businesses.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-text-secondary">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="communities" className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Start with your community</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Explore an area-based experience
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Pick a community to see how Plus27 brings local meetups, events, forums (groups), vendors, marketplace listings, odd jobs, and rentals together. Daveyton is shown here as an example.
            </p>
          </div>
          <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            Create an account
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {communities.map((community) => {
            const active = community.slug === selected.slug;
            return (
              <article
                key={community.slug}
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  active ? "border-primary/40 bg-primary/5" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-navy">{community.name}</h3>
                    <p className="mt-1 text-sm text-muted">{community.region}</p>
                  </div>
                  {active && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">Example</span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{community.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/community?area=${community.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">Community</Link>
                  <Link href={`/vendors?area=${community.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">Vendors</Link>
                  <Link href={`/marketplace?area=${community.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">Marketplace</Link>
                  <Link href={`/jobs?area=${community.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">Jobs</Link>
                  <Link href={`/rentals?area=${community.slug}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">Rentals</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-surface via-surface to-primary/10 p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">For residents, vendors, and communities</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">
                Build stronger local connections on Plus27
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                Whether someone wants to join a neighborhood discussion, recommend a trusted vendor, find a quick job, or list a room for rent, Plus27 makes local information easier to find and trust.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                Get started
              </Link>
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-surface-muted">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}