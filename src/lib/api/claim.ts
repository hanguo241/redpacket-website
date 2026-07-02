import { request } from "./client";
import type { TransactionData } from "./packet";

// ── 类型 ──

export interface ClaimPrepareResponse {
  packet_id: string;
  amount: string;
  signature: string;
  nonce: number;
  deadline: number;
  transaction: TransactionData;
}

export interface ClaimSignResponse {
  packet_id: string;
  recipient: string;
  amount: string;
  signature: string;
  nonce: number;
  deadline: number;
}

export interface ProxyClaimResponse {
  status: string;
  tx_hash: string;
  packet_id: string;
  amount: string;
}

// ── API ──

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

export function proxyClaim(data: {
  packet_id: string;
  user_address: string;
  user_signature: string;
  proof?: { password: string };
}) {
  return request<ProxyClaimResponse>("/api/v1/claim/proxy", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
