// ═══════════════════════════════════════════════════════
// Design System — RedPacket App (Uniswap-Inspired)
// ═══════════════════════════════════════════════════════

// ── Color Palette ──
export const colors = {
  // Brand
  magenta: "#FF37C7",
  magentaLight: "#FC72FF",
  magentaDark: "#E620A8",
  magentaOverlay: "rgba(255, 55, 199, 0.08)",
  magentaOverlayHover: "rgba(255, 55, 199, 0.15)",

  purple: "#5B4FFF",
  purpleOverlay: "rgba(130, 81, 251, 0.06)",

  blue: "#627EEA",
  blueOverlay: "rgba(176, 207, 252, 0.04)",

  // Neutrals
  textPrimary: "#131313",
  textSecondary: "#4d4d4d",
  textTertiary: "#808080",
  textPlaceholder: "#9B9B9B",
  textDisabled: "#CBCDE1",

  // Surfaces
  white: "#FFFFFF",
  bgSubtle: "#F9F9F9",
  bgLight: "#F2F2F2",
  border: "#CBCDE1",
  borderLight: "#F2F2F2",

  // Semantic
  success: "#075229",
  successBg: "rgba(7, 82, 41, 0.12)",
  error: "#FF001A",
  errorBg: "rgba(255, 0, 26, 0.12)",
  info: "#409192",
  infoBg: "rgba(64, 145, 146, 0.12)",
  warning: "#EAB308",
} as const;

// ── Typography ──
export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "var(--font-geist-mono), 'Courier New', monospace",
  },
  fontSize: {
    h1: "64px",
    h2: "36px",
    h3: "24px",
    body: "16px",
    button: "13.3333px",
    small: "12px",
  },
  fontWeight: {
    normal: 400,
    primary: 485,
    emphasis: 535,
    bold: 600,
  },
  lineHeight: {
    h1: "76px",
    h2: "36px",
    h3: "28.8px",
    body: "24px",
    button: "16px",
    small: "16px",
  },
} as const;

// ── Spacing (4px grid) ──
export const spacing = {
  px2: "2px",
  px4: "4px",
  px8: "8px",
  px12: "12px",
  px16: "16px",
  px20: "20px",
  px24: "24px",
  px32: "32px",
  px40: "40px",
  px48: "48px",
  px72: "72px",
} as const;

// ── Border Radius ──
export const radius = {
  sm: "6px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "32px",
  full: "9999px",
} as const;

// ── Shadows ──
export const shadows = {
  none: "none",
  subtle: "0px 1px 4px rgba(0, 0, 0, 0.04)",
  standard: "0px 4px 16px rgba(0, 0, 0, 0.08)",
  lifted: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  max: "0px 12px 32px rgba(0, 0, 0, 0.16)",
  card: "0px 4px 16px rgba(0, 0, 0, 0.04)",
} as const;

// ── Component Presets (React CSSProperties) ──
import type { CSSProperties } from "react";

export const container: CSSProperties = {
  background: colors.white,
  borderRadius: radius.xl,
  padding: spacing.px24,
  border: `1px solid ${colors.borderLight}`,
  boxShadow: shadows.card,
};

export const input: CSSProperties = {
  width: "100%",
  padding: `${spacing.px12} ${spacing.px16}`,
  borderRadius: radius.md,
  fontSize: typography.fontSize.body,
  fontWeight: typography.fontWeight.normal,
  color: colors.textPrimary,
  background: colors.white,
  border: `1px solid ${colors.border}`,
  outline: "none",
  fontFamily: typography.fontFamily.sans,
  height: "44px",
  boxSizing: "border-box",
};

export const inputFocus: CSSProperties = {
  borderColor: colors.magenta,
  boxShadow: `0px 0px 0px 3px rgba(255, 55, 199, 0.1)`,
};

export const btnPrimary: CSSProperties = {
  width: "100%",
  padding: `${spacing.px12} ${spacing.px16}`,
  borderRadius: radius.lg,
  fontSize: typography.fontSize.button,
  fontWeight: typography.fontWeight.normal,
  lineHeight: typography.lineHeight.button,
  height: "46.7031px",
  background: colors.magenta,
  color: colors.textPrimary,
  border: "1px solid transparent",
  cursor: "pointer",
  fontFamily: typography.fontFamily.sans,
  transition: "all 0.15s ease",
};

export const btnSecondary: CSSProperties = {
  ...btnPrimary,
  background: colors.magentaOverlay,
  color: colors.textPrimary,
  height: "54.7031px",
  borderRadius: radius.xl,
  padding: `${spacing.px16} ${spacing.px20}`,
};

export const btnGhost: CSSProperties = {
  padding: `${spacing.px8} ${spacing.px12}`,
  borderRadius: radius.md,
  fontSize: typography.fontSize.button,
  fontWeight: typography.fontWeight.normal,
  fontFamily: typography.fontFamily.sans,
  background: "transparent",
  color: colors.magenta,
  border: `1px solid rgba(255, 55, 199, 0.3)`,
  cursor: "pointer",
  height: "34.0938px",
  transition: "all 0.15s ease",
};

export const label: CSSProperties = {
  display: "block",
  fontSize: typography.fontSize.small,
  fontWeight: typography.fontWeight.normal,
  color: colors.textTertiary,
  marginBottom: spacing.px8,
  letterSpacing: "0.5px",
};

export const cardEmbed: CSSProperties = {
  background: colors.bgSubtle,
  borderRadius: radius.md,
  padding: spacing.px16,
};
