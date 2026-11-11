export default function InboxPage() {
  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Inbox</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Your inbox will show messages and connection conversations here. Use Meet in Community to connect with people and send invites.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted">
            No messages yet.
          </div>
        </div>
      </div>
    </div>
  );
}
