import { MarketingCard, SectionHeader } from "@/components/ui/Marketing";

const chains = [
  { name: "Avalanche C-Chain", icon: "🔺" },
];

export default function ChainSupport() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeader
          title="当前支持的链"
          description="首批上线 Avalanche C-Chain（Fuji 测试网），一条 API 打通 EVM 多链，其余链按计划接入"
          className="mb-12"
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          {chains.map((c) => (
            <MarketingCard
              key={c.name}
              className="flex items-center gap-2 rounded-md px-5 py-2.5 transition-all duration-200"
            >
              <span className="text-lg">{c.icon}</span>
              <span className="text-base font-medium text-vercel-black">{c.name}</span>
            </MarketingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
