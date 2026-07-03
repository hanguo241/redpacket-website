import { MarketingCard, Pill, SectionHeader } from "@/components/ui/Marketing";

const packetTypes = [
  {
    title: "普通红包 · 均分",
    tag: "进来即领",
    description: "人人一样，公平简单。用户链接钱包即可领取，无需口令。",
    icon: "🧧",
  },
  {
    title: "普通红包 · 随机",
    tag: "开盲盒",
    description: "手气比拼，趣味十足。用户进来即领，金额随机分配。",
    icon: "🎲",
  },
  {
    title: "口令红包 · 均分",
    tag: "私域精准",
    description: "输入口令才能领取，适合在私域社群做精准投放。",
    icon: "🔐",
  },
  {
    title: "口令红包 · 随机",
    tag: "刺激有趣",
    description: "输入口令拼手气，传播性强，适合裂变活动。",
    icon: "🎯",
  },
];

export default function PacketTypes() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="四种红包玩法，覆盖所有场景" description="均分或随机，普通或口令，灵活组合满足不同运营需求" />

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packetTypes.map((p) => (
            <MarketingCard
              key={p.title}
              variant="elevated"
              className="p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Pill className="mb-3">{p.tag}</Pill>

              {/* Icon */}
              <div className="text-[28px] mb-3">{p.icon}</div>

              {/* Title */}
              <h3 className="mb-2 text-2xl font-semibold leading-[1.33] tracking-[-0.96px] text-vercel-black">
                {p.title}
              </h3>

              {/* Description */}
              <p className="text-base font-normal leading-[1.5] text-text-secondary">
                {p.description}
              </p>
            </MarketingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
