const packetTypes = [
  {
    title: "普通红包 · 均分",
    tag: "进来即领",
    description: "人人一样，公平简单。用户链接钱包即可领取，无需口令。",
    icon: "🧧",
    gradient: "from-redpacket/20 to-transparent",
  },
  {
    title: "普通红包 · 随机",
    tag: "开盲盒",
    description: "手气比拼，趣味十足。用户进来即领，金额随机分配。",
    icon: "🎲",
    gradient: "from-gold/20 to-transparent",
  },
  {
    title: "口令红包 · 均分",
    tag: "私域精准",
    description: "输入口令才能领取，适合在私域社群做精准投放。",
    icon: "🔐",
    gradient: "from-redpacket/20 to-transparent",
  },
  {
    title: "口令红包 · 随机",
    tag: "刺激有趣",
    description: "输入口令拼手气，传播性强，适合裂变活动。",
    icon: "🎯",
    gradient: "from-gold/20 to-transparent",
  },
];

export default function PacketTypes() {
  return (
    <section className="py-24 bg-surface-dark/50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            四种红包玩法，覆盖所有场景
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            均分或随机，普通或口令，灵活组合满足不同运营需求
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packetTypes.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-2xl glass p-6 hover:bg-surface-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10">
                {/* Tag */}
                <span className="inline-block rounded-full bg-redpacket/10 text-redpacket text-xs font-semibold px-3 py-1 mb-4">
                  {p.tag}
                </span>

                {/* Icon */}
                <div className="text-3xl mb-3">{p.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
