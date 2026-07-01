import Link from "next/link";

const footerSections = [
  {
    title: "Products",
    links: [
      { label: "红包服务", href: "/app" },
      { label: "API 文档", href: "/docs" },
      { label: "SDK", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "关于我们", href: "#" },
      { label: "联系我们", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "开发者文档", href: "/docs" },
      { label: "GitHub", href: "https://github.com" },
      { label: "技术白皮书", href: "/docs" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Discord", href: "#" },
      { label: "Telegram", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white"
      style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4"
              style={{ fontSize: "16px", fontWeight: 600, color: "#171717", letterSpacing: "-0.32px" }}>
              <span style={{ fontSize: "20px" }}>🧧</span>
              RedPacket
            </Link>
            <p style={{ fontSize: "14px", color: "#4d4d4d", lineHeight: 1.7 }}>
              一键发红包，Web3 用户增长引擎。
              <br />
              即插即用的红包基础设施。
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#171717", marginBottom: "16px", letterSpacing: "-0.32px" }}>
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-[#171717]"
                      style={{ fontSize: "14px", color: "#666666" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 text-center"
          style={{ fontSize: "14px", color: "#808080", boxShadow: "rgba(0, 0, 0, 0.08) 0px -1px 0px 0px" }}>
          &copy; {new Date().getFullYear()} RedPacket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
