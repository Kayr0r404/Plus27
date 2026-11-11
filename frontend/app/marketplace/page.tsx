import Link from "next/link";
import CommunityAreaBar from "@/components/CommunityAreaBar";
import { getCommunityBySlug, getProductsByCommunity, getVendorsByCommunity } from "@/lib/mock-data";

const categories = ["All categories", "Groceries & Produce", "Fashion & Apparel", "Food & Catering", "Services & Repairs", "Uniforms"];

const toneClass = {
  mint: "from-primary/20 to-primary/5",
  teal: "from-secondary/20 to-secondary/5",
  violet: "from-violet/20 to-violet/5",
  navy: "from-surface-muted to-background",
} as const;

type Props = { searchParams: Promise<{ area?: string }> };

export default async function MarketplacePage({ searchParams }: Props) {
  const { area } = await searchParams;
  const selected = getCommunityBySlug(area);
  const localVendors = getVendorsByCommunity(selected.slug);
  const products = getProductsByCommunity(selected.slug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Your area · {selected.name}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Community Marketplace</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Browse products and services offered by vendors in {selected.name}. By default, you see what’s available in your area. Search or switch communities to explore others.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/vendors?area=${selected.slug}`} className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-muted">
              View local vendors
            </Link>
            <button type="button" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              List a product
            </button>
          </div>
        </div>

        <CommunityAreaBar currentSlug={selected.slug} basePath="/marketplace" label="Marketplace area" />

        <div className="grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm md:grid-cols-[1fr_220px_220px_auto]">
          <input
            readOnly
            placeholder={`Search products or vendors in ${selected.name} or other communities...`}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted/70"
          />
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
            <option>Within {selected.name}</option>
            <option>Search other communities</option>
          </select>
          <button type="button" className="h-10 rounded-lg border border-border bg-surface-muted px-4 text-sm font-medium text-foreground">
            Filters
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>Showing <span className="font-medium text-foreground">{products.length}</span> products from vendors in <span className="font-medium text-foreground">{selected.name}</span></p>
          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-foreground">Popular nearby</span>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length ? products.map((product) => {
            const vendor = localVendors.find((v) => v.id === product.vendorId);
            return (
              <article key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className={`flex h-36 items-end justify-between bg-gradient-to-br p-4 ${toneClass[product.imageTone]}`}>
                  <span className="rounded-full bg-surface/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                    {product.category}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.inStock ? "bg-primary/15 text-primary" : "bg-surface-muted text-muted"}`}>
                    {product.inStock ? "In stock" : "Pre-order"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-semibold text-navy">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{product.description}</p>
                  <div className="mt-3 text-sm">
                    {vendor ? (
                      <Link href={`/vendors/${vendor.slug}`} className="font-medium text-link hover:underline">
                        {vendor.name}
                      </Link>
                    ) : (
                      <span className="text-muted">Local vendor</span>
                    )}
                    {vendor && <p className="text-xs text-muted">{vendor.area} · {selected.name}</p>}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                    <p className="text-base font-semibold text-foreground">
                      {product.price === 0 ? "Request quote" : `R${product.price}`}
                      {product.unit && product.price > 0 ? <span className="ml-1 text-xs font-normal text-muted">/ {product.unit}</span> : null}
                    </p>
                    <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted">
                      View
                    </button>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              No products listed in {selected.name} yet. Switch or search another community to explore.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}