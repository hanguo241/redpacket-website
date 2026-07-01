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
            谁在用 RedPacket
          </h2>
          <p style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.8, color: "#4d4d4d", maxWidth: "36rem", margin: "0 auto" }}>
            从项目方到普通用户，RedPacket 让每个人都能轻松收发链上红包
          </p>
        </div>

        {/* Stories grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {stories.map((s) => (
            <div
              key={s.role}
              className="bg-white transition-all duration-200"
              style={{
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
              }}
            >
              <div className="flex items-start gap-4">
                <div style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>{s.icon}</div>
                <div>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#171717",
                    letterSpacing: "-0.32px",
                    marginBottom: "8px",
                  }}>
                    {s.role}
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 400, lineHeight: 1.5, color: "#4d4d4d", fontStyle: "italic" }}>
                    &ldquo;{s.quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
