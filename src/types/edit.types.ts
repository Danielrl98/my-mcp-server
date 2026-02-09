export interface EditInstruction {
  sessionId?: string;
  mode: "file" | "folder";
  targetPath: string;
  instruction: string;
  language?: string;
  systemContext?: string;
  dryRun?: boolean;
}

export interface AIAction {
  action: "create" | "update" | "delete";
  filePath: string;
  content?: string;
}
