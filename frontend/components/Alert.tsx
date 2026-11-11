import type { ReactNode } from "react";

interface AlertProps {
  kind: "success" | "error";
  children: ReactNode;
}

const kindStyles = {
  success:
    "border-primary/30 bg-primary/10 text-foreground",
  error:
    "border-danger/30 bg-danger/10 text-danger",
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