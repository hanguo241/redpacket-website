# 快速开始

5 分钟接入红包功能。

---

## 第一步：注册商户

打开 [RedPacket 商户后台](/register)，连接钱包，填写项目信息：

| 字段 | 说明 |
|------|------|
| 项目名称 | 你的 DApp 或项目名称 |
| 钱包地址 | 用于接收手续费和签名验证 |
| 官网地址 | 可选，用于展示 |

注册成功后获取 **AppKey** 和 **AppSecret**：

```
AppKey:    sk_live_2a3b4c5d6e7f8g9h
AppSecret: ss_live_9h8g7f6e5d4c3b2a
```

> ⚠️ **AppSecret 只显示一次**，请妥善保存在服务端，不要泄露给前端。

---

## 第二步：API 请求签名

所有商户 API 请求需要使用 AppSecret 进行 HMAC-SHA256 签名。

### 签名规则

```
待签名字符串 = timestamp + request_body
签名结果   = HMAC-SHA256(AppSecret, 待签名字符串)
最终签名   = hex(签名结果)
```

### 请求头

| Header | 说明 |
|--------|------|
| `X-App-Key` | 商户 AppKey |
| `X-Signature` | HMAC 签名结果 |
| `X-Timestamp` | 当前 Unix 毫秒时间戳 |

### 代码示例

```javascript
// Node.js 示例
const crypto = require('crypto');

function signRequest(appSecret, body, timestamp) {
  const data = timestamp + (body ? JSON.stringify(body) : '');
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(data);
  return hmac.digest('hex');
}

// 使用
const timestamp = Date.now().toString();
const body = { chain: "ETH", token: "native", ... };
const signature = signRequest(appSecret, body, timestamp);

// 发起请求
fetch('https://api.redpacket.com/api/v1/packet/prepare', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-App-Key': appKey,
    'X-Signature': signature,
    'X-Timestamp': timestamp,
  },
  body: JSON.stringify(body),
});
```

```python
# Python 示例
import hmac, hashlib, json, time

def sign_request(app_secret: str, body: dict, timestamp: str) -> str:
    data = timestamp + (json.dumps(body, separators=(',', ':')) if body else '')
    return hmac.new(
        app_secret.encode(),
        data.encode(),
        hashlib.sha256
    ).hexdigest()

# 使用
timestamp = str(int(time.time() * 1000))
body = {"chain": "ETH", "token": "native"}
signature = sign_request(app_secret, body, timestamp)
```

```go
// Go 示例
import (
  "crypto/hmac"
  "crypto/sha256"
  "encoding/hex"
  "encoding/json"
)

func SignRequest(secret string, body interface{}, ts string) string {
  data, _ := json.Marshal(body)
  mac := hmac.New(sha256.New, []byte(secret))
  mac.Write([]byte(ts + string(data)))
  return hex.EncodeToString(mac.Sum(nil))
}
```

---

## 第三步：调用 API

签名完成后，即可调用红包创建、查询等接口。

完整接口定义请参考 [API 参考](/docs/api)。

---

## 第四步：前端集成

将后端返回的交易数据交给用户钱包签名：

```javascript
// 前端 - 用户连接钱包后
const txHash = await ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: userAddress,
    to: transaction.to,
    data: transaction.data,
    value: transaction.value,
  }]
});

// 将 txHash 提交到你的后端
await fetch('/api/v1/packet/create', {
  method: 'POST',
  headers: { /* HMAC 签名 */ },
  body: JSON.stringify({
    packet_id: packetId,
    tx_hash: txHash,
    creator_address: userAddress,
    chain: "ETH",
    ...
  }),
});
```

---

## 第五步：用户领取

生成分享链接，用户点击后即可领取红包。

分享链接格式：
```
https://redpacket.com/claim/{packet_id}
```

用户打开链接 → 连接钱包 → 输入口令（如需）→ 领取成功。
