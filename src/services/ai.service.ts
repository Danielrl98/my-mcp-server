import "dotenv/config";
import OpenAI from "openai";
import { EditInstruction, AIAction } from "../types/edit.types";
import { readRecursive, applyChanges } from "./file.service";
import { gitBackup } from "./git.service";
import { getSession } from "./memory.service";
import { isPathInside } from "../utils/path.util";
import { readFileSync } from "fs";

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
  } else if (mode === "file") {
    files.push({
      path: targetPath,
      content: readFileSync(targetPath, "utf-8"),
    });
  } else {
    throw new Error("METHOD_NOT_EXISTS");
  }

  const content = `
      Você é um engenheiro de software sênior, especializado em análise estática de código (${language}).

      REGRAS OBRIGATÓRIAS:
      - Analise EXCLUSIVAMENTE o código fornecido.
      - NÃO invente endpoints, fluxos, tecnologias ou camadas.
      - NÃO use termos genéricos como "boas práticas", "normalmente", "geralmente".
      - NÃO descreva nada que não possa ser apontado diretamente no código.
      - Sempre referencie arquivos, classes, métodos ou decorators reais.
      - Se algo NÃO estiver explícito no código, declare como "não identificado no código analisado".

      OBJETIVO:
      Gerar ações de escrita de arquivos com documentação técnica e funcional baseada SOMENTE no código real.

      FORMATO DE SAÍDA (JSON estrito, sem comentários ou texto extra):

      [
        {
          "action": "create" | "update",
          "filePath": "caminho absoluto do arquivo",
          "content": "conteúdo completo do arquivo"
        }
      ]

      ESTRUTURA DA DOCUMENTAÇÃO A SER GERADA:
      1. Visão geral do módulo (com base na pasta e imports reais)
      2. Tecnologias e frameworks identificados (com evidência no código)
      3. Arquitetura observada (controllers, services, repositories, etc. SOMENTE se existirem)
      4. Endpoints:
        - Método HTTP
        - Rota exata
        - Controller e método
        - DTOs usados (imports reais)
        - Guards / Middlewares (se existirem)
      5. Observações técnicas (apenas fatos verificáveis no código)

      CONTEXTO DO SISTEMA:
      ${systemContext}
      `;

  const content2 = `TAREFA:
    ${instruction}

    RESTRIÇÕES:
    - Documente SOMENTE o que está presente nos arquivos.
    - Se um endpoint não estiver completamente definido, não documente.
    - Não gere exemplos fictícios de request/response.

    Arquivos:
    ${files.map((f) => `### ${f.path}\n${f.content}`).join("\n")}
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: content,
      },
      ...session,
      {
        role: "user",
        content: content2,
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
