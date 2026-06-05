import { Markdown } from "@/components/markdown";
import fs from "fs";
import path from "path";

export default function QuickstartPage() {
  const content = fs.readFileSync(path.join(process.cwd(), "content/docs/quickstart.md"), "utf-8");
  return <Markdown content={content} />;
}
