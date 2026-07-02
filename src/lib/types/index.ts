// ═══════════════════════════════════════════════════════════
// 共享类型 — 红包业务
// ═══════════════════════════════════════════════════════════

/** 红包类型 */
export type PacketType = "normal" | "password" | "condition";

/** 金额分配方式 */
export type SubType = "average" | "random";

/** 领取模式 */
export type ClaimMode = "self" | "proxy" | "both";

/** 创建红包流程状态 */
export type CreateFlowState = "form" | "confirm" | "pending" | "success";

/** 领取流程状态 */
export type ClaimFlowState = "idle" | "signing" | "sending" | "done";

/** 链选择选项 */
export interface ChainOption {
  name: string;
  chainId: number;
  rpcUrl: string;
  contractAddress: string;
}

/** 代币信息 */
export interface TokenInfo {
  token_address: string;
  symbol: string;
  name: string;
  decimals: number;
  is_native: boolean;
}
