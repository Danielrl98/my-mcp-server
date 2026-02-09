import "dotenv/config";
import OpenAI from "openai";
import { EditInstruction, AIAction } from "../types/edit.types";
import { readRecursive, applyChanges } from "./file.service";
import { gitBackup } from "./git.service";
import { getSession } from "./memory.service";
import { isPathInside } from "../utils/path.util";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function processEdit(data: EditInstruction) {
  const {
    sessionId = "default",
    mode,
    targetPath,
    instruction,
    language = "Node.js",
    systemContext = "",
    dryRun = true,
  } = data;

  console.log({
    data,
  });

  const session = getSession(sessionId);

  let files: any[] = [];

  if (mode === "folder") {
    files = readRecursive(targetPath);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
Você é especialista em ${language}.
Retorne apenas JSON válido no formato:

[
  {
    "action": "create" | "update" | "delete",
    "filePath": "caminho completo",
    "content": "codigo completo"
  }
]
Contexto: ${systemContext}
        `,
      },
      ...session,
      {
        role: "user",
        content: `
Instrução: ${instruction}

Arquivos:
${files.map((f) => `### ${f.path}\n${f.content}`).join("\n")}
        `,
      },
    ],
  });

  const raw = response.choices[0].message.content!;
  const parsed: AIAction[] = JSON.parse(raw);

  if (!dryRun) {
    parsed.forEach((file) => {
      if (!isPathInside(file.filePath, targetPath)) {
        console.log({
          path: file.filePath,
          targetPath,
        });
        //throw new Error("Tentativa de escrita fora do BASE_DIR.");
      }
    });

    applyChanges(parsed);
  }

  session.push({ role: "user", content: instruction });
  session.push({ role: "assistant", content: raw });

  return {
    success: true,
    dryRun,
    filesModified: parsed.length,
  };
}
