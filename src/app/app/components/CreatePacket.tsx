"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { preparePacket, createPacket, type TokenInfo } from "@/lib/api";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useChainSwitch } from "@/hooks/useChainSwitch";
import TokenSelector from "./TokenSelector";
import ErrorBanner from "./ErrorBanner";
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  container,
  input,
  btnPrimary,
  btnSecondary,
  btnGhost,
  label,
  cardEmbed,
} from "../design";

// ── 工具函数 ──

function toWei(amount: string): string {
  try {
    const trimmed = amount.trim();
    if (!trimmed || trimmed === "0") return "0";
    const parts = trimmed.split(".");
    const intPart = parts[0];
    const decPart = (parts[1] || "").padEnd(18, "0").slice(0, 18);
    const wei = intPart + decPart;
    return wei.replace(/^0+/, "") || "0";
  } catch {
    return "0";
  }
}

export function fromWei(wei: string): string {
  try {
    const s = wei.padStart(19, "0");
    const intPart = s.slice(0, s.length - 18).replace(/^0+/, "") || "0";
    const decPart = s.slice(s.length - 18).replace(/0+$/, "");
    return decPart ? `${intPart}.${decPart}` : intPart;
  } catch {
    return wei;
  }
}

type PacketType = "normal" | "password";
type SubType = "average" | "random";
type FlowState = "form" | "confirm" | "pending" | "success";

