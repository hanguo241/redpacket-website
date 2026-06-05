import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-redpacket/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好接入红包功能了吗？
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
              无需合约审计，无需繁琐开发，3 分钟让你的项目拥有链上红包能力
            </p>
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
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full glass px-8 py-3.5 text-base font-semibold text-white hover:bg-surface-card-hover transition-colors"
              >
                查看文档
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
