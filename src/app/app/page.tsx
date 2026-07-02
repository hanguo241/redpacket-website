"use client";

import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import WalletInfo from "./components/WalletInfo";
import CreatePacket from "./components/CreatePacket";
import ClaimView from "./components/ClaimView";
import { colors } from "./design";

type Tab = "create" | "claim";

export default function AppPage() {
  return (
    <Suspense fallback={null}>
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
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[500px] pt-[72px] px-4 pb-16">
          <div className="rp-container">
            <p className="text-base text-[#808080] text-center">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[500px] pt-12 px-4 pb-[72px]">
        {/* Logo */}
        <div className="mb-5">
          <span className="text-xl font-[535] text-[#131313] font-sans tracking-tight">
            🧧 RedPacket
          </span>
        </div>

        {/* Wallet */}
        <div className="mb-6">
          <WalletInfo />
        </div>

        {isConnected && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setTab("create")}
                className={tab === "create" ? "rp-tab-active" : "rp-tab-inactive"}
              >
                发红包
              </button>
              <button
                onClick={() => setTab("claim")}
                className={tab === "claim" ? "rp-tab-active" : "rp-tab-inactive"}
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
