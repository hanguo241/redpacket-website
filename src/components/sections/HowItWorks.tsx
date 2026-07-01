const steps = [
  {
    step: "01",
    title: "创建红包",
    description: "选择链、Token、金额和类型，签名确认后资金进入合约锁定。",
    accent: "develop",
    label: "Develop",
  },
  {
    step: "02",
    title: "分享链接",
    description: "自动生成专属红包链接和二维码，一键分享到社群、Twitter、Discord。",
    accent: "preview",
    label: "Preview",
  },
  {
    step: "03",
    title: "用户领取",
    description: "好友点击链接，完成任务或输入口令，即可领取 Token。支持代付 gas，用户零门槛。",
    accent: "ship",
    label: "Ship",
  },
];

const accentColors: Record<string, { text: string; dot: string; border: string }> = {
  develop: { text: "#0a72ef", dot: "#0a72ef", border: "rgba(10,114,239,0.2)" },
  preview: { text: "#de1d8d", dot: "#de1d8d", border: "rgba(222,29,141,0.2)" },
  ship:    { text: "#ff5b4f", dot: "#ff5b4f", border: "rgba(255,91,79,0.2)" },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
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
            三步使用，极简上手
          </h2>
          <p style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.8, color: "#4d4d4d", maxWidth: "36rem", margin: "0 auto" }}>
            从创建到领取，全流程无需自研合约，无需审计
          </p>
        </div>

        {/* Steps — Workflow Pipeline */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%]" style={{
            height: "2px",
            background: "linear-gradient(to right, #0a72ef, #de1d8d, #ff5b4f)",
            opacity: 0.3,
          }} />

          {steps.map((s, i) => {
            const colors = accentColors[s.accent];
            return (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                {/* Step dot */}
                <div className="relative z-10 flex items-center justify-center mb-6"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: colors.dot,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  }}>
                  {s.step}
                </div>

                {/* Mono label */}
                <div style={{
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: colors.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}>
                  {s.label}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.96px",
                  lineHeight: 1.33,
                  color: "#171717",
                  marginBottom: "12px",
                }}>
                  {s.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: "16px", fontWeight: 400, lineHeight: 1.5, color: "#4d4d4d" }}>
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
