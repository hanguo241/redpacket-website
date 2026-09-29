"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { preparePacket, createPacket } from "@/lib/api";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useChainSwitch } from "@/hooks/useChainSwitch";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, FormTitle } from "@/components/ui/Field";
import { AmountInput, Input } from "@/components/ui/Input";
import { Panel, PanelInset } from "@/components/ui/Panel";
import { Spinner } from "@/components/ui/Spinner";
import TokenSelector from "./TokenSelector";
import SelectField from "./SelectField";
import ErrorBanner from "./ErrorBanner";

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
  packetType, setPacketType,
  subType, setSubType,
  password, setPassword,
  claimMode, setClaimMode,
  endTime, setEndTime,
}: {
  packetType: PacketType; setPacketType: (v: PacketType) => void;
  subType: SubType; setSubType: (v: SubType) => void;
  password: string; setPassword: (v: string) => void;
  claimMode: string; setClaimMode: (v: string) => void;
  endTime: number; setEndTime: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 border-none bg-transparent p-0 font-sans text-sm text-text-tertiary transition-colors hover:text-text-primary"
      >
        ⚙️ 高级选项
        <span className={cn("transition-transform duration-150", open && "rotate-180")}>▾</span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex gap-3">
            <Field label="类型" className="flex-1">
              <SelectField value={packetType} onChange={(v) => setPacketType(v as PacketType)}
                options={[{ value: "normal", label: "普通红包" }, { value: "password", label: "口令红包" }]} />
            </Field>
            <Field label="分配" className="flex-1">
              <SelectField value={subType} onChange={(v) => setSubType(v as SubType)}
                options={[{ value: "average", label: "均分" }, { value: "random", label: "随机" }]} />
            </Field>
          </div>

          <Field label="领取模式">
            <SelectField value={claimMode} onChange={(v) => setClaimMode(v)}
              options={[
                { value: "self", label: "自领（自己付 gas）" },
                { value: "proxy", label: "代领（平台付 gas）" },
                { value: "both", label: "两种模式" },
              ]} />
          </Field>

          <Field label="过期时间">
            <SelectField value={endTime} onChange={(v) => setEndTime(Number(v))}
              options={[
                { value: Math.floor(Date.now() / 1000) + 3600, label: "1 小时后" },
                { value: Math.floor(Date.now() / 1000) + 7200, label: "2 小时后" },
                { value: Math.floor(Date.now() / 1000) + 14400, label: "4 小时后" },
                { value: Math.floor(Date.now() / 1000) + 43200, label: "12 小时后" },
                { value: Math.floor(Date.now() / 1000) + 86400, label: "24 小时后" },
              ]} />
          </Field>

          {packetType === "password" && (
            <Field label="口令">
              <Input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="设置领取口令" />
            </Field>
          )}
        </div>
      )}
    </div>
  );
}

// ── 费用详情面板 ──
function FeeDetails({ gasInfo, token }: {
  gasInfo: {
    platformFeeWei: string; claimPoolWei: string;
    estimatedGasFeeWei: string; estimatedGasFeeEth: string;
    gasPriceGwei: string; multiplier: number;
  } | null;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  if (!gasInfo) return null;

  return (
    <PanelInset>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent p-0 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-sm text-text-secondary">费用明细</span>
        <span className="font-mono text-sm text-magenta">
          {gasInfo.estimatedGasFeeEth} ETH
          <span className={cn("ml-1 inline-block transition-transform duration-150", open && "rotate-180")}>
            ▾
          </span>
        </span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {[
            ["平台费", `${fromWei(gasInfo.platformFeeWei)} ${token === "native" ? "ETH" : "Token"}`],
            ["领取池", `${fromWei(gasInfo.claimPoolWei)} ${token === "native" ? "ETH" : "Token"}`],
            ["Gas Price", `${gasInfo.gasPriceGwei} Gwei`],
            ["估算倍数", `${gasInfo.multiplier}x`],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between text-xs">
              <span className="text-text-tertiary">{label as string}</span>
              <span className="font-mono text-text-primary">{value as string}</span>
            </div>
          ))}
        </div>
      )}
    </PanelInset>
  );
}

