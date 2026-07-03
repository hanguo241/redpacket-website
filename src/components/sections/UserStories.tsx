import { MarketingCard, SectionHeader } from "@/components/ui/Marketing";

const stories = [
  {
    icon: "🎯",
    role: "项目方",
    quote:
      "我们做了个 DApp，想加个红包活动拉新，不用自己写合约，接入 RedPacket SDK 就搞定了。",
  },
  {
    icon: "👥",
    role: "KOL / 群主",
    quote:
      "我在社群发红包，条件是加 Twitter 关注，既涨粉又活跃群，一举两得。",
  },
  {
    icon: "🏢",
    role: "大老板",
    quote:
      "想给团队发我自己的 Token 当奖励，RedPacket 比我自己转账方便多了。",
  },
  {
    icon: "🙋",
    role: "普通用户",
    quote:
      "不用付 gas 也能领红包？平台代付 gas 太爽了！",
  },
];

export default function UserStories() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="谁在用 RedPacket" description="从项目方到普通用户，RedPacket 让每个人都能轻松收发链上红包" />

        {/* Stories grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {stories.map((s) => (
            <MarketingCard
              key={s.role}
              className="transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl shrink-0 mt-0.5">{s.icon}</div>
                <div>
                  <div className="mb-2 text-sm font-semibold tracking-[-0.32px] text-vercel-black">
                    {s.role}
                  </div>
                  <p className="text-base font-normal italic leading-[1.5] text-text-secondary">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                </div>
              </div>
            </MarketingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
