"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchChains, type ChainConfig } from "@/lib/api";

export interface ChainOption {
  name: string;
  chainId: number;
  rpcUrl: string;
  contractAddress: string;
}

export function useChainConfig() {
  const [chains, setChains] = useState<ChainOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetchChains();
        if (!cancelled) {
          setChains(
            res.chains
              .filter((c) => c.is_active)
              .map((c: ChainConfig) => ({
                name: c.chain,
                chainId: c.chain_id,
                rpcUrl: c.rpc_url,
                contractAddress: c.contract_address,
              }))
          );
        }
      } catch (err) {
        console.warn("Failed to fetch chain config, using defaults", err);
        if (!cancelled) {
          setChains([
            {
              name: "AVAX-FUJI",
              chainId: 43113,
              rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
              contractAddress: "0x7dc7013fA5bFd9d29323206D5759138494b31FeB",
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const getChainByName = useCallback(
    (name: string) => chains.find((c) => c.name === name) || null,
    [chains]
  );

  /** 判断是否为 EVM 链 (chainId > 0) */
  const isEvm = useCallback((chainId: number) => chainId > 0, []);

  return { chains, loading, getChainByName, isEvm };
}
