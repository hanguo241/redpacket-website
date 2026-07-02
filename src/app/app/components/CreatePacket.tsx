"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { preparePacket, createPacket } from "@/lib/api";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useChainSwitch } from "@/hooks/useChainSwitch";

type PacketType = "normal" | "password";
type SubType = "average" | "random";

/** 将用户输入的单位 (如 ETH) 转为 wei (18 位小数) */
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

/** wei 转回可读单位 (仅展示) */
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

interface SentPacket {
  packetId: string;
  shareUrl: string;
  status: string;
  totalAmount: string;
  claimedCount: number;
  headCount: number;
  txHash?: string;
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "#808080",
  marginBottom: "4px",
};

export default function CreatePacket() {
  const { address, isConnected } = useAccount();
  const { chains, loading: chainsLoading, getChainByName } = useChainConfig();
  const { switchToChain } = useChainSwitch();
  const { sendTransactionAsync } = useSendTransaction()

  const [switchingChain, setSwitchingChain] = useState(false);
  const [chainSwitchErr, setChainSwitchErr] = useState("");

  const [chain, setChain] = useState("");
  const [token, setToken] = useState("native");
  const [totalAmount, setTotalAmount] = useState("");
  const [headCount, setHeadCount] = useState(10);
  const [packetType, setPacketType] = useState<PacketType>("normal");
  const [subType, setSubType] = useState<SubType>("average");
  const [password, setPassword] = useState("");
  const [claimMode, setClaimMode] = useState("self");
  const [endTime, setEndTime] = useState(
    () => Math.floor(Date.now() / 1000) + 86400
  );

  const chainInitRef = useRef(false);

  useEffect(() => {
    if (!chain && chains.length > 0 && !chainInitRef.current) {
      chainInitRef.current = true;
      setChain(chains[0].name);
    }
  }, [chain, chains]);

  const [step, setStep] = useState<"form" | "sign" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [pendingPacketId, setPendingPacketId] = useState("");
  const [pendingPacketInfo, setPendingPacketInfo] = useState<any>(null);
  const [weiAmount, setWeiAmount] = useState("");
  const [sentPackets, setSentPackets] = useState<SentPacket[]>([]);

  const [gasInfo, setGasInfo] = useState<{
    estimatedGasFeeWei: string;
    estimatedGasFeeEth: string;
    gasPriceGwei: string;
    multiplier: number;
    gasReserveWei: string;
    feeBps: number;
    platformFeeWei: string;
    claimPoolWei: string;
    refundAvailableAt: number;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) return;

    setLoading(true);
    setError("");

    try {
      const amountWei = toWei(totalAmount);
      if (amountWei === "0" || amountWei === "") {
        throw new Error("请输入有效的金额");
      }
      setWeiAmount(amountWei);

      const res = await preparePacket({
        chain,
        token,
        total_amount: amountWei,
        head_count: headCount,
        packet_type: packetType,
        sub_type: subType,
        password: packetType === "password" ? password : undefined,
        claim_mode: claimMode as any,
        end_time: endTime,
      });

      setPendingPacketId(res.packet_id);
      setPendingTx({
        to: res.transaction.to as `0x${string}`,
        data: res.transaction.data as `0x${string}`,
        value: res.transaction.value
          ? (BigInt(res.transaction.value) as any)
          : undefined,
      });
      setGasInfo({
        estimatedGasFeeWei: res.estimated_gas_fee_wei,
        estimatedGasFeeEth: res.estimated_gas_fee_eth,
        gasPriceGwei: res.gas_price_gwei,
        multiplier: res.gas_estimate_multiplier,
        gasReserveWei: res.suggested_gas_reserve_wei,
        feeBps: res.fee_bps,
        platformFeeWei: res.platform_fee_wei,
        claimPoolWei: res.claim_pool_wei,
        refundAvailableAt: res.refund_available_at,
      });
      setPendingPacketInfo({
        chain, token, total_amount: amountWei, head_count: headCount,
        packet_type: packetType, sub_type: subType, claim_mode: claimMode,
        password: packetType === "password" ? password : undefined,
        end_time: endTime, start_time: 0,
        gas_reserve_wei: res.suggested_gas_reserve_wei,
        gas_estimate_multiplier: res.gas_estimate_multiplier,
        fee_bps: res.fee_bps,
        platform_fee_wei: res.platform_fee_wei,
        claim_pool_wei: res.claim_pool_wei,
      });

      setStep("sign");
    } catch (err: any) {
      setError(err.message || "创建失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleSign() {
    if (!pendingTx) return;
    setLoading(true);
    setError("");
    try {
      const info = pendingPacketInfo || {};
      const isErc20 = info.token && info.token !== "native";

      // ERC20 需要先 approve 合约扣款
      if (isErc20 && info.token) {
        const amount = info.total_amount || weiAmount;
        // approve(address,uint256) selector: 0x095ea7b3
        const spenderPadded = pendingTx.to.replace("0x", "").padStart(64, "0");
        const amountPadded = BigInt(amount).toString(16).padStart(64, "0");
        const approveData = `0x095ea7b3${spenderPadded}${amountPadded}`;

        const approveHash = await sendTransactionAsync({
          to: info.token as `0x${string}`,
          data: approveData as `0x${string}`,
        });
        if (!approveHash) throw new Error("授权失败");
      }

      const txHash_: string = await sendTransactionAsync({
        to: pendingTx.to,
        data: pendingTx.data,
        value: pendingTx.value,
      })
      if (!txHash_) throw new Error("交易失败");

      const result = await createPacket({
        packet_id: pendingPacketId,
        tx_hash: txHash_,
        creator_address: address || "",
        chain: info.chain || chain,
        contract_address: pendingTx.to,
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
      const txHash = result.tx_hash || txHash_;

      const newPacket: SentPacket = {
        packetId: pendingPacketId,
        shareUrl: result.share_url,
        status: "active",
        totalAmount: result.claim_pool_wei || info.claim_pool_wei || weiAmount,
        claimedCount: 0,
        headCount,
        txHash,
      };
      setSentPackets((prev) => [newPacket, ...prev]);
      setStep("done");
      setTotalAmount("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "交易签名失败");
    } finally {
      setLoading(false);
    }
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
  }

  const handleChainChange = useCallback(
    async (newChain: string) => {
      setChain(newChain);
      setChainSwitchErr("");

      const cfg = getChainByName(newChain);
      if (!cfg || cfg.chainId <= 0) return;

      setSwitchingChain(true);
      try {
        await switchToChain(cfg.chainId, cfg.name, cfg.rpcUrl);
      } catch (err: any) {
        setChainSwitchErr(err?.message || "切换链失败");
      } finally {
        setSwitchingChain(false);
      }
    },
    [getChainByName, switchToChain]
  );

  if (!isConnected || !address) {
    return (
      <div style={cardStyle} className="text-center">
        <p style={{ fontSize: "14px", color: "#808080" }}>请先连接钱包</p>
      </div>
    );
  }

  if (chainsLoading) {
    return (
      <div style={cardStyle} className="text-center">
        <p style={{ fontSize: "14px", color: "#808080" }}>加载链配置中...</p>
      </div>
    );
  }

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

  const btnSecondary: React.CSSProperties = {
    ...btnPrimary,
    background: "#fff",
    color: "#171717",
    boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
  };

  const smallCardStyle: React.CSSProperties = {
    background: "#fafafa",
    borderRadius: "8px",
    padding: "16px",
  };

  return (
    <div className="space-y-6">
      {/* ======== 步骤1: 表单 ======== */}
      {step === "form" && (
        <form onSubmit={handleSubmit} style={cardStyle} className="space-y-4">
          <h3 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
            创建红包
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>链</label>
              <div style={{ position: "relative" }}>
                <select value={chain} onChange={(e) => handleChainChange(e.target.value)}
                  disabled={switchingChain}
                  style={{ ...inputStyle, appearance: "none" as any }}>
                  {chains.filter(c => c.chainId > 0).map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} {c.contractAddress ? `(${c.contractAddress.slice(0, 6)}...)` : ""}
                    </option>
                  ))}
                </select>
                {switchingChain && (
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#808080" }}>
                    切换中...
                  </span>
                )}
              </div>
              {chainSwitchErr && (
                <p style={{ fontSize: "12px", color: "#ff5b4f", marginTop: "4px" }}>{chainSwitchErr}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Token</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)}
                placeholder="native 或合约地址" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>总金额</label>
              <input type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="100" required style={inputStyle} />
              {totalAmount && (
                <p style={{ fontSize: "12px", color: "#808080", marginTop: "4px" }}>
                  ≈ {toWei(totalAmount).slice(0, 12)}... wei
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>领取人数</label>
              <input type="number" value={headCount} onChange={(e) => setHeadCount(Number(e.target.value))}
                min={1} max={1000} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>红包类型</label>
              <select value={packetType} onChange={(e) => setPacketType(e.target.value as PacketType)}
                style={{ ...inputStyle, appearance: "none" as any }}>
                <option value="normal">普通红包</option>
                <option value="password">口令红包</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>分配方式</label>
              <select value={subType} onChange={(e) => setSubType(e.target.value as SubType)}
                style={{ ...inputStyle, appearance: "none" as any }}>
                <option value="average">均分</option>
                <option value="random">随机</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>领取模式</label>
              <select value={claimMode} onChange={(e) => setClaimMode(e.target.value)}
                style={{ ...inputStyle, appearance: "none" as any }}>
                <option value="self">自领（用户付 gas）</option>
                <option value="proxy">代领（平台付 gas）</option>
              </select>
            </div>
            {packetType === "password" && (
              <div>
                <label style={labelStyle}>口令</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="设置领取口令" style={inputStyle} />
              </div>
            )}
          </div>

          {error && <p style={{ fontSize: "14px", color: "#ff5b4f" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={btnPrimary}
            className="transition-opacity hover:opacity-80 disabled:opacity-50">
            {loading ? "提交中..." : "创建红包"}
          </button>
        </form>
      )}

      {/* ======== 步骤2: 钱包签名 ======== */}
      {step === "sign" && (
        <div style={cardStyle} className="text-center space-y-4">
          <div style={{ fontSize: "32px" }}>✍️</div>
          <h3 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
            确认交易
          </h3>
          <p style={{ fontSize: "14px", color: "#808080" }}>
            请在钱包中确认签名以创建红包
          </p>

          {/* 金额明细 */}
          <div style={smallCardStyle} className="text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: "#808080" }}>红包金额</span>
              <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                {totalAmount} {token === "native" ? "ETH" : "Token"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#808080" }}>平台费 (千分之二)</span>
              <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                {gasInfo ? fromWei(gasInfo.platformFeeWei) : "0"} {token === "native" ? "ETH" : "Token"}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#808080", paddingLeft: "16px" }}>
              平台收取红包金额的千分之二，剩余金额进入领取池
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#808080" }}>领取池</span>
              <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                {gasInfo ? fromWei(gasInfo.claimPoolWei) : "0"} {token === "native" ? "ETH" : "Token"}
              </span>
            </div>

            {gasInfo && (
              <>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#808080" }}>预估 Gas 费</span>
                  <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {fromWei(gasInfo.estimatedGasFeeWei)} ETH
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#808080", paddingLeft: "16px" }} className="space-y-0.5">
                  <p>Gas Price: {gasInfo.gasPriceGwei} Gwei</p>
                  <p>估算倍数: {gasInfo.multiplier}x</p>
                </div>
                <div style={{ borderTop: "1px solid #ebebeb", paddingTop: "8px" }}
                  className="flex justify-between text-sm font-semibold">
                  <span style={{ color: "#808080" }}>总计扣款</span>
                  <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {fromWei(gasInfo.estimatedGasFeeWei)} ETH + {totalAmount} {token === "native" ? "ETH" : "Token"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 交易详情 */}
          <div style={{
            background: "#fafafa",
            borderRadius: "8px",
            padding: "12px",
            textAlign: "left",
            fontSize: "12px",
            fontFamily: "var(--font-geist-mono), monospace",
            color: "#808080",
            wordBreak: "break-all",
          }}>
            <p style={{ marginBottom: "4px" }}>
              <span style={{ color: "#808080" }}>合约:</span> {pendingTx?.to?.slice(0, 10)}...{pendingTx?.to?.slice(-6)}
            </p>
            <p style={{ marginBottom: "4px" }}>
              <span style={{ color: "#808080" }}>数据:</span> {pendingTx?.data?.slice(0, 66)}...
            </p>
            <p><span style={{ color: "#808080" }}>Value:</span> {pendingTx?.value?.toString() || "0"} wei</p>
          </div>

          {error && <p style={{ fontSize: "14px", color: "#ff5b4f" }}>{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep("form")} style={{ flex: 1, ...btnSecondary }}
              className="transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]">
              取消
            </button>
            <button onClick={handleSign} disabled={loading} style={{ flex: 1, ...btnPrimary }}
              className="transition-opacity hover:opacity-80 disabled:opacity-50">
              {loading ? "签名中..." : "确认签名"}
            </button>
          </div>
        </div>
      )}

      {/* ======== 步骤3: 完成 ======== */}
      {step === "done" && sentPackets.length > 0 && (
        <div style={{
          ...cardStyle,
          textAlign: "center",
          boxShadow: "rgba(34,197,94,0.15) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
        }} className="space-y-4">
          <div style={{ fontSize: "32px" }}>🎉</div>
          <h3 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
            红包已发送！
          </h3>
          <p style={{ fontSize: "12px", fontFamily: "var(--font-geist-mono), monospace", color: "#808080", wordBreak: "break-all" }}>
            Tx: {sentPackets[0].txHash}
          </p>
          <button onClick={() => { setStep("form"); setPendingTx(null); }}
            style={btnPrimary}
            className="transition-opacity hover:opacity-80">
            再发一个
          </button>
        </div>
      )}

      {/* 发送记录 */}
      {sentPackets.length > 0 && step !== "done" && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.32px", color: "#171717", marginBottom: "16px" }}>
            发送记录
          </h3>
          <div className="space-y-3">
            {sentPackets.map((pkt, i) => (
              <div key={i}
                className="flex items-center justify-between"
                style={smallCardStyle}>
                <div>
                  <p style={{ fontSize: "14px", color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {pkt.txHash?.slice(0, 10)}...
                  </p>
                  <p style={{ fontSize: "12px", color: "#808080" }}>
                    {fromWei(pkt.totalAmount)} · {pkt.claimedCount}/{pkt.headCount} 已领
                  </p>
                </div>
                <span style={{
                  fontSize: "12px",
                  padding: "0px 10px",
                  borderRadius: "9999px",
                  background: "#fafafa",
                  color: "#808080",
                  lineHeight: "24px",
                }}>
                  {pkt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
