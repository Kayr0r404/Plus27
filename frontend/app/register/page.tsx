"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Field, TextInput } from "@/components/Field";
import Alert from "@/components/Alert";
import { ApiError, login, registerUser } from "@/lib/api";
import type { CreateUserPayload } from "@/lib/api";

function deriveUsername(email: string) {
  const local = email.split("@")[0] ?? "";
  const base = local.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}${suffix}`;
}

function deriveName(email: string) {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "Plus27", last_name: "Member" };
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (parts.length === 1) return { first_name: cap(parts[0]), last_name: "Member" };
  return { first_name: cap(parts[0]), last_name: cap(parts.slice(1).join(" ")) };
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const trimmedEmail = email.trim();
    const { first_name, last_name } = deriveName(trimmedEmail);
    const payload: CreateUserPayload = {
      first_name,
      last_name,
      username: deriveUsername(trimmedEmail),
      email: trimmedEmail,
      password,
      sex: null,
      avatar_url: null,
    };

    try {
      await registerUser(payload);
      await login({ email: payload.email, password: payload.password });
      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create account.";
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-navy">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted">Join Plus27 with just your email and a password.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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

            <Field label="Password" hint="At least 8 characters.">
              <TextInput
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <p className="text-xs leading-5 text-muted">
              We&apos;ll create your profile with the minimum details now. You can update your name, username, and avatar anytime from your dashboard.
            </p>

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-link underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}