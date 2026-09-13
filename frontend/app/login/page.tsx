"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import { Field, TextInput } from "@/components/Field";
import Alert from "@/components/Alert";
import { ApiError, login } from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [banner] = useState<string | null>(() => {
    if (searchParams.get("registered")) return "Account created. Log in to continue.";
    if (searchParams.get("logged_out")) return "You have been logged out.";
    if (searchParams.get("deleted")) return "Your account was deleted.";
    return null;
  });
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("expired") ? "Your session expired. Log in again." : null,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to log in. Is the backend running?";
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back to Plus24.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {banner && <Alert kind="success">{banner}</Alert>}
            {error && <Alert kind="error">{error}</Alert>}

            <Field label="Email">
              <TextInput
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Password">
              <TextInput
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              Log in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          New to Plus24?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}