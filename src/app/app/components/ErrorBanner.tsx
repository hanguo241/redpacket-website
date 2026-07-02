"use client";

import { useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../design";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  type?: "error" | "warning" | "info" | "success";
}

const CONFIG = {
  error: {
    icon: "✕",
    bg: "rgba(255, 0, 26, 0.08)",
    border: "rgba(255, 0, 26, 0.2)",
    color: "#CC0014",
    label: "错误",
  },
  warning: {
    icon: "!",
    bg: "rgba(234, 179, 8, 0.08)",
    border: "rgba(234, 179, 8, 0.25)",
    color: "#92400E",
    label: "提示",
  },
  info: {
    icon: "i",
    bg: "rgba(64, 145, 146, 0.08)",
    border: "rgba(64, 145, 146, 0.2)",
    color: "#2C6E6F",
    label: "信息",
  },
  success: {
    icon: "✓",
    bg: "rgba(7, 82, 41, 0.08)",
    border: "rgba(7, 82, 41, 0.2)",
    color: "#075229",
    label: "成功",
  },
};

export default function ErrorBanner({ message, onDismiss, type = "error" }: ErrorBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 入场动画
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const cfg = CONFIG[type];

  // 错误关联合适的 emoji
  const icon = type === "error" ? "✕" : type === "warning" ? "⚠" : type === "success" ? "✓" : "ℹ";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: spacing.px12,
        padding: spacing.px12,
        borderRadius: radius.md,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        transition: "all 0.2s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
      }}
    >
      {/* 图标 */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: cfg.color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 600,
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
        {icon}
      </div>

      {/* 内容 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: typography.fontSize.button,
            fontWeight: typography.fontWeight.emphasis,
            color: cfg.color,
            fontFamily: typography.fontFamily.sans,
            lineHeight: 1.4,
          }}
        >
          {message}
        </p>
      </div>

      {/* 关闭按钮 */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            padding: 0,
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: cfg.color,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
            flexShrink: 0,
            marginTop: "1px",
          }}
          className="hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * 输入框错误样式 — 在 input style 上叠加使用
 *
 * 用法:
 *   <input style={{ ...input, ...(hasError ? inputError : {}) }} />
 */
export const inputError: React.CSSProperties = {
  borderColor: "#CC0014",
  boxShadow: "0px 0px 0px 2px rgba(255, 0, 26, 0.1)",
};

/**
 * 输入框错误提示文本
 */
export const errorTextStyle: React.CSSProperties = {
  fontSize: typography.fontSize.small,
  color: "#CC0014",
  fontFamily: typography.fontFamily.sans,
  marginTop: spacing.px4,
  marginLeft: spacing.px4,
};
