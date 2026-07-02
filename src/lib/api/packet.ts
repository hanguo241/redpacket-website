import { request } from "./client";

// ── 类型 ──

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

// ── API ──

export function preparePacket(data: PreparePacketRequest) {
  return request<PreparePacketResponse>("/api/v1/packet/prepare", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createPacket(data: Record<string, any>) {
  return request<CreatePacketResponse>("/api/v1/packet/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getPacketStatus(packetId: string) {
  return request<PacketStatusResponse>(`/api/v1/packet/${packetId}/status`);
}
