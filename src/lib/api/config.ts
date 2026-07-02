import { request } from "./client";

// ── 类型 ──

export interface ChainConfig {
  chain: string;
  chain_id: number;
  rpc_url: string;
  contract_address: string;
  explorer_url: string | null;
  is_active: boolean;
}

export interface TokenInfo {
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  is_native: boolean;
}

// ── API ──

export function fetchChains() {
  return request<{ chains: ChainConfig[] }>("/api/v1/config/chains");
}

export function fetchTokens(chain: string) {
  return request<{ chain: string; tokens: TokenInfo[] }>(
    `/api/v1/config/tokens?chain=${encodeURIComponent(chain)}`
  );
}

export function fetchGasConfig() {
  return request<{ config: Record<string, string> }>("/api/v1/config/gas");
}

export function fetchSettings() {
  return request<any>("/api/v1/admin/settings");
}

export function updateGasConfig(config: Record<string, string>) {
  return request<{ status: string }>("/api/v1/admin/gas-config", {
    method: "PUT",
    body: JSON.stringify({ config }),
  });
}

export function prepareFeeWithdrawTransaction(data: {
  chain: string;
  token: string;
  to: string;
  amount: string;
}) {
  return request<{
    transaction: { to: string; data: string; value: string };
    chain: string;
    chain_id: number;
    token: string;
    amount: string;
    recipient: string;
  }>("/api/v1/admin/fees/withdraw-transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
