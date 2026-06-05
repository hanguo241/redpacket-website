const steps = [
  {
    step: "01",
    title: "创建红包",
    description: "选择链、Token、金额和类型，签名确认后资金进入合约锁定。",
    icon: "📝",
  },
  {
    step: "02",
    title: "分享链接",
    description: "自动生成专属红包链接和二维码，一键分享到社群、Twitter、Discord。",
    icon: "🔗",
  },
  {
    step: "03",
    title: "用户领取",
    description: "好友点击链接，完成任务或输入口令，即可领取 Token。支持代付 gas，用户零门槛。",
    icon: "🎉",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            三步使用，极简上手
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            从创建到领取，全流程无需自研合约，无需审计
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-redpacket/40 via-gold/40 to-redpacket/40" />

          {steps.map((s, i) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              {/* Step number */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full glass text-redpacket font-bold mb-6">
                {s.step}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{s.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