// ── 发送成功卡片 ──
function SuccessView({ shareUrl, txHash, totalAmount, token, onReset }: {
  shareUrl: string; txHash?: string; totalAmount: string; token: string; onReset: () => void;
}) {
  return (
    <div className="text-center">
      <div className="text-[48px] mb-4 leading-none">🎉</div>
      <h3 className="m-0 mb-2 font-sans text-2xl font-semibold text-text-primary">红包已发送！</h3>
      <p className="mb-6 font-sans text-base text-text-secondary">
        {fromWei(totalAmount)} {token === "native" ? "ETH" : "Token"}
      </p>

      <PanelInset className="mb-5 flex items-center justify-between gap-2 text-left">
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs text-text-tertiary">
          {shareUrl}
        </span>
        <Button variant="ghost" size="sm" fullWidth={false} onClick={() => navigator.clipboard.writeText(shareUrl)}>
          复制链接
        </Button>
      </PanelInset>

      {txHash && (
        <p className="mb-5 break-all font-mono text-xs text-text-tertiary">
          Tx: {txHash.slice(0, 10)}...{txHash.slice(-6)}
        </p>
      )}

      <Button onClick={onReset}>再发一个</Button>
    </div>
  );
}

// ── Pending 状态 ──
function PendingView({ step }: { step: "approve" | "create" }) {
  return (
    <div className="text-center py-8">
      <Spinner size="sm" className="mb-5" />
      <p className="mb-2 font-sans text-base text-text-primary">
        {step === "approve" ? "授权代币中…" : "创建红包中…"}
      </p>
      <p className="font-sans text-xs text-text-tertiary">请在钱包中确认交易</p>
    </div>
  );
}

