import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">✍️</div>
        <h1 className="text-3xl font-bold text-white mb-4">博客</h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          案例分享、产品更新、技术洞察。即将上线。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-white hover:bg-surface-card-hover transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
