"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi";

export default function WalletInfo() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免 hydration 不匹配：服务器和客户端第一次渲染内容一致
  if (!mounted) {
    return (
      <div className="glass rounded-xl p-6">
        <p className="text-text-secondary text-center">加载中...</p>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <div>
            <p className="text-sm font-mono text-white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <p className="text-xs text-text-secondary">
              {chainId ? `Chain ID: ${chainId}` : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-sm text-text-secondary hover:text-redpacket transition-colors"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <p className="text-text-secondary text-center mb-4">选择钱包连接</p>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full rounded-full bg-redpacket px-6 py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50"
          >
            {isPending ? "连接中..." : `连接 ${connector.name || connector.id}`}
          </button>
        ))}
      </div>
    </div>
  );
}
