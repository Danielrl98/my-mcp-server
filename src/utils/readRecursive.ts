import fs from "fs";
import path from "path";

export function readRecursive(
  dir: string,
  ignore = new Set(["node_modules", ".git", ".next", "dist", "build"]),
) {
  let results: { path: string; content: string }[] = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    if (ignore.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...readRecursive(fullPath, ignore));
    } else {
      results.push({
        path: fullPath,
        content: fs.readFileSync(fullPath, "utf-8"),
      });
    }
  }

  return results;
}