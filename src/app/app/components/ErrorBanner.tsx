"use client";

import { useEffect, useState } from "react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  type?: "error" | "warning" | "info" | "success";
}

const CONFIG: Record<string, { bg: string; border: string; color: string }> = {
  error:   { bg: "rgba(255, 0, 26, 0.08)", border: "rgba(255, 0, 26, 0.2)", color: "#CC0014" },
  warning: { bg: "rgba(234, 179, 8, 0.08)", border: "rgba(234, 179, 8, 0.25)", color: "#92400E" },
  info:    { bg: "rgba(64, 145, 146, 0.08)", border: "rgba(64, 145, 146, 0.2)", color: "#2C6E6F" },
  success: { bg: "rgba(7, 82, 41, 0.08)", border: "rgba(7, 82, 41, 0.2)", color: "#075229" },
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
      className="rp-error-banner"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
      }}
    >
      <div className="rp-error-icon" style={{ background: cfg.color }}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="m-0 text-[13.3333px] font-[535] font-sans leading-[1.4]" style={{ color: cfg.color }}>
          {message}
        </p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="rp-error-close"
          style={{ color: cfg.color }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
