import Link from "next/link";

const plans = [
  {
    name: "自领模式",
    price: "0.2%",
    unit: "每笔红包金额",
    description: "用户自己付 gas，创建时收取平台费",
    features: [
      "用户连接钱包自行 claim",
      "无额外平台成本",
      "适合有 gas 的存量用户",
    ],
    highlighted: false,
  },
  {
    name: "代领模式",
    price: "0.2%",
    unit: "每笔红包金额",
    description: "平台代领，gas 准备金按实际使用扣减",
    features: [
      "用户无需持有 native token",
      "零 gas 领取体验",
      "gas 准备金未用完可退回",
      "适合新用户引流活动",
    ],
    highlighted: true,
  },
  {
    name: "大客户",
    price: "定制",
    unit: "联系商务",
    description: "高量级项目方专属方案",
    features: [
      "定制手续费比例",
      "专属技术支持",
      "优先接入新链",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 style={{
            fontSize: "40px",
            fontWeight: 600,
            letterSpacing: "-2.4px",
            lineHeight: 1.2,
            color: "#171717",
            marginBottom: "1rem",
          }}>
            简单透明的定价
          </h2>
          <p style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.8, color: "#4d4d4d", maxWidth: "36rem", margin: "0 auto" }}>
            按红包金额收取手续费，没有隐藏费用
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const shadow = p.highlighted
              ? "rgba(10,114,239,0.15) 0px 0px 0px 2px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px"
              : "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px";

            return (
              <div
                key={p.name}
                className="relative bg-white"
                style={{
                  borderRadius: "12px",
                  padding: "32px",
                  boxShadow: shadow,
                }}
              >
                {p.highlighted && (
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#0a72ef",
                    color: "#fff",
                    borderRadius: "9999px",
                    padding: "2px 16px",
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}>
                    推荐
                  </div>
                )}

                <h3 style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.96px",
                  color: "#171717",
                  marginBottom: "4px",
                }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: "14px", color: "#4d4d4d", marginBottom: "16px" }}>
                  {p.description}
                </p>

                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "48px", fontWeight: 600, letterSpacing: "-2.4px", lineHeight: 1.0, color: "#171717" }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: "14px", color: "#808080", marginLeft: "8px" }}>
                    {p.unit}
                  </span>
                </div>

                <ul style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#4d4d4d" }}>
                      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#171717" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/app"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: 1.43,
                    ...(p.highlighted
                      ? { background: "#171717", color: "#fff" }
                      : { background: "#fff", color: "#171717", boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px" }
                    ),
                  }}
                  className="transition-opacity hover:opacity-80"
                >
                  {p.highlighted ? "立即开始" : "联系我们"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
