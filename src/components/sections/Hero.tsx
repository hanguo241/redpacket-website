import { MarketingLink, Pill } from "@/components/ui/Marketing";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Pill withDot className="mb-8">
          Web3 红包基础设施
        </Pill>

        {/* Headline */}
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,3rem)] font-semibold leading-none tracking-[-2.4px] text-vercel-black">
          让每个 Web3 项目
          <br />
          都有红包功能
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-10 max-w-[36rem] text-xl font-normal leading-[1.8] text-text-secondary">
          免合约、跨链、即插即用。
          <br className="hidden md:block" />
          3 分钟接入红包能力，告别自研合约的繁琐与高昂审计成本。
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <MarketingLink href="/app">
            立即接入
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MarketingLink>
          <MarketingLink href="#how-it-works" variant="outline">
            了解更多
          </MarketingLink>
        </div>
      </div>
    </section>
  );
}
