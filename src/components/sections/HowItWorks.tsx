import { SectionHeader } from "@/components/ui/Marketing";

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

const accentClasses: Record<string, { text: string; dot: string }> = {
  develop: { text: "text-develop", dot: "bg-develop" },
  preview: { text: "text-preview", dot: "bg-preview" },
  ship: { text: "text-ship", dot: "bg-ship" },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="三步使用，极简上手" description="从创建到领取，全流程无需自研合约，无需审计" />

        {/* Steps — Workflow Pipeline */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-0.5 bg-gradient-to-r from-develop via-preview to-ship opacity-30 md:block" />

          {steps.map((s) => {
            const colors = accentClasses[s.accent];
            return (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className={`relative z-10 mb-6 flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-medium text-white ${colors.dot}`}>
                  {s.step}
                </div>

                <div className={`mb-2 font-mono text-xs font-medium uppercase tracking-[0.05em] ${colors.text}`}>
                  {s.label}
                </div>

                <h3 className="mb-3 text-2xl font-semibold leading-[1.33] tracking-[-0.96px] text-vercel-black">
                  {s.title}
                </h3>

                <p className="text-base font-normal leading-[1.5] text-text-secondary">
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
