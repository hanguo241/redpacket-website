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
    // 去掉空格
    const trimmed = amount.trim();
    if (!trimmed || trimmed === "0") return "0";
    const parts = trimmed.split(".");
    const intPart = parts[0];
    const decPart = (parts[1] || "").padEnd(18, "0").slice(0, 18);
    // 去掉前导零
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

export default function CreatePacket() {
  const { address, isConnected } = useAccount();
  const { chains, loading: chainsLoading, getChainByName } = useChainConfig();
  const { switchToChain } = useChainSwitch();
  const { sendTransactionAsync } = useSendTransaction()

  // 链切换状态
  const [switchingChain, setSwitchingChain] = useState(false);
  const [chainSwitchErr, setChainSwitchErr] = useState("");

  // 表单状态
  const [chain, setChain] = useState("");
  const [token, setToken] = useState("native");
  const [totalAmount, setTotalAmount] = useState("");
  const [headCount, setHeadCount] = useState(10);
  const [packetType, setPacketType] = useState<PacketType>("normal");
  const [subType, setSubType] = useState<SubType>("average");
  const [password, setPassword] = useState("");
  const [claimMode, setClaimMode] = useState("both");
  const [endTime, setEndTime] = useState(
    () => Math.floor(Date.now() / 1000) + 86400
  );

  // 默认链已初始化的标记
  const chainInitRef = useRef(false);

  // 链就绪后设置默认链
  useEffect(() => {
    if (!chain && chains.length > 0 && !chainInitRef.current) {
      chainInitRef.current = true;
      setChain(chains[0].name);
    }
  }, [chain, chains]);

  // 过程状态
  const [step, setStep] = useState<"form" | "sign" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [pendingPacketId, setPendingPacketId] = useState("");
  const [pendingPacketInfo, setPendingPacketInfo] = useState<any>(null);
  const [weiAmount, setWeiAmount] = useState("");
  const [sentPackets, setSentPackets] = useState<SentPacket[]>([]);

  // gas 估算信息
  const [gasInfo, setGasInfo] = useState<{
    estimatedGasFeeWei: string;
    estimatedGasFeeEth: string;
    gasPriceGwei: string;
    multiplier: number;
    gasReserveWei: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) return;

    setLoading(true);
    setError("");

    try {
      // 金额单位转换: 用户输入 ETH → 转为 wei 传给后端
      const amountWei = toWei(totalAmount);
      if (amountWei === "0" || amountWei === "") {
        throw new Error("请输入有效的金额");
      }
      setWeiAmount(amountWei);

      // 1. 获取待签名交易数据 (不写 DB)
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
      // 保存 gas 估算信息
      setGasInfo({
        estimatedGasFeeWei: res.estimated_gas_fee_wei,
        estimatedGasFeeEth: res.estimated_gas_fee_eth,
        gasPriceGwei: res.gas_price_gwei,
        multiplier: res.gas_estimate_multiplier,
        gasReserveWei: res.suggested_gas_reserve_wei,
      });
      // 保存红包信息供下一步 create 提交
      setPendingPacketInfo({
        chain, token, total_amount: amountWei, head_count: headCount,
        packet_type: packetType, sub_type: subType, claim_mode: claimMode,
        password: packetType === "password" ? password : undefined,
        end_time: endTime, start_time: 0,
        gas_reserve_wei: res.suggested_gas_reserve_wei,
        gas_estimate_multiplier: res.gas_estimate_multiplier,
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
    console.log("待签名交易数据:", pendingTx);
    try {
      // 2. 前端广播: eth_sendTransaction → 获取 txHash
      const txHash_: string =await sendTransactionAsync({
        to: pendingTx.to,
        data: pendingTx.data,
        value: pendingTx.value,
      })
      console.log("交易已发送，txHash:", txHash_);
      if (!txHash_) throw new Error("交易失败");

      // 3. 将红包信息 + txHash 提交后端记录
      const info = pendingPacketInfo || {};
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
      });
      const txHash = result.tx_hash || txHash_;

      // 4. 记录已发送的红包
      const newPacket: SentPacket = {
        packetId: pendingPacketId,
        shareUrl: `https://redpacket.com/claim/${pendingPacketId}`,
        status: "active",
        totalAmount: weiAmount,
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

  // 选择链时触发钱包切换/添加（必须在任何 return 之前定义）
  const handleChainChange = useCallback(
    async (newChain: string) => {
      console.log("切换到链:", newChain);
      setChain(newChain);
      setChainSwitchErr("");

      const cfg = getChainByName(newChain);
      console.log("链配置:", cfg);
      if (!cfg || cfg.chainId <= 0) return;

      setSwitchingChain(true);
      try {
        console.log("尝试切换到链ID:", cfg.chainId);
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
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-text-secondary">请先连接钱包</p>
      </div>
    );
  }

  if (chainsLoading) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-text-secondary">加载链配置中...</p>
      </div>
    );
  }

  

  return (
    <div className="space-y-6">
      {/* ======== 步骤1: 表单 ======== */}
      {step === "form" && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">创建红包</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">链</label>
              <div className="relative">
                <select value={chain} onChange={(e) => handleChainChange(e.target.value)}
                  disabled={switchingChain}
                  className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket disabled:opacity-50 appearance-none">
                  {chains.filter(c => c.chainId > 0).map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} {c.contractAddress ? `(${c.contractAddress.slice(0, 6)}...)` : ""}
                    </option>
                  ))}
                </select>
                {switchingChain && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold">
                    切换中...
                  </span>
                )}
              </div>
              {chainSwitchErr && (
                <p className="text-redpacket text-xs mt-1">{chainSwitchErr}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Token</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value)}
                placeholder="native 或合约地址"
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">总金额</label>
              <input type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="100" required
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket" />
              {totalAmount && (
                <p className="text-xs text-text-secondary mt-1">
                  ≈ {toWei(totalAmount).slice(0, 12)}... wei
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">领取人数</label>
              <input type="number" value={headCount} onChange={(e) => setHeadCount(Number(e.target.value))}
                min={1} max={1000}
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket" />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">红包类型</label>
              <select value={packetType} onChange={(e) => setPacketType(e.target.value as PacketType)}
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket">
                <option value="normal">普通红包</option>
                <option value="password">口令红包</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">分配方式</label>
              <select value={subType} onChange={(e) => setSubType(e.target.value as SubType)}
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket">
                <option value="average">均分</option>
                <option value="random">随机</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Gas 模式</label>
              <select value={claimMode} onChange={(e) => setClaimMode(e.target.value)}
                className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket">
                <option value="both">自领+代领</option>
                <option value="self">仅自领</option>
                <option value="proxy">仅代领</option>
              </select>
            </div>
            {packetType === "password" && (
              <div>
                <label className="block text-sm text-text-secondary mb-1">口令</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="设置领取口令"
                  className="w-full rounded-lg bg-surface-dark border border-border px-3 py-2 text-white text-sm focus:outline-none focus:border-redpacket" />
              </div>
            )}
          </div>

          {error && <p className="text-redpacket text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-redpacket py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50">
            {loading ? "提交中..." : "创建红包"}
          </button>
        </form>
      )}

      {/* ======== 步骤2: 钱包签名 ======== */}
      {step === "sign" && (
        <div className="glass rounded-2xl p-6 text-center space-y-4">
          <div className="text-4xl">✍️</div>
          <h3 className="text-lg font-semibold text-white">确认交易</h3>
          <p className="text-text-secondary text-sm">
            请在钱包中确认签名以创建红包
          </p>

          {/* 金额明细 */}
          <div className="bg-surface-dark rounded-lg p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">红包金额</span>
              <span className="text-white font-mono">
                {totalAmount} {token === "native" ? "ETH" : "Token"}
              </span>
            </div>
            {gasInfo && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">预估 Gas 费</span>
                  <span className="text-white font-mono">
                    {fromWei(gasInfo.estimatedGasFeeWei)} ETH
                  </span>
                </div>
                <div className="text-xs text-text-secondary pl-4 space-y-0.5">
                  <p>Gas Price: {gasInfo.gasPriceGwei} Gwei</p>
                  <p>估算倍数: {gasInfo.multiplier}x</p>
                </div>
                <div className="border-t border-border/50 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-text-secondary">总计扣款</span>
                  <span className="text-white font-mono">
                    {fromWei(gasInfo.estimatedGasFeeWei)} ETH + {totalAmount} {token === "native" ? "ETH" : "Token"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 交易详情 */}
          <div className="bg-surface-dark rounded-lg p-3 text-left text-xs font-mono text-text-secondary break-all">
            <p className="mb-1"><span className="text-text-secondary">合约:</span> {pendingTx?.to?.slice(0, 10)}...{pendingTx?.to?.slice(-6)}</p>
            <p className="mb-1"><span className="text-text-secondary">数据:</span> {pendingTx?.data?.slice(0, 66)}...</p>
            <p><span className="text-text-secondary">Value:</span> {pendingTx?.value?.toString() || "0"} wei</p>
          </div>

          {error && <p className="text-redpacket text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 rounded-full glass py-3 text-sm font-semibold text-white hover:bg-surface-card-hover transition-colors">
              取消
            </button>
            <button onClick={handleSign} disabled={loading}
              className="flex-1 rounded-full bg-redpacket py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50">
              {loading ? "签名中..." : "确认签名"}
            </button>
          </div>
        </div>
      )}

      {/* ======== 步骤3: 完成 ======== */}
      {step === "done" && sentPackets.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-green-500/30 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-lg font-semibold text-white">红包已发送！</h3>
          <p className="text-xs font-mono text-text-secondary break-all">
            Tx: {sentPackets[0].txHash}
          </p>
          <button onClick={() => { setStep("form"); setPendingTx(null); }}
            className="w-full rounded-full bg-redpacket py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors">
            再发一个
          </button>
        </div>
      )}

      {/* 发送记录 */}
      {sentPackets.length > 0 && step !== "done" && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">发送记录</h3>
          <div className="space-y-3">
            {sentPackets.map((pkt, i) => (
              <div key={i}
                className="flex items-center justify-between bg-surface-dark rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm text-white font-mono">
                    {pkt.txHash?.slice(0, 10)}...
                  </p>
                  <p className="text-xs text-text-secondary">
                    {fromWei(pkt.totalAmount)} · {pkt.claimedCount}/{pkt.headCount} 已领
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
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
