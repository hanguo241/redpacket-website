import { http, createConfig } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";

/**
 * Wagmi 配置 — 仅用于钱包连接。
 * 对外展示的链列表由后端 GET /api/v1/config/chains 提供，当前上线的是 Avalanche Fuji。
 *
 * 只配置 AVAX-FUJI：钱包停在其他链时 wagmi 直接拒绝发交易，
 * 避免带 value 的交易被发到错误链上（那是真金白银的损失）。
 */
export const config = createConfig({
  chains: [avalancheFuji],
  connectors: [metaMask(), injected()],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

/** 后端链名 → wagmi chainId 映射（以后端 chain 字段为准） */
export const CHAIN_NAME_TO_ID: Record<string, number> = {
  "AVAX-FUJI": 43113,
  AVAX: 43114,
  ETH: 1,
  BSC: 56,
};

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
