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

interface FormState {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const initialState: FormState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const payload: CreateUserPayload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
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
          <p className="mt-1 text-sm text-muted">Join Plus27 with your basic details.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {error && <Alert kind="error">{error}</Alert>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <TextInput
                  name="first_name"
                  required
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                />
              </Field>
              <Field label="Surname">
                <TextInput
                  name="last_name"
                  required
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Username" hint="Lowercase letters and numbers only.">
              <TextInput
                name="username"
                required
                autoCapitalize="none"
                autoComplete="username"
                placeholder="janedoe"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
              />
            </Field>

            <Field label="Email">
              <TextInput
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
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
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </Field>

            <Field label="Confirm password">
              <TextInput
                name="confirm_password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirm_password}
                onChange={(e) => updateField("confirm_password", e.target.value)}
              />
            </Field>

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