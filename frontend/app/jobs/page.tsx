import CommunityAreaBar from "@/components/CommunityAreaBar";
import { getCommunityBySlug, getJobsByCommunity } from "@/lib/mock-data";

const categories = ["All", "Gardening", "Retail", "Tutoring", "Events", "Delivery", "Maintenance", "Cleaning", "Other"];

type Props = { searchParams: Promise<{ area?: string }> };

export default async function JobsPage({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area);
  const localJobs = getJobsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Odd Jobs Near You</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Find once-off, part-time, and short-term jobs around {selected.name}. By default, you see opportunities in your area. Search or switch communities to explore other areas.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Post a job
          </button>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/jobs" label="Jobs area" />

        <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[1fr_220px_220px_auto]">
          <input
            readOnly
            placeholder={`Search jobs in ${selected.name} or other communities...`}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted/70"
          />
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            <option>All job types</option>
            <option>Once-off</option>
            <option>Part-time</option>
            <option>Short-term</option>
          </select>
          <button type="button" className="h-10 rounded-lg border border-border bg-surface-muted px-4 text-sm font-medium text-foreground">
            Filters
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>Showing <span className="font-medium text-foreground">{localJobs.length}</span> jobs in <span className="font-medium text-foreground">{selected.name}</span></p>
          <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-foreground">Most recent</span>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          {localJobs.length ? localJobs.map((job) => (
            <article key={job.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-foreground">{job.category}</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">{job.type}</span>
                    <span>{job.area}, {selected.name}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-navy">{job.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-foreground">{job.pay}</p>
                  <p className="text-xs text-muted">{job.postedAt}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{job.description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-sm text-muted">Posted by <span className="font-medium text-foreground">{job.postedBy}</span></p>
                <div className="flex gap-2">
                  <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted">
                    View details
                  </button>
                  <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                    Apply / Contact
                  </button>
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              No odd jobs listed in {selected.name} yet. Switch or search another community to explore opportunities.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}