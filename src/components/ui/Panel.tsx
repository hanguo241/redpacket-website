import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-light bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    />
  );
}

export function PanelInset({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-bg-subtle p-4", className)} {...props} />;
}
