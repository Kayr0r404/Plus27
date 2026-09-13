import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <section className="flex w-full max-w-3xl flex-col items-center gap-10 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Your account, managed simply.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Create a Plus24 account to register, sign in, and manage your
            profile — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
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
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}