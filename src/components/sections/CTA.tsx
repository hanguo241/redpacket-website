import { MarketingCard, MarketingLink, SectionHeader } from "@/components/ui/Marketing";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <MarketingCard variant="elevated" className="relative overflow-hidden px-8 py-12 md:px-16">
          <div className="relative z-10">
            <SectionHeader
              title="准备好接入红包功能了吗？"
              description="无需合约审计，无需繁琐开发，3 分钟让你的项目拥有链上红包能力"
              className="mb-8"
              descriptionClassName="max-w-[28rem]"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MarketingLink href="/app">
                立即接入
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MarketingLink>
              <MarketingLink href="/docs" variant="outline">
                查看文档
              </MarketingLink>
            </div>
          </div>
        </MarketingCard>
      </div>
    </section>
  );
}
