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
    <section className="py-24" style={{ background: "#fafafa" }}>
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
            四种红包玩法，覆盖所有场景
          </h2>
          <p style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.8, color: "#4d4d4d", maxWidth: "36rem", margin: "0 auto" }}>
            均分或随机，普通或口令，灵活组合满足不同运营需求
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packetTypes.map((p) => (
            <div
              key={p.title}
              className="bg-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
              }}
            >
              {/* Tag */}
              <span style={{
                display: "inline-block",
                background: "#ebf5ff",
                color: "#0068d6",
                borderRadius: "9999px",
                padding: "0px 10px",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "24px",
                marginBottom: "12px",
              }}>
                {p.tag}
              </span>

              {/* Icon */}
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{p.icon}</div>

              {/* Title */}
              <h3 style={{
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "-0.96px",
                lineHeight: 1.33,
                color: "#171717",
                marginBottom: "8px",
              }}>
                {p.title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: "16px", fontWeight: 400, lineHeight: 1.5, color: "#4d4d4d" }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
