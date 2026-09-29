"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getPacketStatus, prepareClaim, confirmClaim, proxyClaim } from "@/lib/api";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useChainSwitch } from "@/hooks/useChainSwitch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, FormTitle } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Panel, PanelInset } from "@/components/ui/Panel";
import { Spinner } from "@/components/ui/Spinner";
import { fromWei } from "./CreatePacket";
import ErrorBanner from "./ErrorBanner";

// ── Status Badge ──
function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, "success" | "info" | "error" | "neutral"> = {
    active: "success", completed: "success", pending: "info",
    expired: "error", refunded: "error", failed: "error",
  };
  const labels: Record<string, string> = {
    active: "进行中", completed: "已完成", pending: "待确认",
    expired: "已过期", refunded: "已退款", failed: "失败",
  };
  const label = labels[status] || status;

  return <Badge tone={tones[status] || "neutral"}>{label}</Badge>;
}

// ── 领取记录 ──
function ClaimHistory({ history }: { history: ClaimRecord[] }) {
  if (history.length === 0) return null;

  return (
    <div className="mt-5">
      <h4 className="m-0 mb-3 font-sans text-sm font-semibold text-text-primary">领取记录</h4>
      <div className="flex flex-col gap-2">
        {history.map((r, i) => (
          <PanelInset key={i} className="flex items-center justify-between">
            <div>
              <p className="m-0 mb-0.5 font-mono text-sm text-text-primary">
                {r.packetId.slice(0, 8)}...
              </p>
              <p className="m-0 font-sans text-xs text-text-tertiary">
                {fromWei(r.amount)} · {r.txHash?.slice(0, 10)}...
              </p>
            </div>
            <Badge tone="success">{r.status}</Badge>
          </PanelInset>
        ))}
      </div>
    </div>
  );
}

interface ClaimRecord {
  packetId: string; amount: string; status: string; txHash?: string; timestamp: number;
}

