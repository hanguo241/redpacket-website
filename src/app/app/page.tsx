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
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧧 红包应用</h1>
          <p className="text-text-secondary">发红包 · 领红包 · 一站式管理</p>
        </div>

        {/* Wallet Info */}
        <div className="mb-6">
          <WalletInfo />
        </div>

        {/* mounted 之前不渲染条件内容，避免 hydration 不匹配 */}
        {mounted && isConnected && (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-1 glass rounded-xl p-1 mb-6">
              <button
                onClick={() => setTab("create")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  tab === "create"
                    ? "bg-redpacket text-white shadow-lg shadow-redpacket/20"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                发红包
              </button>
              <button
                onClick={() => setTab("claim")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  tab === "claim"
                    ? "bg-redpacket text-white shadow-lg shadow-redpacket/20"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                领红包
              </button>
            </div>

            {/* Tab Content */}
            {tab === "create" ? <CreatePacket /> : <ClaimView />}
          </>
        )}

        {mounted && !isConnected && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-text-secondary">
              连接钱包后即可开始使用红包应用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
