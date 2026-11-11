export default function NotificationsPage() {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Notifications</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Your notifications will appear here. Stay tuned for updates about community activity, events, invites, messages, and local opportunities.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted">
            No notifications yet.
          </div>
        </div>
      </div>
    </div>
  );
}
