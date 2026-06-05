import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    // 标题
    h1: ({ children, id }) => (
      <h1 id={id} className="text-3xl font-bold mb-4 text-white">{children}</h1>
    ),
    h2: ({ children, id }) => (
      <h2 id={id} className="text-2xl font-semibold mt-10 mb-4 pb-2 text-white" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} className="text-xl font-semibold mt-8 mb-3 text-white">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-white">{children}</h4>
    ),

    // 段落
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed" style={{ color: "#94A3B8" }}>{children}</p>
    ),

    // 列表
    ul: ({ children }) => (
      <ul className="mb-4 pl-5 space-y-1.5" style={{ color: "#94A3B8", lineHeight: 1.8 }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 pl-5 space-y-1.5" style={{ color: "#94A3B8", lineHeight: 1.8 }}>{children}</ol>
    ),
    li: ({ children }) => <li className="list-disc">{children}</li>,

    // 链接
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#FF4D4F" }}>
            {children}
          </a>
        );
      }
      return <Link href={href || "#"} className="hover:underline" style={{ color: "#FF4D4F" }}>{children}</Link>;
    },

    // 代码
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: "rgba(255,255,255,0.06)", color: "#FF4D4F" }} {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre className="p-4 rounded-lg overflow-x-auto my-4 text-sm leading-relaxed" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)" }}>
          <code className={className} {...props}>{children}</code>
        </pre>
      );
    },
    pre: ({ children }) => <>{children}</>,

    // 表格
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="text-sm font-medium" style={{ color: "#94A3B8" }}>{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left px-4 py-2.5 font-medium" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#94A3B8" }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 text-sm" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#CBD5E1" }}>
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-white/[0.02]">{children}</tr>
    ),

    // 引用
    blockquote: ({ children }) => (
      <blockquote className="my-4 p-4 rounded-lg" style={{ background: "rgba(255,77,79,0.08)", borderLeft: "3px solid #FF4D4F" }}>
        <div style={{ color: "#CBD5E1" }}>{children}</div>
      </blockquote>
    ),

    // 分隔线
    hr: () => <hr className="my-8" style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)" }} />,

    // 强调
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em style={{ color: "#CBD5E1" }}>{children}</em>,
  };
}