// ── 主组件 ──
export default function CreatePacket() {
  const { address, isConnected } = useAccount();
  const { chains, loading: chainsLoading, getChainByName } = useChainConfig();
  const { switchToChain, ensureChain } = useChainSwitch();
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
  const [symbol, setSymbol] = useState("ETH");
  const [flow, setFlow] = useState<FlowState>("form");
  const [error, setError] = useState("");
  const [pendingStep, setPendingStep] = useState<"approve" | "create">("create");
  const [successData, setSuccessData] = useState<{ shareUrl: string; txHash?: string; totalAmount: string } | null>(null);
  const [prepared, setPrepared] = useState<{
    packetId: string; tx: { to: `0x${string}`; data: `0x${string}`; value: bigint | undefined };
    gasInfo: any; packetInfo: any;
  } | null>(null);
  const [needsApprove, setNeedsApprove] = useState(false);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const chainInitRef = useRef(false);
  useEffect(() => {
    if (!chain && chains.length > 0 && !chainInitRef.current) {
      chainInitRef.current = true;
      setChain(chains[0].name);
    }
  }, [chain, chains]);

  const weiAmount = toWei(totalAmount);

  useEffect(() => {
    if (flow !== "confirm" || !prepared) return;
    const p = prepared;
    const tokenAddr = p.packetInfo?.token;
    if (!tokenAddr || tokenAddr === "native") { setNeedsApprove(false); return; }
    const amount = p.packetInfo?.total_amount || weiAmount || "0";

    async function checkAllowance() {
      setAllowanceLoading(true);
      try {
        const provider = (window as any).ethereum;
        if (!provider) { setNeedsApprove(true); return; }
        const owner = address?.toLowerCase() || "";
        const spender = (p.tx.to as string).toLowerCase();
        const data = `0xdd62ed3e${owner.padStart(66, "0")}${spender.padStart(66, "0")}`;
        const result = await provider.request({ method: "eth_call", params: [{ to: tokenAddr, data }, "latest"] });
        setNeedsApprove(BigInt(amount) > BigInt(result || "0"));
      } catch { setNeedsApprove(true); }
      finally { setAllowanceLoading(false); }
    }
    checkAllowance();
  }, [flow, prepared, address, weiAmount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) return;
    setError("");
    if (weiAmount === "0" || weiAmount === "") { setError("请输入有效的金额"); return; }

    try {
      const res = await preparePacket({
        chain, token, total_amount: weiAmount, head_count: headCount,
        packet_type: packetType, sub_type: subType,
        password: packetType === "password" ? password : undefined,
        claim_mode: claimMode as any, end_time: endTime,
      });
      setPrepared({
        packetId: res.packet_id,
        tx: { to: res.transaction.to as `0x${string}`, data: res.transaction.data as `0x${string}`,
          value: res.transaction.value ? BigInt(res.transaction.value) : undefined },
        gasInfo: {
          platformFeeWei: res.platform_fee_wei, claimPoolWei: res.claim_pool_wei,
          estimatedGasFeeWei: res.estimated_gas_fee_wei, estimatedGasFeeEth: res.estimated_gas_fee_eth,
          gasPriceGwei: res.gas_price_gwei, multiplier: res.gas_estimate_multiplier,
        },
        packetInfo: {
          chain, token, total_amount: weiAmount, head_count: headCount,
          packet_type: packetType, sub_type: subType, claim_mode: claimMode,
          password: packetType === "password" ? password : undefined,
          end_time: endTime, start_time: 0,
          gas_reserve_wei: res.suggested_gas_reserve_wei,
          gas_estimate_multiplier: res.gas_estimate_multiplier,
          fee_bps: res.fee_bps, platform_fee_wei: res.platform_fee_wei, claim_pool_wei: res.claim_pool_wei,
        },
      });
      setFlow("confirm");
    } catch (err: any) { setError(err.message || "创建失败"); }
  }

  async function handleConfirm() {
    if (!prepared) return;
    setError("");
    setFlow("pending");
    try {
      // 护栏：交易必须发在红包所属的那条链上。
      // 钱包停在别的链时，同一笔带 value 的交易会打到错误链上 —— 钱就没了。
      const chainCfg = getChainByName(chain);
      if (chainCfg && chainCfg.chainId > 0) {
        await ensureChain(chainCfg.chainId, chainCfg.name, chainCfg.rpcUrl);
      }

      const info = prepared.packetInfo;
      const isErc20 = info.token && info.token !== "native";

      if (isErc20 && info.token) {
        setPendingStep("approve");
        const spenderPadded = prepared.tx.to.replace("0x", "").padStart(64, "0");
        const amountPadded = BigInt(info.total_amount || weiAmount).toString(16).padStart(64, "0");
        const approveHash = await sendTransactionAsync({
          to: info.token as `0x${string}`, data: `0x095ea7b3${spenderPadded}${amountPadded}` as `0x${string}`,
        });
        if (!approveHash) throw new Error("授权失败");
      }

      setPendingStep("create");
      const txHash = await sendTransactionAsync({ to: prepared.tx.to, data: prepared.tx.data, value: prepared.tx.value });
      if (!txHash) throw new Error("交易失败");

      const result = await createPacket({
        packet_id: prepared.packetId, tx_hash: txHash, creator_address: address || "",
        chain: info.chain || chain, contract_address: prepared.tx.to,
        token: info.token || "native", total_amount: info.total_amount || weiAmount,
        head_count: info.head_count || headCount, packet_type: info.packet_type || packetType,
        sub_type: info.sub_type || subType, claim_mode: info.claim_mode || claimMode,
        password: info.password, start_time: info.start_time || 0, end_time: info.end_time || endTime,
        gas_reserve_wei: info.gas_reserve_wei || "0", gas_estimate_multiplier: info.gas_estimate_multiplier || 1.2,
        fee_bps: info.fee_bps || 20,
      });

      setSuccessData({
        shareUrl: result.share_url, txHash: result.tx_hash || txHash,
        totalAmount: result.gross_amount || info.total_amount || weiAmount,
      });
      setFlow("success");
    } catch (err: any) { setError(err.message || "交易签名失败"); setFlow("confirm"); }
  }

  function handleReset() { setFlow("form"); setPrepared(null); setSuccessData(null); setError(""); setTotalAmount(""); setPassword(""); }

  async function handleChainChange(newChain: string) {
    setChain(newChain);
    const cfg = getChainByName(newChain);
    if (cfg && cfg.chainId > 0) { try { await switchToChain(cfg.chainId, cfg.name, cfg.rpcUrl); } catch { /* 忽略 */ } }
  }

  if (chainsLoading) {
    return (
      <Panel>
        <p className="text-center text-base text-text-tertiary">加载链配置中...</p>
      </Panel>
    );
  }

  return (
    <Panel>
      {flow === "success" && successData && (
        <SuccessView shareUrl={successData.shareUrl} txHash={successData.txHash}
          totalAmount={successData.totalAmount} token={token} onReset={handleReset} />
      )}

      {flow === "pending" && <PendingView step={pendingStep} />}

      {flow === "confirm" && prepared && (
        <div>
          <FormTitle title="确认红包" description="请在钱包中确认交易" />

          <PanelInset>
            {[
              ["红包金额", `${totalAmount} ${token === "native" ? "ETH" : "Token"}`, true],
              ["领取人数", `${headCount} 人`, false],
              ["领取模式", claimMode === "self" ? "自领" : claimMode === "proxy" ? "代领" : "两种模式", false],
            ].map(([l, v, bold]) => (
              <div key={l as string} className="flex justify-between mb-2 last:mb-0">
                <span className="font-sans text-xs text-text-tertiary">{l as string}</span>
                <span className={cn(bold ? "text-base font-semibold" : "text-xs", "font-mono text-text-primary")}>
                  {v as string}
                </span>
              </div>
            ))}
          </PanelInset>

          <div className="mt-3 mb-5"><FeeDetails gasInfo={prepared.gasInfo} token={token} /></div>
          {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

          <div className="flex flex-col gap-2">
            <Button onClick={handleConfirm} disabled={allowanceLoading}>
              {allowanceLoading ? "检查授权中…" : needsApprove ? "授权并发送" : "确认并发送"}
            </Button>
            <Button variant="ghost" onClick={() => setFlow("form")}>
              取消，返回修改
            </Button>
          </div>
        </div>
      )}

      {flow === "form" && (
        <form onSubmit={handleSubmit}>
          <FormTitle title="创建红包" description="填写信息，创建链上红包" className="mb-6" />

          <Field label="链" className="mb-4">
            <SelectField value={chain} onChange={(v) => handleChainChange(v)}
              options={chains.filter(c => c.chainId > 0).map(c => ({ value: c.name, label: c.name }))} />
          </Field>

          <Field label="代币" className="mb-4">
            <TokenSelector chain={chain} value={token} onChange={(addr, info) => { setToken(addr); if (info) setSymbol(info.symbol); }} />
          </Field>

          <Field label="总金额" className="mb-4">
            <AmountInput type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.0" required symbol={symbol} />
          </Field>

          <Field label="领取人数" className="mb-4">
            <Input type="number" value={headCount} onChange={(e) => setHeadCount(Number(e.target.value))}
              min={1} max={1000} />
          </Field>

          <div className="mb-5">
            <AdvancedOptions packetType={packetType} setPacketType={setPacketType}
              subType={subType} setSubType={setSubType} password={password} setPassword={setPassword}
              claimMode={claimMode} setClaimMode={setClaimMode} endTime={endTime} setEndTime={setEndTime} />
          </div>

          {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
          <Button type="submit">创建红包</Button>
        </form>
      )}
    </Panel>
  );
}
