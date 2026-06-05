import Link from "next/link";

const SIDEBAR = [
  {
    title: "入门",
    items: [
      { href: "/docs", label: "概述" },
      { href: "/docs/quickstart", label: "5 分钟接入" },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/docs/api", label: "API 参考" },
      { href: "/docs/guide", label: "完整指南" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-6 flex gap-10">
        <aside className="hidden md:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-6">
            {SIDEBAR.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "#94A3B8" }}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-sm transition-colors hover:text-white"
                        style={{ color: "#94A3B8" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <article className="flex-1 min-w-0 max-w-3xl">
          {children}
        </article>
      </div>
    </div>
  );
}
