"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useConnectors } from "wagmi";
import { colors, radius, spacing, typography, btnPrimary } from "../design";

export default function WalletInfo() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isConnected) return null; // 已连接由 page.tsx 顶部栏展示

  return (
    <div
      style={{
        textAlign: "center",
        padding: spacing.px48,
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: spacing.px16, lineHeight: 1 }}>🔗</div>
      <p
        style={{
          fontSize: typography.fontSize.body,
          color: colors.textSecondary,
          marginBottom: spacing.px24,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        选择钱包连接
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.px12,
          maxWidth: "320px",
          margin: "0 auto",
        }}
      >
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            style={btnPrimary}
            className="transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "连接中..." : `连接 ${connector.name || connector.id}`}
          </button>
        ))}
      </div>
    </div>
  );
}
