import CommunityAreaBar from "@/components/CommunityAreaBar";
import { getCommunityBySlug, getRentalsByCommunity } from "@/lib/mock-data";

const types = ["All types", "Room", "Back room", "Flat", "House"];

type Props = { searchParams: Promise<{ area?: string }> };

export default async function RentalsPage({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area);
  const localRentals = getRentalsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Rooms & Houses for Rent</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Find rooms, houses, flats, and back rooms available around {selected.name}. By default, you see rentals in your area. Search or switch communities to explore other areas.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            List a rental
          </button>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/rentals" label="Rentals area" />

        <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[1fr_220px_220px_auto]">
          <input
            readOnly
            placeholder={`Search rentals in ${selected.name} or other communities...`}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted/70"
          />
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            <option>Any price</option>
            <option>Under R2,000</option>
            <option>R2,000 - R4,000</option>
            <option>R4,000+</option>
          </select>
          <button type="button" className="h-10 rounded-lg border border-border bg-surface-muted px-4 text-sm font-medium text-foreground">
            Filters
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>Showing <span className="font-medium text-foreground">{localRentals.length}</span> rentals in <span className="font-medium text-foreground">{selected.name}</span></p>
          <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-foreground">Newest</span>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          {localRentals.length ? localRentals.map((rental) => (
            <article key={rental.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="h-28 bg-gradient-to-r from-primary/15 via-[#3088a0]/10 to-secondary/10 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-surface/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                    {rental.listingType}
                  </span>
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                    {rental.available}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-navy">{rental.title}</h2>
                    <p className="mt-1 text-sm text-muted">{rental.area}, {selected.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{rental.price}</p>
                    <p className="text-xs text-muted">{rental.period}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  {typeof rental.bedrooms === "number" && <span><span className="font-medium text-foreground">{rental.bedrooms}</span> bed</span>}
                  {typeof rental.bathrooms === "number" && <span><span className="font-medium text-foreground">{rental.bathrooms}</span> bath</span>}
                  <span>Posted {rental.postedAt}</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-text-secondary">{rental.description}</p>

                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Amenities & details</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rental.amenities.map((a) => (
                      <span key={a} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm text-muted">Listed by <span className="font-medium text-foreground">{rental.postedBy}</span></p>
                  <div className="flex gap-2">
                    <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted">
                      View details
                    </button>
                    <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              No rentals listed in {selected.name} yet. Switch or search another community to explore listings.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}