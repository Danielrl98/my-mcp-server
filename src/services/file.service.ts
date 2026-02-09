import fs from "fs";
import path from "path";

export function readRecursive(
  dir: string,
  ignore = ["node_modules", ".git", ".next"],
) {
  let results: any[] = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignore.some((i) => filePath.includes(i))) {
        results = results.concat(readRecursive(filePath));
      }
    } else {
      results.push({
        path: filePath,
        content: fs.readFileSync(filePath, "utf-8"),
      });
    }
  });

  return results;
}

export function applyChanges(actions: any[]) {
  actions.forEach((file) => {
    const dir = path.dirname(file.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (file.action === "delete") {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
      return;
    }

    try {
      fs.writeFileSync(
        process.env.BASE_DIR + file.filePath,
        file.content || "",
        "utf-8",
      );
    } catch (error) {
      fs.writeFileSync(file.filePath, file.content || "", "utf-8");
    }
  });
}
