"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Field, TextInput, SelectInput } from "@/components/Field";
import Alert from "@/components/Alert";
import { ApiError, registerUser } from "@/lib/api";
import type { CreateUserPayload } from "@/lib/api";

interface FormState {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  sex: "" | "Male" | "Female";
  avatar_url: string;
}

const initialState: FormState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  sex: "",
  avatar_url: "",
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
    setSubmitting(true);

    const payload: CreateUserPayload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      sex: form.sex === "" ? null : form.sex,
      avatar_url: form.avatar_url.trim() || null,
    };

    try {
      await registerUser(payload);
      router.push("/login?registered=1");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create account.";
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Join Plus24 in under a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {error && <Alert kind="error">{error}</Alert>}

            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <TextInput
                  name="first_name"
                  required
                  placeholder="Jane"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                />
              </Field>
              <Field label="Last name">
                <TextInput
                  name="last_name"
                  required
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
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </Field>

            <Field label="Sex (optional)">
              <SelectInput
                name="sex"
                value={form.sex}
                onChange={(e) =>
                  updateField("sex", e.target.value as FormState["sex"])
                }
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </SelectInput>
            </Field>

            <Field label="Avatar URL (optional)">
              <TextInput
                name="avatar_url"
                type="url"
                placeholder="https://example.com/avatar.png"
                value={form.avatar_url}
                onChange={(e) => updateField("avatar_url", e.target.value)}
              />
            </Field>

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}