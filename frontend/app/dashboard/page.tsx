"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Field, TextInput, SelectInput } from "@/components/Field";
import Alert from "@/components/Alert";
import {
  ApiError,
  getMe,
  updateUser,
  deleteUser,
  logout as apiLogout,
} from "@/lib/api";
import type { User } from "@/lib/api";

function initials(user: User): string {
  const first = (user.first_name ?? "").trim()[0] ?? "";
  const last = (user.last_name ?? "").trim()[0] ?? "";
  const combined = (first + last).toUpperCase();
  return combined || user.username.slice(0, 1).toUpperCase() || "?";
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    sex: "" as "" | "Male" | "Female",
    avatar_url: "",
  });
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        setEditForm({
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          email: u.email,
          sex: u.sex ?? "",
          avatar_url: u.avatar_url ?? "",
        });
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login?expired=1");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function startEditing() {
    if (!user) return;
    setEditing(true);
    setSaveMessage(null);
  }

  function cancelEditing() {
    if (!user) return;
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      sex: user.sex ?? "",
      avatar_url: user.avatar_url ?? "",
    });
    setEditing(false);
    setSaveMessage(null);
  }

  function updateEditField(
    field: keyof typeof editForm,
    value: string | "Male" | "Female" | "",
  ) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      const updated = await updateUser({
        id: user.id,
        email: editForm.email.trim(),
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        username: editForm.username.trim(),
        avatar_url: editForm.avatar_url.trim() || null,
        sex: editForm.sex === "" ? null : editForm.sex,
      });
      setUser(updated);
      setEditing(false);
      setSaveMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to update profile.";
      setSaveMessage({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteUser(user.id);
      await apiLogout();
      router.replace("/login?deleted=1");
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setSaveMessage({
        type: "error",
        text: "Failed to delete account. Please try again.",
      });
    }
  }

  async function handleLogout() {
    try {
      await apiLogout();
    } finally {
      router.replace("/login?logged_out=1");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 py-24 dark:bg-black">
        <span className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        {saveMessage && (
          <Alert kind={saveMessage.type}>{saveMessage.text}</Alert>
        )}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-5">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar is a user-supplied remote URL
              <img
                src={user.avatar_url}
                alt={`${user.first_name} ${user.last_name}`}
                className="size-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xl font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {initials(user)}
              </div>
            )}
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <h2 className="truncate text-lg font-medium">
                {user.first_name} {user.last_name}
              </h2>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                @{user.username}
              </p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
              {user.sex && (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {user.sex}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Profile</h3>
            {!editing && (
              <Button variant="secondary" onClick={startEditing}>
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name">
                  <TextInput
                    required
                    value={editForm.first_name}
                    onChange={(e) =>
                      updateEditField("first_name", e.target.value)
                    }
                  />
                </Field>
                <Field label="Last name">
                  <TextInput
                    required
                    value={editForm.last_name}
                    onChange={(e) =>
                      updateEditField("last_name", e.target.value)
                    }
                  />
                </Field>
              </div>

              <Field label="Username">
                <TextInput
                  required
                  autoCapitalize="none"
                  value={editForm.username}
                  onChange={(e) =>
                    updateEditField("username", e.target.value)
                  }
                />
              </Field>

              <Field label="Email">
                <TextInput
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => updateEditField("email", e.target.value)}
                />
              </Field>

              <Field label="Sex">
                <SelectInput
                  value={editForm.sex}
                  onChange={(e) =>
                    updateEditField(
                      "sex",
                      e.target.value as "" | "Male" | "Female",
                    )
                  }
                >
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </SelectInput>
              </Field>

              <Field label="Avatar URL">
                <TextInput
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  value={editForm.avatar_url}
                  onChange={(e) =>
                    updateEditField("avatar_url", e.target.value)
                  }
                />
              </Field>

              <div className="mt-2 flex gap-3">
                <Button type="submit" loading={saving}>
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  First name
                </dt>
                <dd className="mt-0.5">{user.first_name}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  Last name
                </dt>
                <dd className="mt-0.5">{user.last_name}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  Username
                </dt>
                <dd className="mt-0.5">@{user.username}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </dt>
                <dd className="mt-0.5">{user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  Sex
                </dt>
                <dd className="mt-0.5">{user.sex ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                  Account ID
                </dt>
                <dd className="mt-0.5 truncate font-mono text-xs">
                  {user.id}
                </dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/40 dark:bg-zinc-900">
          <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
            Danger zone
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              className="mt-4"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete account
            </Button>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="danger"
                loading={deleting}
                onClick={handleDelete}
              >
                Confirm delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}