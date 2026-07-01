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
    <section className="py-24" style={{ background: "#fafafa" }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 style={{
          fontSize: "40px",
          fontWeight: 600,
          letterSpacing: "-2.4px",
          lineHeight: 1.2,
          color: "#171717",
          marginBottom: "1rem",
        }}>
          支持的主流公链
        </h2>
        <p style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.8, color: "#4d4d4d", marginBottom: "48px" }}>
          覆盖 EVM 与非 EVM 生态，一条 API 接入所有链
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {chains.map((c) => (
            <div
              key={c.name}
              className="bg-white flex items-center gap-2 transition-all duration-200"
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{c.icon}</span>
              <span style={{ fontSize: "16px", fontWeight: 500, color: "#171717" }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
