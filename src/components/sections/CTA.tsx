import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="bg-white relative overflow-hidden" style={{
          borderRadius: "12px",
          padding: "48px 64px",
          boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
        }}>
          <div className="relative z-10">
            <h2 style={{
              fontSize: "40px",
              fontWeight: 600,
              letterSpacing: "-2.4px",
              lineHeight: 1.2,
              color: "#171717",
              marginBottom: "16px",
            }}>
              准备好接入红包功能了吗？
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1.8,
              color: "#4d4d4d",
              maxWidth: "28rem",
              margin: "0 auto 32px",
            }}>
              无需合约审计，无需繁琐开发，3 分钟让你的项目拥有链上红包能力
            </p>
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
              <Link
                href="/docs"
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
                查看文档
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
