# API 参考

所有接口均返回 JSON 格式。商户 API 需携带 HMAC 签名头。

---

## 通用

### 鉴权头

商户 API 请求必须携带以下 Header：

| Header | 说明 |
|--------|------|
| `X-App-Key` | 商户 AppKey |
| `X-Signature` | HMAC-SHA256 签名 |
| `X-Timestamp` | Unix 毫秒时间戳 |

签名规则：`hex(HMAC-SHA256(AppSecret, timestamp + body))`

### 错误响应

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "具体错误信息"
  }
}
```

| 状态码 | code | 说明 |
|--------|------|------|
| 400 | BAD_REQUEST | 参数错误 |
| 401 | UNAUTHORIZED | 认证失败 / 签名错误 |
| 404 | NOT_FOUND | 资源不存在 |
| 500 | INTERNAL_ERROR | 服务端错误 |

---

## 商户管理

### 注册商户

```http
POST /api/v1/project/register
Content-Type: application/json

{
  "name": "My DApp"
}
```

**响应**

```json
{
  "project_id": "uuid",
  "app_key": "sk_live_...",
  "app_secret": "ss_live_...",
  "message": "保存好 AppSecret，不会再次显示"
}
```

---

## 红包管理

### 获取交易数据

获取待用户签名的合约调用数据。

```http
POST /api/v1/packet/prepare
X-App-Key: sk_live_xxx
X-Signature: abc123...
X-Timestamp: 1700000000000

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

**参数说明**

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| chain | string | 是 | - | ETH / BSC / LOCAL |
| token | string | 是 | - | "native" 或 ERC20 合约地址 |
| total_amount | string | 是 | - | 金额，单位为 wei |
| head_count | int | 是 | - | 红包份数 |
| packet_type | string | 是 | - | normal / password |
| sub_type | string | 是 | - | average / random |
| password | string | 否 | - | 口令（password 类型必填）|
| claim_mode | string | 否 | "both" | self / proxy / both |
| start_time | int | 否 | 0 | 领取开始时间戳 |
| end_time | int | 是 | - | 过期时间戳 |

**响应**

```json
{
  "packet_id": "uuid",
  "transaction": {
    "to": "0xContractAddress",
    "data": "0x...",
    "value": "1000000000000000000"
  },
  "share_url": "https://redpacket.com/claim/uuid",
  "expire_at": 1735689600
}
```

---

### 确认红包

用户签名上链后，将交易信息提交到后端记录。后端会自动从链上事件中提取 `onchain_packet_id`。

```http
POST /api/v1/packet/create
X-App-Key: sk_live_xxx
X-Signature: abc123...
X-Timestamp: 1700000000000

{
  "packet_id": "uuid-from-prepare",
  "tx_hash": "0x...",
  "creator_address": "0xUserAddress",
  "chain": "ETH",
  "contract_address": "0xContractAddress",
  "token": "native",
  "total_amount": "1000000000000000000",
  "head_count": 10,
  "packet_type": "normal",
  "sub_type": "average",
  "claim_mode": "both",
  "end_time": 1735689600
}
```

---

### 查询红包状态

```http
GET /api/v1/packet/{packet_id}/status
```

**响应**

```json
{
  "packet_id": "uuid",
  "status": "active",
  "total_amount": "1000000000000000000",
  "claimed_amount": "200000000000000000",
  "remaining_amount": "800000000000000000",
  "claimed_count": 2,
  "head_count": 10,
  "claim_mode": "both"
}
```

| 状态 | 说明 |
|------|------|
| pending | 待确认（交易未上链） |
| active | 进行中，可领取 |
| completed | 已领完 |
| expired | 已过期 |
| refunded | 已退款 |

---

## 领取管理

### 获取 Claim 签名

验证条件（口令等）后，返回 EIP-712 签名和待签名交易数据。

```http
POST /api/v1/claim/prepare

{
  "packet_id": "uuid",
  "user_address": "0xRecipient",
  "proof": {
    "password": "my-password"
  }
}
```

**响应**

```json
{
  "amount": "100000000000000000",
  "signature": "0x...",
  "nonce": 12345,
  "deadline": 1735691400,
  "transaction": {
    "to": "0xContractAddress",
    "data": "0x..."
  }
}
```

前端拿到 `transaction` 后直接发起 `eth_sendTransaction` → 用户钱包签名 → 上链。

---

### 确认领取

```http
POST /api/v1/claim/confirm

{
  "packet_id": "uuid",
  "recipient": "0xRecipientAddress",
  "tx_hash": "0x..."
}
```

---

## 配置查询

### 支持的链列表

```http
GET /api/v1/config/chains
```

**响应**

```json
{
  "chains": [
    {
      "chain": "ETH",
      "chain_id": 1,
      "rpc_url": "https://...",
      "contract_address": "0x...",
      "is_active": true
    }
  ]
}
```

---

## 完整调用流程

```
商户后端                            前端 (用户浏览器)                 区块链
   │                                      │                          │
   ├─ POST /packet/prepare ──────────────→│                          │
   │←─ { transaction, packet_id } ───────│                          │
   │                                      ├─ eth_sendTransaction ──→│
   │                                      │←─ txHash ──────────────│
   ├─ POST /packet/create ───────────────→│                          │
   │   { tx_hash, packet_id, ... }       │                          │
   │                                      │                          │
   │              ← 分享红包链接 ─────────│                          │
   │                                      │                          │
   │← 用户点击链接 ──────────────────────│                          │
   ├─ POST /claim/prepare ──────────────→│                          │
   │←─ { signature, transaction } ──────│                          │
   │                                      ├─ eth_sendTransaction ──→│
   │                                      │←─ txHash ──────────────│
   ├─ POST /claim/confirm ──────────────→│                          │
```
