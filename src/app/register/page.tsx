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
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="mx-auto max-w-xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-[40px] font-semibold tracking-[-2.4px] leading-[1.2] text-[#171717] mb-2">
            🔐 商户注册
          </h1>
          <p className="text-base text-[#4d4d4d]">
            连接钱包，创建你的 RedPacket 商户账号
          </p>
        </div>

        {/* 步骤: 连接钱包 */}
        {step === "connect" && (
          <div className="bg-white rounded-xl p-8 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px,rgba(0,0,0,0.04)_0px_8px_8px_-8px,#fafafa_0px_0px_0px_1px] text-center">
            <p className="text-sm text-[#808080] mb-6">首先，连接你的钱包</p>
            {metaMaskConnector && (
              <button
                onClick={() => connect({ connector: metaMaskConnector })}
                disabled={connectPending}
                className="w-full px-5 py-2.5 rounded-[6px] text-sm font-medium leading-[1.43] bg-[#171717] text-white border-none cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {connectPending ? "连接中..." : "连接 MetaMask"}
              </button>
            )}
            {isConnected && (
              <button
                onClick={() => setStep("form")}
                className="w-full px-5 py-2.5 rounded-[6px] text-sm font-medium leading-[1.43] bg-white text-[#171717] border-none cursor-pointer mt-4 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]"
              >
                已连接: {address?.slice(0, 6)}...{address?.slice(-4)} → 下一步
              </button>
            )}
          </div>
        )}

        {/* 步骤: 填写信息 */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px,rgba(0,0,0,0.04)_0px_8px_8px_-8px,#fafafa_0px_0px_0px_1px] space-y-4">
            <p className="text-sm text-[#808080] mb-2">
              钱包: <span className="text-[#171717] font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button onClick={() => disconnect()} className="ml-2 text-[#ff5b4f] text-xs bg-none border-none cursor-pointer">
                更换
              </button>
            </p>

            <div>
              <label className="block text-[13px] text-[#808080] mb-1">项目名称 *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="输入你的 DApp 或项目名称" required
                className="w-full px-3 py-2 rounded-[6px] text-sm text-[#171717] bg-white border-none outline-none font-sans shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]" />
            </div>

            <div>
              <label className="block text-[13px] text-[#808080] mb-1">项目网站</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mydapp.com（选填）"
                className="w-full px-3 py-2 rounded-[6px] text-sm text-[#171717] bg-white border-none outline-none font-sans shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]" />
            </div>

            <div>
              <label className="block text-[13px] text-[#808080] mb-1">联系方式</label>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram / 邮箱（选填）"
                className="w-full px-3 py-2 rounded-[6px] text-sm text-[#171717] bg-white border-none outline-none font-sans shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]" />
            </div>

            {error && <p className="text-sm text-[#ff5b4f]">{error}</p>}

            <button type="submit" disabled={busy || !name.trim()}
              className="w-full px-5 py-2.5 rounded-[6px] text-sm font-medium leading-[1.43] bg-[#171717] text-white border-none cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50">
              {busy ? "请求钱包签名..." : "提交注册"}
            </button>
          </form>
        )}

        {/* 步骤: 完成 */}
        {step === "done" && result && (
          <div className="bg-white rounded-xl p-8 text-center space-y-4 shadow-[rgba(34,197,94,0.15)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px,rgba(0,0,0,0.04)_0px_8px_8px_-8px,#fafafa_0px_0px_0px_1px]">
            <div className="text-[32px]">🎉</div>
            <h2 className="text-2xl font-semibold tracking-[-0.96px] text-[#171717]">
              注册成功！
            </h2>
            <p className="text-sm text-[#808080]">
              AppSecret <strong className="text-[#171717]">只显示一次</strong>，请立即保存
            </p>

            <div className="text-left space-y-3 bg-[#fafafa] rounded-lg p-4">
              <div>
                <div className="text-xs text-[#808080] mb-1">AppKey</div>
                <div className="font-mono text-sm text-[#171717] break-all bg-white rounded-[6px] px-3 py-2 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">
                  {result.app_key}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#808080] mb-1">AppSecret</div>
                <div className="font-mono text-sm text-[#171717] break-all bg-white rounded-[6px] px-3 py-2 shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">
                  {result.app_secret}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={copySecret}
                className="flex-1 px-5 py-2.5 rounded-[6px] text-sm font-medium leading-[1.43] bg-[#171717] text-white border-none cursor-pointer transition-opacity hover:opacity-80">
                {copied ? "✅ 已复制" : "📋 复制凭据"}
              </button>
              <a href="/docs/quickstart"
                className="flex-1 px-5 py-2.5 rounded-[6px] text-sm font-medium leading-[1.43] bg-white text-[#171717] border-none cursor-pointer text-center no-underline shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]">
                📖 查看接入文档
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
