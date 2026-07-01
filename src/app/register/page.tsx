"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors, useSignMessage } from "wagmi";
import { registerProject } from "@/lib/api";

type Step = "connect" | "form" | "sign" | "done";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  padding: "32px",
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

const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  background: "#fff",
  color: "#171717",
  boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px",
};

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
          <h1 style={{
            fontSize: "40px",
            fontWeight: 600,
            letterSpacing: "-2.4px",
            lineHeight: 1.2,
            color: "#171717",
            marginBottom: "0.5rem",
          }}>
            🔐 商户注册
          </h1>
          <p style={{ fontSize: "16px", color: "#4d4d4d" }}>
            连接钱包，创建你的 RedPacket 商户账号
          </p>
        </div>

        {/* 步骤: 连接钱包 */}
        {step === "connect" && (
          <div style={cardStyle} className="text-center">
            <p style={{ fontSize: "14px", color: "#808080", marginBottom: "24px" }}>
              首先，连接你的钱包
            </p>
            {metaMaskConnector && (
              <button
                onClick={() => connect({ connector: metaMaskConnector })}
                disabled={connectPending}
                style={btnPrimary}
                className="transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {connectPending ? "连接中..." : "连接 MetaMask"}
              </button>
            )}
            {isConnected && (
              <button
                onClick={() => setStep("form")}
                style={{ ...btnPrimary, marginTop: "16px", background: "#fff", color: "#171717", boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px" }}
                className="transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]"
              >
                已连接: {address?.slice(0, 6)}...{address?.slice(-4)} → 下一步
              </button>
            )}
          </div>
        )}

        {/* 步骤: 填写信息 */}
        {step === "form" && (
          <form onSubmit={handleSubmit} style={cardStyle} className="space-y-4">
            <p style={{ fontSize: "14px", color: "#808080", marginBottom: "8px" }}>
              钱包: <span style={{ color: "#171717", fontFamily: "var(--font-geist-mono), monospace" }}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button onClick={() => disconnect()} style={{ marginLeft: "8px", color: "#ff5b4f", fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}>
                更换
              </button>
            </p>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>项目名称 *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="输入你的 DApp 或项目名称" required style={inputStyle} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>项目网站</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mydapp.com（选填）" style={inputStyle} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#808080", marginBottom: "4px" }}>联系方式</label>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram / 邮箱（选填）" style={inputStyle} />
            </div>

            {error && <p style={{ fontSize: "14px", color: "#ff5b4f" }}>{error}</p>}

            <button type="submit" disabled={busy || !name.trim()}
              style={btnPrimary}
              className="transition-opacity hover:opacity-80 disabled:opacity-50">
              {busy ? "请求钱包签名..." : "提交注册"}
            </button>
          </form>
        )}

        {/* 步骤: 完成 */}
        {step === "done" && result && (
          <div style={{
            ...cardStyle,
            textAlign: "center",
            boxShadow: "rgba(34,197,94,0.15) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
          }} className="space-y-4">
            <div style={{ fontSize: "32px" }}>🎉</div>
            <h2 style={{ fontSize: "24px", fontWeight: 600, letterSpacing: "-0.96px", color: "#171717" }}>
              注册成功！
            </h2>
            <p style={{ fontSize: "14px", color: "#808080" }}>
              AppSecret <strong style={{ color: "#171717" }}>只显示一次</strong>，请立即保存
            </p>

            <div className="text-left space-y-3" style={{ background: "#fafafa", borderRadius: "8px", padding: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>AppKey</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "14px", color: "#171717", wordBreak: "break-all", background: "#fff", borderRadius: "6px", padding: "8px 12px", boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px" }}>
                  {result.app_key}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#808080", marginBottom: "4px" }}>AppSecret</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "14px", color: "#171717", wordBreak: "break-all", background: "#fff", borderRadius: "6px", padding: "8px 12px", boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px" }}>
                  {result.app_secret}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={copySecret}
                style={{ flex: 1, ...btnPrimary }}
                className="transition-opacity hover:opacity-80">
                {copied ? "✅ 已复制" : "📋 复制凭据"}
              </button>
              <a href="/docs/quickstart"
                style={{ flex: 1, ...btnSecondary }}
                className="transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]">
                📖 查看接入文档
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
