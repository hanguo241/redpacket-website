import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-redpacket/5 via-transparent to-surface-dark pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-redpacket/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-text-secondary mb-8">
          <span className="h-2 w-2 rounded-full bg-redpacket animate-pulse" />
          Web3 红包基础设施
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
          让每个 Web3 项目
          <br />
          都有<span className="gradient-text"> 红包功能</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          免合约、跨链、即插即用。
          <br className="hidden md:block" />
          3 分钟接入红包能力，告别自研合约的繁琐与高昂审计成本。
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-redpacket px-8 py-3.5 text-base font-semibold text-white hover:bg-redpacket-dark transition-all hover:shadow-lg hover:shadow-redpacket/25"
          >
            立即接入
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-3.5 text-base font-semibold text-white hover:bg-surface-card-hover transition-colors"
          >
            了解更多
          </a>
        </div>
      </div>
    </section>
  );
}