// ── 高级选项面板 ──
function AdvancedOptions({
  packetType,
  setPacketType,
  subType,
  setSubType,
  password,
  setPassword,
  claimMode,
  setClaimMode,
  endTime,
  setEndTime,
}: {
  packetType: PacketType;
  setPacketType: (v: PacketType) => void;
  subType: SubType;
  setSubType: (v: SubType) => void;
  password: string;
  setPassword: (v: string) => void;
  claimMode: string;
  setClaimMode: (v: string) => void;
  endTime: number;
  setEndTime: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing.px4,
          padding: 0,
          fontSize: typography.fontSize.button,
          color: colors.textTertiary,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: typography.fontFamily.sans,
        }}
        className="hover:text-[#131313]"
      >
        ⚙️ 高级选项
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: spacing.px12,
            display: "flex",
            flexDirection: "column",
            gap: spacing.px12,
          }}
        >
          <div style={{ display: "flex", gap: spacing.px12 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>类型</label>
              <select
                value={packetType}
                onChange={(e) => setPacketType(e.target.value as PacketType)}
                style={input}
              >
                <option value="normal">普通红包</option>
                <option value="password">口令红包</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>分配</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value as SubType)}
                style={input}
              >
                <option value="average">均分</option>
                <option value="random">随机</option>
              </select>
            </div>
          </div>

          <div>
            <label style={label}>领取模式</label>
            <select
              value={claimMode}
              onChange={(e) => setClaimMode(e.target.value)}
              style={input}
            >
              <option value="self">自领（自己付 gas）</option>
              <option value="proxy">代领（平台付 gas）</option>
              <option value="both">两种模式</option>
            </select>
          </div>

          <div>
            <label style={label}>过期时间</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(Number(e.target.value))}
              style={input}
            >
              <option value={Math.floor(Date.now() / 1000) + 3600}>1 小时后</option>
              <option value={Math.floor(Date.now() / 1000) + 7200}>2 小时后</option>
              <option value={Math.floor(Date.now() / 1000) + 14400}>4 小时后</option>
              <option value={Math.floor(Date.now() / 1000) + 43200}>12 小时后</option>
              <option value={Math.floor(Date.now() / 1000) + 86400}>24 小时后</option>
            </select>
          </div>

          {packetType === "password" && (
            <div>
              <label style={label}>口令</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="设置领取口令"
                style={input}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 费用详情面板 ──
function FeeDetails({ gasInfo, token }: {
  gasInfo: {
    platformFeeWei: string;
    claimPoolWei: string;
    estimatedGasFeeWei: string;
    estimatedGasFeeEth: string;
    gasPriceGwei: string;
    multiplier: number;
  } | null;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  if (!gasInfo) return null;

  return (
    <div style={cardEmbed}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: typography.fontSize.button, color: colors.textSecondary, fontFamily: typography.fontFamily.sans }}>
          费用明细
        </span>
        <span style={{
          fontSize: typography.fontSize.button,
          color: colors.magenta,
          fontFamily: typography.fontFamily.mono,
        }}>
          {fromWei(gasInfo.estimatedGasFeeEth)} ETH
          <span style={{ marginLeft: spacing.px4, transform: open ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▾</span>
        </span>
      </div>

      {open && (
        <div style={{ marginTop: spacing.px12, display: "flex", flexDirection: "column", gap: spacing.px8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: typography.fontSize.small }}>
            <span style={{ color: colors.textTertiary }}>平台费</span>
            <span style={{ color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
              {fromWei(gasInfo.platformFeeWei)} {token === "native" ? "ETH" : "Token"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: typography.fontSize.small }}>
            <span style={{ color: colors.textTertiary }}>领取池</span>
            <span style={{ color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
              {fromWei(gasInfo.claimPoolWei)} {token === "native" ? "ETH" : "Token"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: typography.fontSize.small }}>
            <span style={{ color: colors.textTertiary }}>Gas Price</span>
            <span style={{ color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
              {gasInfo.gasPriceGwei} Gwei
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: typography.fontSize.small }}>
            <span style={{ color: colors.textTertiary }}>估算倍数</span>
            <span style={{ color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
              {gasInfo.multiplier}x
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 发送成功卡片 ──
function SuccessView({
  shareUrl,
  txHash,
  totalAmount,
  token,
  onReset,
}: {
  shareUrl: string;
  txHash?: string;
  totalAmount: string;
  token: string;
  onReset: () => void;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: spacing.px16, lineHeight: 1 }}>🎉</div>
      <h3
        style={{
          fontSize: typography.fontSize.h3,
          fontWeight: typography.fontWeight.emphasis,
          color: colors.textPrimary,
          fontFamily: typography.fontFamily.sans,
          margin: 0,
          marginBottom: spacing.px8,
        }}
      >
        红包已发送！
      </h3>
      <p
        style={{
          fontSize: typography.fontSize.body,
          color: colors.textSecondary,
          marginBottom: spacing.px24,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        {fromWei(totalAmount)} {token === "native" ? "ETH" : "Token"}
      </p>

      {/* 分享链接 */}
      <div
        style={{
          ...cardEmbed,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.px8,
          marginBottom: spacing.px20,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: typography.fontSize.small,
            color: colors.textTertiary,
            fontFamily: typography.fontFamily.sans,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {shareUrl}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          style={btnGhost}
          className="hover:bg-[rgba(255,55,199,0.08)]"
        >
          复制链接
        </button>
      </div>

      {txHash && (
        <p
          style={{
            fontSize: typography.fontSize.small,
            color: colors.textTertiary,
            fontFamily: typography.fontFamily.mono,
            marginBottom: spacing.px20,
            wordBreak: "break-all",
          }}
        >
          Tx: {txHash.slice(0, 10)}...{txHash.slice(-6)}
        </p>
      )}

      <button onClick={onReset} style={btnPrimary} className="transition-opacity hover:opacity-80">
        再发一个
      </button>
    </div>
  );
}

// ── Pending 状态 ──
function PendingView({ step }: { step: "approve" | "create" }) {
  return (
    <div style={{ textAlign: "center", padding: spacing.px32 }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: `3px solid ${colors.borderLight}`,
          borderTopColor: colors.magenta,
          animation: "spin 0.8s linear infinite",
          margin: "0 auto",
          marginBottom: spacing.px20,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p
        style={{
          fontSize: typography.fontSize.body,
          color: colors.textPrimary,
          fontFamily: typography.fontFamily.sans,
          marginBottom: spacing.px8,
        }}
      >
        {step === "approve" ? "授权代币中…" : "创建红包中…"}
      </p>
      <p
        style={{
          fontSize: typography.fontSize.small,
          color: colors.textTertiary,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        请在钱包中确认交易
      </p>
    </div>
  );
}

// ── 主组件 ──
export default function CreatePacket() {
  const { address, isConnected } = useAccount();
  const { chains, loading: chainsLoading, getChainByName } = useChainConfig();
  const { switchToChain } = useChainSwitch();
  const { sendTransactionAsync } = useSendTransaction();

  const [chain, setChain] = useState("");
  const [token, setToken] = useState("native");
  const [totalAmount, setTotalAmount] = useState("");
  const [headCount, setHeadCount] = useState(10);
  const [packetType, setPacketType] = useState<PacketType>("normal");
  const [subType, setSubType] = useState<SubType>("average");
  const [password, setPassword] = useState("");
  const [claimMode, setClaimMode] = useState("self");
  const [endTime, setEndTime] = useState(Math.floor(Date.now() / 1000) + 86400);

  const [flow, setFlow] = useState<FlowState>("form");
  const [error, setError] = useState("");
  const [pendingStep, setPendingStep] = useState<"approve" | "create">("create");
  const [successData, setSuccessData] = useState<{
    shareUrl: string;
    txHash?: string;
    totalAmount: string;
  } | null>(null);

  // prepare 返回的数据
  const [prepared, setPrepared] = useState<{
    packetId: string;
    tx: { to: `0x${string}`; data: `0x${string}`; value: bigint | undefined };
    gasInfo: any;
    packetInfo: any;
  } | null>(null);

  const chainInitRef = useRef(false);
  useEffect(() => {
    if (!chain && chains.length > 0 && !chainInitRef.current) {
      chainInitRef.current = true;
      setChain(chains[0].name);
    }
  }, [chain, chains]);

  const weiAmount = toWei(totalAmount);

  // ── 第 1 步: 提交表单 → prepare ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) return;
    setError("");

    if (weiAmount === "0" || weiAmount === "") {
      setError("请输入有效的金额");
      return;
    }

    try {
      const res = await preparePacket({
        chain,
        token,
        total_amount: weiAmount,
        head_count: headCount,
        packet_type: packetType,
        sub_type: subType,
        password: packetType === "password" ? password : undefined,
        claim_mode: claimMode as any,
        end_time: endTime,
      });

      setPrepared({
        packetId: res.packet_id,
        tx: {
          to: res.transaction.to as `0x${string}`,
          data: res.transaction.data as `0x${string}`,
          value: res.transaction.value ? BigInt(res.transaction.value) : undefined,
        },
        gasInfo: {
          platformFeeWei: res.platform_fee_wei,
          claimPoolWei: res.claim_pool_wei,
          estimatedGasFeeWei: res.estimated_gas_fee_wei,
          estimatedGasFeeEth: res.estimated_gas_fee_eth,
          gasPriceGwei: res.gas_price_gwei,
          multiplier: res.gas_estimate_multiplier,
        },
        packetInfo: {
          chain, token, total_amount: weiAmount, head_count: headCount,
          packet_type: packetType, sub_type: subType, claim_mode: claimMode,
          password: packetType === "password" ? password : undefined,
          end_time: endTime, start_time: 0,
          gas_reserve_wei: res.suggested_gas_reserve_wei,
          gas_estimate_multiplier: res.gas_estimate_multiplier,
          fee_bps: res.fee_bps,
          platform_fee_wei: res.platform_fee_wei,
          claim_pool_wei: res.claim_pool_wei,
        },
      });
      setFlow("confirm");
    } catch (err: any) {
      setError(err.message || "创建失败");
    }
  }

  // ── 第 2 步: 确认 → 发送交易 ──
  async function handleConfirm() {
    if (!prepared) return;
    setError("");
    setFlow("pending");

    try {
      const info = prepared.packetInfo;
      const isErc20 = info.token && info.token !== "native";

      // ERC20: 先 approve
      if (isErc20 && info.token) {
        setPendingStep("approve");
        const amount = info.total_amount || weiAmount;
        const spenderPadded = prepared.tx.to.replace("0x", "").padStart(64, "0");
        const amountPadded = BigInt(amount).toString(16).padStart(64, "0");
        const approveData = `0x095ea7b3${spenderPadded}${amountPadded}`;

        const approveHash = await sendTransactionAsync({
          to: info.token as `0x${string}`,
          data: approveData as `0x${string}`,
        });
        if (!approveHash) throw new Error("授权失败");
      }

      // 创建红包
      setPendingStep("create");
      const txHash = await sendTransactionAsync({
        to: prepared.tx.to,
        data: prepared.tx.data,
        value: prepared.tx.value,
      });
      if (!txHash) throw new Error("交易失败");

      // 落库
      const result = await createPacket({
        packet_id: prepared.packetId,
        tx_hash: txHash,
        creator_address: address || "",
        chain: info.chain || chain,
        contract_address: prepared.tx.to,
        token: info.token || "native",
        total_amount: info.total_amount || weiAmount,
        head_count: info.head_count || headCount,
        packet_type: info.packet_type || packetType,
        sub_type: info.sub_type || subType,
        claim_mode: info.claim_mode || claimMode,
        password: info.password,
        start_time: info.start_time || 0,
        end_time: info.end_time || endTime,
        gas_reserve_wei: info.gas_reserve_wei || "0",
        gas_estimate_multiplier: info.gas_estimate_multiplier || 1.2,
        fee_bps: info.fee_bps || 20,
      });

      setSuccessData({
        shareUrl: result.share_url,
        txHash: result.tx_hash || txHash,
        totalAmount: result.claim_pool_wei || info.claim_pool_wei || weiAmount,
      });
      setFlow("success");
    } catch (err: any) {
      setError(err.message || "交易签名失败");
      setFlow("confirm");
    }
  }

  function handleReset() {
    setFlow("form");
    setPrepared(null);
    setSuccessData(null);
    setError("");
    setTotalAmount("");
    setPassword("");
  }

  // ── 链切换 ──
  async function handleChainChange(newChain: string) {
    setChain(newChain);
    const cfg = getChainByName(newChain);
    if (cfg && cfg.chainId > 0) {
      try { await switchToChain(cfg.chainId, cfg.name, cfg.rpcUrl); }
      catch { /* 用户拒绝忽略 */ }
    }
  }

  if (chainsLoading) {
    return (
      <div style={container}>
        <p style={{ fontSize: typography.fontSize.body, color: colors.textTertiary, textAlign: "center" }}>
          加载链配置中...
        </p>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* ── 成功状态 ── */}
      {flow === "success" && successData && (
        <SuccessView
          shareUrl={successData.shareUrl}
          txHash={successData.txHash}
          totalAmount={successData.totalAmount}
          token={token}
          onReset={handleReset}
        />
      )}

      {/* ── Pending 状态 ── */}
      {flow === "pending" && <PendingView step={pendingStep} />}

      {/* ── 确认状态 ── */}
      {flow === "confirm" && prepared && (
        <div>
          <h3
            style={{
              fontSize: typography.fontSize.h3,
              fontWeight: typography.fontWeight.emphasis,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.sans,
              margin: 0,
              marginBottom: spacing.px8,
            }}
          >
            确认红包
          </h3>
          <p
            style={{
              fontSize: typography.fontSize.small,
              color: colors.textTertiary,
              marginBottom: spacing.px20,
              fontFamily: typography.fontFamily.sans,
            }}
          >
            请在钱包中确认交易
          </p>

          {/* 金额摘要 */}
          <div style={cardEmbed}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing.px8 }}>
              <span style={{ fontSize: typography.fontSize.body, color: colors.textTertiary, fontFamily: typography.fontFamily.sans }}>
                红包金额
              </span>
              <span style={{ fontSize: typography.fontSize.body, fontWeight: typography.fontWeight.emphasis, color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
                {totalAmount} {token === "native" ? "ETH" : "Token"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing.px8 }}>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, fontFamily: typography.fontFamily.sans }}>
                领取人数
              </span>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
                {headCount} 人
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, fontFamily: typography.fontFamily.sans }}>
                领取模式
              </span>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textPrimary, fontFamily: typography.fontFamily.mono }}>
                {claimMode === "self" ? "自领" : claimMode === "proxy" ? "代领" : "两种模式"}
              </span>
            </div>
          </div>

          {/* Gas 信息 */}
          <div style={{ marginTop: spacing.px12, marginBottom: spacing.px20 }}>
            <FeeDetails gasInfo={prepared.gasInfo} token={token} />
          </div>

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError("")} />
          )}

          <div style={{ display: "flex", gap: spacing.px12 }}>
            <button
              onClick={() => setFlow("form")}
              style={{ ...btnGhost, flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="hover:bg-[rgba(255,55,199,0.08)]"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              style={{ ...btnSecondary, flex: 2, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="hover:bg-[rgba(255,55,199,0.15)]"
            >
              确认并发送
            </button>
          </div>
        </div>
      )}

      {/* ── 表单状态 ── */}
      {flow === "form" && (
        <form onSubmit={handleSubmit}>
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
            创建红包
          </h3>
          <p
            style={{
              fontSize: typography.fontSize.small,
              color: colors.textTertiary,
              marginBottom: spacing.px24,
              fontFamily: typography.fontFamily.sans,
            }}
          >
            填写信息，创建链上红包
          </p>

          {/* 链 + Token 行 */}
          <div style={{ display: "flex", gap: spacing.px12, marginBottom: spacing.px16 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>链</label>
              <select
                value={chain}
                onChange={(e) => handleChainChange(e.target.value)}
                style={input}
              >
                {chains.filter(c => c.chainId > 0).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>代币</label>
              <TokenSelector
                chain={chain}
                value={token}
                onChange={(addr) => setToken(addr)}
              />
            </div>
          </div>

          {/* 金额 — 大号输入 */}
          <div style={{ marginBottom: spacing.px16 }}>
            <label style={label}>总金额</label>
            <input
              type="text"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.0"
              required
              style={{
                ...input,
                fontSize: "32px",
                fontWeight: typography.fontWeight.emphasis,
                height: "64px",
                padding: `${spacing.px12} ${spacing.px16}`,
                textAlign: "right",
              }}
            />
            {totalAmount && (
              <p
                style={{
                  fontSize: typography.fontSize.small,
                  color: colors.textPlaceholder,
                  marginTop: spacing.px4,
                  textAlign: "right",
                  fontFamily: typography.fontFamily.mono,
                }}
              >
                ≈ {weiAmount.slice(0, 14)}... wei
              </p>
            )}
          </div>

          {/* 领取人数 */}
          <div style={{ marginBottom: spacing.px16 }}>
            <label style={label}>领取人数</label>
            <input
              type="number"
              value={headCount}
              onChange={(e) => setHeadCount(Number(e.target.value))}
              min={1}
              max={1000}
              style={input}
            />
          </div>

          {/* 高级选项 */}
          <div style={{ marginBottom: spacing.px20 }}>
            <AdvancedOptions
              packetType={packetType}
              setPacketType={setPacketType}
              subType={subType}
              setSubType={setSubType}
              password={password}
              setPassword={setPassword}
              claimMode={claimMode}
              setClaimMode={setClaimMode}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          </div>

          {error && (
            <ErrorBanner message={error} onDismiss={() => setError("")} />
          )}

          <button
            type="submit"
            style={btnPrimary}
            className="transition-opacity hover:opacity-80"
          >
            创建红包
          </button>
        </form>
      )}
    </div>
  );
}
