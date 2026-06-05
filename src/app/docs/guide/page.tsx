import { Markdown } from "@/components/markdown";
import fs from "fs";
import path from "path";

export default function GuidePage() {
  const content = fs.readFileSync(path.join(process.cwd(), "content/docs/guide.md"), "utf-8");
  return <Markdown content={content} />;
}
