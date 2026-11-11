import Link from "next/link";
import { notFound } from "next/navigation";
import Rating from "@/components/Rating";
import { getVendorBySlug, getProductsByVendor, getReviewsByVendor, getCommunityBySlug } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

const toneClass = {
  mint: "from-primary/20 to-primary/5",
  teal: "from-secondary/20 to-secondary/5",
  violet: "from-violet/20 to-violet/5",
  navy: "from-surface-muted to-background",
} as const;

export default async function VendorStorePage({ params }: Props) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) notFound();
  const vendorProducts = getProductsByVendor(vendor.id);
  const vendorReviews = getReviewsByVendor(vendor.id);
  const recommendPct = Math.round((vendor.recommendations / Math.max(vendor.reviewCount, 1)) * 100);
  const vendorCommunity = getCommunityBySlug(vendor.communitySlug);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <Link href={`/vendors?area=${vendor.communitySlug}`} className="hover:text-primary">Vendors</Link>
          <span>/</span>
          <Link href={`/?area=${vendor.communitySlug}`} className="hover:text-primary">{vendorCommunity.name}</Link>
          <span>/</span>
          <span className="text-foreground">{vendor.name}</span>
        </div>
        <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Community: {vendorCommunity.name} · {vendor.area}
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className={`h-36 bg-gradient-to-r ${vendor.cover} sm:h-44`} />
          <div className="p-5 sm:p-6">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface bg-surface-muted text-xl font-semibold text-primary shadow-sm">
                  {vendor.avatar}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-navy">{vendor.name}</h1>
                  <p className="text-sm text-muted">{vendor.category} · {vendor.area}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-surface-muted">
                  Recommend store
                </button>
                <button type="button" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                  Contact vendor
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm leading-7 text-text-secondary">{vendor.about}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {vendor.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted">Community rating</p>
                  <div className="mt-2"><Rating value={vendor.rating} count={vendor.reviewCount} /></div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted">Recommendations</p>
                  <p className="mt-2 text-xl font-semibold text-navy">{vendor.recommendations}</p>
                  <p className="text-xs text-muted">{recommendPct}% recommend</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted">Hours</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{vendor.hours}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted">Contact</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{vendor.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-navy">Store products</h2>
                <p className="mt-1 text-sm text-muted">Browse everything this vendor is selling.</p>
              </div>
              <span className="text-sm text-muted">{vendorProducts.length} items</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vendorProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  <div className={`flex h-32 items-start justify-between bg-gradient-to-br p-4 ${toneClass[product.imageTone]}`}>
                    <span className="rounded-full bg-surface/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">{product.category}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.inStock ? "bg-primary/15 text-primary" : "bg-surface-muted text-muted"}`}>
                      {product.inStock ? "In stock" : "Pre-order"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-navy">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">
                        {product.price === 0 ? "Request quote" : `R${product.price}`}
                        {product.unit && product.price > 0 ? <span className="ml-1 text-xs font-normal text-muted">/ {product.unit}</span> : null}
                      </p>
                      <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-muted">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Ratings & reviews</h2>
              <p className="mt-1 text-sm text-muted">Community feedback and recommendations.</p>
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <p className="text-3xl font-semibold text-navy">{vendor.rating.toFixed(1)}</p>
                <div className="mt-1"><Rating value={vendor.rating} count={vendor.reviewCount} /></div>
                <p className="mt-2 text-sm text-muted">{vendor.recommendations} people recommend this vendor</p>
              </div>
              <div className="mt-4 space-y-3">
                {vendorReviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.author}</p>
                        <p className="text-xs text-muted">{review.date}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${review.recommends ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted"}`}>
                        {review.recommends ? "Recommends" : "Review"}
                      </span>
                    </div>
                    <div className="mt-2"><Rating value={review.rating} size="sm" /></div>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{review.comment}</p>
                  </article>
                ))}
              </div>
              <button type="button" className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted">
                Write a review
              </button>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-navy">Store info</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><span className="text-foreground">Area:</span> {vendor.area}</li>
                <li><span className="text-foreground">Category:</span> {vendor.category}</li>
                <li><span className="text-foreground">Hours:</span> {vendor.hours}</li>
                <li><span className="text-foreground">Products listed:</span> {vendorProducts.length}</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}