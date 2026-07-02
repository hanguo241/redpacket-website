import { request } from "./client";

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

export function getAdminStats() {
  return request<{
    total_packets: number;
    total_claimed_amount: string;
    total_projects: number;
    active_packets: number;
    total_platform_fees_wei: string;
  }>("/api/v1/admin/stats");
}
