"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getPacketStatus, prepareClaim, confirmClaim, proxyClaim } from "@/lib/api";
import { fromWei } from "./CreatePacket";

interface ClaimRecord {
  packetId: string;
  amount: string;
  status: string;
  txHash?: string;
  timestamp: number;
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#171717",
  background: "#fff",
  border: "none",
  boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
  outline: "none",
  fontFamily: "var(--font-geist-sans), sans-serif",
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: 1.43,
  background: "#171717",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const smallCardStyle: React.CSSProperties = {
  background: "#fafafa",
  borderRadius: "8px",
  padding: "16px",
};

export default function ClaimView() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [packetId, setPacketId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [claimHistory, setClaimHistory] = useState<ClaimRecord[]>([]);

  // 从链接中提取 packetId
  function extractPacketId(input: string): string {
    const trimmed = input.trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(trimmed)) return trimmed;
    const m = trimmed.match(/\/claim\/([0-9a-f-]+)/i);
    return m ? m[1] : trimmed;
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = extractPacketId(packetId);
    if (!id) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const status = await getPacketStatus(id);
      setResult(status);
    } catch (err: any) {
      setError(err.message || "查询失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleProxyClaim() {
    if (!isConnected || !address || !result) return;

    setLoading(true);
    setError("");

    try {
      // 用户签署授权消息
      const authMsg = `RedPacket: authorize claim ${result.packet_id}`;
      const userSignature = await signMessageAsync({ message: authMsg });

      // 调用后端代领接口
      const res = await proxyClaim({
        packet_id: result.packet_id,
        user_address: address,
        user_signature: userSignature,
        proof: password ? { password } : undefined,
      });

      const record: ClaimRecord = {
        packetId: result.packet_id,
        amount: res.amount,
        status: "confirmed",
        txHash: res.tx_hash,
        timestamp: Date.now(),
      };
      setClaimHistory((prev) => [record, ...prev]);
      setResult(null);
      setPacketId("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "代领失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim() {
    if (!isConnected || !address || !result) return;

    setLoading(true);
    setError("");

    try {
      const prep = await prepareClaim({
        packet_id: result.packet_id,
        user_address: address,
        proof: password ? { password } : undefined,
      });

      const provider = (window as any).ethereum;
      if (!provider) throw new Error("No Ethereum provider");

      const txHash: string = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: address,
          to: prep.transaction.to,
          data: prep.transaction.data,
        }],
      });
      if (!txHash) throw new Error("交易失败");

      try {
        await confirmClaim({
          packet_id: result.packet_id,
          recipient: address,
          tx_hash: txHash,
        });
      } catch (_) {}

      const record: ClaimRecord = {
        packetId: result.packet_id,
        amount: prep.amount,
        status: "confirmed",
        txHash,
        timestamp: Date.now(),
      };
      setClaimHistory((prev) => [record, ...prev]);
      setResult(null);
      setPacketId("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "领取失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 查询红包 */}
      <form onSubmit={handleLookup} style={cardStyle} className="space-y-4">
        <h3 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
          领取红包
        </h3>
        <div>
          <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>
            红包 ID 或链接
          </label>
          <input
            type="text"
            value={packetId}
            onChange={(e) => setPacketId(e.target.value)}
            placeholder="粘贴红包链接或输入 ID"
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading}
          style={btnPrimary}
          className="transition-opacity hover:opacity-80 disabled:opacity-50">
          {loading ? "查询中..." : "查询红包"}
        </button>
      </form>

      {error && (
        <div style={{
          ...cardStyle,
          padding: "16px",
          boxShadow: "rgba(255,91,79,0.15) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
        }}>
          <p style={{ fontSize: "14px", color: "#ff5b4f" }}>{error}</p>
        </div>
      )}

      {/* 红包信息 */}
      {result && (
        <div style={cardStyle} className="space-y-4">
          <h3 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
            🧧 红包信息
          </h3>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: "14px" }}>
            <div><span style={{ color: "#808080" }}>状态:</span> <span style={{ color: "#171717" }}>{result.status}</span></div>
            <div><span style={{ color: "#808080" }}>总额:</span> <span style={{ color: "#171717" }}>{fromWei(result.gross_amount || result.total_amount)}</span></div>
            <div><span style={{ color: "#808080" }}>领取池:</span> <span style={{ color: "#171717" }}>{fromWei(result.total_amount)}</span></div>
            <div><span style={{ color: "#808080" }}>平台费:</span> <span style={{ color: "#171717" }}>{fromWei(result.platform_fee_wei || "0")}</span></div>
            <div><span style={{ color: "#808080" }}>已领:</span> <span style={{ color: "#171717" }}>{result.claimed_count}/{result.head_count}</span></div>
            <div><span style={{ color: "#808080" }}>Gas:</span> <span style={{ color: "#171717" }}>{result.claim_mode}</span></div>
          </div>

          {result.status === "active" && isConnected && (
            <div className="space-y-3" style={{ borderTop: "1px solid #ebebeb", paddingTop: "16px" }}>
              <input type="text" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入口令（如有）"
                style={inputStyle} />

              {/* 自领按钮 */}
              {(result.claim_mode === "self" || result.claim_mode === "both") && (
                <button onClick={handleClaim} disabled={loading}
                  style={btnPrimary}
                  className="transition-opacity hover:opacity-80 disabled:opacity-50">
                  {loading ? "领取中..." : "自领（自己付 gas）🧧"}
                </button>
              )}

              {/* 代领按钮 */}
              {(result.claim_mode === "proxy" || result.claim_mode === "both") && (
                <button onClick={handleProxyClaim} disabled={loading}
                  style={{ ...btnPrimary, background: "#0068d6" }}
                  className="transition-opacity hover:opacity-80 disabled:opacity-50">
                  {loading ? "代领中..." : "代领（平台付 gas）⚡"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 领取记录 */}
      {claimHistory.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.32px", color: "#171717", marginBottom: "16px" }}>
            领取记录
          </h3>
          <div className="space-y-3">
            {claimHistory.map((r, i) => (
              <div key={i}
                className="flex items-center justify-between"
                style={smallCardStyle}>
                <div>
                  <p style={{ fontSize: "14px", color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {r.packetId.slice(0, 8)}...
                  </p>
                  <p style={{ fontSize: "12px", color: "#808080" }}>
                    {fromWei(r.amount)} · {r.txHash?.slice(0, 10)}...
                  </p>
                </div>
                <span style={{
                  fontSize: "12px",
                  padding: "0px 10px",
                  borderRadius: "9999px",
                  background: "#ebf5ff",
                  color: "#0068d6",
                  lineHeight: "24px",
                }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
