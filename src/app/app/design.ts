// ═══════════════════════════════════════════════════════
// Design System — RedPacket App (Uniswap-Inspired)
// Tailwind Class Tokens
// ═══════════════════════════════════════════════════════

// ── Colors (Arbitrary values for Tailwind) ──
export const colors = {
  magenta: "#FF37C7",
  magentaLight: "#FC72FF",
  magentaDark: "#E620A8",
  magentaOverlay: "rgba(255, 55, 199, 0.08)",
  magentaOverlayHover: "rgba(255, 55, 199, 0.15)",
  textPrimary: "#131313",
  textSecondary: "#4d4d4d",
  textTertiary: "#808080",
  textPlaceholder: "#9B9B9B",
  textDisabled: "#CBCDE1",
  white: "#FFFFFF",
  bgSubtle: "#F9F9F9",
  border: "#CBCDE1",
  borderLight: "#F2F2F2",
  success: "#075229",
  successBg: "rgba(7, 82, 41, 0.12)",
  error: "#FF001A",
  errorBg: "rgba(255, 0, 26, 0.12)",
  info: "#409192",
  infoBg: "rgba(64, 145, 146, 0.12)",
} as const;

// ── Component Class Presets ──

/** 卡片容器 */
export const containerCls =
  "bg-white rounded-xl p-6 border border-[#F2F2F2] shadow-[0px_4px_16px_rgba(0,0,0,0.04)]";

/** 文本输入框 */
export const inputCls =
  "w-full px-4 py-3 rounded-xl text-base font-normal text-[#131313] bg-white border border-[#CBCDE1] outline-none h-11 box-border font-sans transition-all duration-150 focus:border-[#FF37C7] focus:shadow-[0px_0px_0px_3px_rgba(255,55,199,0.1)]";

/** 主要按钮（品红） */
export const btnPrimaryCls =
  "w-full px-4 py-3 rounded-2xl text-[13.3333px] font-normal leading-4 h-[46.7031px] bg-[#FF37C7] text-[#131313] border border-transparent cursor-pointer font-sans transition-opacity hover:opacity-80 disabled:opacity-50";

/** 次要按钮（品红半透明） */
export const btnSecondaryCls =
  "w-full px-5 py-4 rounded-2xl text-[13.3333px] font-normal leading-4 h-[54.7031px] bg-[rgba(255,55,199,0.08)] text-[#131313] border border-transparent cursor-pointer font-sans transition-opacity hover:opacity-80";

/** 幽灵按钮 */
export const btnGhostCls =
  "px-3 py-2 rounded-xl text-[13.3333px] font-normal font-sans bg-transparent text-[#FF37C7] border border-[rgba(255,55,199,0.3)] cursor-pointer h-[34.0938px] transition-all hover:bg-[rgba(255,55,199,0.08)]";

/** 标签文本 */
export const labelCls =
  "block text-xs font-normal text-[#808080] mb-2 tracking-[0.5px]";

/** 内嵌卡片 (Tailwind) */
export const cardEmbedCls =
  "bg-[#F9F9F9] rounded-xl p-4";

/** @deprecated 逐步迁移到 Tailwind 类 + className */
import type { CSSProperties } from "react";

export const container: CSSProperties = {
  background: "#FFFFFF", borderRadius: "20px", padding: "24px",
  border: "1px solid #F2F2F2", boxShadow: "0px 4px 16px rgba(0,0,0,0.04)",
};

export const input: CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: "12px", fontSize: "16px",
  fontWeight: 400, color: "#131313", background: "#FFFFFF",
  border: "1px solid #CBCDE1", outline: "none", fontFamily: "var(--font-geist-sans), sans-serif",
  height: "44px", boxSizing: "border-box",
};

export const btnPrimary: CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: "16px",
  fontSize: "13.3333px", fontWeight: 400, lineHeight: "16px", height: "46.7031px",
  background: "#FF37C7", color: "#131313", border: "1px solid transparent",
  cursor: "pointer", fontFamily: "var(--font-geist-sans), sans-serif",
  transition: "all 0.15s ease",
};

export const btnSecondary: CSSProperties = {
  ...btnPrimary, background: "rgba(255,55,199,0.08)", height: "54.7031px",
  borderRadius: "20px", padding: "16px 20px",
};

export const btnGhost: CSSProperties = {
  padding: "8px 12px", borderRadius: "12px", fontSize: "13.3333px",
  fontWeight: 400, fontFamily: "var(--font-geist-sans), sans-serif",
  background: "transparent", color: "#FF37C7",
  border: "1px solid rgba(255,55,199,0.3)", cursor: "pointer",
  height: "34.0938px", transition: "all 0.15s ease",
};

export const label: CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 400,
  color: "#808080", marginBottom: "8px", letterSpacing: "0.5px",
};

export const cardEmbed: CSSProperties = {
  background: "#F9F9F9", borderRadius: "12px", padding: "16px",
};

/** Focus 光晕（用于需要手动加 focus 的元素） */
export const focusRingCls =
  "focus:border-[#FF37C7] focus:shadow-[0px_0px_0px_3px_rgba(255,55,199,0.1)]";

// ── 向下兼容：保留 spacing / radius / typography 常量 ──
// 新代码建议直接使用 Tailwind 类，以下仅用于逐步迁移
export const spacing = {
  px2: "2px", px4: "4px", px8: "8px", px12: "12px",
  px16: "16px", px20: "20px", px24: "24px",
  px32: "32px", px40: "40px", px48: "48px", px72: "72px",
} as const;

export const radius = {
  sm: "6px", md: "12px", lg: "16px", xl: "20px", xxl: "32px", full: "9999px",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "var(--font-geist-mono), 'Courier New', monospace",
  },
  fontSize: { h1: "64px", h2: "36px", h3: "24px", body: "16px", button: "13.3333px", small: "12px" },
  fontWeight: { normal: 400, primary: 485, emphasis: 535, bold: 600 },
  lineHeight: { h1: "76px", h2: "36px", h3: "28.8px", body: "24px", button: "16px", small: "16px" },
} as const;
