import { Markdown } from "@/components/markdown";
import fs from "fs";
import path from "path";

export default function ApiPage() {
  const content = fs.readFileSync(path.join(process.cwd(), "content/docs/api.md"), "utf-8");
  return <Markdown content={content} />;
}
