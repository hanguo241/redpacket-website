"use client";

import { useEffect, useState, useRef } from "react";
import { fetchTokens, type TokenInfo } from "@/lib/api";
import { cn } from "@/lib/cn";

interface TokenSelectorProps {
  chain: string;
  value: string;
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTokens(chain)
      .then((res) => { if (!cancelled) setTokens(res.tokens || []); })
      .catch(() => { if (!cancelled) setTokens([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [chain]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false); setCustomMode(false); setSearch("");
      }
    }
    if (open) { document.addEventListener("mousedown", handleClick); return () => document.removeEventListener("mousedown", handleClick); }
  }, [open]);

  const selectedToken = tokens.find((t) => t.token_address === value);
  const isCustom = value && !selectedToken && value !== "native";

  function handleSelect(token: TokenInfo) {
    onChange(token.token_address, token); setOpen(false); setCustomMode(false); setSearch("");
  }

  function handleCustomSubmit() {
    const addr = customAddress.trim();
    if (!addr) return;
    onChange(addr, { token_address: addr, symbol: addr.slice(0, 6).toUpperCase() + "…", name: "Custom Token", decimals: 18, is_native: false });
    setOpen(false); setCustomMode(false); setCustomAddress(""); setSearch("");
  }

  const filtered = tokens.filter((t) =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.token_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-white px-4 py-3 font-sans text-base font-normal text-text-primary outline-none transition-[border-color,box-shadow] focus:border-magenta focus:shadow-[0_0_0_3px_rgba(255,55,199,0.1)]"
      >
        <span className="flex items-center gap-2">
          {selectedToken ? (
            <>
              <NativeDot isNative={selectedToken.is_native} />
              <span className="font-semibold text-text-primary">{selectedToken.symbol}</span>
            </>
          ) : isCustom ? (
            <>
              <span className="h-2 w-2 shrink-0 rounded-full bg-border" />
              <span className="font-mono text-xs text-text-primary">{value.slice(0, 6)}...{value.slice(-4)}</span>
              <span className="text-xs text-text-tertiary">自定义</span>
            </>
          ) : (
            <span className="text-text-placeholder">选择代币</span>
          )}
        </span>
        <span className={cn("text-xs text-text-tertiary transition-transform duration-150", open && "rotate-180")}>▾</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 flex max-h-[360px] flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="border-b border-border-light p-2">
            {!customMode ? (
              <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索代币或输入地址"
                className="w-full rounded-md border border-border bg-bg-subtle px-3 py-2 font-sans text-sm text-text-primary outline-none placeholder:text-text-placeholder" />
            ) : (
              <div className="flex gap-2">
                <input autoFocus type="text" value={customAddress} onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="输入合约地址 0x..."
                  className="box-border flex-1 rounded-md border border-border bg-bg-subtle px-3 py-2 font-mono text-xs text-text-primary outline-none placeholder:text-text-placeholder" />
                <button type="button" onClick={handleCustomSubmit} disabled={!customAddress.trim()}
                  className="cursor-pointer whitespace-nowrap rounded-md border-none bg-magenta px-3 py-2 font-sans text-sm font-semibold text-text-primary disabled:opacity-50">添加</button>
              </div>
            )}
          </div>

          <div className="overflow-auto flex-1">
            {loading && <p className="p-4 text-center text-xs text-text-tertiary">加载中...</p>}
            {!loading && filtered.length === 0 && !customMode && (
              <div className="p-4">
                <p className="mb-2 text-center text-xs text-text-tertiary">未找到代币</p>
                <button type="button" onClick={() => { setCustomMode(true); setSearch(""); }}
                  className="w-full cursor-pointer rounded-md border-none bg-magenta-overlay px-3 py-2 font-sans text-sm text-magenta">+ 添加自定义代币</button>
              </div>
            )}
            {!loading && filtered.map((token) => (
              <button key={token.token_address} type="button" onClick={() => handleSelect(token)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-left font-sans transition-colors duration-100 hover:bg-bg-subtle",
                  token.token_address === value ? "bg-magenta-overlay" : "bg-white"
                )}>
                <div className="flex items-center gap-2">
                  <NativeDot isNative={token.is_native} />
                  <span className="text-base font-semibold text-text-primary">{token.symbol}</span>
                </div>
                {token.token_address === value && <span className="text-xs text-magenta">✓</span>}
              </button>
            ))}
          </div>

          {!customMode && (
            <div className="border-t border-border-light p-2">
              <button type="button" onClick={() => { setCustomMode(true); setSearch(""); }}
                className="w-full cursor-pointer rounded-md border border-dashed border-border bg-transparent px-3 py-2 font-sans text-sm text-text-tertiary hover:text-text-primary">+ 添加自定义代币</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NativeDot({ isNative }: { isNative: boolean }) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
        isNative ? "bg-magenta-overlay text-magenta" : "bg-bg-subtle text-text-tertiary"
      )}
    >
      {isNative ? "⚡" : "🪙"}
    </span>
  );
}
