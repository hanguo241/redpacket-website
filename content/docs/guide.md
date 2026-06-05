# 接入指南

本文档详细说明如何将 RedPacket 红包功能接入你的项目。

---

## 第一步：注册项目方

调用注册接口获取 AppKey 和 AppSecret，用于后续 API 请求的鉴权。

```bash
curl -X POST https://api.redpacket.com/api/v1/project/register \
  -H "Content-Type: application/json" \
  -d '{"name": "My DApp"}'
```

响应示例：

```json
{
  "project_id": "uuid",
  "app_key": "a1b2c3d4...",
  "app_secret": "e5f6g7h8...",
  "message": "Registration successful..."
}
```

> ⚠️ **重要**: AppSecret 只会在注册时返回一次，请妥善保存。

## 第二步：创建红包

```json
POST /api/v1/packet/prepare
Content-Type: application/json

{
  "chain": "ETH",
  "token": "native",
  "total_amount": "1000000000000000000",
  "head_count": 10,
  "packet_type": "normal",
  "sub_type": "average",
  "claim_mode": "both",
  "end_time": 1735689600
}
```

## 支持的链

| 链 | Chain ID | 类型 |
|---|----------|------|
| Ethereum (ETH) | 1 | EVM |
| BSC | 56 | EVM |
| AB-Core | 123 | EVM |
| AB-iOT | 456 | EVM |

## 注意事项

- **金额单位** — 所有金额以 wei 为单位（1 ETH = 10^18 wei）
- **签名有效期** — claim 签名默认 30 分钟过期
- **手续费** — 每笔 claim 按比例扣除手续费，默认 1%
