"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import WalletInfo from "./components/WalletInfo";
import CreatePacket from "./components/CreatePacket";
import ClaimView from "./components/ClaimView";

type Tab = "create" | "claim";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("create");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{
            fontSize: "40px",
            fontWeight: 600,
            letterSpacing: "-2.4px",
            lineHeight: 1.2,
            color: "#171717",
            marginBottom: "0.5rem",
          }}>
            🧧 红包应用
          </h1>
          <p style={{ fontSize: "16px", color: "#4d4d4d" }}>
            发红包 · 领红包 · 一站式管理
          </p>
        </div>

        {/* Wallet Info */}
        <div className="mb-6">
          <WalletInfo />
        </div>

        {/* mounted 之前不渲染条件内容，避免 hydration 不匹配 */}
        {mounted && isConnected && (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 mb-6 bg-white" style={{
              borderRadius: "8px",
              boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
            }}>
              <button
                onClick={() => setTab("create")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  ...(tab === "create"
                    ? { background: "#171717", color: "#fff" }
                    : { background: "transparent", color: "#666666" }),
                }}
              >
                发红包
              </button>
              <button
                onClick={() => setTab("claim")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  ...(tab === "claim"
                    ? { background: "#171717", color: "#fff" }
                    : { background: "transparent", color: "#666666" }),
                }}
              >
                领红包
              </button>
            </div>

            {/* Tab Content */}
            {tab === "create" ? <CreatePacket /> : <ClaimView />}
          </>
        )}

        {mounted && !isConnected && (
          <div className="bg-white text-center" style={{
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
            <p style={{ fontSize: "16px", color: "#4d4d4d" }}>
              连接钱包后即可开始使用红包应用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
