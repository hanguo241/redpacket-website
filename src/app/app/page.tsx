"use client";

import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Panel } from "@/components/ui/Panel";
import WalletInfo from "./components/WalletInfo";
import CreatePacket from "./components/CreatePacket";
import ClaimView from "./components/ClaimView";

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
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();
  const claimId = searchParams?.get("claim") || null;
  const [tab, setTab] = useState<Tab>(claimId ? "claim" : "create");

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[500px] px-4 pb-16 pt-[72px]">
          <Panel>
            <p className="text-center text-base text-text-tertiary">加载中...</p>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[500px] pt-12 px-4 pb-[72px]">
  
        <div className="mb-6"><WalletInfo /></div>

        {isConnected && (
          <>
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setTab("create")}
                className={cn(
                  "flex-1 rounded-full border-none px-1 py-2 font-sans text-base transition-all duration-150",
                  tab === "create"
                    ? "bg-magenta-overlay font-semibold text-magenta"
                    : "bg-transparent font-normal text-text-tertiary hover:opacity-80"
                )}
              >
                发红包
              </button>
              <button
                type="button"
                onClick={() => setTab("claim")}
                className={cn(
                  "flex-1 rounded-full border-none px-1 py-2 font-sans text-base transition-all duration-150",
                  tab === "claim"
                    ? "bg-magenta-overlay font-semibold text-magenta"
                    : "bg-transparent font-normal text-text-tertiary hover:opacity-80"
                )}
              >
                领红包
              </button>
            </div>
            {tab === "create" ? <CreatePacket /> : <ClaimView key={claimId || "default"} initialPacketId={claimId} />}
          </>
        )}
      </div>
    </div>
  );
}
