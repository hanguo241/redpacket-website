import { MarketingLink } from "@/components/ui/Marketing";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
      <div className="text-center px-6">
        <div className="text-[48px] mb-6">✍️</div>
        <h1 className="mb-4 text-[40px] font-semibold leading-[1.2] tracking-[-2.4px] text-vercel-black">博客</h1>
        <p className="mx-auto mb-8 max-w-[24rem] text-base text-text-secondary">
          案例分享、产品更新、技术洞察。即将上线。
        </p>
        <MarketingLink href="/" variant="outline">返回首页</MarketingLink>
      </div>
    </div>
  );
}
