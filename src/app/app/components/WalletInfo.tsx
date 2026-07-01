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

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
  };

  // 避免 hydration 不匹配
  if (!mounted) {
    return (
      <div style={cardStyle}>
        <p style={{ fontSize: "14px", color: "#808080", textAlign: "center" }}>加载中...</p>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
            <div>
              <p style={{ fontSize: "14px", fontFamily: "var(--font-geist-mono), monospace", color: "#171717" }}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <p style={{ fontSize: "12px", color: "#808080" }}>
                {chainId ? `Chain ID: ${chainId}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            style={{
              fontSize: "13px",
              color: "#808080",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            className="hover:text-[#171717]"
          >
            断开连接
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: "14px", color: "#808080", textAlign: "center", marginBottom: "16px" }}>
        选择钱包连接
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              background: "#171717",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
            className="transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "连接中..." : `连接 ${connector.name || connector.id}`}
          </button>
        ))}
      </div>
    </div>
  );
}
