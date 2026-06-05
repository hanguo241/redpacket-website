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
    <section className="py-24 bg-surface-dark/50">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          支持的主流公链
        </h2>
        <p className="text-text-secondary text-lg mb-12">
          覆盖 EVM 与非 EVM 生态，一条 API 接入所有链
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {chains.map((c) => (
            <div
              key={c.name}
              className="glass rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-surface-card-hover transition-colors"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="font-semibold text-white">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
