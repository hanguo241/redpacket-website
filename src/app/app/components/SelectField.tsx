"use client";

import { colors, radius, spacing, typography } from "../design";

interface SelectFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
}

export default function SelectField({ value, onChange, options, disabled }: SelectFieldProps) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: `${spacing.px12} ${spacing.px40} ${spacing.px12} ${spacing.px16}`,
          borderRadius: radius.md,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.normal,
          fontFamily: typography.fontFamily.sans,
          color: colors.textPrimary,
          background: colors.white,
          border: `1px solid ${colors.border}`,
          outline: "none",
          height: "44px",
          boxSizing: "border-box",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          transition: "border-color 0.15s ease",
        }}
        className="focus:border-[#FF37C7] focus:shadow-[0px_0px_0px_3px_rgba(255,55,199,0.1)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: spacing.px12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: colors.textTertiary,
          fontSize: "10px",
          lineHeight: 1,
        }}
      >
        ▾
      </div>
    </div>
  );
}
