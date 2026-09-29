"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect, useBalance } from "wagmi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

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

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4 leading-none">🔗</div>
        <p className="text-base text-[#4d4d4d] mb-6 font-sans">选择钱包连接</p>
        <div className="flex flex-col gap-3 max-w-[320px] mx-auto">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
            >
              {isPending ? "连接中..." : `连接 ${connector.name || connector.id}`}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const chainLabel =
    chainId === 43113 ? "AVAX-FUJI" :
    chainId === 43114 ? "AVAX" :
    chainId === 31337 ? "LOCAL" :
    chainId === 1 ? "ETH" :
    chainId === 56 ? "BSC" :
    chainId ? `${chainId}` : "—";

  const balanceStr = balance
    ? `${(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} ${balance.symbol}`
    : "—";

  return (
    <Panel className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-magenta-overlay text-base">
          🧧
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-text-primary">
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </span>
            <Badge tone="neutral" className="font-mono">{chainLabel}</Badge>
          </div>
          <p className="m-0 mt-0.5 font-mono text-xs text-text-tertiary">
            {balanceStr}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth={false}
        onClick={() => disconnect()}
        className="whitespace-nowrap text-text-tertiary hover:bg-bg-subtle hover:text-text-primary"
      >
        断开
      </Button>
    </Panel>
  );
}
