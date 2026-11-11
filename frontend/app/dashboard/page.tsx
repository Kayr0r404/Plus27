"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Field, SelectInput, TextInput } from "@/components/Field";
import Alert from "@/components/Alert";
import ThemeSetting from "@/components/ThemeSetting";
import {
  ApiError,
  deleteUser,
  getMe,
  logout as apiLogout,
  updateUser,
} from "@/lib/api";
import type { User } from "@/lib/api";

function initials(user: User): string {
  const first = (user.first_name ?? "").trim()[0] ?? "";
  const last = (user.last_name ?? "").trim()[0] ?? "";
  const combined = (first + last).toUpperCase();
  return combined || user.username.slice(0, 1).toUpperCase() || "?";
}

type TabKey = "profile" | "activity" | "settings";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
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

  const quickLinks = useMemo(
    () => [
      {
        title: "Community",
        description: "Meet people, discover events, and join local groups.",
        href: "/community",
        cta: "Open community",
      },
      {
        title: "Marketplace",
        description: "Browse local products and services in your area.",
        href: "/marketplace",
        cta: "Browse marketplace",
      },
      {
        title: "Vendors",
        description: "Find trusted local vendors, stores, and reviews.",
        href: "/vendors",
        cta: "Find vendors",
      },
      {
        title: "Jobs & rentals",
        description: "Explore odd jobs and rental listings near you.",
        href: "/jobs",
        cta: "View jobs",
        secondaryHref: "/rentals",
        secondaryCta: "Rentals",
      },
    ],
    [],
  );

  function startEditing() {
    if (!user) return;
    setEditing(true);
    setActiveTab("profile");
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
      <div className="flex flex-1 items-center justify-center bg-background py-24">
        <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!user) return null;

  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;

  return (
    <div className="w-full bg-background px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {saveMessage && <Alert kind={saveMessage.type}>{saveMessage.text}</Alert>}

        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="h-28 bg-gradient-to-r from-primary/20 via-secondary/15 to-violet/20 sm:h-36" />
          <div className="p-5 sm:p-6">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar is a user-supplied remote URL
                  <img
                    src={user.avatar_url}
                    alt={fullName}
                    className="size-20 rounded-2xl border-4 border-surface object-cover shadow-sm sm:size-24"
                  />
                ) : (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-surface bg-primary/15 text-2xl font-semibold text-navy shadow-sm sm:size-24">
                    {initials(user)}
                  </div>
                )}
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-navy">{fullName}</h1>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      Plus27 member
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">@{user.username} · {user.email}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Manage your profile, preferences, and local community activity from one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/community"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
                >
                  Explore community
                </Link>
                <Button variant="secondary" onClick={startEditing}>
                  Edit profile
                </Button>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-base font-semibold text-navy">Intro</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Username</dt>
                  <dd className="mt-0.5 font-medium text-foreground">@{user.username}</dd>
                </div>
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-0.5 break-all font-medium text-foreground">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-muted">Sex</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{user.sex ?? "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Account ID</dt>
                  <dd className="mt-0.5 truncate font-mono text-xs text-foreground">{user.id}</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-border pt-4">
                <button type="button" onClick={startEditing} className="text-sm font-semibold text-primary hover:underline">
                  Edit profile details
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-base font-semibold text-navy">On Plus27</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>• Meet: share casual posts and send invites to connect.</li>
                <li>• Events: discover and track local events in your area.</li>
                <li>• Forums: join groups for focused community discussions.</li>
                <li>• Marketplace, vendors, jobs, and rentals are area-first.</li>
              </ul>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2">
              {quickLinks.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href={item.href} className="text-sm font-semibold text-primary hover:underline">
                      {item.cta}
                    </Link>
                    {item.secondaryHref && item.secondaryCta ? (
                      <Link href={item.secondaryHref} className="text-sm font-semibold text-link hover:underline">
                        {item.secondaryCta}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="border-b border-border bg-surface-muted/40 p-2">
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "profile", label: "Profile" },
                    { key: "activity", label: "Activity" },
                    { key: "settings", label: "Settings" },
                  ] as const).map((tab) => {
                    const active = tab.key === activeTab;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted hover:bg-surface-muted hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-navy">Profile details</h3>
                        <p className="mt-1 text-sm text-muted">Keep your account information up to date so people can recognize and contact you.</p>
                      </div>
                      {!editing && (
                        <Button variant="secondary" onClick={startEditing}>
                          Edit
                        </Button>
                      )}
                    </div>

                    {editing ? (
                      <form onSubmit={handleSave} className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="First name">
                            <TextInput
                              required
                              value={editForm.first_name}
                              onChange={(e) => updateEditField("first_name", e.target.value)}
                            />
                          </Field>
                          <Field label="Last name">
                            <TextInput
                              required
                              value={editForm.last_name}
                              onChange={(e) => updateEditField("last_name", e.target.value)}
                            />
                          </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Username">
                            <TextInput
                              required
                              autoCapitalize="none"
                              value={editForm.username}
                              onChange={(e) => updateEditField("username", e.target.value)}
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
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Sex">
                            <SelectInput
                              value={editForm.sex}
                              onChange={(e) =>
                                updateEditField("sex", e.target.value as "" | "Male" | "Female")
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
                              onChange={(e) => updateEditField("avatar_url", e.target.value)}
                            />
                          </Field>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-3">
                          <Button type="submit" loading={saving}>
                            Save changes
                          </Button>
                          <Button type="button" variant="secondary" onClick={cancelEditing}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { label: "First name", value: user.first_name },
                          { label: "Last name", value: user.last_name },
                          { label: "Username", value: `@${user.username}` },
                          { label: "Email", value: user.email },
                          { label: "Sex", value: user.sex ?? "—" },
                          { label: "Account ID", value: user.id, mono: true },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl border border-border bg-background p-4">
                            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</dt>
                            <dd className={`mt-1 text-sm text-foreground ${item.mono ? "truncate font-mono text-xs" : "font-medium"}`}>
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-navy">Your community activity</h3>
                      <p className="mt-1 text-sm text-muted">
                        A quick view of how you can participate across Plus27. Personal activity history and saved items will appear here as features are connected.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { title: "Meet posts", value: "—", note: "Casual posts and invites" },
                        { title: "Groups", value: "—", note: "Forums you join or create" },
                        { title: "Events", value: "—", note: "Events you’re interested in" },
                      ].map((stat) => (
                        <div key={stat.title} className="rounded-xl border border-border bg-background p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted">{stat.title}</p>
                          <p className="mt-2 text-2xl font-semibold text-navy">{stat.value}</p>
                          <p className="mt-1 text-sm text-muted">{stat.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background p-5">
                        <h4 className="font-semibold text-navy">Recent activity</h4>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          No activity yet. Start by sharing a post in Meet, joining a forum group, or marking an event as interested.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link href="/community?tab=meet" className="text-sm font-semibold text-primary hover:underline">Go to Meet</Link>
                          <Link href="/community?tab=events" className="text-sm font-semibold text-primary hover:underline">Explore events</Link>
                          <Link href="/community?tab=forums" className="text-sm font-semibold text-primary hover:underline">Browse groups</Link>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-5">
                        <h4 className="font-semibold text-navy">Connections</h4>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          Connect with people from Meet posts and send invites to start conversations. Connection management will be available here in a future update.
                        </p>
                        <div className="mt-4">
                          <Link href="/community?tab=meet" className="text-sm font-semibold text-primary hover:underline">
                            Find people to connect with
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-navy">Settings</h3>
                      <p className="mt-1 text-sm text-muted">Manage your appearance and account preferences for Plus27.</p>
                    </div>

                    <section className="rounded-xl border border-border bg-background p-5">
                      <h4 className="font-semibold text-navy">Appearance</h4>
                      <p className="mt-1 text-sm text-muted">Choose how Plus27 looks for you. This setting is saved on this device.</p>
                      <div className="mt-4">
                        <ThemeSetting />
                      </div>
                    </section>

                    <section className="rounded-xl border border-border bg-background p-5">
                      <h4 className="font-semibold text-navy">Account</h4>
                      <p className="mt-1 text-sm text-muted">Update your profile information or sign out of this device.</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button variant="secondary" onClick={startEditing}>Edit profile</Button>
                        <Button variant="secondary" onClick={handleLogout}>Log out</Button>
                      </div>
                    </section>

                    <section className="rounded-xl border border-danger/30 bg-danger/5 p-5">
                      <h4 className="font-semibold text-danger">Danger zone</h4>
                      <p className="mt-1 text-sm text-muted">
                        Permanently delete your account and all associated data. This action cannot be undone.
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
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Button variant="danger" loading={deleting} onClick={handleDelete}>
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
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}