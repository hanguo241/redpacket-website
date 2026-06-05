"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getPacketStatus, prepareClaim, confirmClaim } from "@/lib/api";
import { fromWei } from "./CreatePacket";

interface ClaimRecord {
  packetId: string;
  amount: string;
  status: string;
  txHash?: string;
  timestamp: number;
}

export default function ClaimView() {
  const { address, isConnected } = useAccount();

  const [packetId, setPacketId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [claimHistory, setClaimHistory] = useState<ClaimRecord[]>([]);

  // 从链接中提取 packetId
  function extractPacketId(input: string): string {
    const trimmed = input.trim();
    // 如果是 UUID 格式直接返回
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(trimmed)) return trimmed;
    // 从 URL 中提取
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

  async function handleClaim() {
    if (!isConnected || !address || !result) return;

    setLoading(true);
    setError("");

    try {
      // 1. 从后端获取签名 + 待签名交易数据
      const prep = await prepareClaim({
        packet_id: result.packet_id,
        user_address: address,
        proof: password ? { password } : undefined,
      });

      // 2. 前端广播领红包交易
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

      // 3. 提交 txHash 到后端确认
      try {
        await confirmClaim({
          packet_id: result.packet_id,
          recipient: address,
          tx_hash: txHash,
        });
      } catch (_) {
        // 后端确认失败不影响链上结果
      }

      // 4. 记录
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
      <form onSubmit={handleLookup} className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">领取红包</h3>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            红包 ID 或链接
          </label>
          <input
            type="text"
            value={packetId}
            onChange={(e) => setPacketId(e.target.value)}
            placeholder="粘贴红包链接或输入 ID"
            className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-full bg-redpacket py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50">
          {loading ? "查询中..." : "查询红包"}
        </button>
      </form>

      {error && (
        <div className="glass rounded-xl p-4 border border-redpacket/30">
          <p className="text-redpacket text-sm">{error}</p>
        </div>
      )}

      {/* 红包信息 */}
      {result && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">🧧 红包信息</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-text-secondary">状态:</span> <span className="text-white">{result.status}</span></div>
            <div><span className="text-text-secondary">金额:</span> <span className="text-white">{fromWei(result.total_amount)}</span></div>
            <div><span className="text-text-secondary">已领:</span> <span className="text-white">{result.claimed_count}/{result.head_count}</span></div>
            <div><span className="text-text-secondary">Gas:</span> <span className="text-white">{result.claim_mode}</span></div>
          </div>

          {result.status === "active" && isConnected && (
            <div className="space-y-3 pt-2 border-t border-border">
              <input type="text" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入口令（如有）"
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket" />
              <button onClick={handleClaim} disabled={loading}
                className="w-full rounded-full bg-redpacket py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50">
                {loading ? "领取中..." : "领取红包 🧧"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 领取记录 */}
      {claimHistory.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">领取记录</h3>
          <div className="space-y-3">
            {claimHistory.map((r, i) => (
              <div key={i}
                className="flex items-center justify-between bg-surface-dark rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm text-white font-mono">
                    {r.packetId.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-text-secondary">
                    {fromWei(r.amount)} · {r.txHash?.slice(0, 10)}...
                  </p>
                </div>
                <span className="text-xs text-green-500 bg-green-500/10 rounded-full px-2 py-0.5">
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
