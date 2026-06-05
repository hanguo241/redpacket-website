"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors, useSignMessage } from "wagmi";
import { registerProject } from "@/lib/api";

type Step = "connect" | "form" | "sign" | "done";

export default function RegisterPage() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { signMessageAsync } = useSignMessage();

  const [step, setStep] = useState<Step>("connect");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ app_key: string; app_secret: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const metaMaskConnector = connectors.find(
    (c) => c.id === "metaMaskSDK" || c.id === "io.metamask"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address || !name.trim()) return;
    setError("");
    setStep("sign");
    setBusy(true);

    try {
      const msg = `RedPacket Register: ${address}`;
      const signature = await signMessageAsync({ message: msg });

      const res = await registerProject({
        name: name.trim(),
        wallet_address: address,
        signature,
        website: website.trim() || undefined,
        contact: contact.trim() || undefined,
      });

      setResult({ app_key: res.app_key, app_secret: res.app_secret });
      setStep("done");
    } catch (err: any) {
      setError(err.message || "注册失败");
      setStep("form");
    } finally {
      setBusy(false);
    }
  }

  function copySecret() {
    if (!result) return;
    navigator.clipboard.writeText(`AppKey: ${result.app_key}\nAppSecret: ${result.app_secret}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔐 商户注册</h1>
          <p className="text-text-secondary">连接钱包，创建你的 RedPacket 商户账号</p>
        </div>

        {/* 步骤: 连接钱包 */}
        {step === "connect" && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-text-secondary mb-6">首先，连接你的钱包</p>
            {metaMaskConnector && (
              <button
                onClick={() => connect({ connector: metaMaskConnector })}
                disabled={connectPending}
                className="w-full rounded-full bg-redpacket px-6 py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {connectPending ? "连接中..." : "连接 MetaMask"}
              </button>
            )}
            {isConnected && (
              <button
                onClick={() => setStep("form")}
                className="mt-4 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                已连接: {address?.slice(0, 6)}...{address?.slice(-4)} → 下一步
              </button>
            )}
          </div>
        )}

        {/* 步骤: 填写信息 */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-4" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-text-secondary mb-2">
              钱包: <span className="text-white font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} className="ml-2 text-redpacket text-xs">更换</button>
            </p>

            <div>
              <label className="block text-sm text-text-secondary mb-1">项目名称 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入你的 DApp 或项目名称"
                required
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">项目网站</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mydapp.com（选填）"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">联系方式</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram / 邮箱（选填）"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy || !name.trim()}
              className="w-full rounded-full bg-redpacket px-6 py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy ? "请求钱包签名..." : "提交注册"}
            </button>
          </form>
        )}

        {/* 步骤: 完成 */}
        {step === "done" && result && (
          <div className="rounded-2xl p-8 text-center space-y-4" style={{ background: "#1a1a2e", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-bold text-white">注册成功！</h2>
            <p className="text-sm text-text-secondary">
              AppSecret <strong className="text-redpacket">只显示一次</strong>，请立即保存
            </p>

            <div className="text-left space-y-3 bg-[#0D0D0D] rounded-lg p-4">
              <div>
                <div className="text-xs text-text-secondary mb-1">AppKey</div>
                <div className="font-mono text-sm text-white break-all bg-[#1a1a2e] rounded px-3 py-2">{result.app_key}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary mb-1">AppSecret</div>
                <div className="font-mono text-sm text-white break-all bg-[#1a1a2e] rounded px-3 py-2">{result.app_secret}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copySecret}
                className="flex-1 rounded-full bg-redpacket px-6 py-3 text-sm font-semibold text-white hover:bg-redpacket-dark transition-colors cursor-pointer"
              >
                {copied ? "✅ 已复制" : "📋 复制凭据"}
              </button>
              <a
                href="/docs/quickstart"
                className="flex-1 rounded-full px-6 py-3 text-sm font-semibold text-center text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                📖 查看接入文档
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
