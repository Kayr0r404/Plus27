import Link from "next/link";

const links = [
  { href: "/forum", label: "Forum" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/vendors", label: "Vendors" },
  { href: "/jobs", label: "Jobs" },
  { href: "/rentals", label: "Rentals" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/30">
                +27
              </span>
              <span className="text-base font-semibold tracking-tight text-navy">Plus27</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
              A local community platform for discussions, marketplaces, vendor stores, odd jobs, and rentals. Content is shown for your area by default, and you can search other communities when needed.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Explore</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Community listings, posts, and ratings are provided by users and local vendors.</li>
              <li>Always verify details, pricing, availability, and safety before meeting or making payments.</li>
              <li>This is a UI prototype and may include sample data.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Plus27. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>Local-first community experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
}