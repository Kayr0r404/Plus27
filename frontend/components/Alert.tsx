import type { ReactNode } from "react";

interface AlertProps {
  kind: "success" | "error";
  children: ReactNode;
}

const kindStyles = {
  success:
    "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  error:
    "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
};

export default function Alert({ kind, children }: AlertProps) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${kindStyles[kind]}`}
    >
      {children}
    </div>
  );
}