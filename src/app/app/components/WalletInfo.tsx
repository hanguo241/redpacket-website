"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect, useBalance } from "wagmi";
import { colors, spacing, radius, typography, container, btnPrimary, btnPrimaryCls, containerCls, cardEmbedCls } from "../design";

export default function WalletInfo() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const connectors = useConnectors();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ── 未连接：显示连接器列表 ──
  if (!isConnected) {
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

  // ── 已连接：显示钱包信息卡片 ──
  const chainLabel =
    chainId === 31337 ? "LOCAL" :
    chainId === 1 ? "ETH" :
    chainId === 56 ? "BSC" :
    chainId ? `${chainId}` : "—";

  const balanceStr = balance
    ? `${(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} ${balance.symbol}`
    : "—";

  return (
    <div
      style={{
        ...container,
        padding: spacing.px16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: spacing.px12 }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: colors.magentaOverlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          🧧
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.px8,
            }}
          >
            <span
              style={{
                fontSize: typography.fontSize.button,
                fontFamily: typography.fontFamily.mono,
                color: colors.textPrimary,
                fontWeight: typography.fontWeight.emphasis,
              }}
            >
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </span>
            <span
              style={{
                fontSize: typography.fontSize.small,
                padding: `0 ${spacing.px8}`,
                borderRadius: radius.sm,
                background: colors.bgSubtle,
                color: colors.textTertiary,
                fontFamily: typography.fontFamily.mono,
                lineHeight: "20px",
              }}
            >
              {chainLabel}
            </span>
          </div>
          <p
            style={{
              fontSize: typography.fontSize.small,
              color: colors.textTertiary,
              fontFamily: typography.fontFamily.mono,
              margin: 0,
              marginTop: spacing.px2,
            }}
          >
            {balanceStr}
          </p>
        </div>
      </div>

      <button
        onClick={() => disconnect()}
        style={{
          padding: `${spacing.px8} ${spacing.px12}`,
          borderRadius: radius.md,
          fontSize: typography.fontSize.small,
          fontFamily: typography.fontFamily.sans,
          color: colors.textTertiary,
          background: "transparent",
          border: `1px solid ${colors.borderLight}`,
          cursor: "pointer",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
        }}
        className="hover:bg-[#f5f5f5] hover:text-[#131313]"
      >
        断开
      </button>
    </div>
  );
}
