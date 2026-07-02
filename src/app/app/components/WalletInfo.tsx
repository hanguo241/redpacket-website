"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect, useBalance } from "wagmi";
import { colors } from "../design";

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
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="rp-btn-primary"
            >
              {isPending ? "连接中..." : `连接 ${connector.name || connector.id}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const chainLabel =
    chainId === 31337 ? "LOCAL" :
    chainId === 1 ? "ETH" :
    chainId === 56 ? "BSC" :
    chainId ? `${chainId}` : "—";

  const balanceStr = balance
    ? `${(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} ${balance.symbol}`
    : "—";

  return (
    <div className="rp-container flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[rgba(255,55,199,0.08)] flex items-center justify-center text-base shrink-0">
          🧧
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13.3333px] font-mono text-[#131313] font-[535]">
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </span>
            <span className="text-xs px-1.5 rounded-[6px] bg-[#F9F9F9] text-[#808080] font-mono leading-5">
              {chainLabel}
            </span>
          </div>
          <p className="text-xs text-[#808080] font-mono m-0 mt-0.5">
            {balanceStr}
          </p>
        </div>
      </div>

      <button
        onClick={() => disconnect()}
        className="px-3 py-1.5 rounded-xl text-xs font-sans text-[#808080] bg-transparent border border-[#F2F2F2] cursor-pointer transition-all whitespace-nowrap hover:bg-[#f5f5f5] hover:text-[#131313]"
      >
        断开
      </button>
    </div>
  );
}
