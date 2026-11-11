import Link from "next/link";
import Rating from "@/components/Rating";
import CommunityAreaBar from "@/components/CommunityAreaBar";
import { getCommunityBySlug, getVendorsByCommunity, getProductsByVendor } from "@/lib/mock-data";

type Props = { searchParams: Promise<{ area?: string }> };

export default async function VendorsPage({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area);
  const localVendors = getVendorsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Local Vendors</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Discover vendor stores in {selected.name}, see what they’re selling, and explore ratings and recommendations from the community. Search or switch to find vendors in other communities.
            </p>
          </div>
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Register as a vendor
          </button>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/vendors" label="Vendor area" />

        <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[1fr_220px_220px]">
          <input readOnly placeholder={`Search vendors, products, or services in ${selected.name} or other communities...`} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted/70" />
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            <option>All categories</option>
            <option>Groceries & Produce</option>
            <option>Fashion & Apparel</option>
            <option>Food & Catering</option>
            <option>Services & Repairs</option>
          </select>
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            <option>Sort: Top rated nearby</option>
            <option>Sort: Most recommended</option>
            <option>Sort: Newest</option>
          </select>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {localVendors.length ? localVendors.map((vendor) => {
            const vendorProducts = getProductsByVendor(vendor.id);
            return (
              <article key={vendor.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className={`h-24 bg-gradient-to-r ${vendor.cover}`} />
                <div className="p-5">
                  <div className="-mt-10 flex items-end justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-surface bg-surface-muted text-sm font-semibold text-primary shadow-sm">
                      {vendor.avatar}
                    </div>
                    <Link href={`/vendors/${vendor.slug}`} className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted">
                      Visit store
                    </Link>
                  </div>
                  <div className="mt-3">
                    <h2 className="text-lg font-semibold text-navy">
                      <Link href={`/vendors/${vendor.slug}`} className="hover:text-primary">{vendor.name}</Link>
                    </h2>
                    <p className="text-sm text-muted">{vendor.category} · {vendor.area}, {selected.name}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">{vendor.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Rating value={vendor.rating} count={vendor.reviewCount} size="sm" />
                    <span className="text-sm text-muted"><span className="font-medium text-foreground">{vendor.recommendations}</span> recommendations</span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">Selling</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {vendorProducts.slice(0, 4).map((p) => (
                        <span key={p.id} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground">
                          {p.name}
                        </span>
                      ))}
                      {vendorProducts.length > 4 && (
                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted">
                          +{vendorProducts.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              No vendors listed in {selected.name} yet. Switch or search another community to explore.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}