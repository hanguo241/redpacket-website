// 后端 API 服务层 — 可通过 NEXT_PUBLIC_API_URL 环境变量配置
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============ 商户注册 ============

export function registerProject(data: {
  name: string;
  wallet_address: string;
  signature: string;
  website?: string;
  contact?: string;
}) {
  return request<{
    project_id: string;
    app_key: string;
    app_secret: string;
    message: string;
  }>("/api/v1/project/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ 红包: Step 1 — 获取待签名交易数据 ============

export interface PreparePacketRequest {
  chain: string;
  token: string;
  total_amount: string;
  head_count: number;
  packet_type: "normal" | "password" | "condition";
  sub_type: "average" | "random";
  password?: string;
  claim_mode?: "self" | "proxy" | "both";
  start_time?: number;
  end_time: number;
}

export interface TransactionData {
  to: string;
  data: string;
  value: string;
}

export interface PreparePacketResponse {
  packet_id: string;
  transaction: TransactionData;
  share_url: string;
  expire_at: number;
  estimated_gas_fee_wei: string;
  estimated_gas_fee_eth: string;
  gas_price_gwei: string;
  gas_estimate_multiplier: number;
  suggested_gas_reserve_wei: string;
  fee_bps: number;
  platform_fee_wei: string;
  claim_pool_wei: string;
  refund_available_at: number;
}

/** 第一步: 获取待签名交易数据, 不写 DB */
export function preparePacket(data: PreparePacketRequest) {
  return request<PreparePacketResponse>("/api/v1/packet/prepare", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ 红包: Step 2 — 签名后提交(广播+入库) ============

export interface CreatePacketResponse {
  packet_id: string;
  share_url: string;
  status: string;
  tx_hash?: string;
  gross_amount: string;
  platform_fee_wei: string;
  claim_pool_wei: string;
  fee_bps: number;
  refund_available_at: number;
}

/** 第二步: 前端签名后, 将 signed_rlp + 全部红包信息提交, 后端广播上链并写入 DB */
export function createPacket(data: Record<string, any>) {
  return request<CreatePacketResponse>("/api/v1/packet/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ 红包: 查询状态 ============

export interface PacketStatusResponse {
  packet_id: string;
  status: string;
  gross_amount: string;
  total_amount: string;
  platform_fee_wei: string;
  claimed_amount: string;
  remaining_amount: string;
  claimed_count: number;
  head_count: number;
  claim_mode: string;
  refund_available_at: number;
}

export function getPacketStatus(packetId: string) {
  return request<PacketStatusResponse>(`/api/v1/packet/${packetId}/status`);
}

// ============ Claim ============

export interface ClaimPrepareResponse {
  packet_id: string;
  amount: string;
  signature: string;
  nonce: number;
  deadline: number;
  transaction: TransactionData;
}

/** 获取领红包的签名 + 待签名交易数据 */
export function prepareClaim(data: {
  packet_id: string;
  user_address: string;
  proof?: { password?: string };
}) {
  return request<ClaimPrepareResponse>("/api/v1/claim/prepare", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** 领取后提交 tx_hash 确认 */
export function confirmClaim(data: {
  packet_id: string;
  recipient: string;
  tx_hash: string;
}) {
  return request<{ status: string; tx_hash: string }>("/api/v1/claim/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface ClaimSignResponse {
  packet_id: string;
  recipient: string;
  amount: string;
  signature: string;
  nonce: number;
  deadline: number;
}

export function requestClaimSign(
  packetId: string,
  userAddress: string,
  proof?: { password?: string; captcha_token?: string }
) {
  return request<ClaimSignResponse>("/api/v1/claim/sign", {
    method: "POST",
    body: JSON.stringify({
      packet_id: packetId,
      user_address: userAddress,
      proof,
    }),
  });
}

export interface ProxyClaimResponse {
  claim_id: string;
  tx_hash: string;
  status: string;
}

export function proxyClaim(data: {
  packet_id: string;
  recipient: string;
  amount: string;
  signature: string;
  nonce: number;
  deadline: number;
  user_authorization: string;
}) {
  return request<ProxyClaimResponse>("/api/v1/claim/proxy", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ 配置 ============

export interface ChainConfig {
  chain: string;
  chain_id: number;
  rpc_url: string;
  contract_address: string;
  explorer_url: string | null;
  is_active: boolean;
}

export function fetchChains() {
  return request<{ chains: ChainConfig[] }>("/api/v1/config/chains");
}

// ============ 统计 ============

export function getAdminStats() {
  return request<{
    total_packets: number;
    total_claimed_amount: string;
    total_projects: number;
    active_packets: number;
    total_platform_fees_wei: string;
  }>("/api/v1/admin/stats");
}
