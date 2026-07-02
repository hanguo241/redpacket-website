// ═══════════════════════════════════════════════════════════
// API 层 — 向后兼容入口
// ═══════════════════════════════════════════════════════════
// 所有功能已按域拆分到 lib/api/ 目录下。
// 此文件保留全部导出，确保现有 import 语句不失效。
// 新代码请直接 import 子模块：import { preparePacket } from "@/lib/api/packet"
// ═══════════════════════════════════════════════════════════

// 商户注册 & 统计
export { registerProject, getAdminStats } from "./api/project";
export type {} from "./api/project";

// 红包 CRUD
export {
  preparePacket,
  createPacket,
  getPacketStatus,
} from "./api/packet";
export type {
  PreparePacketRequest,
  TransactionData,
  PreparePacketResponse,
  CreatePacketResponse,
  PacketStatusResponse,
} from "./api/packet";

// 领取
export {
  prepareClaim,
  confirmClaim,
  requestClaimSign,
  proxyClaim,
} from "./api/claim";
export type {
  ClaimPrepareResponse,
  ClaimSignResponse,
  ProxyClaimResponse,
} from "./api/claim";

// 配置 & 代币
export {
  fetchChains,
  fetchTokens,
  fetchGasConfig,
  fetchSettings,
  updateGasConfig,
  prepareFeeWithdrawTransaction,
} from "./api/config";
export type {
  ChainConfig,
  TokenInfo,
} from "./api/config";
