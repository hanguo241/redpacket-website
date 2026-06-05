import Link from "next/link";

const plans = [
  {
    name: "自领模式",
    price: "1%",
    unit: "每笔红包金额",
    description: "用户自己付 gas，平台只收手续费",
    features: [
      "用户连接钱包自行 claim",
      "无额外平台成本",
      "适合有 gas 的存量用户",
    ],
    highlighted: false,
  },
  {
    name: "代领模式",
    price: "1.5%",
    unit: "每笔红包金额",
    description: "平台代付 gas，用户零门槛领取",
    features: [
      "用户无需持有 native token",
      "零 gas 领取体验",
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
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            简单透明的定价
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            按红包金额收取手续费，没有隐藏费用
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 ${
                p.highlighted
                  ? "glass ring-1 ring-redpacket/50"
                  : "glass"
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-redpacket px-4 py-1 text-xs font-semibold text-white">
                  推荐
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-sm text-text-secondary mb-4">{p.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-text-secondary text-sm ml-2">{p.unit}</span>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="h-4 w-4 text-redpacket shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className={`block text-center rounded-full py-3 text-sm font-semibold transition-all ${
                  p.highlighted
                    ? "bg-redpacket text-white hover:bg-redpacket-dark"
                    : "glass text-white hover:bg-surface-card-hover"
                }`}
              >
                {p.highlighted ? "立即开始" : "联系我们"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
