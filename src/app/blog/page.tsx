import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
      <div className="text-center px-6">
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>✍️</div>
        <h1 style={{
          fontSize: "40px",
          fontWeight: 600,
          letterSpacing: "-2.4px",
          lineHeight: 1.2,
          color: "#171717",
          marginBottom: "16px",
        }}>
          博客
        </h1>
        <p style={{ fontSize: "16px", color: "#4d4d4d", marginBottom: "32px", maxWidth: "24rem", margin: "0 auto 32px" }}>
          案例分享、产品更新、技术洞察。即将上线。
        </p>
        <Link
          href="/"
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
            textDecoration: "none",
          }}
          className="transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
