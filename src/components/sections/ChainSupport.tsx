import { MarketingCard, SectionHeader } from "@/components/ui/Marketing";

const chains = [
  { name: "ETH", icon: "🔵" },
  { name: "BSC", icon: "🟡" },
  { name: "SOLANA", icon: "🟣" },
  { name: "TRON", icon: "🔴" },
  { name: "AB-Core", icon: "🟠" },
  { name: "AB-iOT", icon: "🟢" },
];

export default function ChainSupport() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeader
          title="支持的主流公链"
          description="覆盖 EVM 与非 EVM 生态，一条 API 接入所有链"
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
