"use client";

import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import WalletInfo from "./components/WalletInfo";
import CreatePacket from "./components/CreatePacket";
import ClaimView from "./components/ClaimView";
import {
  colors,
  spacing,
  typography,
  container,
} from "./design";

type Tab = "create" | "claim";

// useSearchParams 需要 Suspense 边界
// 外层只提供 Suspense，业务逻辑在 AppPageInner
export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ background: colors.white }}>
          <div className="mx-auto" style={{ maxWidth: "500px", padding: `${spacing.px72} ${spacing.px16}` }}>
            <div style={container}>
              <p style={{ fontSize: typography.fontSize.body, color: colors.textTertiary, textAlign: "center" }}>
                加载中...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <AppPageInner />
    </Suspense>
  );
}

function AppPageInner() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const claimId = searchParams?.get("claim") || null;

  const [tab, setTab] = useState<Tab>(claimId ? "claim" : "create");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ background: colors.white }}>
        <div className="mx-auto" style={{ maxWidth: "500px", padding: `${spacing.px72} ${spacing.px16}` }}>
          <div style={container}>
            <p style={{ fontSize: typography.fontSize.body, color: colors.textTertiary, textAlign: "center" }}>
              加载中...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.white }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: "500px",
          padding: `${spacing.px48} ${spacing.px16} ${spacing.px72}`,
        }}
      >
        {/* ── 顶部 Logo ── */}
        <div style={{ marginBottom: spacing.px20 }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: typography.fontWeight.emphasis,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.sans,
              letterSpacing: "-0.4px",
            }}
          >
            🧧 RedPacket
          </span>
        </div>

        {/* ── 钱包信息卡片 ── */}
        <div style={{ marginBottom: spacing.px24 }}>
          <WalletInfo />
        </div>

        {/* ── 已连接: Tab + 内容 ── */}
        {isConnected && (
          <>
            <div
              style={{
                display: "flex",
                gap: spacing.px8,
                marginBottom: spacing.px20,
              }}
            >
              <button
                onClick={() => setTab("create")}
                style={{
                  flex: 1,
                  padding: `${spacing.px8} ${spacing.px4}`,
                  borderRadius: "9999px",
                  fontSize: typography.fontSize.body,
                  fontWeight: tab === "create" ? typography.fontWeight.emphasis : typography.fontWeight.normal,
                  fontFamily: typography.fontFamily.sans,
                  color: tab === "create" ? colors.magenta : colors.textTertiary,
                  background: tab === "create" ? "rgba(255, 55, 199, 0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:opacity-80"
              >
                发红包
              </button>
              <button
                onClick={() => setTab("claim")}
                style={{
                  flex: 1,
                  padding: `${spacing.px8} ${spacing.px4}`,
                  borderRadius: "9999px",
                  fontSize: typography.fontSize.body,
                  fontWeight: tab === "claim" ? typography.fontWeight.emphasis : typography.fontWeight.normal,
                  fontFamily: typography.fontFamily.sans,
                  color: tab === "claim" ? colors.magenta : colors.textTertiary,
                  background: tab === "claim" ? "rgba(255, 55, 199, 0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:opacity-80"
              >
                领红包
              </button>
            </div>

            {tab === "create" ? (
              <CreatePacket />
            ) : (
              <ClaimView key={claimId || "default"} initialPacketId={claimId} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
