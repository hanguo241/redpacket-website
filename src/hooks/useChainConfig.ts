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
            { name: "ETH", chainId: 1, rpcUrl: "", contractAddress: "" },
            { name: "BSC", chainId: 56, rpcUrl: "", contractAddress: "" },
            { name: "LOCAL", chainId: 31337, rpcUrl: "http://127.0.0.1:8545", contractAddress: "" },
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
