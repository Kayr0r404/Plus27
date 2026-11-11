import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full items-center justify-center bg-background px-4">
      <section className="flex w-full max-w-3xl flex-col items-center gap-10 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-navy sm:text-5xl">
            Your account, managed simply.
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted">
            Create a Plus27 account to register, sign in, and manage your
            profile — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-navy/20 bg-surface px-6 text-sm font-medium text-navy transition-colors hover:bg-surface-muted"
          >
            Log in
          </Link>
        </div>

        <ul className="grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {[
            "Register a personal account",
            "Secure cookie-based sign in",
            "View and edit your profile",
          ].map((feature) => (
            <li
              key={feature}
              className="rounded-xl border border-border bg-surface p-4 text-sm text-muted shadow-sm"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}