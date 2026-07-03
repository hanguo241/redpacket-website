"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  type?: "error" | "warning" | "info" | "success";
}

const CONFIG: Record<string, { root: string; icon: string; text: string }> = {
  error: {
    root: "border-error-bg bg-error-bg",
    icon: "bg-error",
    text: "text-error",
  },
  warning: {
    root: "border-yellow-200 bg-yellow-50",
    icon: "bg-yellow-700",
    text: "text-yellow-800",
  },
  info: {
    root: "border-info-bg bg-info-bg",
    icon: "bg-info",
    text: "text-info",
  },
  success: {
    root: "border-success-bg bg-success-bg",
    icon: "bg-success",
    text: "text-success",
  },
};

export default function ErrorBanner({ message, onDismiss, type = "error" }: ErrorBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const cfg = CONFIG[type];
  const icon = type === "error" ? "✕" : type === "warning" ? "⚠" : type === "success" ? "✓" : "ℹ";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        cfg.root
      )}
    >
      <div
        className={cn(
          "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white",
          cfg.icon
        )}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("m-0 font-sans text-sm font-medium leading-snug", cfg.text)}>
          {message}
        </p>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-none bg-transparent text-sm opacity-50 transition-opacity hover:opacity-100",
            cfg.text
          )}
        >
          ✕
        </button>
      )}
    </div>
  );
}
