# 🎉 Bem-vindo à Documentação Oficial do MCP Server! 🎉

Olá, eu sou o próprio MCP Server e fui eu mesmo que gerei esta documentação para você! Prepare-se para uma jornada divertida e objetiva pelo meu universo técnico. Vamos lá!

---

## 1. Visão Geral do Módulo

O MCP Server é um serviço Node.js que expõe uma API HTTP para processar instruções de edição de arquivos e pastas, utilizando inteligência artificial (OpenAI) para gerar e aplicar ações de escrita, atualização ou deleção de arquivos. O módulo principal está localizado em `src/index.ts` e utiliza rotas definidas em `src/routes/edit.route.ts`.

### Estrutura Principal:
- **src/index.ts**: Inicializa o servidor Express, carrega variáveis de ambiente e registra rotas.
- **src/routes/edit.route.ts**: Define a rota `/edit` para processar requisições de edição.
- **src/services/ai.service.ts**: Implementa a lógica principal de processamento de instruções usando OpenAI.
- **src/services/file.service.ts**: Manipulação de arquivos e diretórios.
- **src/services/memory.service.ts**: Gerenciamento de sessões em memória.
- **src/types/edit.types.ts**: Tipos TypeScript para instruções e ações de edição.
- **src/utils/path.util.ts**: Utilitários para manipulação de caminhos.
- **src/utils/readRecursive.ts**: Função alternativa para leitura recursiva de arquivos.

---

## 2. Tecnologias e Frameworks Identificados

- **Node.js**: Plataforma de execução JavaScript (presente em todos os arquivos `.ts` e dependências).
- **Express**: Framework web para Node.js (`import express from "express";` em `src/index.ts`).
- **OpenAI SDK**: Cliente oficial para integração com a API OpenAI (`import OpenAI from "openai";` em `src/services/ai.service.ts`).
- **dotenv**: Gerenciamento de variáveis de ambiente (`import dotenv from "dotenv";` em `src/index.ts`).
- **TypeScript**: Tipagem estática e compilação (`tsconfig.json` presente).
- **Prettier**: Ferramenta de formatação de código (presente em dependências e scripts).

---

## 3. Arquitetura Observada

- **Controllers**: Não identificado no código analisado (uso direto de rotas Express).
- **Services**:
  - `ai.service.ts`: Processamento de instruções de edição com IA.
  - `file.service.ts`: Leitura e escrita recursiva de arquivos.
  - `memory.service.ts`: Sessões em memória.
  - `git.service.ts`: Backup Git (implementação comentada).
- **Repositories**: Não identificado no código analisado.
- **DTOs**: Definidos em `src/types/edit.types.ts`.

---

## 4. Endpoints

### POST /edit

- **Método HTTP**: POST
- **Rota exata**: `/edit`
- **Controller e método**: Função anônima registrada em `src/routes/edit.route.ts` via `router.post("/", ...)`
- **DTOs usados**:
  - `EditInstruction` (importado de `src/types/edit.types.ts`)
  - `AIAction` (importado de `src/types/edit.types.ts`)
- **Guards / Middlewares**: Não identificado no código analisado (apenas `express.json({ limit: "50mb" })` global).

#### Fluxo do endpoint:
1. Recebe um JSON no corpo da requisição conforme o tipo `EditInstruction`.
2. Chama `processEdit` do `ai.service.ts` com os dados recebidos.
3. Retorna um JSON com o resultado da operação, incluindo:
   - `success`: booleano
   - `dryRun`: booleano
   - `filesModified`: número de arquivos modificados
4. Em caso de erro, retorna status 500 e `{ error: <mensagem> }`.

---

## 5. Observações Técnicas

- O servidor lê variáveis de ambiente de `.env` e `.env.local`.
- O endpoint `/edit` aceita instruções para editar arquivos ou pastas inteiras, utilizando IA para gerar as ações.
- O campo `dryRun` permite simular as alterações sem aplicá-las fisicamente.
- O serviço de IA utiliza o modelo `gpt-4.1` da OpenAI.
- As ações possíveis são: `create`, `update`, `delete` (definidas em `AIAction`).
- O sistema mantém sessões em memória para contexto de conversação.
- O backup Git está presente mas comentado e não é executado.
- O limite de payload JSON é de 50MB.
- O caminho base para operações de arquivo é definido por `BASE_DIR` nas variáveis de ambiente.
- Não há autenticação, autorização, ou validação de input além do que está implementado nos serviços.
- Não há exemplos de request/response explícitos no código.

---

## 6. Como Usar o MCP Server

1. **Instale as dependências:**
   ```sh
   npm install
   ```
2. **Configure o arquivo `.env` com sua chave OpenAI e BASE_DIR.**
3. **Inicie o servidor:**
   ```sh
   npm run dev
   # ou
   npm start
   ```
4. **Faça uma requisição POST para `/edit` com um corpo JSON conforme o tipo `EditInstruction` (veja `src/types/edit.types.ts`).**

---

Pronto! Agora você pode automatizar edições de arquivos e pastas usando IA, tudo via uma simples API HTTP. E lembre-se: esta documentação foi gerada por mim, o MCP Server, com um toque de inteligência e diversão! 🚀
