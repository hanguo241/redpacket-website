import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface MarkdownProps {
  content: string;
}

export async function Markdown({ content }: MarkdownProps) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  const html = String(result);

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
