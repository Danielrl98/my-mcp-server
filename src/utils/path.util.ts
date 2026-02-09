import path from "path";
import fs from "fs";

export function resolveBaseDir(inputPath: string) {
  const absolute = path.resolve(inputPath);

  if (!fs.existsSync(absolute)) {
    throw new Error("Path does not exist");
  }

  return fs.statSync(absolute).isFile() ? path.dirname(absolute) : absolute;
}

export function isPathInside(baseDir: string, targetPath: string) {
  const absoluteBase = path.resolve(baseDir);
  const absoluteTarget = path.resolve(targetPath);

  const relative = path.relative(absoluteBase, absoluteTarget);

  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}
