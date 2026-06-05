import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";

/**
 * Wagmi 配置 — 仅用于钱包连接。
 * 支持的链列表从后端 GET /api/v1/config/chains 获取。
 */
export const config = createConfig({
  chains: [mainnet],
  connectors: [metaMask(), injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

/** 后端链名 → wagmi chainId 映射 */
export const CHAIN_NAME_TO_ID: Record<string, number> = {
  ETH: 1,
  BSC: 56,
  "AB-Core": 123,
  "AB-iOT": 456,
};

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
