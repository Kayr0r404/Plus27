import type { ComponentProps, ReactNode } from "react";

const controlClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({ className = "", ...props }: ComponentProps<"input">) {
  return <input {...props} className={`${controlClass} ${className}`} />;
}

export function SelectInput({
  className = "",
  ...props
}: ComponentProps<"select">) {
  return <select {...props} className={`${controlClass} ${className}`} />;
}