"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getPacketStatus, prepareClaim, confirmClaim, proxyClaim } from "@/lib/api";
import { fromWei } from "./CreatePacket";
import ErrorBanner from "./ErrorBanner";
import {
  colors,
  spacing,
  radius,
  typography,
  containerCls,
  inputCls,
  btnPrimaryCls,
  btnSecondaryCls,
  btnGhostCls,
  labelCls,
  container,
  input,
  btnPrimary,
  btnSecondary,
  btnGhost,
  label,
  cardEmbedCls,
  cardEmbed,
} from "../design";

// ── Status Badge ──
function StatusBadge({ status }: { status: string }) {
  const palette: Record<string, { bg: string; color: string; label: string }> = {
    active:    { bg: colors.successBg, color: colors.success, label: "进行中" },
    completed: { bg: colors.successBg, color: colors.success, label: "已完成" },
    pending:   { bg: colors.infoBg, color: colors.info, label: "待确认" },
    expired:   { bg: colors.errorBg, color: colors.error, label: "已过期" },
    refunded:  { bg: colors.errorBg, color: colors.error, label: "已退款" },
    failed:    { bg: colors.errorBg, color: colors.error, label: "失败" },
  };
  const s = palette[status] || { bg: colors.bgSubtle, color: colors.textTertiary, label: status };

  return (
    <span
      style={{
        display: "inline-block",
        padding: `${spacing.px4} ${spacing.px8}`,
        borderRadius: radius.sm,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.normal,
        fontFamily: typography.fontFamily.sans,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.bg}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ── 领取记录 ──
function ClaimHistory({ history }: { history: ClaimRecord[] }) {
  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: spacing.px20 }}>
      <h4
        style={{
          fontSize: typography.fontSize.button,
          fontWeight: typography.fontWeight.emphasis,
          color: colors.textPrimary,
          fontFamily: typography.fontFamily.sans,
          margin: 0,
          marginBottom: spacing.px12,
        }}
      >
        领取记录
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.px8 }}>
        {history.map((r, i) => (
          <div
            key={i}
            style={{
              ...cardEmbed,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: typography.fontSize.button,
                  color: colors.textPrimary,
                  fontFamily: typography.fontFamily.mono,
                  margin: 0,
                  marginBottom: spacing.px2,
                }}
              >
                {r.packetId.slice(0, 8)}...
              </p>
              <p
                style={{
                  fontSize: typography.fontSize.small,
                  color: colors.textTertiary,
                  fontFamily: typography.fontFamily.sans,
                  margin: 0,
                }}
              >
                {fromWei(r.amount)} · {r.txHash?.slice(0, 10)}...
              </p>
            </div>
            <span
              style={{
                fontSize: typography.fontSize.small,
                padding: `0 ${spacing.px8}`,
                borderRadius: radius.full,
                background: colors.successBg,
                color: colors.success,
                lineHeight: "24px",
                fontFamily: typography.fontFamily.sans,
              }}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ClaimRecord {
  packetId: string;
  amount: string;
  status: string;
  txHash?: string;
  timestamp: number;
}

// ── 主组件 ──
export default function ClaimView({ initialPacketId }: { initialPacketId?: string | null }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [packetId, setPacketId] = useState(initialPacketId || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [claimHistory, setClaimHistory] = useState<ClaimRecord[]>([]);
  const [claimStatus, setClaimStatus] = useState<"idle" | "signing" | "sending" | "done">("idle");

  // 从 URL 携带红包 ID 时自动查询
  useEffect(() => {
    if (initialPacketId) {
      setLoading(true);
      setError("");
      getPacketStatus(initialPacketId)
        .then((status) => setResult(status))
        .catch((err) => setError(err.message || "查询失败"))
        .finally(() => setLoading(false));
    }
  }, [initialPacketId]);

  function extractPacketId(input: string): string {
    const trimmed = input.trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(trimmed)) return trimmed;
    const m = trimmed.match(/\/claim\/([0-9a-f-]+)/i);
    return m ? m[1] : trimmed;
  }

  // ── 查询红包 ──
  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = extractPacketId(packetId);
    if (!id) return;

    setLoading(true);
    setError("");
    setResult(null);
    setClaimStatus("idle");

    try {
      const status = await getPacketStatus(id);
      setResult(status);
    } catch (err: any) {
      setError(err.message || "查询失败");
    } finally {
      setLoading(false);
    }
  }

  // ── 自领 ──
  async function handleClaim() {
    if (!isConnected || !address || !result) return;
    setError("");
    setClaimStatus("signing");

    try {
      const prep = await prepareClaim({
        packet_id: result.packet_id,
        user_address: address,
        proof: password ? { password } : undefined,
      });

      setClaimStatus("sending");
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
      } catch { /* 后台确认，忽略前端错误 */ }

      const record: ClaimRecord = {
        packetId: result.packet_id,
        amount: prep.amount,
        status: "confirmed",
        txHash,
        timestamp: Date.now(),
      };
      setClaimHistory((prev) => [record, ...prev]);
      setClaimStatus("done");
      setResult(null);
      setPacketId("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "领取失败");
      setClaimStatus("idle");
    }
  }

  // ── 代领 ──
  async function handleProxyClaim() {
    if (!isConnected || !address || !result) return;
    setError("");
    setClaimStatus("signing");

    try {
      const authMsg = `RedPacket: authorize claim ${result.packet_id}`;
      const userSignature = await signMessageAsync({ message: authMsg });

      setClaimStatus("sending");
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
      setClaimStatus("done");
      setResult(null);
      setPacketId("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "代领失败");
      setClaimStatus("idle");
    }
  }

  const showPassword = result?.packet_type === "password";
  const claimMode = result?.claim_mode || "both";
  const canClaim = result?.status === "active" && isConnected;

  return (
    <div>
      {/* ── 查询表单 ── */}
      <form onSubmit={handleLookup} style={container}>
        <h3
          style={{
            fontSize: typography.fontSize.h3,
            fontWeight: typography.fontWeight.emphasis,
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.sans,
            margin: 0,
            marginBottom: spacing.px8,
            letterSpacing: "-0.48px",
          }}
        >
          领取红包
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.small,
            color: colors.textTertiary,
            marginBottom: spacing.px20,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          输入红包 ID 或分享链接
        </p>

        <div style={{ marginBottom: spacing.px16 }}>
          <input
            type="text"
            value={packetId}
            onChange={(e) => setPacketId(e.target.value)}
            placeholder="粘贴红包链接或输入 ID"
            style={input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={btnPrimary}
          className="transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "查询中..." : "查询红包"}
        </button>
      </form>

      {/* ── 错误提示 ── */}
      {error && (
        <div style={{ marginTop: spacing.px12 }}>
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {/* ── 红包信息 + 领取 ── */}
      {result && (
        <div style={{ ...container, marginTop: spacing.px12 }}>
          {/* 头部：状态标记 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing.px16,
            }}
          >
            <span
              style={{
                fontSize: typography.fontSize.body,
                fontWeight: typography.fontWeight.emphasis,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.sans,
              }}
            >
              🧧 红包信息
            </span>
            <StatusBadge status={result.status} />
          </div>

          {/* 详情 */}
          <div style={cardEmbed}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: spacing.px12,
              }}
            >
              <div>
                <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, margin: 0, marginBottom: spacing.px2, fontFamily: typography.fontFamily.sans }}>
                  领取池
                </p>
                <p style={{ fontSize: typography.fontSize.button, color: colors.textPrimary, fontFamily: typography.fontFamily.mono, margin: 0 }}>
                  {fromWei(result.total_amount)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, margin: 0, marginBottom: spacing.px2, fontFamily: typography.fontFamily.sans }}>
                  已领 / 总人数
                </p>
                <p style={{ fontSize: typography.fontSize.button, color: colors.textPrimary, fontFamily: typography.fontFamily.mono, margin: 0 }}>
                  {result.claimed_count} / {result.head_count}
                </p>
              </div>
              <div>
                <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, margin: 0, marginBottom: spacing.px2, fontFamily: typography.fontFamily.sans }}>
                  总额
                </p>
                <p style={{ fontSize: typography.fontSize.button, color: colors.textTertiary, fontFamily: typography.fontFamily.mono, margin: 0 }}>
                  {fromWei(result.gross_amount || result.total_amount)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, margin: 0, marginBottom: spacing.px2, fontFamily: typography.fontFamily.sans }}>
                  Gas 模式
                </p>
                <p style={{ fontSize: typography.fontSize.button, color: colors.textTertiary, fontFamily: typography.fontFamily.mono, margin: 0 }}>
                  {claimMode === "self" ? "自领" : claimMode === "proxy" ? "代领" : "自领/代领"}
                </p>
              </div>
            </div>
          </div>

          {/* ── 领取操作 ── */}
          {canClaim && (
            <div style={{ marginTop: spacing.px16 }}>
              {showPassword && (
                <div style={{ marginBottom: spacing.px12 }}>
                  <label style={label}>口令</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入口令"
                    style={input}
                  />
                </div>
              )}

              {/* Pending 状态 */}
              {claimStatus !== "idle" && claimStatus !== "done" && (
                <div style={{ textAlign: "center", marginBottom: spacing.px16 }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `2px solid ${colors.borderLight}`,
                      borderTopColor: colors.magenta,
                      animation: "claimSpin 0.8s linear infinite",
                      margin: "0 auto",
                      marginBottom: spacing.px8,
                    }}
                  />
                  <style>{`@keyframes claimSpin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, fontFamily: typography.fontFamily.sans, margin: 0 }}>
                    {claimStatus === "signing" ? "请签名授权…" : "发送交易中…"}
                  </p>
                </div>
              )}

              {/* 自领按钮 */}
              {(claimMode === "self" || claimMode === "both") && claimStatus === "idle" && (
                <button
                  onClick={handleClaim}
                  style={{ ...btnSecondary, marginBottom: spacing.px8 }}
                  className="transition-opacity hover:opacity-80"
                >
                  自领（自己付 gas）
                </button>
              )}

              {/* 代领按钮 */}
              {(claimMode === "proxy" || claimMode === "both") && claimStatus === "idle" && (
                <button
                  onClick={handleProxyClaim}
                  style={btnPrimary}
                  className="transition-opacity hover:opacity-80"
                >
                  代领（平台付 gas）
                </button>
              )}

              {/* 领取成功 */}
              {claimStatus === "done" && (
                <ErrorBanner message="领取成功！" type="success" />
              )}
            </div>
          )}

          {/* 未连接提示 */}
          {!isConnected && (
            <p
              style={{
                marginTop: spacing.px16,
                fontSize: typography.fontSize.small,
                color: colors.textTertiary,
                textAlign: "center",
                fontFamily: typography.fontFamily.sans,
              }}
            >
              请先连接钱包
            </p>
          )}
        </div>
      )}

      {/* ── 领取记录 ── */}
      <ClaimHistory history={claimHistory} />
    </div>
  );
}