// ── 主组件 ──
export default function ClaimView({ initialPacketId }: { initialPacketId?: string | null }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chains } = useChainConfig();
  const { ensureChain } = useChainSwitch();

  const [packetId, setPacketId] = useState(initialPacketId || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [claimHistory, setClaimHistory] = useState<ClaimRecord[]>([]);
  const [claimStatus, setClaimStatus] = useState<"idle" | "signing" | "sending" | "done">("idle");

  useEffect(() => {
    if (initialPacketId) {
      setLoading(true); setError("");
      getPacketStatus(initialPacketId)
        .then(s => setResult(s))
        .catch(e => setError(e.message || "查询失败"))
        .finally(() => setLoading(false));
    }
  }, [initialPacketId]);

  function extractPacketId(input: string): string {
    const t = input.trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(t)) return t;
    const m = t.match(/\/claim\/([0-9a-f-]+)/i);
    return m ? m[1] : t;
  }

  /** 按目标合约地址反查它属于哪条链，确保钱包在正确链上再发交易 */
  async function ensureChainForContract(contractAddress: string) {
    const target = contractAddress.toLowerCase();
    const cfg = chains.find(
      (c) => c.contractAddress && c.contractAddress.toLowerCase() === target
    );
    if (cfg && cfg.chainId > 0) await ensureChain(cfg.chainId, cfg.name, cfg.rpcUrl);
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const id = extractPacketId(packetId);
    if (!id) return;
    setLoading(true); setError(""); setResult(null); setClaimStatus("idle");
    try { setResult(await getPacketStatus(id)); }
    catch (err: any) { setError(err.message || "查询失败"); }
    finally { setLoading(false); }
  }

  async function handleClaim() {
    if (!isConnected || !address || !result) return;
    setError(""); setClaimStatus("signing");
    try {
      const prep = await prepareClaim({ packet_id: result.packet_id, user_address: address, proof: password ? { password } : undefined });
      setClaimStatus("sending");
      const provider = (window as any).ethereum;
      if (!provider) throw new Error("No Ethereum provider");
      // 护栏：发错链 = 白付 gas 且领不到红包
      await ensureChainForContract(prep.transaction.to);
      const txHash: string = await provider.request({ method: "eth_sendTransaction", params: [{ from: address, to: prep.transaction.to, data: prep.transaction.data }] });
      if (!txHash) throw new Error("交易失败");
      try { await confirmClaim({ packet_id: result.packet_id, recipient: address, tx_hash: txHash }); } catch { /* ignore */ }
      setClaimHistory(p => [{ packetId: result.packet_id, amount: prep.amount, status: "confirmed", txHash, timestamp: Date.now() }, ...p]);
      setClaimStatus("done"); setResult(null); setPacketId(""); setPassword("");
    } catch (err: any) { setError(err.message || "领取失败"); setClaimStatus("idle"); }
  }

  async function handleProxyClaim() {
    if (!isConnected || !address || !result) return;
    setError(""); setClaimStatus("signing");
    try {
      const userSignature = await signMessageAsync({ message: `RedPacket: authorize claim ${result.packet_id}` });
      setClaimStatus("sending");
      const res = await proxyClaim({ packet_id: result.packet_id, user_address: address, user_signature: userSignature, proof: password ? { password } : undefined });
      setClaimHistory(p => [{ packetId: result.packet_id, amount: res.amount, status: "confirmed", txHash: res.tx_hash, timestamp: Date.now() }, ...p]);
      setClaimStatus("done"); setResult(null); setPacketId(""); setPassword("");
    } catch (err: any) { setError(err.message || "代领失败"); setClaimStatus("idle"); }
  }

  const showPassword = result?.packet_type === "password";
  const claimMode = result?.claim_mode || "both";
  const canClaim = result?.status === "active" && isConnected;

  return (
    <div>
      {/* ── 查询表单 ── */}
      <Panel>
        <form onSubmit={handleLookup}>
          <FormTitle title="领取红包" description="输入红包 ID 或分享链接" />
          <div className="mb-4">
            <Input type="text" value={packetId} onChange={(e) => setPacketId(e.target.value)}
              placeholder="粘贴红包链接或输入 ID" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "查询中..." : "查询红包"}
          </Button>
        </form>
      </Panel>

      {error && <div className="mt-3"><ErrorBanner message={error} onDismiss={() => setError("")} /></div>}

      {result && (
        <Panel className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-base font-semibold text-text-primary">🧧 红包信息</span>
            <StatusBadge status={result.status} />
          </div>

          <PanelInset>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["领取池", fromWei(result.total_amount)],
                ["已领 / 总人数", `${result.claimed_count} / ${result.head_count}`],
                ["总额", fromWei(result.gross_amount || result.total_amount)],
                ["Gas 模式", claimMode === "self" ? "自领" : claimMode === "proxy" ? "代领" : "自领/代领"],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <p className="m-0 mb-0.5 font-sans text-xs text-text-tertiary">{l as string}</p>
                  <p className="m-0 font-mono text-sm text-text-primary">{v as string}</p>
                </div>
              ))}
            </div>
          </PanelInset>

          {canClaim && (
            <div className="mt-4">
              {showPassword && (
                <Field label="口令" className="mb-3">
                  <Input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入口令" />
                </Field>
              )}

              {claimStatus !== "idle" && claimStatus !== "done" && (
                <div className="text-center mb-4">
                  <Spinner size="sm" className="mb-2" />
                  <p className="m-0 font-sans text-xs text-text-tertiary">
                    {claimStatus === "signing" ? "请签名授权…" : "发送交易中…"}
                  </p>
                </div>
              )}

              {(claimMode === "self" || claimMode === "both") && claimStatus === "idle" && (
                <Button variant="secondary" className="mb-2" onClick={handleClaim}>
                  自领（自己付 gas）
                </Button>
              )}
              {(claimMode === "proxy" || claimMode === "both") && claimStatus === "idle" && (
                <Button onClick={handleProxyClaim}>代领（平台付 gas）</Button>
              )}
              {claimStatus === "done" && <ErrorBanner message="领取成功！" type="success" />}
            </div>
          )}

          {!isConnected && (
            <p className="mt-4 text-center font-sans text-xs text-text-tertiary">请先连接钱包</p>
          )}
        </Panel>
      )}

      <ClaimHistory history={claimHistory} />
    </div>
  );
}
