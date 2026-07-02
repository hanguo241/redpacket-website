"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import WalletInfo from "./components/WalletInfo";
import CreatePacket from "./components/CreatePacket";
import ClaimView from "./components/ClaimView";
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  container,
} from "./design";

type Tab = "create" | "claim";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("create");

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

        {/* ── 钱包信息卡片（连接 / 未连接都显示）─ ─ */}
        <div style={{ marginBottom: spacing.px24 }}>
          <WalletInfo />
        </div>

        {/* ── 已连接: Tab + 内容 ── */}
        {isConnected && (
          <>
            {/* Tab 导航 */}
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
                  borderRadius: radius.full,
                  fontSize: typography.fontSize.body,
                  fontWeight: tab === "create" ? typography.fontWeight.emphasis : typography.fontWeight.normal,
                  fontFamily: typography.fontFamily.sans,
                  color: tab === "create" ? colors.magenta : colors.textTertiary,
                  background: tab === "create" ? colors.magentaOverlay : "transparent",
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
                  borderRadius: radius.full,
                  fontSize: typography.fontSize.body,
                  fontWeight: tab === "claim" ? typography.fontWeight.emphasis : typography.fontWeight.normal,
                  fontFamily: typography.fontFamily.sans,
                  color: tab === "claim" ? colors.magenta : colors.textTertiary,
                  background: tab === "claim" ? colors.magentaOverlay : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:opacity-80"
              >
                领红包
              </button>
            </div>

            {/* Tab 内容 */}
            {tab === "create" ? <CreatePacket /> : <ClaimView />}
          </>
        )}
      </div>
    </div>
  );
}
