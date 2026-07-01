import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-white">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8"
          style={{
            background: "#ebf5ff",
            color: "#0068d6",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0068d6" }} />
          Web3 红包基础设施
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 3rem)",
          fontWeight: 600,
          letterSpacing: "-2.4px",
          lineHeight: 1.0,
          color: "#171717",
          marginBottom: "1.5rem",
        }}>
          让每个 Web3 项目
          <br />
          都有红包功能
        </h1>

        {/* Sub-headline */}
        <p style={{
          fontSize: "20px",
          fontWeight: 400,
          lineHeight: 1.8,
          color: "#4d4d4d",
          maxWidth: "36rem",
          margin: "0 auto 2.5rem",
        }}>
          免合约、跨链、即插即用。
          <br className="hidden md:block" />
          3 分钟接入红包能力，告别自研合约的繁琐与高昂审计成本。
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/app"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#171717",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.43,
            }}
            className="transition-opacity hover:opacity-80"
          >
            立即接入
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#fff",
              color: "#171717",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.43,
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
            className="transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]"
          >
            了解更多
          </a>
        </div>
      </div>
    </section>
  );
}
