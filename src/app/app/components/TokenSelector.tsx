"use client";

import { useEffect, useState, useRef } from "react";
import { fetchTokens, type TokenInfo } from "@/lib/api";
import {
  colors,
  radius,
  spacing,
  typography,
  input,
  cardEmbed,
} from "../design";

interface TokenSelectorProps {
  chain: string;
  value: string; // 当前选中的 token_address
  onChange: (tokenAddress: string, tokenInfo?: TokenInfo) => void;
}

export default function TokenSelector({ chain, value, onChange }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const [search, setSearch] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // 加载代币列表
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTokens(chain)
      .then((res) => {
        if (!cancelled) setTokens(res.tokens || []);
      })
      .catch(() => {
        if (!cancelled) setTokens([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [chain]);

  // 点击外部关闭
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCustomMode(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  // 当前选中的代币信息
  const selectedToken = tokens.find((t) => t.token_address === value);
  const isCustom = value && !selectedToken && value !== "native";

  function handleSelect(token: TokenInfo) {
    onChange(token.token_address, token);
    setOpen(false);
    setCustomMode(false);
    setSearch("");
  }

  function handleCustomSubmit() {
    const addr = customAddress.trim();
    if (!addr) return;
    onChange(addr, {
      token_address: addr,
      symbol: addr.slice(0, 6).toUpperCase() + "…",
      name: "Custom Token",
      decimals: 18,
      is_native: false,
    });
    setOpen(false);
    setCustomMode(false);
    setCustomAddress("");
    setSearch("");
  }

  // 搜索过滤
  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.token_address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* 触发器按钮 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          ...input,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          paddingRight: spacing.px12,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.px8,
          }}
        >
          {selectedToken ? (
            <>
              <NativeDot isNative={selectedToken.is_native} />
              <span style={{ fontWeight: typography.fontWeight.emphasis, color: colors.textPrimary }}>
                {selectedToken.symbol}
              </span>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textTertiary }}>
                {selectedToken.name}
              </span>
            </>
          ) : isCustom ? (
            <>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: colors.textDisabled, flexShrink: 0,
              }} />
              <span style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.small, color: colors.textPrimary }}>
                {value.slice(0, 6)}...{value.slice(-4)}
              </span>
              <span style={{ fontSize: typography.fontSize.small, color: colors.textTertiary }}>
                自定义
              </span>
            </>
          ) : (
            <span style={{ color: colors.textPlaceholder }}>选择代币</span>
          )}
        </span>
        <span style={{
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.15s",
          color: colors.textTertiary,
          fontSize: "12px",
        }}>
          ▾
        </span>
      </button>

      {/* 下拉面板 */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: colors.white,
            borderRadius: radius.md,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
            maxHeight: "360px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 搜索/输入 */}
          <div style={{ padding: spacing.px8, borderBottom: `1px solid ${colors.borderLight}` }}>
            {!customMode ? (
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索代币或输入地址"
                style={{
                  width: "100%",
                  padding: `${spacing.px8} ${spacing.px12}`,
                  borderRadius: radius.sm,
                  border: `1px solid ${colors.border}`,
                  fontSize: typography.fontSize.button,
                  fontFamily: typography.fontFamily.sans,
                  outline: "none",
                  color: colors.textPrimary,
                  background: colors.bgSubtle,
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <div style={{ display: "flex", gap: spacing.px8 }}>
                <input
                  autoFocus
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="输入合约地址 0x..."
                  style={{
                    flex: 1,
                    padding: `${spacing.px8} ${spacing.px12}`,
                    borderRadius: radius.sm,
                    border: `1px solid ${colors.border}`,
                    fontSize: typography.fontSize.small,
                    fontFamily: typography.fontFamily.mono,
                    outline: "none",
                    color: colors.textPrimary,
                    background: colors.bgSubtle,
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  disabled={!customAddress.trim()}
                  style={{
                    padding: `${spacing.px8} ${spacing.px12}`,
                    borderRadius: radius.sm,
                    background: colors.magenta,
                    color: colors.textPrimary,
                    border: "none",
                    fontSize: typography.fontSize.button,
                    fontFamily: typography.fontFamily.sans,
                    cursor: "pointer",
                    fontWeight: typography.fontWeight.emphasis,
                    whiteSpace: "nowrap",
                  }}
                  className="disabled:opacity-50"
                >
                  添加
                </button>
              </div>
            )}
          </div>

          {/* 列表 */}
          <div style={{ overflow: "auto", flex: 1 }}>
            {loading && (
              <p style={{ padding: spacing.px16, textAlign: "center", fontSize: typography.fontSize.small, color: colors.textTertiary }}>
                加载中...
              </p>
            )}

            {!loading && filtered.length === 0 && !customMode && (
              <div style={{ padding: spacing.px16 }}>
                <p style={{ fontSize: typography.fontSize.small, color: colors.textTertiary, marginBottom: spacing.px8, textAlign: "center" }}>
                  未找到代币
                </p>
                <button
                  type="button"
                  onClick={() => { setCustomMode(true); setSearch(""); }}
                  style={{
                    width: "100%",
                    padding: `${spacing.px8} ${spacing.px12}`,
                    borderRadius: radius.sm,
                    background: colors.magentaOverlay,
                    color: colors.magenta,
                    border: "none",
                    fontSize: typography.fontSize.button,
                    fontFamily: typography.fontFamily.sans,
                    cursor: "pointer",
                  }}
                >
                  + 添加自定义代币
                </button>
              </div>
            )}

            {!loading && filtered.map((token) => (
              <button
                key={token.token_address}
                type="button"
                onClick={() => handleSelect(token)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: `${spacing.px8} ${spacing.px12}`,
                  border: "none",
                  background: token.token_address === value ? colors.magentaOverlay : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: typography.fontFamily.sans,
                  transition: "background 0.1s",
                }}
                className="hover:bg-[#f5f5f5]"
              >
                <div style={{ display: "flex", alignItems: "center", gap: spacing.px8 }}>
                  <NativeDot isNative={token.is_native} />
                  <div>
                    <div style={{ fontSize: typography.fontSize.body, fontWeight: typography.fontWeight.emphasis, color: colors.textPrimary }}>
                      {token.symbol}
                    </div>
                    <div style={{ fontSize: typography.fontSize.small, color: colors.textTertiary }}>
                      {token.name}
                    </div>
                  </div>
                </div>
                {token.token_address === value && (
                  <span style={{ color: colors.magenta, fontSize: typography.fontSize.small }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* 底部: 切换自定义模式 */}
          {!customMode && (
            <div style={{ padding: spacing.px8, borderTop: `1px solid ${colors.borderLight}` }}>
              <button
                type="button"
                onClick={() => { setCustomMode(true); setSearch(""); }}
                style={{
                  width: "100%",
                  padding: `${spacing.px8} ${spacing.px12}`,
                  borderRadius: radius.sm,
                  background: "transparent",
                  color: colors.textTertiary,
                  border: `1px dashed ${colors.border}`,
                  fontSize: typography.fontSize.button,
                  fontFamily: typography.fontFamily.sans,
                  cursor: "pointer",
                }}
                className="hover:text-[#131313] hover:border-[#131313]"
              >
                + 添加自定义代币
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 原生代币标识圆点
function NativeDot({ isNative }: { isNative: boolean }) {
  return (
    <span
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        flexShrink: 0,
        background: isNative ? "rgba(255, 55, 199, 0.12)" : colors.bgSubtle,
        color: isNative ? colors.magenta : colors.textTertiary,
      }}
    >
      {isNative ? "⚡" : "🪙"}
    </span>
  );
}
