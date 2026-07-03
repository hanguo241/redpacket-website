import { MarketingCard, MarketingLink, SectionHeader } from "@/components/ui/Marketing";

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
        <SectionHeader title="简单透明的定价" description="按红包金额收取手续费，没有隐藏费用" />

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => {
            return (
              <MarketingCard
                key={p.name}
                variant={p.highlighted ? "highlighted" : "elevated"}
                className="relative"
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-develop px-4 text-xs font-medium leading-6 text-white">
                    推荐
                  </div>
                )}

                <h3 className="mb-1 text-2xl font-semibold tracking-[-0.96px] text-vercel-black">
                  {p.name}
                </h3>
                <p className="mb-4 text-sm text-text-secondary">
                  {p.description}
                </p>

                <div className="mb-6">
                  <span className="text-[48px] font-semibold leading-none tracking-[-2.4px] text-vercel-black">
                    {p.price}
                  </span>
                  <span className="ml-2 text-sm text-text-tertiary">
                    {p.unit}
                  </span>
                </div>

                <ul className="flex flex-col gap-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-vercel-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <MarketingLink
                  href="/app"
                  variant={p.highlighted ? "dark" : "outline"}
                  className="w-full"
                >
                  {p.highlighted ? "立即开始" : "联系我们"}
                </MarketingLink>
              </MarketingCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
