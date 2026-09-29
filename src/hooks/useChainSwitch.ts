"use client";

import { useCallback } from "react";

// EIP-3085: wallet_addEthereumChain
// EIP-3326: wallet_switchEthereumChain

/** EVM 链的原生币信息 */
const NATIVE_CURRENCIES: Record<number, { symbol: string; decimals: number }> = {
  1: { symbol: "ETH", decimals: 18 },
  56: { symbol: "BNB", decimals: 18 },
  137: { symbol: "POL", decimals: 18 },
  31337: { symbol: "ETH", decimals: 18 },
  11155111: { symbol: "ETH", decimals: 18 },
  43113: { symbol: "AVAX", decimals: 18 },
  43114: { symbol: "AVAX", decimals: 18 },
};

/** 区块浏览器 — 不传给钱包，钱包里点交易详情会打不开 */
const EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  56: "https://bscscan.com",
  137: "https://polygonscan.com",
  43113: "https://testnet.snowtrace.io",
  43114: "https://snowtrace.io",
};

/**
 * 使用 window.ethereum (EIP-1193) 直接切换/添加链。
 * 不依赖 wagmi 的 useSwitchChain，因为后端链列表是动态的。
 */
export function useChainSwitch() {
  const getProvider = useCallback((): any => {
    if (typeof window === "undefined") return null;
    return (window as any).ethereum;
  }, []);

  const switchToChain = useCallback(
    async (chainId: number, chainName: string, rpcUrl: string) => {
      const provider = getProvider();
      if (!provider) {
        throw new Error("No Ethereum provider found");
      }

      const hexChainId = `0x${chainId.toString(16)}`;

      // 1. 尝试切换
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });
        return; // 成功
      } catch (switchError: any) {
        // 4902 = chain not added yet
        if (switchError.code === 4902) {
          const currency = NATIVE_CURRENCIES[chainId] || {
            symbol: "ETH",
            decimals: 18,
          };
          const explorer = EXPLORERS[chainId];
          // 2. 添加链后再切换
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexChainId,
                chainName: chainName,
                nativeCurrency: {
                  name: currency.symbol,
                  symbol: currency.symbol,
                  decimals: currency.decimals,
                },
                rpcUrls: [rpcUrl],
                ...(explorer ? { blockExplorerUrls: [explorer] } : {}),
              },
            ],
          });
        } else {
          // 用户拒绝或其他错误
          throw switchError;
        }
      }
    },
    [getProvider]
  );

  /**
   * 确认钱包就在目标链上：不在就切过去，切不动就抛错。
   * 直接问钱包 eth_chainId，不看 React state —— state 有渲染延迟，不能作为发交易前的依据。
   */
  const ensureChain = useCallback(
    async (chainId: number, chainName: string, rpcUrl: string) => {
      const provider = getProvider();
      if (!provider) throw new Error("未检测到钱包");
      const readChainId = async () => Number(await provider.request({ method: "eth_chainId" }));
      if ((await readChainId()) === chainId) return;
      await switchToChain(chainId, chainName, rpcUrl);
      if ((await readChainId()) !== chainId) {
        throw new Error(`请把钱包切换到 ${chainName}（chainId ${chainId}）后再确认交易`);
      }
    },
    [getProvider, switchToChain]
  );

  return { switchToChain, ensureChain };
}
